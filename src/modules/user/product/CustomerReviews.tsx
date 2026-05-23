"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// Mock data based on the screenshot provided
const MOCK_REVIEWS = [
  {
    id: 1,
    initials: "JM",
    name: "Jhansi Mulakalapally",
    time: "2 days ago",
    rating: 5,
    text: "Good",
    tags: [{ label: "City", value: "Hyderabad" }],
  },
  {
    id: 2,
    initials: "CMR",
    name: "Chandra Mouli Rokk...",
    time: "2 days ago",
    rating: 5,
    text: "Best delivery",
    tags: [
      { label: "Occasion", value: "Anniversary" },
      { label: "City", value: "Miyapur-Hyderabad" },
    ],
  },
  {
    id: 3,
    initials: "NY",
    name: "Nandini Yadav",
    time: "2 days ago",
    rating: 5,
    text: "Great!",
    tags: [
      { label: "Occasion", value: "I-Am-Sorry" },
      { label: "City", value: "Delhi" },
    ],
  },
  {
    id: 4,
    initials: "AK",
    name: "Aditya K",
    time: "2 days ago",
    rating: 5,
    text: "The delivery agent handled the flowers very carefully and got them on time. Excellent job",
    tags: [{ label: "City", value: "Ranga-Reddy" }],
  },
  {
    id: 5,
    initials: "SD",
    name: "Sneha Das",
    time: "3 days ago",
    rating: 4,
    text: "Loved the quality of the product. Will buy again.",
    tags: [{ label: "City", value: "Mumbai" }],
  },
];

export const CustomerReviews = () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-neutral-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800">Customer Reviews</h2>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-700 border border-[#bfa268] rounded-md hover:bg-[#bfa268]/5 transition-colors cursor-pointer">
          Show All Reviews <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative group">
        <div ref={emblaRef} className="overflow-hidden py-2">
          <div className="flex -ml-4">
            {MOCK_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="flex-none w-[85%] sm:w-[45%] md:w-[35%] lg:w-[28%] pl-4"
              >
                <div className="flex flex-col justify-between h-[180px] p-5 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  {/* Review Header */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#566e7a] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {review.initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm text-neutral-700 flex items-center">
                          <span className="font-medium truncate max-w-[130px]">{review.name}</span>
                          <span className="text-neutral-400 mx-1">•</span>
                          <span className="text-neutral-400 text-xs">{review.time}</span>
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "fill-[#008a00] text-[#008a00]"
                                  : "fill-neutral-200 text-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Text */}
                    <p className="text-sm text-neutral-700 mt-3 line-clamp-3">
                      {review.text}
                    </p>
                  </div>

                  {/* Review Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {review.tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 bg-neutral-100 rounded text-[11px] text-neutral-600 font-medium"
                      >
                        {tag.label}: {tag.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Arrow Navigation */}
        {prevBtnEnabled && (
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-9 h-9 rounded-full border border-gray-300 bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Arrow Navigation */}
        {nextBtnEnabled && (
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-9 h-9 rounded-full border border-gray-300 bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
