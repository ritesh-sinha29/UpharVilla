"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    image: "/promo-offer-1.png",
    tag: "UPHARVILLA",
    title: "Memories That Last",
    subtitle: "Beautifully crafted photo gifts for every cherished moment.",
    gradient: "from-indigo-500/10 via-purple-500/5 to-white border-purple-100/60",
    badge: "bg-purple-50 text-purple-700 border-purple-100",
    glow: "bg-purple-400/10",
  },
  {
    image: "/promo-offer-2.png",
    tag: "CUSTOMIZED",
    title: "Made Just for Them",
    subtitle: "Personalized gifts that speak from the heart.",
    gradient: "from-amber-500/15 via-orange-500/5 to-white border-amber-100/60",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    glow: "bg-amber-400/10",
  },
  {
    image: "/promo-offer-3.png",
    tag: "TRENDING",
    title: "Gift with Meaning",
    subtitle: "Thoughtful pieces designed to make every occasion unforgettable.",
    gradient: "from-rose-500/15 via-pink-500/5 to-white border-rose-100/60",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    glow: "bg-rose-400/10",
  },
  {
    image: "/promo-offer-4.png",
    tag: "PREMIUM",
    title: "Crafted with Love",
    subtitle: "From us to yours — gifts that truly stand out.",
    gradient: "from-rose-500/15 via-pink-500/5 to-white border-rose-100/60",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    glow: "bg-rose-400/10",
  },
];

interface SlideBoxProps {
  slides: typeof SLIDES;
  initialSlide?: number;
}

function SlideBox({
  slides,
  initialSlide = 0,
}: SlideBoxProps) {
  const [current, setCurrent] = useState(initialSlide);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  };

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % slides.length;
        return next;
      });
    }, 3000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = slides[current];

  return (
    <div
      className={`group relative flex-1 rounded-2xl overflow-hidden bg-gradient-to-br border min-h-[160px] sm:min-h-[180px] md:min-h-[200px] transition-all duration-500 ease-in-out ${slide.gradient}`}
    >
      {/* Layout wrapper */}
      <div className="relative z-10 flex items-center h-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px]">
        {/* Left: Text Content */}
        <div className="flex-1 min-w-0 px-5 sm:px-8 pt-4 pb-8 md:pt-6 md:pb-10 pr-[145px] sm:pr-[170px] md:pr-[190px] lg:pr-[230px] flex flex-col justify-start">
          <div
            className="transition-all duration-500 ease-out"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
            }}
          >
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.05em] border mb-2 md:mb-3 shadow-sm ${slide.badge}`}
            >
              <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
              {slide.tag}
            </span>
            <h2 className="text-[17px] sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight">
              {slide.title}
            </h2>
            <p className="mt-1 md:mt-2 text-neutral-500 text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-[180px] sm:max-w-[220px] md:max-w-xs line-clamp-2 md:line-clamp-3">
              {slide.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Product Image — anchored bottom-right */}
      <div className="absolute right-0 sm:right-2 top-0 bottom-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[220px] overflow-hidden pointer-events-none">
        <div
          className="relative w-full h-full transition-all duration-500 ease-out group-hover:scale-105"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? "scale(0.9) translateY(8px)"
              : "scale(1) translateY(0)",
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-contain object-bottom drop-shadow-lg"
            sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 220px"
            priority
          />
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-2.5 sm:bottom-3.5 left-5 sm:left-8 flex items-center gap-1.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              goTo(idx);
              startInterval();
            }}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              idx === current
                ? "w-6 h-1.5 bg-neutral-800 shadow-sm"
                : "w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Background glowing accent */}
      <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl transition-all duration-1000 ease-in-out pointer-events-none ${slide.glow}`} />
    </div>
  );
}

export default function ProductHeroSlider() {
  return (
    <div className="mx-4 md:mx-12 mt-4 md:mt-6 mb-4 flex flex-col md:flex-row gap-4 md:gap-6">
      <SlideBox slides={SLIDES} initialSlide={0} />
      {/* Second slider — desktop only */}
      <div className="hidden md:flex flex-1">
        <SlideBox slides={SLIDES} initialSlide={1 % SLIDES.length} />
      </div>
    </div>
  );
}
