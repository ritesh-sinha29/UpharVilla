"use client";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { Truck, Headset, RotateCcw } from "lucide-react";

const Features = () => {
  const { data: session } = authClient.useSession();

  if (session) return null;

  const featureList = [
    {
      icon: <Truck strokeWidth={1.5} className="w-8 h-8" />,
      title: "Free Shipping",
      description: "Lorem ipsum dolor sit amet consectetu adipisicing elit sed",
    },
    {
      icon: <Headset strokeWidth={1.5} className="w-8 h-8" />,
      title: "Support 24/7",
      description: "Lorem ipsum dolor sit amet consectetu adipisicing elit sed",
    },
    {
      icon: <RotateCcw strokeWidth={1.5} className="w-8 h-8 " />,
      title: "Money Return",
      description: "Lorem ipsum dolor sit amet consectetu adipisicing elit sed",
    },
  ];

  return (
    <div className="py-14 px-4 max-w-[1440px] mx-auto px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-0">
        {featureList.map((feature, index) => (
          <React.Fragment key={index}>
            <div className="flex-1 flex flex-col items-center text-center px-10 group cursor-default">
              <div className="mb-6 p-4 rounded-full bg-primary border border-neutral-100 text-white! ">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-[220px]">
                {feature.description}
              </p>
            </div>
            {index < featureList.length - 1 && (
              <div className="hidden md:block self-center w-[1.5px] h-32 bg-neutral-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Features;
