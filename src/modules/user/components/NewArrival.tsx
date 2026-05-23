"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star, ArrowRight } from "lucide-react";

const NewArrival = () => {
  const products = useQuery(api.products.getNewArrivals);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-7xl px-4">
          <div className="h-10 w-64 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block relative"
          >
            <h2 className="text-3xl font-semibold underline underline-offset-8">
              New Arrival
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground max-w-2xl font-mono mx-auto text-lg font-medium tracking-wide"
          >
            Explore our latest drops and trending pieces designed to elevate
            your style.
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Embla Viewport */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-3">
              {products.map((product: any) => (
                <div
                  key={product._id}
                  className="flex-none w-full sm:w-1/2 lg:w-1/5 pl-3"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow — floats over left edge, centered on image (aspect-square ~ 67% of card height) */}
          <button
            type="button"
            onClick={scrollPrev}
            style={{ top: "33%" }}
            className="absolute -left-5 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white shadow-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={scrollNext}
            style={{ top: "33%" }}
            className="absolute -right-5 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 bg-white shadow-md text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View All Button & Rating */}
        <div className="flex flex-col items-center mt-12 space-y-4">
          <a
            href="/new-arrivals"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white hover:bg-primary/90 hover:shadow-md px-6 py-2 text-sm font-medium transition-all duration-150 cursor-pointer"
          >
            View All New Arrivals
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="flex items-center gap-2 border border-purple-100 bg-purple-50/30 rounded-md px-4 py-2 shadow-sm">
            <Star className="fill-purple-600 text-purple-600 w-4 h-4" />
            <span className="text-sm font-medium text-gray-600">
              Rated 4.8 / 5 | Trusted by 4,62,543 Happy Customers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
