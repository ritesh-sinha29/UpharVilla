"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ProductCard from "@/modules/user/components/ProductCard";
import Header from "@/modules/user/components/Header";
import NavBar from "@/modules/user/components/NavBar";
import Footer from "@/modules/user/components/Footer";
import { HeartCrack, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";

export default function WishlistPage() {
  const { data: session, isPending } = authClient.useSession();
  const wishlistProducts = useQuery(api.wishlists.getUserWishlist);

  if (isPending || wishlistProducts === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <HeartCrack className="w-24 h-24 text-muted-foreground/30" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Sign In to View Wishlist</h1>
            <p className="text-muted-foreground max-w-md mx-auto font-mono text-lg font-medium tracking-wide">
              You need to be logged in to save and view your favorite products.
            </p>
          </div>
          <Link href="/auth">
            <Button size="lg" className="rounded-full px-8 mt-4">Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <section className="flex-1 py-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block relative"
            >
              <h2 className="text-3xl font-semibold underline underline-offset-8">
                My Wishlist
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground max-w-2xl font-mono mx-auto text-lg font-medium tracking-wide"
            >
              {wishlistProducts.length > 0 
                ? `You have ${wishlistProducts.length} ${wishlistProducts.length === 1 ? "item" : "items"} saved in your wishlist.`
                : "Explore our collections and save your favorite pieces here."}
            </motion.p>
          </div>

          {wishlistProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/30 rounded-3xl border border-dashed border-border/50 max-w-3xl mx-auto"
            >
              <HeartCrack className="w-24 h-24 text-muted-foreground/30" />
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Your Wishlist is Empty</h2>
                <p className="text-muted-foreground font-mono">
                  Looks like you haven't added anything to your wishlist yet.
                </p>
              </div>
              <Link href="/">
                <Button size="lg" className="rounded-full px-8 mt-4">Continue Shopping</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product?._id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {product && <ProductCard product={product} />}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
