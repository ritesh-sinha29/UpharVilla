"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface SubCategory {
  heading: string;
  links: string[];
}

interface NavItem {
  title: string;
  hasDropdown: boolean;
  align?: "left" | "center" | "right";
  categories?: SubCategory[];
  images?: {
    src: string;
    alt: string;
    label: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: "Customized Gifts",
    hasDropdown: true,
    align: "left",
    categories: [
      {
        heading: "Keepsakes",
        links: [
          "Photo Frames",
          "Custom Mugs",
          "Photo Cushions",
          "Engraved Plaques",
          "LED Lamps",
          "Desktop Gifts",
        ],
      },
      {
        heading: "Art & Decor",
        links: [
          "Resin Art",
          "Custom Paintings",
          "Neon Signs",
          "Name Plates",
          "Shadow Boxes",
          "Canvas Prints",
        ],
      },
      {
        heading: "Accessories",
        links: [
          "Custom Keychains",
          "Personalized Wallets",
          "Custom Pens",
          "Passport Covers",
          "Phone Covers",
          "Bottle Opener",
        ],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80",
        alt: "Customized Keepsakes",
        label: "Personalized Prints",
      },
      {
        src: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&auto=format&fit=crop&q=80",
        alt: "Resin Keepsakes",
        label: "Resin Masterpieces",
      },
    ],
  },
  {
    title: "Corporate Gifts",
    hasDropdown: true,
    align: "left",
    categories: [
      {
        heading: "Office Essentials",
        links: [
          "Welcome Kits",
          "Custom Notebooks",
          "Tech Organizers",
          "Brand Pens",
          "Wireless Chargers",
          "Coffee Mugs",
        ],
      },
      {
        heading: "Branding & Merch",
        links: [
          "Logo Bottles",
          "Custom T-Shirts",
          "Brand Hoodies",
          "Promotional Bags",
          "Brand Caps",
          "Custom Lanyards",
        ],
      },
      {
        heading: "Premium Executive",
        links: [
          "Premium Gift Boxes",
          "Desk Organizers",
          "Smart Gadgets",
          "Luxury Gift Cards",
          "Leather Portfolios",
          "Gift Vouchers",
        ],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1521791136368-1a8b92755358?w=400&auto=format&fit=crop&q=80",
        alt: "Corporate Kits",
        label: "Corporate Welcome Kits",
      },
      {
        src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80",
        alt: "Executive Desk Setup",
        label: "Premium Exec Collection",
      },
    ],
  },
  {
    title: "Trending Gifts",
    hasDropdown: true,
    align: "center",
    categories: [
      {
        heading: "Social Media Hits",
        links: [
          "Instagram Trending",
          "TikTok Favorites",
          "Spotify Plaques",
          "Levitating Lamps",
          "Galaxy Projectors",
          "Moon Lamps",
        ],
      },
      {
        heading: "Aesthetic Vibe",
        links: [
          "Aesthetic Lamps",
          "Dried Flowers",
          "Sunset Projectors",
          "Pastel Planners",
          "Scented Candles",
          "Cozy Blankets",
        ],
      },
      {
        heading: "Anime & Pop Culture",
        links: [
          "Anime Action Figures",
          "Oversized Anime Tees",
          "Manga Box Sets",
          "Pop Culture Posters",
          "Gaming Keyboards",
          "Cosplay Merch",
        ],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80",
        alt: "Spotify Plaque",
        label: "Acrylic Spotify Plaques",
      },
      {
        src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80",
        alt: "Aesthetic lights",
        label: "Aesthetic Ambient Lights",
      },
    ],
  },
  {
    title: "Hampers",
    hasDropdown: true,
    align: "center",
    categories: [
      {
        heading: "Celebration",
        links: [
          "Birthday Hampers",
          "Anniversary Hampers",
          "Congrats Hampers",
          "Housewarming Trays",
          "Chocolate Bouquets",
          "Sweets Boxes",
        ],
      },
      {
        heading: "Bridal & Groom",
        links: [
          "Bridal Hampers",
          "Groom-to-Be Boxes",
          "Bridesmaid Proposals",
          "Wedding Favors",
          "Bride Accessories",
          "Groom Essentials",
        ],
      },
      {
        heading: "Festive Delights",
        links: [
          "Festival Hampers",
          "Gourmet Baskets",
          "Dry Fruit Hampers",
          "Organic Tea Hampers",
          "Spa & Care Baskets",
          "Snack Gift Packs",
        ],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80",
        alt: "Gourmet Hamper",
        label: "Lux Gourmet Baskets",
      },
      {
        src: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&auto=format&fit=crop&q=80",
        alt: "Gift Hamper Set",
        label: "Signature Hampers",
      },
    ],
  },
  {
    title: "Imitation Jewellery",
    hasDropdown: true,
    align: "right",
    categories: [
      {
        heading: "Earrings",
        links: [
          "Jhumkas",
          "Studs & Tops",
          "Hoop Earrings",
          "Danglers",
          "Chandbalis",
          "Ear Cuffs",
        ],
      },
      {
        heading: "Necklaces",
        links: [
          "Pendant Necklaces",
          "Choker Sets",
          "Kundan Necklaces",
          "Minimalist Chains",
          "Oxidized Necklaces",
          "Pearl Strings",
        ],
      },
      {
        heading: "Bridal Pieces",
        links: [
          "Complete Bridal Sets",
          "Bangles & Kadas",
          "Maang Tikka",
          "Anklets",
          "Nose Rings / Nath",
          "Ring Bracelets",
        ],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80",
        alt: "Gold Pendant Necklace",
        label: "Fine Oxidized Silver",
      },
      {
        src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80",
        alt: "Indian Bridal Set",
        label: "Bridal Special Kundan",
      },
    ],
  },
  {
    title: "Shop by Occasion",
    hasDropdown: true,
    align: "right",
    categories: [
      {
        heading: "Life Milestones",
        links: [
          "Birthday",
          "Anniversary",
          "Wedding",
          "Baby Shower",
          "Graduation",
          "Housewarming",
        ],
      },
      {
        heading: "Seasonal Romance",
        links: [
          "Valentine's Day",
          "Mother's Day",
          "Father's Day",
          "Friendship Day",
          "Men's Day",
          "Women's Day",
        ],
      },
      {
        heading: "Festive Occasions",
        links: [
          "Diwali",
          "Christmas",
          "Rakhi Specials",
          "Eid Specials",
          "Karwa Chauth",
          "Holi Hampers",
        ],
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80",
        alt: "Valentine Red Theme",
        label: "Valentine's & Love",
      },
      {
        src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&auto=format&fit=crop&q=80",
        alt: "Anniversary Champagne Gift",
        label: "Milestone Anniversaries",
      },
    ],
  },
  {
    title: "New Arrivals",
    hasDropdown: false,
  },
];

