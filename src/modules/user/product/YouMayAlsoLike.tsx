"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ProductCard from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

interface YouMayAlsoLikeProps {
  currentProductId: Id<"products">;
}

export const YouMayAlsoLike = ({ currentProductId }: YouMayAlsoLikeProps) => {
  // Use list to get general products
  const products = useQuery(api.products.list);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!products) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-muted rounded mb-8 animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 aspect-[3/4] bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Filter out current product and maybe limit to some random or latest 8
  const recommendedProducts = products.filter(p => p._id !== currentProductId).slice(0, 8);

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-100 mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-neutral-800">You May Also Like</h2>
      </div>

      <div className="relative group">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -ml-4">
            {recommendedProducts.map((product: any) => (
              <div
                key={product._id}
                className="flex-none w-[85%] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 pl-4"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Left Arrow */}
        {prevBtnEnabled && (
          <button
            type="button"
            onClick={scrollPrev}
            style={{ top: "45%" }}
            className="absolute -left-5 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white shadow-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Arrow */}
        {nextBtnEnabled && (
          <button
            type="button"
            onClick={scrollNext}
            style={{ top: "45%" }}
            className="absolute -right-5 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white shadow-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
