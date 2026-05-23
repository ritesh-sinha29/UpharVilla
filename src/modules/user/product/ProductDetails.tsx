"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Gift, Truck, ShieldCheck, CreditCard, RotateCcw, Share, ShoppingCart, Zap } from "lucide-react";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: any; // We'll pass the convex product here
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(
    product?.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"
  );
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const addToCart = useMutation(api.cart.addToCart);
  
  const allImages = [product?.thumbnail, ...(product?.images || [])].filter(Boolean);
  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop");
  }

  const originalPrice = product?.discount
    ? Math.round(product.price / (1 - product.discount / 100))
    : null;

  // Mock data as per screenshot requirements
  const viewingCount = 67;
  const reviewCount = 22;
  const ratingValue = 4.5;
  const isPersonalised = product?.category === "custom-hampers";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="flex gap-4 h-[600px]">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3 w-20 overflow-y-auto hidden-scrollbar">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                className={`cursor-pointer relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedImage === img ? "border-primary" : "border-transparent hover:border-neutral-300"
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#F7F7F7]">
            <Image
              src={selectedImage}
              alt={product?.name || "Product"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          {/* Title & Share */}
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-semibold text-neutral-800 capitalize">
              {product?.name || "Product Name"}
            </h1>
            <button className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
              Share <Share className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Views & Ratings */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-neutral-600 font-medium">
              <Eye className="w-4 h-4 text-neutral-500" />
              {viewingCount} People Viewing This
            </div>
            <div className="flex items-center gap-2">
              <Rating
                name="read-only"
                value={ratingValue}
                precision={0.5}
                readOnly
                size="small"
                sx={{ color: "#000" }} // Matches screenshot black stars
              />
              <span className="text-sm text-neutral-500">{reviewCount} reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-end gap-3">
              {originalPrice && (
                <span className="text-lg text-neutral-400 line-through font-medium">
                  Rs. {originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-3xl font-bold text-neutral-900">
                Rs. {product?.price?.toLocaleString("en-IN") || "690.00"}
              </span>
              {product?.discount && (
                <span className="text-sm font-semibold text-rose-500 mb-1">
                  Save {product.discount}%
                </span>
              )}
            </div>
            <span className="text-sm text-neutral-500">(Inclusive of all taxes)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full mt-4">
            <button 
              disabled={isAdding}
              onClick={async () => {
                if (isAddedToCart) {
                  router.push("/cart");
                } else {
                  if (isLoading) {
                    toast.info("Please wait, loading authentication state...");
                    return;
                  }
                  if (!isAuthenticated) {
                    toast.error("Please sign in to add items to your cart");
                    router.push("/auth");
                    return;
                  }
                  try {
                    setIsAdding(true);
                    await addToCart({ productId: product._id, quantity: 1 });
                    setIsAddedToCart(true);
                    toast.success("Added to cart");
                  } catch (error: any) {
                    toast.error(error?.message || "Failed to add to cart");
                  } finally {
                    setIsAdding(false);
                  }
                }
              }}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 shadow-sm hover:shadow-md font-semibold tracking-wider text-sm py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 uppercase ${
                isAddedToCart 
                  ? "bg-[#F5F5DC] border-[#F5F5DC] text-neutral-800" 
                  : "bg-white border border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/5"
              } ${isAdding ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? "Adding..." : (isAddedToCart ? "Go to Cart" : "Add to Cart")}
            </button>
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg hover:to-primary/70 font-semibold tracking-wider text-sm py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 uppercase">
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
          </div>

          {/* Freebie Bar */}
          <div className="mt-4 bg-[#FDFDFD] p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center gap-6">
            <span className="bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
              Free gift on every purchase
            </span>
            
            {/* Progress Bar Container */}
            <div className="w-full relative px-6 mt-4">
              {/* Background Line */}
              <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-neutral-200 -translate-y-1/2 rounded-full" />
              
              {/* Nodes */}
              <div className="relative flex justify-between">
                {[1000, 2000, 3000].map((amount, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 z-10 w-24">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-primary/30 flex items-center justify-center shadow-sm">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-neutral-700">{idx + 1} Freebie</div>
                      <div className="text-[10px] text-neutral-500">(orders &gt;₹{amount})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-4 py-6 border-b border-neutral-100">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="w-6 h-6 text-neutral-600" strokeWidth={1.5} />
              <span className="text-[11px] text-neutral-600 font-medium">Free delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-6 h-6 text-neutral-600" strokeWidth={1.5} />
              <span className="text-[11px] text-neutral-600 font-medium">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="w-6 h-6 text-neutral-600" strokeWidth={1.5} />
              <span className="text-[11px] text-neutral-600 font-medium">Easy Return</span>
            </div>
          </div>

          {/* Pincode Checker */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-neutral-700">Check Shipping Availability</span>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                className="flex-1 border border-neutral-300 rounded-xl px-4 text-sm outline-none focus:border-primary transition-colors"
              />
              <button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wider text-sm px-8 py-3 rounded-xl transition-colors uppercase">
                Submit
              </button>
            </div>
          </div>

          {/* Offers */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-neutral-800 mb-2">Offers Available</h4>
            <div className="text-sm text-neutral-600">
              No active offers for this product.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
