"use client";

import React from "react";
import { Search, SearchIcon } from "lucide-react";
import Typewriter from "typewriter-effect";

export const SearchBar = () => {
  return (
    <div className="flex-1 max-w-2xl px-4 mt-2">
      <div className="relative flex items-center w-full h-10 bg-neutral-50 border border-neutral-200 rounded-md overflow-hidden">
        <div className="pl-3 pr-2 text-gray-600">
          <Search className="h-4 w-4" />
        </div>
        <div className="flex-1 text-sm text-gray-600 font-normal">
          <Typewriter
            options={{
              strings: [
                "Search for Personalized Gifts...",
                "Search for Corporate Hampers...",
                "Search for Custom Jewellery...",
                "Search for Birthday Surprises...",
                "Search for Anniversary Gifts...",
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 30,
              wrapperClassName: "opacity-70",
            }}
          />
        </div>
        <div className="pr-1">
          <button className="h-8 px-4 bg-[#ad8de9] text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity">
            Search <SearchIcon className="inline w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