const getAlignClass = (align?: "left" | "center" | "right") => {
  if (align === "left") return "left-0! right-auto!";
  if (align === "right") return "right-0! left-auto!";
  return "left-1/2! -translate-x-1/2!";
};

export const Navigation = () => {
  return (
    <div className="flex justify-center w-full">
      <NavigationMenu viewport={false} className="w-full justify-center">
        <NavigationMenuList className="flex gap-10 items-center justify-center">
          {navItems.map((item) => (
            <NavigationMenuItem
              key={item.title}
              className={item.hasDropdown ? "static!" : ""}
            >
              {item.hasDropdown ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent hover:text-primary text-base font-medium px-4 py-1 transition-colors cursor-pointer data-[state=open]:text-primary">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="bg-white! border border-neutral-200 shadow-2xl rounded-xl p-8 z-50 md:absolute! md:w-[1000px]! top-[calc(100%+14px)]! left-1/2! -translate-x-1/2! grid grid-cols-12 gap-8 animate-in fade-in-0 slide-in-from-top-2 duration-300"
                  >
                    {/* Columns of sublinks */}
                    <div className="col-span-7 grid grid-cols-3 gap-6 border-r-2 border-primary/20 pr-8">
                      {item.categories?.map((cat) => (
                        <div
                          key={cat.heading}
                          className="flex flex-col gap-3 border-r border-neutral-300 pr-4 last:border-r-0 last:pr-0"
                        >
                          <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">
                            {cat.heading}
                          </h4>
                          <div className="flex flex-col gap-2.5">
                            {cat.links.map((link) => (
                              <Link
                                key={link}
                                href="#"
                                className="group/sublink text-sm text-neutral-700 hover:text-black flex items-center justify-between w-full transition-all duration-200"
                              >
                                <span className="group-hover/sublink:underline decoration-neutral-850 decoration-1 underline-offset-4">
                                  {link}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-600 opacity-0 -translate-x-1 group-hover/sublink:opacity-100 group-hover/sublink:translate-x-0 transition-all duration-250" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Image / Banner columns */}
                    <div className="col-span-5 flex gap-4 h-[280px]">
                      {item.images?.map((img, idx) => (
                        <div
                          key={idx}
                          className="flex-1 relative rounded-xl overflow-hidden group/img-card shadow-md h-full"
                        >
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover group-hover/img-card:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4">
                            <span className="text-white font-semibold text-xs uppercase tracking-wider mb-0.5">
                              {img.label}
                            </span>
                            <span className="text-neutral-300 text-[10px] flex items-center gap-1 group-hover/img-card:text-white transition-colors">
                              Shop Now <ChevronRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link
                  href="/new-arrivals"
                  className="hover:text-primary text-base font-medium px-4 py-1 transition-colors cursor-pointer inline-flex items-center justify-center text-neutral-700"
                >
                  {item.title}
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navigation;
