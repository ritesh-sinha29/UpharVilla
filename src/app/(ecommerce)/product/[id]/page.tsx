"use client";

import React, { use } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ProductDetails } from "@/modules/user/product/ProductDetails";
import { SimilarProducts } from "@/modules/user/product/SimilarProducts";
import { CustomerReviews } from "@/modules/user/product/CustomerReviews";
import { YouMayAlsoLike } from "@/modules/user/product/YouMayAlsoLike";
import Header from "@/modules/user/components/Header";
import AnnouncementBar from "@/modules/user/components/AnnouncementBar";
import Footer from "@/modules/user/components/Footer";
import NavBar from "@/modules/user/components/NavBar";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract id from params
  const { id } = use(params);

  // Fetch product from convex
  const product = useQuery(api.products.getById, { id: id as Id<"products"> });

  return (
    <div className="min-h-screen bg-white">
      
      {/* Product Content */}
      {product === undefined ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : product === null ? (
        <div className="flex items-center justify-center min-h-[60vh] text-neutral-500">
          Product not found
        </div>
      ) : (
        <>
          <ProductDetails product={product} />
          <CustomerReviews />
          <SimilarProducts category={product.category} currentProductId={product._id} />
          <YouMayAlsoLike currentProductId={product._id} />
        </>
      )}

      <Footer />
    </div>
  );
}
