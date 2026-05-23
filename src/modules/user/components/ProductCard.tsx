"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { Rating } from "@mui/material";
import { cn } from "@/lib/utils";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: any;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isHovered && images.length > 1) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex(1);
        if (images.length > 2) {
          intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
          }, 900);
        }
      }, 400);
    } else {
      setCurrentIndex(0);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, images.length]);

  const originalPrice = product.discount
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  // Simulated review count (can be replaced with real data later)
  const reviewCount = Math.floor(10 + (product.price % 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col cursor-pointer",
        className
      )}
    >
      <Link href={`/product/${product._id}`} className="flex flex-col h-full w-full">
        {/* Image Container — full bleed, clean */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F7F7F7]">
          {/* Sliding strip */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
            }}
          >
            {images.map((src: string, i: number) => (
              <div
                key={i}
                className="relative h-full flex-none"
                style={{ width: `${100 / images.length}%` }}
              >
                <Image
                  src={
                    src ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {product.discount ? (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
                {product.discount}% OFF
              </span>
            ) : (
              (product.markNewArrival ||
                Date.now() - product.launchedAt < 24 * 60 * 60 * 1000) && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
                  NEW
                </span>
              )
            )}
          </div>

          {/* Wishlist — appears on hover */}
          <div
            className={`absolute top-2.5 right-2.5 z-10 transition-all duration-200 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            onClick={(e) => e.preventDefault()}
          >
            <WishlistButton productId={product._id} />
          </div>



        </div>

        {/* Text content — below image, no card border */}
        <div className="pt-3 px-0.5 flex flex-col gap-1">
          {/* Product name */}
          <h3 className="text-sm text-gray-800 capitalize line-clamp-2 leading-snug font-medium">
            {product.name}
          </h3>

          {/* Stars + review count */}
          <div className="flex items-center gap-1.5">
            <Rating
              name={`rating-${product._id}`}
              defaultValue={2.5}
              precision={0.5}
              readOnly
              size="small"
              sx={{ fontSize: "0.85rem" }}
            />
            <span className="text-xs text-gray-400 font-medium">
              {reviewCount} reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-gray-900 font-mono">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through font-mono">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span
              className={`flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              Shop
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
