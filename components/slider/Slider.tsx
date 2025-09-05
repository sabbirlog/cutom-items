"use client";

import React, {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BaseSliderProps {
    children: ReactNode;
    className?: string;
    showArrows?: boolean;
    alwaysShowArrows?: boolean;
    showDots?: boolean;
    showDotsOutside?: boolean;
    gap?: string;
    height?: string;
    mode?: "slide" | "fade";
    slidesPerView?: number;
}

interface AutoPlayEnabledProps extends BaseSliderProps {
    autoPlay: true;
    autoPlayInterval: number;
    perSlideDuration?: number;
}

interface AutoPlayDisabledProps extends BaseSliderProps {
    autoPlay?: false;
    autoPlayInterval?: number;
    perSlideDuration: number;
}

// Dots mutually exclusive
interface ShowDotsOnly {
    showDots: true;
    showDotsOutside?: false;
}

interface ShowDotsOutsideOnly {
    showDots?: false;
    showDotsOutside: true;
}

// SliderProps union
export type SliderProps =
    | (AutoPlayEnabledProps & ShowDotsOnly)
    | (AutoPlayEnabledProps & ShowDotsOutsideOnly)
    | (AutoPlayDisabledProps & ShowDotsOnly)
    | (AutoPlayDisabledProps & ShowDotsOutsideOnly);


export default function Slider({
    children,
    className,
    showArrows = true,
    alwaysShowArrows = false,
    showDots = false,
    showDotsOutside = false,
    gap = "0",
    autoPlay = false,
    autoPlayInterval = 500,
    height = "250",
    mode = "fade",
    perSlideDuration,
    slidesPerView = 1,
}: Readonly<SliderProps>) {
    const slides = React.Children.toArray(children);
    const totalSlides = slides.length;

    // Infinite loop: clone slides for slide mode
    const loopSlides = mode === "slide" ? [...slides, ...slides, ...slides] : slides;
    const middleIndex = mode === "slide" ? totalSlides : 0;

    const [currentIndex, setCurrentIndex] = useState<number>(middleIndex);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const lockUntilRef = useRef<number>(Date.now());
    const dragStartRef = useRef<number | null>(null);
    const dragTranslateRef = useRef(0);

    const getDwellTime = (): number => {
        return autoPlay
            ? autoPlayInterval ?? 500
            : perSlideDuration ?? 500;
    };

    const armDwellLock = (): void => {
        const dwell = getDwellTime();
        if (dwell > 0) {
            lockUntilRef.current = Date.now() + dwell;
        }
    };

    const canNavigate = (): boolean => {
        return Date.now() >= lockUntilRef.current;
    };

    // handle pending navigation for multiple rapid clicks
    const pendingNavigationRef = useRef<"left" | "right" | null>(null);


    const scrollRight = useCallback(() => {
        if (!canNavigate()) {
            pendingNavigationRef.current = "right";
            return;
        }
        setIsTransitioning(true);
        setCurrentIndex((prev) =>
            mode === "slide" ? prev + slidesPerView : (prev + 1) % totalSlides
        );
        armDwellLock();
    }, [slidesPerView, mode, totalSlides, autoPlay, autoPlayInterval, perSlideDuration]);

    const scrollLeft = useCallback(() => {
        if (!canNavigate()) {
            pendingNavigationRef.current = "left";
            return;
        }
        setIsTransitioning(true);
        setCurrentIndex((prev) =>
            mode === "slide" ? prev - slidesPerView : (prev - 1 + totalSlides) % totalSlides
        );
        armDwellLock();
    }, [slidesPerView, mode, totalSlides, autoPlay, autoPlayInterval, perSlideDuration]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (mode === "slide") {
            // Reset index for infinite loop
            if (currentIndex >= totalSlides * 2) {
                setCurrentIndex(middleIndex + ((currentIndex - middleIndex) % totalSlides));
            }
            if (currentIndex < totalSlides) {
                setCurrentIndex(middleIndex + ((currentIndex - middleIndex) % totalSlides));
            }
        }
    };

    // Drag/Swipe support for slide mode
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (mode !== "slide") return;
        const clientX =
            "touches" in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
        dragStartRef.current = clientX;
        if (sliderRef.current) sliderRef.current.style.transition = "none";
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (mode !== "slide") return;
        if (dragStartRef.current === null || !sliderRef.current) return;
        const clientX =
            "touches" in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
        const diff = dragStartRef.current - clientX;
        dragTranslateRef.current = diff;
        const slideWidth = sliderRef.current.clientWidth / slidesPerView;
        sliderRef.current.style.transform = `translateX(${-(currentIndex * 100) / loopSlides.length - (diff / slideWidth) * (100 / loopSlides.length)
            }%)`;
    };

    const handlePointerUp = () => {
        if (mode !== "slide" || !sliderRef.current) return;
        sliderRef.current.style.transition = "transform 0.5s ease";
        if (Math.abs(dragTranslateRef.current) > 50) {
            if (dragTranslateRef.current > 0) scrollRight();
            else scrollLeft();
        } else {
            setIsTransitioning(true);
        }
        dragStartRef.current = null;
        dragTranslateRef.current = 0;
    };

    // Autoplay
    useEffect(() => {
        if (!autoPlay || totalSlides <= 1) return;
        if (!autoPlayInterval || autoPlayInterval <= 0) return;
        if (isHovered) return;

        const id = setInterval(() => {
            scrollRight();
        }, autoPlayInterval);

        return () => clearInterval(id);
    }, [autoPlay, autoPlayInterval, totalSlides, scrollRight, isHovered]);


    // effect to handle pending navigation after dwell lock expires
    useEffect(() => {
        const interval = setInterval(() => {
            if (!pendingNavigationRef.current) return;
            if (!canNavigate()) return;

            if (pendingNavigationRef.current === "right") scrollRight();
            if (pendingNavigationRef.current === "left") scrollLeft();

            pendingNavigationRef.current = null;
        }, 50);

        return () => clearInterval(interval);
    }, [scrollRight, scrollLeft]);

    // Update transform
    useEffect(() => {
        if (!sliderRef.current) return;
        if (mode === "slide") {
            sliderRef.current.style.transition = isTransitioning
                ? "transform 0.5s ease"
                : "none";
            sliderRef.current.style.transform = `translateX(-${(currentIndex * 100) / loopSlides.length
                }%)`;
        }
    }, [currentIndex, isTransitioning, mode, loopSlides.length]);

    // Dots
    const renderDots = (total: number, current: number) =>
        Array.from({ length: total }).map((_, i) => (
            <button
                key={i}
                onClick={() => {
                    setCurrentIndex(mode === "slide" ? middleIndex + i : i);
                    setIsTransitioning(true);
                }}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-[5px] cursor-pointer rounded-[10px] bg-[#E1E1E1] overflow-hidden"
                style={{
                    width: i === current % total ? 40 : 10,
                    transition: `transform 0.5s`,
                }}
            >
                {i === current % total && (
                    <span
                        className="absolute top-0 left-0 h-full bg-[#2C2C2C] rounded-[10px] transition-all duration-500"
                        style={{ width: "27px" }}
                    />
                )}
            </button>
        ));

    const arrowClass = (side: "left" | "right") =>
        cn(
            "group/button absolute top-1/2 -translate-y-1/2 h-[90px] w-[46px] flex items-center justify-center cursor-pointer",
            "bg-white/70 hover:bg-black/20 backdrop-blur-[4px] transition-colors duration-300",
            "drop-shadow-[3px_0px_6px_rgba(0,0,0,0.1)] z-20",
            side === "left"
                ? "left-0 rounded-tr-[3px] rounded-br-[3px]"
                : "right-0 rounded-tl-[3px] rounded-bl-[3px]",
            alwaysShowArrows ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        );

    return (
        <div className="relative w-full group">
            <div
                className={`relative w-full overflow-hidden ${className ?? ""}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {showArrows && (
                    <button onClick={scrollLeft} aria-label="Scroll Left" className={arrowClass("left")}>
                        <ChevronLeft className="text-black group-hover/button:text-white transition-colors" />
                    </button>
                )}

                {/* Slide / Fade Wrapper */}
                {mode === "slide" ? (
                    <div
                        ref={sliderRef}
                        className={`flex gap-${gap} w-full transition-transform duration-500 ease-in-out`}
                        style={{ width: `${(loopSlides.length / slidesPerView) * 100}%` }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {loopSlides.map((child, i) => (
                            <div
                                key={i}
                                className={cn("flex-shrink-0", !height && "h-full")}
                                style={{
                                    width: `${100 / loopSlides.length}%`,
                                    height: height ? `${height}px` : undefined, // 👈 height applied here for slide mode
                                }}
                            >
                                {child}
                            </div>
                        ))}

                    </div>
                ) : (
                    <div
                        className={cn("relative w-full overflow-hidden", !height && "h-full")}
                        style={{ height: height ? `${height}px` : undefined }} // 👈 height applied here for fade wrapper
                    >
                        {slides.map((child, i) => (
                            <div
                                key={i}
                                className={`absolute top-0 left-0 w-full transition-opacity duration-700 ease-in-out ${i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                                style={{ height: height ? `${height}px` : "100%" }} // 👈 height applied here for each fade slide
                            >
                                <div className="relative w-full h-full">{child}</div>
                            </div>
                        ))}
                    </div>

                )}

                {showArrows && (
                    <button onClick={scrollRight} aria-label="Scroll Right" className={arrowClass("right")}>
                        <ChevronRight className="text-black group-hover/button:text-white transition-colors" />
                    </button>
                )}

                {showDots && !showDotsOutside && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
                        {renderDots(totalSlides, currentIndex)}
                    </div>
                )}
            </div>

            {!showDots && showDotsOutside && (
                <div className="flex justify-center h-[21px] items-center gap-1 mt-2">
                    {renderDots(totalSlides, currentIndex)}
                </div>
            )}
        </div>
    );
}
