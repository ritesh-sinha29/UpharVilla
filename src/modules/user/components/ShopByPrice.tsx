"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const priceCategories = [
  {
    label: "Under 299",
    price: "299",
    image: "/gift1.svg",
  },
  {
    label: "Under 499",
    price: "499",
    image: "/gift3.svg",
  },
  {
    label: "Under 699",
    price: "699",
    image: "/gift2.svg",
  },
  {
    label: "Under 999",
    price: "999",
    image: "/gift4.svg",
  },
  {
    label: "Under 1599",
    price: "1599",
    image: "/gift5.svg",
  },
];

const ShopByPrice = () => {
  return (
    <section className="py-12 bg-white relative ">
      {/* <Image
        src="/35.png"
        alt="Accent"
        width={200}
        height={200}
        className="absolute top-0 -right-5 rounded-xl"
      /> */}
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl font-semibold">Shop By Price</h2>
          <p className="text-muted-foreground font-mono text-lg max-w-2xl font-medium">
            Shop your favourites gift Hmapers under your budget.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {priceCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={`/search?maxPrice=${category.price}`} className="block">
                <div className="relative mb-6">
                  {/* Randomish shaped container for image */}
                  <motion.div
                    className="relative aspect-[0.9/1] overflow-hidden bg-primary/10 border border-primary/30 shadow-sm transition-all duration-500 rounded-xl group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:border-primary/30 group-hover:bg-primary/[0.08]"
                    style={{
                      borderRadius:
                        index % 2 === 0
                          ? "12px 40px 12px 40px"
                          : "40px 12px 40px 12px",
                    }}
                    whileHover={{
                      borderRadius:
                        index % 2 === 0
                          ? "40px 12px 40px 12px"
                          : "12px 40px 12px 40px",
                      scale: 1.05,
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.label}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 scale-105"
                    />

                    {/* Subtle purple tint on hover */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>

                  {/* Background decorative shape */}
                  <div className="absolute -inset-2 bg-[#c88ee8]/5 rounded-[2rem] -z-10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
                </div>

                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-1">
                    Under
                  </span>
                  <h3 className="text-2xl font-bold text-black transition-colors duration-300 group-hover:text-[#c88ee8] flex items-center justify-center">
                    <span className="text-lg mr-0.5">₹</span>
                    {category.price}
                  </h3>
                  <motion.div className="h-0.5 w-0 bg-[#c88ee8] mx-auto mt-1 transition-all duration-300 group-hover:w-12" />
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
