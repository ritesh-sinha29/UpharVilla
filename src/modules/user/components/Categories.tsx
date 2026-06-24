"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Personalised Gifts",
    image: "/category-personalised.webp",
  },
  {
    name: "Anniversary",
    image: "/category-anniversary.webp",
  },
  {
    name: "Birthday",
    image: "/category-birthday.webp",
  },
  {
    name: "Corporate Gifts",
    image: "/category-corporate.webp",
  },
  {
    name: "Custom Hampers",
    image: "/category-custom-hampers.webp",
  },
  {
    name: "Trending Gifts",
    image: "/category-trending.webp",
  },
];

const categoryLinks: Record<string, string> = {
  "Personalised Gifts": "/products?tag=Customized Photo Gifts",
  Anniversary: "/products?tag=Anniversary",
  Birthday: "/products?tag=Birthday",
  "Corporate Gifts": "/products?tag=Employee Welcome Kits",
  "Custom Hampers": "/products?tag=Customized Hampers",
  "Trending Gifts": "/products?tag=Viral & Bestselling Gifts",
};

export const Categories = () => {
  return (
    <section className="md:py-6 lg:py-8 px-5 sm:px-6 md:px-8 lg:px-12 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center mb-3 md:mb-6">
          <h2 className="text-[15px] sm:text-2xl md:text-3xl lg:text-4xl font-bold md:font-semibold tracking-tight mb-2 md:mb-4 text-center">
            Shop by Category
          </h2>
          <div className="h-1 md:h-1.5 w-16 md:w-24 bg-primary rounded-full" />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={categoryLinks[category.name] || "/products"}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative mb-3 md:mb-6">
                  {/* Randomish shaped container for image */}
                  <motion.div
                    className="relative aspect-[1/1.2] overflow-hidden bg-primary/10 border border-primary/30 shadow-sm transition-all duration-500 rounded-xl group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:border-primary/30 group-hover:bg-primary/[0.08]"
                    style={{
                      borderRadius:
                        index % 2 === 0
                          ? "12px 40px 12px 40px"
                          : "40px 12px 40px 12px",
                    }}
                    whileHover={{
                      borderRadius:
                        index % 2 === 0
                          ? "40px 12px 40px 12px"
                          : "12px 40px 12px 40px",
                      scale: 1.05,
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Subtle purple tint on hover */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>

                  {/* Background decorative shape */}
                  <div className="absolute -inset-2 bg-[#c88ee8]/5 rounded-[2rem] -z-10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
                </div>

                <div className="text-center">
                  <h3 className="text-xs md:text-base lg:text-lg font-semibold text-black transition-colors duration-300 group-hover:text-[#c88ee8]">
                    {category.name}
                  </h3>
                  <motion.div className="h-0.5 w-0 bg-[#c88ee8] mx-auto mt-1 transition-all duration-300 group-hover:w-12" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
