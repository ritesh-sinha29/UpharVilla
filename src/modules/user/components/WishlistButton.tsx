"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: Id<"products">;
  className?: string;
  iconClassName?: string;
}

export const WishlistButton = ({ productId, className, iconClassName }: WishlistButtonProps) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const inWishlist = useQuery(api.wishlists.check, { productId });
  const toggleWishlist = useMutation(api.wishlists.toggle);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to add items to your wishlist");
      router.push("/auth");
      return;
    }

    try {
      setIsLoading(true);
      const result = await toggleWishlist({ productId });
      if (result.added) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  // If query is loading and we don't have cached data, we can optionally show a disabled state.
  // But usually, it's fine to just show the outlined heart until data arrives.

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors duration-300",
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:text-primary",
        inWishlist ? "text-red-500" : "text-foreground/70",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-transform duration-200 active:scale-75",
          inWishlist && "fill-current text-red-500",
          iconClassName
        )}
      />
    </button>
  );
};

export default WishlistButton;
