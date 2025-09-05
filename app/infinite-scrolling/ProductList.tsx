"use client";

import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCallback, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

const ALL: Product[] = Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: (i + 1) * 10,
  imageUrl: `https://via.placeholder.com/600x400.png?text=Product+${i + 1}`,
}));

const PER_PAGE = 6;
const SIMULATED_DELAY = 2500;

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Product[]>(ALL.slice(0, PER_PAGE));

  const total = ALL.length;
  const hasMore = items.length < total;

  // Simulate async fetch with delay
  const fetchPage = useCallback(async (nextPage: number): Promise<Product[]> => {
    await new Promise((r) => setTimeout(r, SIMULATED_DELAY));
    const start = (nextPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    return ALL.slice(start, end);
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const newItems = await fetchPage(nextPage);
    if (newItems.length === 0) return;
    setItems((prev) => [...prev, ...newItems]);
    setPage(nextPage);
  }, [page, fetchPage]);

  const { sentinelRef, isFetching } = useInfiniteScroll(loadMore, hasMore, {
    root: null,
    rootMargin: "300px",
    threshold: 0,
  });

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      <div
        className="grid gap-6
                   grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      >
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}

        {/* Skeletons while loading */}
        {isFetching &&
          Array.from({ length: PER_PAGE }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Sentinel — stable element observed by the hook */}
      <div ref={sentinelRef} aria-hidden className="h-10" />

      <div className="mt-4 text-center">
        {!hasMore && <p>No more products</p>}
      </div>
    </div>
  );
}
