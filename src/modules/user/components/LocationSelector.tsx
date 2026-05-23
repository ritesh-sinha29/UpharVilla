"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export const LocationSelector = () => {
  return (
    <div className="flex items-start mt-1 gap-3 px-2 py-1 cursor-pointer">
      <div className="relative h-6 w-8 overflow-hidden rounded-sm">
        <Image src="/india.png" alt="India" fill className="object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold whitespace-nowrap text-gray-800">
          Where to deliver?
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-red-500 whitespace-nowrap font-medium">
            Location missing
          </span>
          <ChevronDown className="h-3 w-3 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
