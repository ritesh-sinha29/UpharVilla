"use client";

import React from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aarav Sharma",
    location: "Mumbai, IN",
    date: "12/03/2026",
    text: "The custom hamper was absolutely beautiful! Every item felt premium and the packaging was top-notch. My sister was thrilled to receive it.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60",
    avatar: "https://i.pravatar.cc/150?u=aarav",
  },
  {
    name: "Ananya Iyer",
    location: "Bangalore, IN",
    date: "15/04/2026",
    text: "Ordered a personalized photo frame for my parents' anniversary. The print quality is excellent and the wood finish is very elegant.",
    rating: 4.5,
    avatar: "https://i.pravatar.cc/150?u=ananya",
  },
  {
    name: "Ishaan Gupta",
    location: "Delhi, IN",
    date: "20/04/2026",
    text: "Quick delivery and very helpful customer support. They even accommodated a last-minute change in the gift card message.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=60",
    avatar: "https://i.pravatar.cc/150?u=ishaan",
  },
  {
    name: "Priya Lakshmi",
    location: "Chennai, IN",
    date: "05/05/2026",
    text: "The 'Under 499' collection has some gems! Found the perfect birthday gift for my colleague without breaking the bank.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=priya",
  },
  {
    name: "Rohan Verma",
    location: "Pune, IN",
    date: "10/05/2026",
    text: "Best gifting site I've used so far. The curation is very thoughtful and not generic like other platforms.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&auto=format&fit=crop&q=60",
    avatar: "https://i.pravatar.cc/150?u=rohan",
  },
  {
    name: "Sanya Malhotra",
    location: "Hyderabad, IN",
    date: "18/05/2026",
    text: "Loved the eco-friendly packaging options. The products inside were just as described. Will definitely order again.",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60",
    avatar: "https://i.pravatar.cc/150?u=sanya",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur, IN",
    date: "22/05/2026",
    text: "The premium hampers are truly luxury. Great for corporate gifting. My clients were very impressed.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=vikram",
  },
  {
    name: "Meera Reddy",
    location: "Kolkata, IN",
    date: "25/05/2026",
    text: "The attention to detail in the custom notes is what sets them apart. Highly recommended for personal gifts.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&auto=format&fit=crop&q=60",
    avatar: "https://i.pravatar.cc/150?u=meera",
  },
  {
    name: "Arjun Kapoor",
    location: "Ahmedabad, IN",
    date: "01/06/2026",
    text: "Good value for money. The combo sets are well-priced.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=arjun",
  },
];

const Testimonials = () => {
  // Split into 3 columns for the grid
  const column1 = [testimonials[0], testimonials[3], testimonials[6]];
  const column2 = [testimonials[1], testimonials[4], testimonials[7]];
  const column3 = [testimonials[2], testimonials[5], testimonials[8]];

  return (
    <section className="py-14 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold underline underline-offset-8 mb-3">
            Loved by everyone, trusted by many!
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Rating value={5} readOnly size="medium" />
            <span className="text-gray-600 font-medium">
              from 16549 reviews
            </span>
          </div>
        </div>

        {/* Scrollable Container with Fade Mask */}
        <div className="relative h-[800px] overflow-hidden">
          {/* Top and Bottom Fade Overlays */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background to-transparent z-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-20 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {[column1, column2, column3].map((column, colIndex) => (
              <motion.div
                key={colIndex}
                animate={{
                  y: [0, -500],
                }}
                transition={{
                  duration: 20 + colIndex * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex flex-col gap-6"
              >
                {/* Double the column content for seamless loop */}
                {[...column, ...column].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Header: Avatar, Name, Location, Date */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 leading-none">
                              {item.name}
                            </span>
                            <span className="bg-neutral-900 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">
                              Verified
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1">
                            {item.location}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {item.date}
                      </span>
                    </div>

                    {/* Content: Image (Optional) */}
                    {item.image && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-100">
                        <Image
                          src={item.image}
                          alt="Purchased item"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content: Text */}
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {item.text}
                    </p>

                    {/* Footer: Rating */}
                    <div className="pt-2 border-t border-neutral-50">
                      <Rating
                        value={item.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                        sx={{ fontSize: "0.875rem" }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default Testimonials;
