"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsletterBox from "./NewsletterBox";

const Footer = () => {
  return (
    <footer className="w-full bg-white pt-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Newsletter Section */}
        <NewsletterBox />

        {/* Footer Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-neutral-100">
          {/* Brand Column */}
          <div className="space-y-6">
            <Image src="/logo2.png" alt="UpharVilla" width={150} height={50} />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Making every occasion special with curated hampers and
              personalized gifts. Your one-stop shop for thoughtful gifting.
            </p>
            {/* <div className="flex items-center gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-600 hover:bg-primary hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-lg">Shop Categories</h3>
            <ul className="space-y-4">
              {[
                "Custom Hampers",
                "Frames & Bouquets",
                "Anniversary Gifts",
                "Corporate Gifting",
                "New Arrivals",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-lg">Customer Care</h3>
            <ul className="space-y-4">
              {[
                "Contact Us",
                "Shipping Policy",
                "Track Order",
                "Return & Refund",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 text-lg">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>
                  123 Gift Lane, Creative Hub,
                  <br />
                  Mumbai, MH 400001
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>hello@upharvilla.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
          <p>© 2026 UpharVilla. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
