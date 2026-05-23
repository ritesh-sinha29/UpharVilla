import React from "react";
import AnnouncementBar from "@/modules/user/components/AnnouncementBar";
import Header from "@/modules/user/components/Header";
import NavBar from "@/modules/user/components/NavBar";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 w-full flex flex-col bg-white shadow-sm">
        <AnnouncementBar />
        <Header />
        <NavBar />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
