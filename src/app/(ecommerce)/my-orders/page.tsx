"use client";

import { useQuery } from "convex/react";
import { ChevronRight, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { OrderItemCard } from "@/modules/user/components/my-orders/OrderItemCard";
import { OrdersSearchBar } from "@/modules/user/components/my-orders/OrdersSearchBar";
import { OrdersSidebar } from "@/modules/user/components/my-orders/OrdersSidebar";
import { api } from "../../../../convex/_generated/api";

export default function UserOrdersPage() {
  const { data: session, isPending } = authClient.useSession();
  const orders = useQuery(api.orders.listUserOrders);

  const displayOrders = useMemo(() => {
    return orders || [];
  }, [orders]);

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Debounce search input to update activeSearch after 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  // Filter states
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Expanded card state
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleExpand = (cardId: string) => {
    setExpandedCardId((prev) => (prev === cardId ? null : cardId));
  };

  // Flatten orders into individual item display lines (Flipkart style)
  const allOrderItems = useMemo(() => {
    if (!displayOrders) return [];
    return displayOrders.flatMap((order) => {
      const orderReviews = (order as any).reviews || [];
      return order.items.map((item, idx) => {
        const itemId = `${order._id}-${item.productId}-${idx}`;
        const itemReview = orderReviews.find((r: any) => r.itemId === itemId);
        return {
          orderId: order._id as any,
          itemId,
          item: item as any,
          orderItems: order.items as any,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          orderStatus: order.orderStatus as any,
          paymentStatus: order.paymentStatus as any,
          razorpayOrderId: order.razorpayOrderId,
          address: order.address as any,
          shippedAt: (order as any).shippedAt,
          outForDeliveryAt: (order as any).outForDeliveryAt,
          deliveredAt: (order as any).deliveredAt,
          review: itemReview || null,
        };
      });
    });
  }, [displayOrders]);

  // Check for openReview query parameter on mount or when allOrderItems change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const openReviewId = params.get("openReview");
      if (openReviewId) {
        setExpandedCardId(openReviewId);

        // Wait for rendering to complete before scrolling
        setTimeout(() => {
          const element = document.getElementById(
            `order-item-card-${openReviewId}`,
          );
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      }
    }
  }, []);

  // Apply filters and search
  const filteredOrderItems = useMemo(() => {
    const term = activeSearch.toLowerCase().trim();

    let result = allOrderItems.filter((item) => {
      // 1. Search Filter (by item name or order ID)
      if (term) {
        const matchesName = item.item.name.toLowerCase().includes(term);
        const matchesId = item.orderId.toLowerCase().includes(term);
        if (!matchesName && !matchesId) return false;
      }

      // 2. Order Status Filter
      if (selectedStatuses.length > 0) {
        const matchesStatus = selectedStatuses.some((status) => {
          if (status === "on_the_way") {
            return (
              item.orderStatus === "placed" || item.orderStatus === "shipped"
            );
          }
          return item.orderStatus === status;
        });
        if (!matchesStatus) return false;
      }

      // 3. Order Time Filter
      if (selectedTimes.length > 0) {
        const orderDate = new Date(item.createdAt);
        const orderYear = orderDate.getFullYear().toString();
        const now = Date.now();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

        const matchesTime = selectedTimes.some((time) => {
          if (time === "last_30_days") {
            return item.createdAt >= thirtyDaysAgo;
          }
          if (time === "2026") {
            return orderYear === "2026";
          }
          if (time === "2025") {
            return orderYear === "2025";
          }
          if (time === "older") {
            return parseInt(orderYear, 10) < 2025;
          }
          return false;
        });
        if (!matchesTime) return false;
      }

      return true;
    });

    if (term) {
      result = [...result].sort((a, b) => {
        const getScore = (item: typeof a) => {
          let score = 0;
          const nameLower = item.item.name.toLowerCase();
          const orderIdLower = item.orderId.toLowerCase();

          // 1. Exact match on item name
          if (nameLower === term) {
            score += 100;
          }
          // 2. Item name starts with term
          else if (nameLower.startsWith(term)) {
            score += 80;
          }
          // 3. Item name contains term
          else if (nameLower.includes(term)) {
            score += 60;
          }

          // 4. Exact match on order ID
          if (orderIdLower === term) {
            score += 50;
          }
          // 5. Order ID contains term
          else if (orderIdLower.includes(term)) {
            score += 40;
          }

          return score;
        };

        return getScore(b) - getScore(a);
      });
    }

    return result;
  }, [allOrderItems, activeSearch, selectedStatuses, selectedTimes]);

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const handleTimeFilterChange = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput);
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedTimes([]);
    setSearchInput("");
    setActiveSearch("");
  };

  const hasFilters =
    selectedStatuses.length > 0 ||
    selectedTimes.length > 0 ||
    activeSearch !== "";

  if (isPending || orders === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[65vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[65vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl transform scale-150 animate-pulse" />
          <ShoppingBag className="w-20 h-20 text-primary relative z-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground font-serif">
            Sign In to View Orders
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto font-sans text-sm tracking-wide">
            Please log in to track your deliveries, view invoices, and manage
            order history.
          </p>
        </div>
        <Link href="/auth">
          <Button
            size="lg"
            className="rounded-full px-8 mt-4 bg-primary hover:bg-primary/95 text-white shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#faf9ff] min-h-screen py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 px-1 select-none font-mono">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={10} className="text-neutral-400" />
          <Link href="/account" className="hover:text-primary transition-colors">
            My Account
          </Link>
          <ChevronRight size={10} className="text-neutral-400" />
          <span className="text-neutral-800 font-semibold cursor-default">
            My Orders
          </span>
        </div>

        {/* Page heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-neutral-800">My Orders</h1>
          {orders && orders.length > 0 && (
            <span className="inline-flex items-center justify-center bg-primary text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono">
              {orders.length}
            </span>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-1 flex flex-col">
            <OrdersSidebar
              selectedStatuses={selectedStatuses}
              onStatusChange={handleStatusFilterChange}
              selectedTimes={selectedTimes}
              onTimeChange={handleTimeFilterChange}
              onClear={clearFilters}
              hasFilters={hasFilters}
            />
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Search Orders Bar */}
            <OrdersSearchBar
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
              onSearchSubmit={handleSearchSubmit}
              allOrderItems={allOrderItems}
              onSelectSuggestion={(itemId) => {
                const item = allOrderItems.find((x) => x.itemId === itemId);
                if (item) {
                  setSearchInput(item.item.name);
                  setActiveSearch(item.item.name);
                }
                
                setExpandedCardId(itemId);
                setTimeout(() => {
                  const el = document.getElementById(`order-item-card-${itemId}`);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }, 200);
              }}
            />

            {/* Items List */}
            {allOrderItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <div className="p-4 bg-[#ad8de9]/10 rounded-full">
                  <ShoppingBag className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold font-serif text-neutral-800">
                    No Orders Found
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    You haven't placed any orders yet. Start exploring our
                    beautiful collections!
                  </p>
                </div>
                <Link href="/products">
                  <Button className="rounded-full px-8 bg-primary hover:bg-primary/95 text-white transition-all shadow-sm">
                    Shop Now
                  </Button>
                </Link>
              </div>
            ) : filteredOrderItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <div className="p-4 bg-[#ad8de9]/10 rounded-full">
                  <ShoppingBag className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold font-serif text-neutral-800">
                    No Orders Matching Filters
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Try checking different filters or clearing the search text
                    to find what you are looking for.
                  </p>
                </div>
                <Button
                  onClick={clearFilters}
                  className="rounded-full px-8 bg-primary hover:bg-primary/95 text-white transition-all shadow-sm"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrderItems.map((displayItem) => (
                  <OrderItemCard
                    key={displayItem.itemId}
                    displayItem={displayItem}
                    isExpanded={expandedCardId === displayItem.itemId}
                    onToggleExpand={() => toggleExpand(displayItem.itemId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
