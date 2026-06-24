"use client";

import { Rating } from "@mui/material";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const images = useMemo(
    () => [product.thumbnail, ...(product.images || [])].filter(Boolean),
    [product.thumbnail, product.images],
  );

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
  }, [isHovered, images]);

  const originalPrice = product.discount
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  // Simulated review count (can be replaced with real data later)
  const reviewCount = Math.floor(10 + (product.price % 60));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("group relative flex flex-col cursor-pointer", className)}
    >
      <Link
        href={`/product/${product._id}`}
        className="flex flex-col h-full w-full"
      >
        {/* Image Container — full bleed, clean */}
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden rounded-lg md:rounded-xl bg-[#F7F7F7]",
            product.stock <= 0 && "opacity-80",
          )}
        >
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Wishlist — top-right corner, appears on hover (Flipkart/Nykaa style) */}
          <div
            className={`absolute top-1.5 right-1.5 md:top-2.5 md:right-2.5 z-10 transition-all duration-200 opacity-100 translate-y-0 md:${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
            onClick={(e) => e.preventDefault()}
          >
            <WishlistButton productId={product._id} />
          </div>

          {/* Badge overlays at the top-left of the image container (Flipkart/Nykaa style) */}
          {(product.stock <= 0 ||
            product.markMostPurchased === true ||
            product.markMostSold === true ||
            product.markTrending === true ||
            !!(
              product.markNewArrival ||
              (product.launchedAt &&
                Date.now() - product.launchedAt < 24 * 60 * 60 * 1000)
            )) && (
            <div className="absolute top-1.5 md:top-2.5 left-0 z-10 flex flex-col items-start">
              {product.stock <= 0 ? (
                <span className="bg-[#FAFAFA]/95 backdrop-blur-xs text-[#737373] border-y border-r border-[#E5E5E5] text-[8px] font-sans font-bold tracking-wider px-2.5 py-0.5 rounded-r-md shadow-sm uppercase">
                  Sold Out
                </span>
              ) : (
                <>
                  {product.markMostSold === true ||
                  product.markMostPurchased === true ? (
                    <span className="bg-[#E2AF3E] text-white text-[8px] font-sans font-extrabold tracking-wider px-2.5 py-0.5 rounded-r-md shadow-sm uppercase">
                      Most Sold
                    </span>
                  ) : product.markTrending === true ? (
                    <span className="bg-[#FC2779] text-white text-[8px] font-sans font-extrabold tracking-wider px-2.5 py-0.5 rounded-r-md shadow-sm uppercase">
                      Trending
                    </span>
                  ) : (
                    <span className="bg-[#0D9488] text-white text-[8px] font-sans font-extrabold tracking-wider px-2.5 py-0.5 rounded-r-md shadow-sm uppercase">
                      New Arrival
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Text content — below image, no card border */}
        <div className="pt-2 md:pt-3 lg:pt-4 px-0.5 flex flex-col gap-0.5 md:gap-1">
          {/* Product name */}
          <h3 className="text-[11px] md:text-sm lg:text-base text-gray-800 capitalize line-clamp-1 md:line-clamp-2 leading-snug font-medium">
            {product.name}
          </h3>

          {/* Stars + review count */}
          <div className="flex items-center gap-1 shrink-0">
            <Rating
              name={`rating-${product._id}`}
              defaultValue={2.5}
              precision={0.5}
              readOnly
              size="small"
              sx={{ fontSize: "0.7rem", '@media (min-width: 768px)': { fontSize: '0.85rem' } }}
            />
            <span className="text-[10px] md:text-xs text-gray-400 font-medium whitespace-nowrap">
              ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-0">
            <div className="flex items-baseline gap-1 md:gap-1.5 min-w-0">
              <span className="text-xs md:text-sm lg:text-base font-bold text-gray-900 font-mono">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {originalPrice && (
                <>
                  <span className="text-[10px] md:text-xs text-gray-400 line-through font-mono hidden sm:inline">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold text-[#E11D48] font-sans">
                    {product.discount}%
                  </span>
                </>
              )}
            </div>
            <span
              className={`flex items-center gap-0.5 text-[9px] md:text-[11px] font-semibold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full transition-all duration-200 cursor-pointer shrink-0 ${
                product.stock <= 0
                  ? "bg-neutral-800 text-white"
                  : "bg-primary text-primary-foreground"
              } opacity-100 pointer-events-auto md:${
                isHovered
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <ShoppingBag className="w-2.5 h-2.5 md:w-3 md:h-3" />
              {product.stock <= 0 ? "Notify" : "Shop"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
