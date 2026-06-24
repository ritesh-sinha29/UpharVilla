import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { incrementCounter } from "./counterUtils";

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCTION SEED — Comprehensive fake data for client demo / testing
// ════════════════════════════════════════════════════════════════════════════════
//
// Run in order:
//   1. npx convex run seedProduction:seedProducts '{"userId":"YOUR_USER_ID"}'
//   2. npx convex run seedProduction:seedHeroBanners
//   3. npx convex run seedProduction:seedOccasionLinks
//   4. npx convex run seedProduction:seedNavbarOccasions
//   5. npx convex run seedProduction:seedCoupons '{"createdBy":"YOUR_USER_ID"}'
//   6. npx convex run seedProduction:seedOrders '{"userId":"YOUR_USER_ID"}'
//   7. npx convex run seedProduction:seedReviews '{"userId":"YOUR_USER_ID","userName":"Ritesh Sinha"}'
//   8. npx convex run seedProduction:seedEnquiries
//
// To remove ALL seeded data:
//   npx convex run seedProduction:clearAllSeededData

// ─── Working Unsplash image URLs (verified) ──────────────────────────────────

const IMG = {
  // Customized Gifts
  ledLamp: "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600",
  mug: "https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=600",
  cushion: "https://images.pexels.com/photos/4210337/pexels-photo-4210337.jpeg?auto=compress&cs=tinysrgb&w=600",
  keychain: "https://images.pexels.com/photos/10293595/pexels-photo-10293595.jpeg?auto=compress&cs=tinysrgb&w=600",
  tshirt: "https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=600",

  // Corporate Gifts
  diary: "https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=600",
  pen: "https://images.pexels.com/photos/5088021/pexels-photo-5088021.jpeg?auto=compress&cs=tinysrgb&w=600",
  laptop_bag: "https://images.pexels.com/photos/2422476/pexels-photo-2422476.jpeg?auto=compress&cs=tinysrgb&w=600",
  desk_organizer: "https://images.pexels.com/photos/6476260/pexels-photo-6476260.jpeg?auto=compress&cs=tinysrgb&w=600",
  award: "https://images.pexels.com/photos/3184425/pexels-photo-3184425.jpeg?auto=compress&cs=tinysrgb&w=600",

  // Hampers
  sweet_hamper: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=600",
  chocolate_box: "https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=600",
  spa_basket: "https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=600",
  dryfruits: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=600",
  tea_hamper: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600",

  // Frames & Bouquet
  photo_frame: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=600",
  flower_bouquet: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=600",
  rose_bouquet: "https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=600",
  collage_frame: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600",
  wall_art: "https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600",

  // Shop by Occasion
  rakhi: "https://images.pexels.com/photos/6044198/pexels-photo-6044198.jpeg?auto=compress&cs=tinysrgb&w=600",
  wedding_card: "https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=600",
  diwali: "https://images.pexels.com/photos/5713103/pexels-photo-5713103.jpeg?auto=compress&cs=tinysrgb&w=600",
  housewarming: "https://images.pexels.com/photos/3935333/pexels-photo-3935333.jpeg?auto=compress&cs=tinysrgb&w=600",
  anniversary: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=600",

  // New Arrivals
  perfume: "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600",
  watch: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600",
  candle: "https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=600",
  jewellery_box: "https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600",
  wallet: "https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=600",

  // Hero Banners
  hero1: "https://images.pexels.com/photos/1050244/pexels-photo-1050244.jpeg?auto=compress&cs=tinysrgb&w=1280",
  hero2: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=1280",
  hero3: "https://images.pexels.com/photos/5713103/pexels-photo-5713103.jpeg?auto=compress&cs=tinysrgb&w=1280",
};

// ─── PRODUCTS (30 across all 6 categories) ───────────────────────────────────

