"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "@/modules/admin/components/AppSidebar";
import { Dashboardcrumbs } from "@/modules/admin/components/Dashboardcrumbs";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden">
      <TooltipProvider delayDuration={0}>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset className="border-l h-screen flex flex-col">
            <header className="flex justify-between h-14 py-1 flex-none items-center border-b px-4 bg-sidebar/60 backdrop-blur-xl z-50">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 cursor-pointer hover:scale-105 transition-all duration-200" />
                <Dashboardcrumbs />
              </div>

              <div className="">
                {/* User avatar and name imported from file */}
              </div>
            </header>
            <div className="flex-1 min-h-0 overflow-hidden">
              <main className="h-full overflow-auto p-4">{children}</main>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
