import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { incrementCounter } from "./counterUtils";

// Occasion products seed — 5 per occasion, tagged with occasion slug
// Run with: npx convex run seed:seedOccasionProducts '{"userId":"YOUR_USER_ID"}'

const OCCASION_PRODUCTS = [
  // ──── Father's Day ────────────────────────────────────────────────────────
  {
    name: "Personalised LED Dad Lamp",
    slug: "personalised-led-dad-lamp",
    description: "A warm LED acrylic lamp with a custom engraved photo of dad. Perfect keepsake for Father's Day.",
    price: 899,
    discount: 18,
    thumbnail: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["fathers-day", "personalized", "lamp", "dad"],
    subCategory: "LED Gifts",
  },
  {
    name: "Gift Tray with Sweets & Flowers",
    slug: "gift-tray-sweets-flowers-dads",
    description: "A curated wooden gift tray filled with assorted sweets, dry fruits, and fresh flowers for Dad.",
    price: 1349,
    discount: 22,
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["fathers-day", "hamper", "sweets", "dad"],
    subCategory: "Gift Trays",
  },
  {
    name: "Dad Photo Collage Frame",
    slug: "dad-photo-collage-frame",
    description: "Premium wooden multi-photo collage frame laser-engraved with 'Best Dad Ever' sentiment.",
    price: 699,
    discount: 12,
    thumbnail: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["fathers-day", "frame", "photo", "dad"],
    subCategory: "Photo Frames",
  },
  {
    name: "Luxury Grooming Hamper for Dad",
    slug: "luxury-grooming-hamper-dad",
    description: "Premium grooming kit with beard oil, face wash, and moisturizer — packed in a classy box.",
    price: 1899,
    discount: 15,
    thumbnail: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["fathers-day", "grooming", "luxury", "dad"],
    subCategory: "Grooming",
  },
  {
    name: "Super Dad Printed Cushion",
    slug: "super-dad-printed-cushion",
    description: "Soft cushion printed with a custom illustration of dad and kids. A heartfelt Father's Day gift.",
    price: 549,
    discount: 10,
    thumbnail: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["fathers-day", "cushion", "printed", "dad"],
    subCategory: "Cushions",
  },

  // ──── Birthday ────────────────────────────────────────────────────────────
  {
    name: "Happy Birthday Balloon Bouquet",
    slug: "happy-birthday-balloon-bouquet",
    description: "A vibrant bunch of 12 birthday balloons in gold and silver with a 'Happy Birthday' foil balloon.",
    price: 699,
    discount: 10,
    thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["birthday", "balloons", "celebration", "party"],
    subCategory: "Balloon Bouquets",
  },
  {
    name: "Birthday Chocolate Hamper",
    slug: "birthday-chocolate-hamper",
    description: "Indulgent birthday hamper with Belgian chocolates, truffles, and a personalised birthday card.",
    price: 1249,
    discount: 20,
    thumbnail: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["birthday", "chocolate", "hamper", "sweets"],
    subCategory: "Chocolate Gifts",
  },
  {
    name: "Personalised Name Mug",
    slug: "personalised-name-mug-birthday",
    description: "High-quality ceramic mug with the recipient's name and a birthday illustration. Microwave safe.",
    price: 449,
    discount: 8,
    thumbnail: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["birthday", "mug", "personalized", "ceramic"],
    subCategory: "Mugs",
  },
  {
    name: "Birthday Memory Book",
    slug: "birthday-memory-book",
    description: "A beautifully designed memory scrapbook with custom photos and heartfelt birthday messages.",
    price: 999,
    discount: 14,
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["birthday", "scrapbook", "memory", "personalized"],
    subCategory: "Books",
  },
  {
    name: "Birthday Flower Bouquet",
    slug: "birthday-flower-bouquet",
    description: "Fresh hand-picked seasonal flower bouquet with a ribbon and personalised birthday message card.",
    price: 799,
    discount: 12,
    thumbnail: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["birthday", "flowers", "bouquet", "fresh"],
    subCategory: "Flower Bouquets",
  },

  // ──── Anniversary ─────────────────────────────────────────────────────────
  {
    name: "Couple Photo LED Lamp",
    slug: "couple-photo-led-lamp-anniversary",
    description: "A romantic acrylic LED lamp with a custom couple photo engraving. Perfect anniversary keepsake.",
    price: 999,
    discount: 16,
    thumbnail: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["anniversary", "couple", "lamp", "romantic"],
    subCategory: "LED Gifts",
  },
  {
    name: "Rose & Chocolate Anniversary Box",
    slug: "rose-chocolate-anniversary-box",
    description: "An elegant gift box with 12 preserved roses and artisan chocolates for your special anniversary.",
    price: 1599,
    discount: 18,
    thumbnail: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["anniversary", "roses", "chocolate", "romantic"],
    subCategory: "Luxury Hampers",
  },
  {
    name: "Custom Anniversary Cushion",
    slug: "custom-anniversary-cushion",
    description: "Personalized cushion with couple name, anniversary date, and a romantic illustration printed.",
    price: 649,
    discount: 10,
    thumbnail: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["anniversary", "cushion", "couple", "personalized"],
    subCategory: "Cushions",
  },
  {
    name: "Anniversary Love Frame",
    slug: "anniversary-love-frame",
    description: "A beautiful wooden love-heart frame with couple photo and personalised anniversary message.",
    price: 849,
    discount: 14,
    thumbnail: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["anniversary", "frame", "photo", "love"],
    subCategory: "Photo Frames",
  },
  {
    name: "Luxury Anniversary Wine Hamper",
    slug: "luxury-anniversary-wine-hamper",
    description: "Premium gift hamper with a bottle of fine wine, gourmet cheese, and artisan chocolates.",
    price: 2499,
    discount: 20,
    thumbnail: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["anniversary", "wine", "luxury", "hamper"],
    subCategory: "Wine Hampers",
  },

  // ──── Valentine's ─────────────────────────────────────────────────────────
  {
    name: "Heart Shaped Chocolate Box",
    slug: "heart-shaped-chocolate-box-valentines",
    description: "A gorgeous red heart-shaped box filled with 24 assorted Belgian truffles and chocolates.",
    price: 899,
    discount: 15,
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["valentines", "chocolate", "heart", "romantic"],
    subCategory: "Chocolate Gifts",
  },
  {
    name: "Red Rose Bouquet",
    slug: "red-rose-bouquet-valentines",
    description: "A classic bouquet of 24 fresh red roses tied with a satin ribbon — say it with flowers.",
    price: 1199,
    discount: 12,
    thumbnail: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["valentines", "roses", "red", "bouquet"],
    subCategory: "Flower Bouquets",
  },
  {
    name: "Love Story Photo Book",
    slug: "love-story-photo-book-valentines",
    description: "Custom printed photo book telling your love story — perfect Valentine's keepsake.",
    price: 1349,
    discount: 18,
    thumbnail: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["valentines", "photobook", "love", "personalized"],
    subCategory: "Books",
  },
  {
    name: "Couple Name Necklace",
    slug: "couple-name-necklace-valentines",
    description: "Delicate sterling silver necklace with custom engraved couple names and heart charm.",
    price: 1799,
    discount: 20,
    thumbnail: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["valentines", "necklace", "jewelry", "couple"],
    subCategory: "Jewelry",
  },
  {
    name: "Valentine Surprise Gift Box",
    slug: "valentine-surprise-gift-box",
    description: "A curated surprise box with chocolates, scented candles, a plush teddy, and a love letter.",
    price: 1999,
    discount: 22,
    thumbnail: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["valentines", "surprise", "box", "romantic"],
    subCategory: "Gift Boxes",
  },

  // ──── Baby Shower ─────────────────────────────────────────────────────────
  {
    name: "New Baby Welcome Hamper",
    slug: "new-baby-welcome-hamper",
    description: "Adorable baby welcome kit with onesie, soft toy, bibs, and a personalised name frame.",
    price: 1499,
    discount: 14,
    thumbnail: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["baby-shower", "baby", "welcome", "hamper"],
    subCategory: "Baby Hampers",
  },
  {
    name: "Personalised Baby Name Frame",
    slug: "personalised-baby-name-frame",
    description: "Cute wooden name frame with the baby's name, birth date, weight, and height. A memory to cherish.",
    price: 799,
    discount: 10,
    thumbnail: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["baby-shower", "frame", "personalized", "baby"],
    subCategory: "Baby Frames",
  },
  {
    name: "Soft Plush Bunny Toy",
    slug: "soft-plush-bunny-toy-babyshower",
    description: "An ultra-soft hypoallergenic plush bunny, perfect as a baby shower gift for the newborn.",
    price: 599,
    discount: 8,
    thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["baby-shower", "plush", "toy", "bunny"],
    subCategory: "Soft Toys",
  },
  {
    name: "Baby Milestone Card Set",
    slug: "baby-milestone-card-set",
    description: "Beautiful set of 36 milestone cards to capture baby's first moments — month by month.",
    price: 499,
    discount: 6,
    thumbnail: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["baby-shower", "milestone", "cards", "baby"],
    subCategory: "Stationery",
  },
  {
    name: "Organic Baby Gift Basket",
    slug: "organic-baby-gift-basket",
    description: "100% organic cotton baby essentials in a wicker basket — safe, gentle, and beautiful.",
    price: 1899,
    discount: 18,
    thumbnail: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["baby-shower", "organic", "basket", "essentials"],
    subCategory: "Baby Baskets",
  },

  // ──── Graduation ──────────────────────────────────────────────────────────
  {
    name: "Graduation Cap Photo Frame",
    slug: "graduation-cap-photo-frame",
    description: "Stylish frame with a laser-cut graduation cap motif and space for a graduation photo.",
    price: 749,
    discount: 10,
    thumbnail: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["graduation", "frame", "cap", "photo"],
    subCategory: "Photo Frames",
  },
  {
    name: "Graduation Success Hamper",
    slug: "graduation-success-hamper",
    description: "A celebratory hamper with champagne, chocolates, and a custom 'Congrats Grad' keepsake.",
    price: 1799,
    discount: 20,
    thumbnail: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop",
    category: "hampers",
    tags: ["graduation", "hamper", "celebration", "success"],
    subCategory: "Celebration Hampers",
  },
  {
    name: "Personalised Graduate Mug",
    slug: "personalised-graduate-mug",
    description: "Custom ceramic mug with graduate's name, degree, and graduation year — for the new professional.",
    price: 449,
    discount: 8,
    thumbnail: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&auto=format&fit=crop",
    category: "customized-gifts",
    tags: ["graduation", "mug", "personalized", "degree"],
    subCategory: "Mugs",
  },
  {
    name: "Leather Portfolio for Graduates",
    slug: "leather-portfolio-graduates",
    description: "Professional slim leather portfolio with engraved name — perfect first office gift for graduates.",
    price: 1299,
    discount: 15,
    thumbnail: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop",
    category: "corporate-gifts",
    tags: ["graduation", "portfolio", "leather", "professional"],
    subCategory: "Professional Gifts",
  },
  {
    name: "Congrats Grad Flower Bouquet",
    slug: "congrats-grad-flower-bouquet",
    description: "A vibrant seasonal bouquet in graduation theme colours with a congratulatory message card.",
    price: 899,
    discount: 12,
    thumbnail: "https://images.unsplash.com/photo-1576016770956-debb63d90029?w=600&auto=format&fit=crop",
    category: "frames-bouquet",
    tags: ["graduation", "bouquet", "flowers", "celebration"],
    subCategory: "Flower Bouquets",
  },
] as const;

