"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

export const HeroSlider = () => {
  const banners = useQuery(api.heroBanners.getBanners);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const isLoading = banners === undefined;

  console.log("BANNERS DATA FROM CONVEX:", banners);

  const displayBanners = (
    banners && banners.length > 0
      ? banners.slice(0, 5)
      : Array.from({ length: 5 }).map((_, index) => ({
        _id: `placeholder-${index}`,
        imageLink: "",
        altText: `Placeholder Banner ${index + 1}`,
        visitLink: "#",
      }))
  ) as Array<{
    _id: string;
    imageLink: string;
    altText?: string;
    visitLink: string;
  }>;

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    };

    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi]);

  // Autoplay with interaction pause/resume
  useEffect(() => {
    if (!carouselApi) return;

    let intervalId: NodeJS.Timeout;

    const startAutoplay = () => {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        carouselApi.scrollNext();
      }, 5000);
    };

    const stopAutoplay = () => {
      clearInterval(intervalId);
    };

    startAutoplay();

    // Pause autoplay on user pointer interaction
    carouselApi.on("pointerDown", stopAutoplay);
    // Reset timer on slide select to prevent sudden jumps
    carouselApi.on("select", startAutoplay);
    // Restart autoplay when carousel settles
    carouselApi.on("settle", startAutoplay);

    return () => {
      stopAutoplay();
      carouselApi.off("pointerDown", stopAutoplay);
      carouselApi.off("select", startAutoplay);
      carouselApi.off("settle", startAutoplay);
    };
  }, [carouselApi]);

  return (
    <div className="w-full mb-10 max-w-[1440px] mx-auto px-8 group relative">
      <Carousel
        setApi={setCarouselApi}
        className="w-full relative overflow-visible"
        opts={{
          loop: true,
          align: "center",
          duration: 18, // Faster, snappy transition duration
        }}
      >
        <CarouselContent className="-ml-6">
          {displayBanners.map((banner, index) => {
            const content = (
              <div
                className={cn(
                  "relative w-full h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden rounded-xl bg-muted border border-neutral-100/50 shadow-md transition-all duration-500",
                  isLoading && "animate-pulse"
                )}
              >
                {banner.imageLink ? (
                  <Image
                    src={banner.imageLink}
                    alt={banner.altText || `Banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/60 select-none p-6 text-center">
                    <span className="text-base text-muted-foreground font-semibold">
                      UpharVilla Banner {index + 1}
                    </span>
                    <span className="text-xs text-muted-foreground/60 mt-1">
                      No banner image uploaded yet
                    </span>
                  </div>
                )}
              </div>
            );

            return (
              <CarouselItem
                key={banner._id}
                className="pl-6 basis-[88vw] sm:basis-[450px] md:basis-[600px] shrink-0 grow-0"
              >
                {banner.imageLink ? (
                  <Link href={banner.visitLink} target="_blank">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Custom Navigation Buttons */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            carouselApi?.scrollPrev();
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 shadow-lg bg-white hover:bg-neutral-50 border border-neutral-200 h-10 w-10 md:h-12 md:w-12 transition-all duration-300 flex items-center justify-center rounded-full text-neutral-800 cursor-pointer active:scale-95 hover:scale-105 opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-4 md:w-4" strokeWidth={2} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            carouselApi?.scrollNext();
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 shadow-lg bg-white hover:bg-neutral-50 border border-neutral-200 h-10 w-10 md:h-12 md:w-12 transition-all duration-300 flex items-center justify-center rounded-full text-neutral-800 cursor-pointer active:scale-95 hover:scale-105 opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-4 md:w-4" strokeWidth={2} />
        </button>

        {/* Bottom Pagination Dots with Framer Motion */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
          {displayBanners.map((_, index) => {
            const isActive = current === index + 1;
            return (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  carouselApi?.scrollTo(index);
                }}
                className="relative flex items-center justify-center h-2 w-2"
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  animate={{
                    width: isActive ? 24 : 8,
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(255, 255, 255, 0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="h-2 rounded-full cursor-pointer"
                />
              </button>
            );
          })}
        </div>
      </Carousel>
    </div>
  );
};

export default HeroSlider;
