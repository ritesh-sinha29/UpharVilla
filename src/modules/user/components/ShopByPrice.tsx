"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const priceCategories = [
  {
    label: "Under 299",
    price: "299",
    image: "/gift1.png",
  },
  {
    label: "Under 499",
    price: "499",
    image: "/gift2.png",
  },
  {
    label: "Under 699",
    price: "699",
    image: "/gift3.png",
  },
  {
    label: "Under 999",
    price: "999",
    image: "/gift4.png",
  },
  {
    label: "Under 1599",
    price: "1599",
    image: "/gift5.png",
  },
];

const ShopByPrice = () => {
  return (
    <section className="py-12 bg-white relative ">
      <Image
        src="/35.png"
        alt="Accent"
        width={200}
        height={200}
        className="absolute top-0 -right-5 rounded-xl"
      />
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl font-semibold">Shop By Price</h2>
          <p className="text-muted-foreground font-mono text-lg max-w-2xl font-medium">
            Shop your favourites gift Hmapers under your budget.
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-8 justify-center">
          {priceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="flex-1 min-w-[220px] group"
            >
              <Link
                href={`/search?maxPrice=${category.price}`}
                className="relative block group"
              >
                <div
                  className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-primary/70 border-2 border-transparent transition-all duration-500 group-hover:shadow-2xl group-hover:border-white/50 group-hover:-translate-y-2`}
                >
                  {/* Category Image with unique shape */}
                  <div className="relative w-48 h-48 mb-6 transition-all duration-500">
                    <div className="w-full h-full overflow-hidden rounded-2xl transition-all duration-500">
                      <Image
                        src={category.image}
                        alt={category.label}
                        fill
                        className="object-cover transition-all duration-500 rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Price Text */}
                  <div className="text-center relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-top-8 w-max">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-white rounded-full shadow-sm`}
                      >
                        BEST VALUE
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-1 block`}
                    >
                      Under
                    </span>
                    <h3
                      className={`text-3xl font-bold font-mono text-white flex items-start justify-center leading-none`}
                    >
                      <span className="text-xl mt-1 mr-0.5 font-bold font-mono">
                        ₹
                      </span>
                      {category.price}
                    </h3>
                  </div>

                  {/* CTA Button removed for cleaner/shorter look as requested to reduce height */}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByPrice;