export const seedOccasionProducts = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const insertedIds: string[] = [];

    for (const product of OCCASION_PRODUCTS) {
      // Skip if slug already exists
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .first();
      if (existing) continue;

      const randomSuffix = Math.random().toString(36).substring(2, 5);
      const slug = `${product.slug}-${randomSuffix}`;

      const id = await ctx.db.insert("products", {
        name: product.name,
        slug,
        createdByUserId: args.userId,
        description: product.description,
        price: product.price,
        discount: product.discount,
        thumbnail: product.thumbnail,
        images: [product.thumbnail],
        category: product.category as any,
        subCategory: product.subCategory,
        tags: [...product.tags],
        stock: Math.floor(Math.random() * 50) + 20,
        launchedAt: Date.now(),
        markNewArrival: false,
        markTrending: false,
        markMostPurchased: false,
        markMostSold: false,
        isActive: true,
      });

      await incrementCounter(ctx, "products");
      insertedIds.push(id);
    }

    return { success: true, count: insertedIds.length };
  },
});

export const seedFakeOrders = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // 1. Fetch first few active products to use as order items
    const products = await ctx.db
      .query("products")
      .withIndex("by_active_launched_at", (q) => q.eq("isActive", true))
      .take(5);

    if (products.length === 0) {
      throw new Error("No active products found. Please seed products first!");
    }

    // 2. Check if the user has an address, if not insert a dummy one
    let address = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!address) {
      const addressId = await ctx.db.insert("addresses", {
        userId: args.userId,
        fullName: "Ritesh Sinha",
        phone: "9876543210",
        pincode: "400001",
        locality: "Colaba",
        address: "123, Ocean Breeze Apartments, Marine Drive",
        city: "Mumbai",
        state: "Maharashtra",
        landmark: "Near Gateway of India",
        addressType: "home",
        isDefault: true,
        createdAt: Date.now(),
      });
      address = await ctx.db.get(addressId);
    }

    const addressId = address!._id;

    // 3. Create 3 mock orders with different orderStatus and paymentStatus values
    const orderStatuses = [
      { orderStatus: "placed" as const, paymentStatus: "paid" as const },
      { orderStatus: "shipped" as const, paymentStatus: "paid" as const },
      { orderStatus: "delivered" as const, paymentStatus: "paid" as const },
    ];

    const insertedOrderIds = [];

    for (let i = 0; i < orderStatuses.length; i++) {
      const { orderStatus, paymentStatus } = orderStatuses[i];

      // Pick 1 or 2 products
      const orderProducts = [products[i % products.length]];
      if (products.length > 1) {
        orderProducts.push(products[(i + 1) % products.length]);
      }

      const items = orderProducts.map((p) => ({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: Math.floor(Math.random() * 2) + 1,
        thumbnail: p.thumbnail,
      }));

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 9; // including 9 platform fee

      const orderId = await ctx.db.insert("orders", {
        userId: args.userId,
        addressId,
        items,
        totalAmount,
        razorpayOrderId: `pay_order_${Math.random().toString(36).substring(2, 10)}`,
        razorpayPaymentId: `pay_id_${Math.random().toString(36).substring(2, 10)}`,
        paymentStatus,
        orderStatus,
        shippedAt: orderStatus !== "placed" ? Date.now() - 1 * 24 * 60 * 60 * 1000 : undefined,
        outForDeliveryAt: orderStatus === "delivered" ? Date.now() - 12 * 60 * 60 * 1000 : undefined,
        deliveredAt: orderStatus === "delivered" ? Date.now() : undefined,
        createdAt: Date.now() - i * 2 * 24 * 60 * 60 * 1000, // staggered dates
      });

      // Increment table count
      await incrementCounter(ctx, "orders");
      insertedOrderIds.push(orderId);
    }

    return { success: true, count: insertedOrderIds.length, orderIds: insertedOrderIds };
  },
});
