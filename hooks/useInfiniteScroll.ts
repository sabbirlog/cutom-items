"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  /** If you're scrolling a container div, pass its element here. Otherwise it defaults to the window. */
  root?: Element | null;
  /** Preload before it hits the viewport. */
  rootMargin?: string;
  threshold?: number | number[];
  /** Temporarily disable observing. */
  disabled?: boolean;
};

export function useInfiniteScroll(
  onLoadMore: () => Promise<void> | void,
  hasMore: boolean,
  {
    root = null,
    rootMargin = "300px",
    threshold = 0,
    disabled = false,
  }: Options = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);
  const nodeRef = useRef<Element | null>(null);

  // Stable setter for the sentinel node (callback ref pattern)
   const setSentinelRef = useCallback((node: HTMLDivElement | null) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || disabled || !hasMore) return;

    // Guard for SSR / old browsers
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        if (isFetchingRef.current) return;

        try {
          isFetchingRef.current = true;
          setIsFetching(true);
          await onLoadMore();
        } finally {
          setIsFetching(false);
          isFetchingRef.current = false;
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onLoadMore, root, rootMargin, threshold, disabled, hasMore]);

  return { sentinelRef: setSentinelRef as (node: HTMLDivElement | null) => void, isFetching };

}
