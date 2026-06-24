"use client";

import { HeroBannerManager } from "@/modules/admin/components/content-management/HeroBannerManager";
import { OccasionManager } from "@/modules/admin/components/content-management/OccasionManager";

export default function ContentManagement() {
  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-primary/90">
          Content Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Customize your homepage visuals and editorial layouts.
        </p>
      </div>

      {/* Hero Banners Section */}
      <section className="animate-in slide-in-from-bottom-2 duration-700 py-8 border-b">
        <HeroBannerManager />
      </section>

      {/* Shop by Occasion Section */}
      <section className="animate-in slide-in-from-bottom-2 duration-700 py-8">
        <OccasionManager />
      </section>
    </div>
  );
}
