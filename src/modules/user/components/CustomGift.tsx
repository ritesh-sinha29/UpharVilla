"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const CustomGift = () => {
  const allProducts = useQuery(api.products.getByCategory, {
    category: "custom-hampers",
  });

  const products = allProducts?.slice(0, 4);

  if (!products) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-7xl px-4">
          <div className="h-10 w-64 bg-muted rounded-lg"></div>
          <div className="h-4 w-96 bg-muted rounded-md"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="pb-16 pt-6 bg-transparent relative">
      {/* <Image
        src="/37.png"
        alt="Accent"
        width={200}
        height={200}
        className="absolute -bottom-10 -left-5 rounded-xl"
      /> */}
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block relative"
          >
            <h2 className="text-3xl font-semibold underline underline-offset-8">
              Custom Gift
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground max-w-2xl font-mono mx-auto text-lg font-medium tracking-wide"
          >
            Add a personal touch to your gift with our customization options,
            including photos, text, and gift hampers.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product: any, index: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/category/custom-hampers"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-white hover:bg-primary/90 hover:shadow-md px-6 py-2 text-sm font-medium transition-all duration-150 cursor-pointer"
          >
            View All Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomGift;