const PRODUCTS = [
  // ── Customized Gifts (5) ──
  { name: "Personalised LED Name Lamp", slug: "personalised-led-name-lamp", description: "A stunning acrylic LED lamp with custom name engraving. Choose from multiple color options. Perfect bedside keepsake.", price: 899, discount: 18, thumbnail: IMG.ledLamp, category: "customized-gifts" as const, tags: ["personalized", "lamp", "led", "birthday", "anniversary", "housewarming"], subCategory: "LED Gifts", recipients: ["friend", "partner"] },
  { name: "Custom Name Ceramic Mug", slug: "custom-name-ceramic-mug", description: "Premium ceramic mug with laser-printed name and illustration. Microwave and dishwasher safe.", price: 449, discount: 10, thumbnail: IMG.mug, category: "customized-gifts" as const, tags: ["mug", "personalized", "ceramic", "birthday", "fathers-day", "mothers-day"], subCategory: "Mugs", recipients: ["friend", "colleague"] },
  { name: "Photo Printed Cushion Cover", slug: "photo-printed-cushion-cover", description: "Velvet cushion cover with high-quality photo print. 16x16 inches with hidden zipper.", price: 599, discount: 12, thumbnail: IMG.cushion, category: "customized-gifts" as const, tags: ["cushion", "photo", "personalized", "home-decor", "anniversary", "housewarming", "mothers-day"], subCategory: "Cushions", recipients: ["parents", "partner"] },
  { name: "Engraved Wooden Keychain", slug: "engraved-wooden-keychain", description: "Handcrafted wooden keychain with custom text engraving. Made from premium teak wood.", price: 249, discount: 5, thumbnail: IMG.keychain, category: "customized-gifts" as const, tags: ["keychain", "wooden", "engraved", "personalized", "birthday", "rakhi", "fathers-day"], subCategory: "Keychains", recipients: ["friend", "colleague"] },
  { name: "Custom Photo T-Shirt", slug: "custom-photo-tshirt", description: "100% cotton round neck t-shirt with full-color photo printing. Available in S to XXL.", price: 699, discount: 15, thumbnail: IMG.tshirt, category: "customized-gifts" as const, tags: ["tshirt", "photo", "custom", "wearable", "birthday", "rakhi"], subCategory: "Wearables", recipients: ["friend", "sibling"] },

  // ── Corporate Gifts (5) ──
  { name: "Premium Leather Diary Set", slug: "premium-leather-diary-set", description: "Executive A5 leather diary with pen holder. Embossed company logo option available.", price: 1299, discount: 20, thumbnail: IMG.diary, category: "corporate-gifts" as const, tags: ["diary", "leather", "corporate", "professional", "fathers-day", "housewarming"], subCategory: "Stationery", recipients: ["colleague", "boss"] },
  { name: "Luxury Pen Gift Box", slug: "luxury-pen-gift-box", description: "Elegant ballpoint pen in a velvet-lined gift box. Gold-plated clip and smooth ink flow.", price: 799, discount: 10, thumbnail: IMG.pen, category: "corporate-gifts" as const, tags: ["pen", "luxury", "corporate", "gift-box", "fathers-day", "birthday"], subCategory: "Stationery", recipients: ["colleague", "boss"] },
  { name: "Executive Laptop Bag", slug: "executive-laptop-bag", description: "Water-resistant premium leather laptop bag. Fits 15.6 inch laptops with padded compartment.", price: 2499, discount: 18, thumbnail: IMG.laptop_bag, category: "corporate-gifts" as const, tags: ["bag", "laptop", "corporate", "professional", "fathers-day"], subCategory: "Bags", recipients: ["colleague", "boss"] },
  { name: "Wooden Desk Organizer", slug: "wooden-desk-organizer", description: "Handcrafted teak wood desk organizer with phone stand, pen holder, and card slot.", price: 999, discount: 12, thumbnail: IMG.desk_organizer, category: "corporate-gifts" as const, tags: ["desk", "organizer", "wooden", "office", "housewarming", "fathers-day"], subCategory: "Office Accessories", recipients: ["colleague"] },
  { name: "Crystal Achievement Trophy", slug: "crystal-achievement-trophy", description: "Laser-engraved crystal trophy with custom text. Perfect for employee recognition and awards.", price: 1499, discount: 15, thumbnail: IMG.award, category: "corporate-gifts" as const, tags: ["trophy", "crystal", "award", "recognition", "birthday"], subCategory: "Awards", recipients: ["colleague", "boss"] },

  // ── Hampers (5) ──
  { name: "Royal Sweet & Dry Fruit Hamper", slug: "royal-sweet-dry-fruit-hamper", description: "Curated wooden tray with premium assorted sweets, dry fruits, and chocolate truffles.", price: 1899, discount: 22, thumbnail: IMG.sweet_hamper, category: "hampers" as const, tags: ["sweets", "dry-fruits", "hamper", "festival", "diwali", "housewarming", "rakhi"], subCategory: "Sweet Hampers", recipients: ["parents", "family"] },
  { name: "Belgian Chocolate Gift Box", slug: "belgian-chocolate-gift-box", description: "Handmade Belgian chocolates in assorted flavors — dark, milk, and white. 24-piece box.", price: 1299, discount: 15, thumbnail: IMG.chocolate_box, category: "hampers" as const, tags: ["chocolate", "belgian", "gift-box", "premium", "valentines-day", "birthday", "mothers-day"], subCategory: "Chocolate Hampers", recipients: ["partner", "friend"] },
  { name: "Luxury Spa & Wellness Basket", slug: "luxury-spa-wellness-basket", description: "Natural bath products, essential oils, scented candles, and a plush robe — complete self-care set.", price: 2499, discount: 20, thumbnail: IMG.spa_basket, category: "hampers" as const, tags: ["spa", "wellness", "candle", "self-care", "mothers-day", "valentines-day", "anniversary"], subCategory: "Spa Hampers", recipients: ["partner", "mother"] },
  { name: "Premium Dry Fruits Gift Box", slug: "premium-dry-fruits-gift-box", description: "Assorted premium dry fruits in a handcrafted brass gift box — almonds, cashews, pistachios, and raisins.", price: 999, discount: 12, thumbnail: IMG.dryfruits, category: "hampers" as const, tags: ["dry-fruits", "premium", "healthy", "festival", "diwali", "rakhi", "housewarming"], subCategory: "Dry Fruit Hampers", recipients: ["parents", "family"] },
  { name: "Artisan Tea & Snacks Hamper", slug: "artisan-tea-snacks-hamper", description: "Curated collection of 5 single-estate teas with biscotti and organic honey.", price: 1599, discount: 18, thumbnail: IMG.tea_hamper, category: "hampers" as const, tags: ["tea", "snacks", "artisan", "gourmet", "mothers-day", "housewarming"], subCategory: "Tea Hampers", recipients: ["parents", "colleague"] },

  // ── Frames & Bouquet (5) ──
  { name: "Wooden Engraved Photo Frame", slug: "wooden-engraved-photo-frame", description: "Premium wooden frame with laser-engraved border pattern. Fits 8x10 inch photos.", price: 699, discount: 10, thumbnail: IMG.photo_frame, category: "frames-bouquet" as const, tags: ["frame", "wooden", "engraved", "photo", "anniversary", "birthday", "housewarming"], subCategory: "Photo Frames", recipients: ["parents", "partner"] },
  { name: "Premium Rose Bouquet", slug: "premium-rose-bouquet", description: "25 long-stem red roses wrapped in luxury craft paper with a satin ribbon. Same-day delivery available.", price: 1199, discount: 15, thumbnail: IMG.rose_bouquet, category: "frames-bouquet" as const, tags: ["roses", "bouquet", "flowers", "romantic", "valentines-day", "anniversary", "birthday"], subCategory: "Bouquets", recipients: ["partner"] },
  { name: "Mixed Flower Arrangement", slug: "mixed-flower-arrangement", description: "Vibrant seasonal flower arrangement with lilies, carnations, and chrysanthemums in a glass vase.", price: 899, discount: 12, thumbnail: IMG.flower_bouquet, category: "frames-bouquet" as const, tags: ["flowers", "arrangement", "vase", "birthday", "mothers-day", "housewarming"], subCategory: "Bouquets", recipients: ["friend", "mother"] },
  { name: "Multi-Photo Collage Frame", slug: "multi-photo-collage-frame", description: "8-slot collage photo frame in matte black finish. Wall mountable with hardware included.", price: 1099, discount: 18, thumbnail: IMG.collage_frame, category: "frames-bouquet" as const, tags: ["collage", "frame", "multi-photo", "wall-art", "anniversary", "wedding", "housewarming"], subCategory: "Photo Frames", recipients: ["parents", "family"] },
  { name: "Personalised Canvas Wall Art", slug: "personalised-canvas-wall-art", description: "Gallery-quality canvas print with custom photo and text. Stretched on wooden frame, ready to hang.", price: 1499, discount: 20, thumbnail: IMG.wall_art, category: "frames-bouquet" as const, tags: ["canvas", "wall-art", "personalized", "home-decor", "anniversary", "housewarming", "wedding"], subCategory: "Wall Art", recipients: ["partner", "parents"] },

  // ── Shop by Occasion (5) ──
  { name: "Rakhi Gift Hamper for Brother", slug: "rakhi-gift-hamper-brother", description: "Beautiful rakhi set with premium dry fruits, chocolates, and a personalized card.", price: 1099, discount: 15, thumbnail: IMG.rakhi, category: "shop-by-occasion" as const, tags: ["rakhi", "brother", "festival", "hamper", "birthday"], subCategory: "Rakhi Gifts", recipients: ["sibling"] },
  { name: "Wedding Welcome Gift Box", slug: "wedding-welcome-gift-box", description: "Elegant wedding favor box with scented candle, treats, and a thank-you card.", price: 799, discount: 10, thumbnail: IMG.wedding_card, category: "shop-by-occasion" as const, tags: ["wedding", "favor", "welcome", "gift-box", "anniversary"], subCategory: "Wedding Gifts", recipients: ["friend", "family"] },
  { name: "Diwali Premium Gift Set", slug: "diwali-premium-gift-set", description: "Festive Diwali hamper with designer diyas, sweets, dry fruits, and a greeting card.", price: 1499, discount: 20, thumbnail: IMG.diwali, category: "shop-by-occasion" as const, tags: ["diwali", "festival", "sweets", "diyas", "housewarming"], subCategory: "Festival Gifts", recipients: ["family", "colleague"] },
  { name: "Housewarming Décor Hamper", slug: "housewarming-decor-hamper", description: "A curated gift set with aromatic candles, a decorative vase, and a handwoven coaster set.", price: 1299, discount: 18, thumbnail: IMG.housewarming, category: "shop-by-occasion" as const, tags: ["housewarming", "decor", "candle", "vase", "wedding"], subCategory: "Housewarming Gifts", recipients: ["friend", "family"] },
  { name: "Anniversary Celebration Box", slug: "anniversary-celebration-box", description: "Romantic anniversary gift box with premium chocolates, wine glasses, and personalized photo frame.", price: 1999, discount: 22, thumbnail: IMG.anniversary, category: "shop-by-occasion" as const, tags: ["anniversary", "romantic", "celebration", "couple", "valentines-day", "wedding"], subCategory: "Anniversary Gifts", recipients: ["partner"] },

  // ── New Arrivals (5) ──
  { name: "Luxury Perfume Gift Set", slug: "luxury-perfume-gift-set", description: "Set of 3 premium eau de parfum miniatures — Woody, Floral, and Oriental notes. 30ml each.", price: 1999, discount: 25, thumbnail: IMG.perfume, category: "new-arrivals" as const, tags: ["perfume", "luxury", "fragrance", "unisex", "valentines-day", "anniversary", "birthday"], subCategory: "Fragrances", recipients: ["partner", "friend"], markNewArrival: true },
  { name: "Classic Leather Watch", slug: "classic-leather-watch", description: "Minimalist analog watch with genuine leather strap and Japanese quartz movement.", price: 2499, discount: 20, thumbnail: IMG.watch, category: "new-arrivals" as const, tags: ["watch", "leather", "classic", "accessory", "fathers-day", "anniversary", "birthday"], subCategory: "Watches", recipients: ["partner", "father"], markNewArrival: true },
  { name: "Artisan Soy Candle Set", slug: "artisan-soy-candle-set", description: "Set of 4 hand-poured soy wax candles — Lavender, Vanilla, Rose, and Sandalwood. 40hr burn each.", price: 899, discount: 12, thumbnail: IMG.candle, category: "new-arrivals" as const, tags: ["candle", "soy", "artisan", "home-decor", "mothers-day", "housewarming", "diwali"], subCategory: "Home Décor", recipients: ["friend", "mother"], markNewArrival: true },
  { name: "Velvet Jewellery Organizer Box", slug: "velvet-jewellery-organizer-box", description: "Premium velvet-lined jewellery box with mirror, ring rolls, and compartments for earrings and necklaces.", price: 1199, discount: 15, thumbnail: IMG.jewellery_box, category: "new-arrivals" as const, tags: ["jewellery", "organizer", "velvet", "gift", "valentines-day", "mothers-day", "anniversary"], subCategory: "Organizers", recipients: ["partner", "mother"], markNewArrival: true },
  { name: "Premium Leather Bifold Wallet", slug: "premium-leather-bifold-wallet", description: "Handcrafted genuine leather wallet with RFID blocking. Multiple card slots and coin pocket.", price: 1299, discount: 18, thumbnail: IMG.wallet, category: "new-arrivals" as const, tags: ["wallet", "leather", "premium", "accessory", "fathers-day", "rakhi", "birthday"], subCategory: "Wallets", recipients: ["father", "friend"], markNewArrival: true },
];

