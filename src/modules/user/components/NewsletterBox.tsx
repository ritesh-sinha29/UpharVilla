"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NewsletterBox = () => {
  return (
    <div className="relative overflow-hidden bg-primary/90 rounded-2xl py-6 px-16 h-[440px] mb-20 flex items-center">
      <div className="relative flex  items-center w-full h-full">
        <div className="absolute z-10 -top-20 -left-18">
          <Image
            src="/f.png"
            alt="UpharVilla Logo"
            width={200}
            height={60}
            className=""
          />
        </div>
        {/* Left Content Section */}
        <div className="space-y-5 flex flex-col items-start justify-center h-full">
          <div className="">
            {/* <Image
              src="/logo2.png"
              alt="UpharVilla Logo"
              width={180}
              height={60}
              className="-mb-6"
            /> */}
            <h1 className="text-4xl font-bold text-amber-200 tracking-tighter my-8">
              upharVilla
            </h1>
            <h2 className="text-3xl font-semibold tracking-tight text-left text-white">
              Where Gifting Begins With Love
            </h2>
            <p className="text-muted font-mono text-lg max-w-lg text-left font-medium">
              Don't miss out on our latest collections, exclusive offers, and
              heartfelt gifting inspiration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md">
            <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl py-6 px-8 font-semibold text-base shadow-xl transition-transform hover:scale-105 active:scale-95">
              Start Gifting
            </Button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="absolute right-40 top-0 h-full flex items-end">
          <div className="relative h-full border-4 rounded-xl ">
            <Image
              src="/footer.jpg"
              alt="Gifting Banner"
              width={500}
              height={440}
              className="h-full w-auto object-cover rounded-xl"
            />
          </div>
        </div>
        <Image
          src="/33.png"
          alt="Accent"
          width={160}
          height={160}
          className="absolute bottom-0 right-0 rounded-xl"
        />
        <Image
          src="/36.png"
          alt="Accent"
          width={200}
          height={200}
          className="absolute -top-10 -right-20 rounded-xl"
        />
      </div>
    </div>
  );
};

export default NewsletterBox;
