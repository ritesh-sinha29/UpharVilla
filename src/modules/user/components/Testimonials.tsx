"use client";

import { Rating } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";

// ─── Review Data ──────────────────────────────────────────────────────────────
const reviews = [
  {
    name: "Aarav Sharma",
    location: "Mumbai",
    text: "The custom hamper was absolutely beautiful! Every item felt premium and the packaging was top-notch. My sister was thrilled to receive it on her birthday.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=aarav",
    product: "Luxury Birthday Hamper",
  },
  {
    name: "Ananya Iyer",
    location: "Bangalore",
    text: "Ordered a personalized photo frame for my parents' anniversary. The print quality is excellent and the wood finish is very elegant.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ananya",
    product: "Custom Photo Frame",
  },
  {
    name: "Ishaan Gupta",
    location: "Delhi",
    text: "Quick delivery and very helpful customer support. They even accommodated a last-minute change in the gift card message. Will order again!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ishaan",
    product: "Premium Gift Set",
  },
  {
    name: "Priya Lakshmi",
    location: "Chennai",
    text: "The 'Under ₹499' collection has some gems! Found the perfect birthday gift for my colleague without breaking the bank.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=priya",
    product: "Budget Gift Box",
  },
  {
    name: "Rohan Verma",
    location: "Pune",
    text: "Best gifting site I've used so far. The curation is very thoughtful and not generic like other platforms. Every hamper feels personalised.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=rohan",
    product: "Curated Gift Hamper",
  },
  {
    name: "Sanya Malhotra",
    location: "Hyderabad",
    text: "Loved the eco-friendly packaging options. The products inside were just as described. Will definitely order again for the festive season.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sanya",
    product: "Eco Gift Collection",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur",
    text: "The premium hampers are truly luxury. Great for corporate gifting — my clients were very impressed with the presentation and quality.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=vikram",
    product: "Corporate Gift Set",
  },
  {
    name: "Meera Reddy",
    location: "Kolkata",
    text: "The attention to detail in the custom notes is what sets UpharVilla apart. Highly recommended for personal gifts!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=meera",
    product: "Personalised Hamper",
  },
];

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ item }: { item: (typeof reviews)[0] }) {
  return (
    <div className="h-full flex flex-col bg-white rounded-xl md:rounded-2xl border border-gray-100 p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Stars */}
      <Rating
        value={item.rating}
        precision={0.5}
        readOnly
        size="small"
        sx={{ fontSize: "0.85rem" }}
      />

      {/* Quote */}
      <p className="text-[12px] md:text-[13px] lg:text-sm text-gray-600 leading-relaxed mt-3 flex-1">
        &ldquo;{item.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-3 md:my-4" />

      {/* Author */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden ring-1 ring-gray-200 shrink-0">
          <Image
            src={item.avatar}
            alt={item.name}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] md:text-xs font-semibold text-gray-900 truncate">
            {item.name}
          </p>
          <p className="text-[10px] text-gray-400 font-medium truncate">
            {item.location} &middot; Verified Buyer
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      slidesToScroll: 1,
      dragFree: false,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-4 md:py-6 lg:py-8 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* ── Header ── */}
        <div className="md:text-center mb-4 md:mb-6 lg:mb-8">
          {/* Mobile header */}
          <div className="flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="text-[15px] font-bold text-neutral-900">
                Customer Reviews
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <Rating value={5} readOnly size="small" sx={{ fontSize: "0.7rem" }} />
              <span className="text-[10px] text-gray-400 font-medium">
                16,549
              </span>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:block">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-neutral-900 underline underline-offset-8"
            >
              What Our Customers Say
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mt-3"
            >
              <Rating value={5} readOnly size="medium" sx={{ fontSize: "1.1rem" }} />
              <span className="text-sm text-gray-500 font-medium font-mono">
                from 16,549 reviews
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base font-mono font-medium mt-2"
            >
              Real feedback from people who trust UpharVilla for their special moments.
            </motion.p>
          </div>
        </div>

        {/* ── Mobile: horizontal scroll ── */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 mobile-scroll">
          {reviews.slice(0, 5).map((item) => (
            <div key={item.name} className="flex-none w-[260px]">
              <ReviewCard item={item} />
            </div>
          ))}
        </div>

        {/* ── Desktop: carousel with arrows ── */}
        <div className="hidden md:block relative">
          <div className="mx-12">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {reviews.map((item) => (
                  <div
                    key={item.name}
                    className="flex-none w-[calc(100%/3)] px-2 lg:px-2.5"
                  >
                    <ReviewCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-gray-200 bg-white shadow-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-xl cursor-pointer transition-all duration-200 flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full border border-gray-200 bg-white shadow-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-xl cursor-pointer transition-all duration-200 flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Quote decoration ── */}
        <div className="hidden md:flex justify-center mt-8 lg:mt-10">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="w-16 h-px bg-gray-200" />
            <Quote className="w-5 h-5 rotate-180" />
            <div className="w-16 h-px bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
