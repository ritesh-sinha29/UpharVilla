"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Heart, Phone, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserButton } from "./UserButton";
import { Navigation } from "./Navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { LocationSelector } from "./LocationSelector";
import { SearchBar } from "./SearchBar";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

export const Header = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const wishlistCount = useQuery(api.wishlists.count) || 0;
  const cartCount = useQuery(api.cart.count) || 0;

  return (
    <div className="bg-white py-4 px-8 flex items-start justify-between ">
      <div className="flex items-start gap-6">
        <Link href="/">
          <div className="cursor-pointer -mt-15 overflow-hidden">
            <Image src="/logo2.png" alt="logo" width={180} height={180} />
          </div>
        </Link>
        <Separator orientation="vertical" className="h-14!" />
        <LocationSelector />
      </div>
      <SearchBar />

      <div className="flex items-center gap-2 mt-2">
        {session ? (
          <div className="flex items-center gap-4">
            <Button size="icon-lg" variant={"outline"} className="">
              <Phone className="h-6 w-6!" />
            </Button>
            <Link href="/wishlist">
              <Button size="icon-lg" variant={"outline"} className="relative">
                <Heart className="h-6 w-6!" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button size="icon-lg" variant={"outline"} className="relative">
                <ShoppingCart className="h-6 w-6!" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <UserButton />
          </div>

        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
            <Button variant="default" onClick={() => router.push("/auth")}>
              Join Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
