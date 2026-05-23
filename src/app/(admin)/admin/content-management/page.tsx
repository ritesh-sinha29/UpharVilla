"use client";

import React from "react";
import { HeroBannerManager } from "@/modules/admin/components/content-management/HeroBannerManager";
import { Separator } from "@/components/ui/separator";

export default function ContentManagement() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary/90">
          Content Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your homepage visuals and editorial layouts.
        </p>
      </div>

      {/* Hero Banners Section */}
      <section className="animate-in slide-in-from-bottom-2 duration-700">
        <HeroBannerManager />
      </section>
    </div>
  );
}
