import Slider from "@/components/slider/Slider"; // Assuming Slider component is in the same directory
import React from "react";

// Helper styles for the example slides
const slideStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2.5rem",
  color: "white",
  fontFamily: "sans-serif",
  fontWeight: "bold",
  borderRadius: "8px",
};

// Create an array of slide elements
const exampleSlides = [
  <div key="slide1" style={{ ...slideStyle, backgroundColor: "#818cf8" }}>
    Slide 1
  </div>,
  <div key="slide2" style={{ ...slideStyle, backgroundColor: "#f472b6" }}>
    Slide 2
  </div>,
  <div key="slide3" style={{ ...slideStyle, backgroundColor: "#fbbf24" }}>
    Slide 3
  </div>,
  <div key="slide4" style={{ ...slideStyle, backgroundColor: "#4ade80" }}>
    Slide 4
  </div>,
];

// The component that renders the Slider for preview
export function SliderPreview() {
  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontFamily: "sans-serif" }}>
        Slider Component Preview
      </h1>
      <Slider
        autoPlay={true}
        autoPlayInterval={4000}
        perSlideDuration={2000}
        showArrows={true}
        alwaysShowArrows={true}
        showDots={false}
        showDotsOutside={true}
        height="250"
        mode="slide"
      >
        {exampleSlides}
      </Slider>
    </div>
  );
}