// ─── 1. Seed Products ────────────────────────────────────────────────────────

export const seedProducts = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const inserted: string[] = [];

    for (const p of PRODUCTS) {
      // Skip duplicates
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", p.slug))
        .first();
      if (existing) continue;

      const id = await ctx.db.insert("products", {
        name: p.name,
        slug: p.slug,
        createdByUserId: args.userId,
        description: p.description,
        price: p.price,
        discount: p.discount,
        thumbnail: p.thumbnail,
        images: [p.thumbnail],
        category: p.category,
        subCategory: p.subCategory,
        tags: p.tags,
        recipients: p.recipients,
        stock: Math.floor(Math.random() * 80) + 20,
        launchedAt: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
        markNewArrival: (p as any).markNewArrival ?? false,
        markTrending: Math.random() > 0.7,
        markMostPurchased: Math.random() > 0.8,
        markMostSold: false,
        isActive: true,
      });

      await incrementCounter(ctx, "products");
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── 2. Seed Hero Banners ────────────────────────────────────────────────────

export const seedHeroBanners = mutation({
  handler: async (ctx) => {
    const banners = [
      { imageLink: IMG.hero1, altText: "Thoughtful gifts for every occasion", visitLink: "/products" },
      { imageLink: IMG.hero2, altText: "Premium hampers & gift boxes", visitLink: "/products?category=hampers" },
      { imageLink: IMG.hero3, altText: "New arrivals — explore now", visitLink: "/products?category=new-arrivals" },
    ];

    const inserted: string[] = [];
    for (const b of banners) {
      const id = await ctx.db.insert("heroBanners", {
        imageLink: b.imageLink,
        altText: b.altText,
        visitLink: b.visitLink,
        createdAt: Date.now(),
      });
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── 3. Seed Occasion Links ─────────────────────────────────────────────────

export const seedOccasionLinks = mutation({
  handler: async (ctx) => {
    const occasions = [
      { label: "Birthday", slug: "birthday", icon: "🎂", sortOrder: 1 },
      { label: "Anniversary", slug: "anniversary", icon: "💍", sortOrder: 2 },
      { label: "Wedding", slug: "wedding", icon: "💒", sortOrder: 3 },
      { label: "Rakhi", slug: "rakhi", icon: "🪢", sortOrder: 4 },
      { label: "Diwali", slug: "diwali", icon: "🪔", sortOrder: 5 },
      { label: "Housewarming", slug: "housewarming", icon: "🏠", sortOrder: 6 },
      { label: "Father's Day", slug: "fathers-day", icon: "👔", sortOrder: 7 },
      { label: "Mother's Day", slug: "mothers-day", icon: "👩", sortOrder: 8 },
      { label: "Valentine's Day", slug: "valentines-day", icon: "❤️", sortOrder: 9 },
    ];

    const inserted: string[] = [];
    for (const o of occasions) {
      const id = await ctx.db.insert("occasionLinks", {
        label: o.label,
        slug: o.slug,
        icon: o.icon,
        sortOrder: o.sortOrder,
        createdAt: Date.now(),
      });
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── 4. Seed Navbar Occasions ────────────────────────────────────────────────

export const seedNavbarOccasions = mutation({
  handler: async (ctx) => {
    const navOccasions = [
      { heading: "Milestones", label: "Birthday", sortOrder: 1 },
      { heading: "Milestones", label: "Anniversary", sortOrder: 2 },
      { heading: "Milestones", label: "Graduation", sortOrder: 3 },
      { heading: "Love & Family", label: "Valentine's Day", sortOrder: 4 },
      { heading: "Love & Family", label: "Mother's Day", sortOrder: 5 },
      { heading: "Love & Family", label: "Father's Day", sortOrder: 6 },
      { heading: "Love & Family", label: "Rakhi", sortOrder: 7 },
      { heading: "Festive & Events", label: "Diwali", sortOrder: 8 },
      { heading: "Festive & Events", label: "Christmas", sortOrder: 9 },
      { heading: "Festive & Events", label: "Housewarming", sortOrder: 10 },
      { heading: "Festive & Events", label: "Wedding", sortOrder: 11 },
    ];

    const inserted: string[] = [];
    for (const o of navOccasions) {
      const id = await ctx.db.insert("navbarOccasions", {
        heading: o.heading,
        label: o.label,
        sortOrder: o.sortOrder,
        createdAt: Date.now(),
      });
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── 5. Seed Coupons ─────────────────────────────────────────────────────────

export const seedCoupons = mutation({
  args: { createdBy: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const coupons = [
      {
        code: "WELCOME10",
        description: "10% off on your first order",
        discountType: "percentage" as const,
        discountValue: 10,
        minOrderAmount: 499,
        maxDiscount: 200,
        applicableTo: "all" as const,
        totalUsageLimit: 500,
        perUserLimit: 1,
        startsAt: now,
        expiresAt: now + 90 * 24 * 60 * 60 * 1000,
      },
      {
        code: "FLAT100",
        description: "₹100 off on orders above ₹999",
        discountType: "flat" as const,
        discountValue: 100,
        minOrderAmount: 999,
        applicableTo: "all" as const,
        totalUsageLimit: 1000,
        perUserLimit: 3,
        startsAt: now,
        expiresAt: now + 60 * 24 * 60 * 60 * 1000,
      },
      {
        code: "FREESHIP",
        description: "Free shipping on all orders",
        discountType: "free_shipping" as const,
        discountValue: 0,
        applicableTo: "all" as const,
        perUserLimit: 5,
        startsAt: now,
        expiresAt: now + 30 * 24 * 60 * 60 * 1000,
      },
      {
        code: "HAMPER20",
        description: "20% off on all hampers (max ₹500 off)",
        discountType: "percentage" as const,
        discountValue: 20,
        maxDiscount: 500,
        applicableTo: "category" as const,
        applicableCategory: "hampers",
        perUserLimit: 2,
        startsAt: now,
        expiresAt: now + 45 * 24 * 60 * 60 * 1000,
      },
    ];

    const inserted: string[] = [];
    for (const c of coupons) {
      // Skip if code already exists
      const existing = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", c.code))
        .first();
      if (existing) continue;

      const id = await ctx.db.insert("coupons", {
        code: c.code,
        description: c.description,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount,
        applicableTo: c.applicableTo,
        applicableCategory: c.applicableCategory,
        perUserLimit: c.perUserLimit,
        totalUsageLimit: c.totalUsageLimit,
        currentUsageCount: 0,
        startsAt: c.startsAt,
        expiresAt: c.expiresAt,
        isActive: true,
        createdBy: args.createdBy,
        createdAt: now,
      });
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── 6. Seed Orders (8 with various statuses) ───────────────────────────────

export const seedOrders = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get active products
    const products = await ctx.db
      .query("products")
      .withIndex("by_active_launched_at", (q) => q.eq("isActive", true))
      .take(10);

    if (products.length < 3) {
      throw new Error("Need at least 3 products. Seed products first!");
    }

    // Ensure address exists
    let address = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!address) {
      const addressId = await ctx.db.insert("addresses", {
        userId: args.userId,
        fullName: "Ritesh Sinha",
        phone: "9876543210",
        pincode: "396445",
        locality: "Mahal Road",
        address: "42, Shreeji Complex, Station Road",
        city: "Navsari",
        state: "Gujarat",
        landmark: "Near Dutt Mandir",
        addressType: "home",
        isDefault: true,
        createdAt: Date.now(),
      });
      address = await ctx.db.get(addressId);
    }

    const addressId = address!._id;
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    const orderConfigs = [
      { status: "placed" as const, payment: "paid" as const, daysAgo: 0 },
      { status: "placed" as const, payment: "pending" as const, daysAgo: 1 },
      { status: "shipped" as const, payment: "paid" as const, daysAgo: 3 },
      { status: "shipped" as const, payment: "paid" as const, daysAgo: 5 },
      { status: "out_for_delivery" as const, payment: "paid" as const, daysAgo: 7 },
      { status: "delivered" as const, payment: "paid" as const, daysAgo: 10 },
      { status: "delivered" as const, payment: "paid" as const, daysAgo: 15 },
      { status: "cancelled" as const, payment: "failed" as const, daysAgo: 12 },
    ];

    const insertedIds: string[] = [];

    for (let i = 0; i < orderConfigs.length; i++) {
      const cfg = orderConfigs[i];
      const createdAt = now - cfg.daysAgo * DAY;

      // Pick 1-3 products
      const count = (i % 3) + 1;
      const orderProducts = [];
      for (let j = 0; j < count; j++) {
        orderProducts.push(products[(i + j) % products.length]);
      }

      const items = orderProducts.map((p) => ({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: (i % 2) + 1,
        thumbnail: p.thumbnail,
      }));

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 9;

      const orderId = await ctx.db.insert("orders", {
        userId: args.userId,
        addressId,
        items,
        totalAmount,
        razorpayOrderId: `order_demo_${Date.now().toString(36)}_${i}`,
        razorpayPaymentId: cfg.payment === "paid" ? `pay_demo_${Date.now().toString(36)}_${i}` : undefined,
        paymentStatus: cfg.payment,
        orderStatus: cfg.status,
        shippedAt: ["shipped", "out_for_delivery", "delivered"].includes(cfg.status) ? createdAt + 1 * DAY : undefined,
        outForDeliveryAt: ["out_for_delivery", "delivered"].includes(cfg.status) ? createdAt + 2 * DAY : undefined,
        deliveredAt: cfg.status === "delivered" ? createdAt + 3 * DAY : undefined,
        createdAt,
      });

      await incrementCounter(ctx, "orders");
      insertedIds.push(orderId);
    }

    return { success: true, count: insertedIds.length };
  },
});

// ─── 7. Seed Reviews ─────────────────────────────────────────────────────────

export const seedReviews = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get delivered orders
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_status_created", (q) => q.eq("orderStatus", "delivered"))
      .collect();

    if (orders.length === 0) {
      throw new Error("No delivered orders found. Seed orders first!");
    }

    const reviewTexts = [
      "Absolutely loved this gift! The quality exceeded my expectations. Would definitely order again.",
      "Beautiful packaging and fast delivery. My friend was so happy with it! Highly recommend.",
      "Great value for money. The personalization turned out really well. Five stars!",
      "Perfect gift for my parents' anniversary. They were thrilled. Excellent customer service too.",
      "The product looks exactly as shown in the photos. Premium feel and finish.",
      "Ordered as a corporate gift — the team loved it! Will be ordering in bulk next time.",
      "Super impressed with the attention to detail. The engraving was flawless.",
      "Quick delivery even during the festive season. Great work, upharVilla!",
    ];

    const fakeReviewers = [
      { name: "Priya Sharma", initials: "PS" },
      { name: "Amit Patel", initials: "AP" },
      { name: "Sneha Gupta", initials: "SG" },
      { name: "Rahul Verma", initials: "RV" },
      { name: "Ananya Reddy", initials: "AR" },
      { name: "Vikram Singh", initials: "VS" },
      { name: "Neha Joshi", initials: "NJ" },
      { name: "Karan Mehta", initials: "KM" },
    ];

    const inserted: string[] = [];

    for (let i = 0; i < Math.min(orders.length, reviewTexts.length); i++) {
      const order = orders[i];
      const reviewer = fakeReviewers[i % fakeReviewers.length];
      const item = order.items[0];

      // Skip if review already exists for this order
      const existing = await ctx.db
        .query("reviews")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .first();
      if (existing) continue;

      const id = await ctx.db.insert("reviews", {
        userId: args.userId,
        userName: reviewer.name,
        userInitials: reviewer.initials,
        productId: item.productId,
        orderId: order._id,
        itemId: `${order._id}_${item.productId}`,
        rating: 4 + (i % 2), // 4 or 5 stars
        reviewText: reviewTexts[i],
        createdAt: Date.now() - (i * 2 * 24 * 60 * 60 * 1000),
      });
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── 8. Seed Enquiries ───────────────────────────────────────────────────────

export const seedEnquiries = mutation({
  handler: async (ctx) => {
    const enquiries = [
      { name: "Rohan Desai", email: "rohan@example.com", phone: "9876543210", message: "Hi, do you offer bulk corporate gifting for 200+ employees? What are the customization options?" },
      { name: "Meera Nair", email: "meera@example.com", phone: "9123456789", message: "I need a custom hamper for my parents' 50th wedding anniversary. Can you create something special?" },
      { name: "Sanjay Kumar", email: "sanjay@example.com", message: "What's the delivery timeline for custom photo frames in Delhi NCR? Need it within 3 days." },
      { name: "Pooja Agarwal", email: "pooja@example.com", phone: "9988776655", message: "Can I get rakhi gift sets with international shipping to the USA? Please share pricing." },
      { name: "Arjun Reddy", email: "arjun@example.com", message: "Do you have franchise or reseller options? I run a gift shop in Hyderabad and would love to collaborate." },
    ];

    const inserted: string[] = [];
    for (let i = 0; i < enquiries.length; i++) {
      const e = enquiries[i];
      const id = await ctx.db.insert("enquiries", {
        name: e.name,
        email: e.email,
        phone: e.phone,
        message: e.message,
        createdAt: Date.now() - (i * 3 * 24 * 60 * 60 * 1000),
      });
      inserted.push(id);
    }

    return { success: true, count: inserted.length };
  },
});

// ─── CLEANUP — Remove ALL seeded data ────────────────────────────────────────
// WARNING: This deletes EVERYTHING from all major tables.
// Only use when you're ready to hand over a clean database to the client.

export const clearAllSeededData = mutation({
  handler: async (ctx) => {
    const tablesToClear = [
      "products",
      "orders",
      "reviews",
      "enquiries",
      "heroBanners",
      "occasionLinks",
      "navbarOccasions",
      "coupons",
      "couponUsages",
      "addresses",
      "carts",
      "wishlists",
      "savedForLater",
      "reservations",
      "recentSearches",
      "recentlyViewed",
      "stockNotifications",
      "counters",
    ] as const;

    const counts: Record<string, number> = {};

    for (const table of tablesToClear) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      counts[table] = docs.length;
    }

    return { success: true, deletedCounts: counts };
  },
});

// ─── FIX — Update all product images to new Pexels URLs ──────────────────────

const SLUG_TO_IMAGE: Record<string, string> = {};
for (const p of PRODUCTS) {
  SLUG_TO_IMAGE[p.slug] = p.thumbnail;
}

export const fixProductImages = mutation({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let updated = 0;

    for (const product of products) {
      // Match by slug prefix (seeds may have added random suffix)
      const matchingSlug = Object.keys(SLUG_TO_IMAGE).find((slug) =>
        product.slug.startsWith(slug)
      );

      if (matchingSlug) {
        const newThumb = SLUG_TO_IMAGE[matchingSlug];
        if (product.thumbnail !== newThumb) {
          await ctx.db.patch(product._id, {
            thumbnail: newThumb,
            images: [newThumb],
          });
          updated++;
        }
      }
    }

    return { success: true, updated };
  },
});

// ─── FIX — Update all product tags with occasion slugs ───────────────────────

const SLUG_TO_TAGS: Record<string, string[]> = {};
for (const p of PRODUCTS) {
  SLUG_TO_TAGS[p.slug] = p.tags;
}

export const fixProductTags = mutation({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let updated = 0;

    for (const product of products) {
      const matchingSlug = Object.keys(SLUG_TO_TAGS).find((slug) =>
        product.slug.startsWith(slug)
      );

      if (matchingSlug) {
        const newTags = SLUG_TO_TAGS[matchingSlug];
        await ctx.db.patch(product._id, { tags: newTags });
        updated++;
      }
    }

    return { success: true, updated };
  },
});
