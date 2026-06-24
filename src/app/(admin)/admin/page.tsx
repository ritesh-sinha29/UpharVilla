"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  IndianRupee,
  MessageSquare,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../../convex/_generated/api";

// ═══════════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════════

const emptyStats = {
  totalRevenue: 0,
  totalOrdersCount: 0,
  totalEnquiriesCount: 0,
  lowStockCount: 0,
  last7DaysSales: [] as { date: string; amount: number; count: number }[],
  orderStatusBreakdown: [] as {
    status: string;
    count: number;
    revenue: number;
  }[],
  inventoryByCategory: [] as {
    category: string;
    totalProducts: number;
    healthy: number;
    lowStock: number;
    outOfStock: number;
    stockUnits: number;
  }[],
  topProducts: [] as { name: string; quantity: number; revenue: number }[],
};

const emptyAdvanced = {
  monthlyRevenue: [] as { month: string; revenue: number; orders: number }[],
  revenueByCategory: [] as {
    category: string;
    revenue: number;
    percentage: number;
  }[],
  dailyOrderVolume: [] as {
    date: string;
    count: number;
    revenue: number;
  }[],
  aovWeekly: [] as { week: string; aov: number; orders: number }[],
  overallAOV: 0,
  couponPerformance: [] as {
    code: string;
    redemptions: number;
    totalDiscount: number;
  }[],
  ratingDistribution: [] as { rating: number; count: number }[],
  totalReviews: 0,
  heatmapData: [] as {
    hour: number;
    dayOfWeek: string;
    count: number;
  }[],
  paymentStatusBreakdown: [] as { status: string; count: number }[],
  recentActivity: [] as {
    type: string;
    description: string;
    time: number;
  }[],
  revenueGrowth: { current: 0, previous: 0, growthPercent: 0 },
};

const STATUS_LABELS: Record<string, string> = {
  placed: "Placed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const CATEGORY_LABELS: Record<string, string> = {
  "customized-gifts": "Customized",
  "corporate-gifts": "Corporate",
  hampers: "Hampers",
  "frames-bouquet": "Frames",
  "shop-by-occasion": "Occasion",
  "new-arrivals": "New arrivals",
};

const STATUS_COLORS = ["#ad8de9", "#6366f1", "#14b8a6", "#10b981", "#f43f5e"];
const DONUT_COLORS = [
  "#ad8de9",
  "#6366f1",
  "#14b8a6",
  "#f59e0b",
  "#f43f5e",
  "#10b981",
];
const RATING_COLORS = ["#f43f5e", "#f97316", "#f59e0b", "#84cc16", "#10b981"];
const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: "#10b981",
  pending: "#f59e0b",
  failed: "#f43f5e",
};

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

function formatCurrency(value: unknown) {
  return typeof value === "number"
    ? `₹${value.toLocaleString("en-IN")}`
    : `₹${String(value)}`;
}

function formatCompactCurrency(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ═══════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════

const TOOLTIP_STYLE = {
  background: "#ffffff",
  border: "1px solid #f3f4f6",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  fontSize: "11px",
};

function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h2 className="text-sm font-bold text-neutral-800 font-serif">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 shadow-xs ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-800">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="rounded-xl border border-dashed border-neutral-200 bg-white/90 px-4 py-2.5 text-center">
        <p className="text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

function RangeToggle({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex bg-neutral-50 rounded-lg p-0.5 gap-0.5 border border-neutral-200">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150 cursor-pointer ${
            value === opt.value
              ? "bg-white text-neutral-800 shadow-xs"
              : "text-neutral-400 hover:text-neutral-600"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════

export default function AdminHomePage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const stats = useQuery(api.orders.getStats);

  const [revenueRange, setRevenueRange] = useState("7d");

  const dashboardStats = stats
    ? {
        totalRevenue: stats.totalRevenue ?? 0,
        totalOrdersCount: stats.totalOrdersCount ?? 0,
        totalEnquiriesCount: stats.totalEnquiriesCount ?? 0,
        lowStockCount: stats.lowStockCount ?? 0,
        last7DaysSales: stats.last7DaysSales ?? [],
        orderStatusBreakdown: stats.orderStatusBreakdown ?? [],
        inventoryByCategory: stats.inventoryByCategory ?? [],
        topProducts: stats.topProducts ?? [],
      }
    : emptyStats;

  const advanced = stats
    ? {
        monthlyRevenue: stats.monthlyRevenue ?? emptyAdvanced.monthlyRevenue,
        revenueByCategory:
          stats.revenueByCategory ?? emptyAdvanced.revenueByCategory,
        dailyOrderVolume:
          stats.dailyOrderVolume ?? emptyAdvanced.dailyOrderVolume,
        aovWeekly: stats.aovWeekly ?? emptyAdvanced.aovWeekly,
        overallAOV: stats.overallAOV ?? 0,
        couponPerformance:
          stats.couponPerformance ?? emptyAdvanced.couponPerformance,
        ratingDistribution:
          stats.ratingDistribution ?? emptyAdvanced.ratingDistribution,
        totalReviews: stats.totalReviews ?? 0,
        heatmapData: stats.heatmapData ?? emptyAdvanced.heatmapData,
        paymentStatusBreakdown:
          stats.paymentStatusBreakdown ??
          emptyAdvanced.paymentStatusBreakdown,
        recentActivity:
          stats.recentActivity ?? emptyAdvanced.recentActivity,
        revenueGrowth: stats.revenueGrowth ?? emptyAdvanced.revenueGrowth,
      }
    : emptyAdvanced;

  const orderPipelineData = dashboardStats.orderStatusBreakdown.map(
    (item) => ({
      ...item,
      label: STATUS_LABELS[item.status] ?? item.status,
    }),
  );
  const inventoryRiskData = dashboardStats.inventoryByCategory.map(
    (item) => ({
      ...item,
      label: CATEGORY_LABELS[item.category] ?? item.category,
    }),
  );
  const hasOrderPipelineData = orderPipelineData.some((i) => i.count > 0);
  const hasInventoryRiskData = inventoryRiskData.some(
    (i) => i.healthy > 0 || i.lowStock > 0 || i.outOfStock > 0,
  );
  const hasTopProductsData = dashboardStats.topProducts.some(
    (i) => i.revenue > 0,
  );

  const revenueChartData =
    revenueRange === "7d"
      ? dashboardStats.last7DaysSales.map((d) => ({
          label: d.date,
          revenue: d.amount,
          orders: d.count,
        }))
      : revenueRange === "30d"
        ? advanced.dailyOrderVolume.map((d) => ({
            label: d.date,
            revenue: d.revenue,
            orders: d.count,
          }))
        : advanced.monthlyRevenue.map((d) => ({
            label: d.month,
            revenue: d.revenue,
            orders: d.orders,
          }));

  const hasRevenueChartData = revenueChartData.some(
    (d) => d.revenue > 0 || d.orders > 0,
  );

  const donutData = advanced.revenueByCategory.map((c) => ({
    ...c,
    label: CATEGORY_LABELS[c.category] ?? c.category,
  }));
  const hasDonutData = donutData.some((d) => d.revenue > 0);
  const hasCouponData = advanced.couponPerformance.some(
    (c) => c.redemptions > 0,
  );
  const hasRatingData = advanced.ratingDistribution.some((r) => r.count > 0);
  const hasHeatmapData = advanced.heatmapData.some((h) => h.count > 0);
  const heatmapMax = Math.max(...advanced.heatmapData.map((h) => h.count), 1);

  if (!isSessionPending && !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-neutral-800">Access Denied</h2>
        <p className="text-sm text-neutral-500 max-w-sm text-center">
          Please log in with an administrator account to view dashboard metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-1 sm:px-4 pb-6">
      {/* Page Header — matches orders page style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-800 font-serif">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
            Overview of revenue, orders, inventory, and customer insights.
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-in fade-in duration-300">
        {/* Revenue */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-sm font-extrabold text-neutral-800 font-mono mt-0.5">
              {formatCompactCurrency(dashboardStats.totalRevenue)}
            </p>
            {advanced.revenueGrowth.growthPercent !== 0 && (
              <span
                className={`text-[10px] font-semibold flex items-center gap-0.5 mt-0.5 ${advanced.revenueGrowth.growthPercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}
              >
                {advanced.revenueGrowth.growthPercent >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(advanced.revenueGrowth.growthPercent)}% vs last 30d
              </span>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ad8de9]/10 text-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Orders
            </p>
            <p className="text-sm font-extrabold text-neutral-800 font-mono mt-0.5">
              {dashboardStats.totalOrdersCount}
            </p>
            <span className="text-[10px] text-neutral-400 font-medium">
              All placed orders
            </span>
          </div>
        </div>

        {/* AOV */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Avg. Order Value
            </p>
            <p className="text-sm font-extrabold text-neutral-800 font-mono mt-0.5">
              {formatCompactCurrency(advanced.overallAOV)}
            </p>
            <span className="text-[10px] text-primary font-medium">
              Per paid order
            </span>
          </div>
        </div>

        {/* Enquiries */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Enquiries
            </p>
            <p className="text-sm font-extrabold text-neutral-800 font-mono mt-0.5">
              {dashboardStats.totalEnquiriesCount}
            </p>
            <span className="text-[10px] text-neutral-400 font-medium">
              Feedback & queries
            </span>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              dashboardStats.lowStockCount > 0
                ? "bg-rose-50 text-rose-600"
                : "bg-neutral-50 text-neutral-400"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Low Stock
            </p>
            <p className="text-sm font-extrabold text-neutral-800 font-mono mt-0.5">
              {dashboardStats.lowStockCount}
            </p>
            <span
              className={`text-[10px] font-medium ${
                dashboardStats.lowStockCount > 0
                  ? "text-rose-500"
                  : "text-neutral-400"
              }`}
            >
              {dashboardStats.lowStockCount > 0
                ? "Action required"
                : "All healthy"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Revenue & Orders Chart ── */}
      <ChartCard
        title="Revenue & Orders"
        subtitle="Revenue timeline with order count overlay."
        right={
          <RangeToggle
            options={[
              { label: "7 Days", value: "7d" },
              { label: "30 Days", value: "30d" },
              { label: "6 Months", value: "6m" },
            ]}
            value={revenueRange}
            onChange={setRevenueRange}
          />
        }
      >
        <div className="h-[200px] sm:h-[280px] w-full relative">
          {!hasRevenueChartData && (
            <EmptyState message="Revenue timeline will appear after orders are paid." />
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={revenueChartData}
              margin={{ top: 8, right: 8, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ad8de9" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ad8de9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />
              <XAxis
                dataKey="label"
                stroke="#d4d4d4"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#d4d4d4"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}`
                }
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#d4d4d4"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(val: unknown, name: unknown) => [
                  name === "revenue" ? formatCurrency(val) : String(val),
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
                contentStyle={TOOLTIP_STYLE}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#ad8de9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={1.5}
                dot={{ r: 2.5, fill: "#6366f1" }}
                name="orders"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* ── Category Revenue + Daily Volume ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard
          title="Revenue by Category"
          subtitle="Revenue split across product categories."
        >
          <div className="h-[220px] sm:h-[260px] w-full relative">
            {!hasDonutData && (
              <EmptyState message="Category breakdown appears after paid orders." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="revenue"
                  nameKey="label"
                  stroke="none"
                >
                  {donutData.map((_e, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: unknown) => [formatCurrency(val), "Revenue"]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 10, color: "#737373" }}
                  formatter={(value: string) => (
                    <span className="text-neutral-500 text-[10px]">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Daily Order Volume"
          subtitle="Orders per day (last 30 days)."
        >
          <div className="h-[220px] sm:h-[260px] w-full relative">
            {advanced.dailyOrderVolume.every((d) => d.count === 0) && (
              <EmptyState message="Daily volume appears as orders come in." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={advanced.dailyOrderVolume}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="date"
                  stroke="#d4d4d4"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(val: unknown, name: unknown) => [
                    String(val),
                    name === "count" ? "Orders" : "Trend",
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="count"
                  fill="#ad8de9"
                  radius={[3, 3, 0, 0]}
                  opacity={0.5}
                  name="count"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  dot={false}
                  name="trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ── Pipeline + Inventory + Top Products ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          title="Fulfillment Pipeline"
          subtitle="Order volume by stage."
        >
          <div className="h-[200px] sm:h-[240px] w-full relative">
            {!hasOrderPipelineData && (
              <EmptyState message="Pipeline fills as orders arrive." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderPipelineData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="label"
                  stroke="#d4d4d4"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(val: unknown, name: unknown) => [
                    name === "revenue" ? formatCurrency(val) : String(val),
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {orderPipelineData.map((entry, i) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Inventory Health"
          subtitle="Stock levels by category."
        >
          <div className="h-[200px] sm:h-[240px] w-full relative">
            {!hasInventoryRiskData && (
              <EmptyState message="Stock health appears after products are active." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryRiskData}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="label"
                  stroke="#d4d4d4"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(val: unknown, name: unknown) => [
                    String(val),
                    name === "outOfStock"
                      ? "Out of stock"
                      : name === "lowStock"
                        ? "Low stock"
                        : "Healthy",
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Legend
                  verticalAlign="top"
                  height={24}
                  iconType="circle"
                  iconSize={6}
                  wrapperStyle={{ fontSize: 10, color: "#737373" }}
                />
                <Bar
                  dataKey="healthy"
                  stackId="inv"
                  fill="#10b981"
                  name="Healthy"
                />
                <Bar
                  dataKey="lowStock"
                  stackId="inv"
                  fill="#f59e0b"
                  name="Low stock"
                />
                <Bar
                  dataKey="outOfStock"
                  stackId="inv"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  name="Out of stock"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Top Products"
          subtitle="Best revenue drivers."
        >
          <div className="h-[200px] sm:h-[240px] w-full relative">
            {!hasTopProductsData && (
              <EmptyState message="Top products appear after paid orders." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardStats.topProducts}
                layout="vertical"
                margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  type="number"
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  stroke="#d4d4d4"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(n) =>
                    n.length > 12 ? `${n.slice(0, 12)}…` : n
                  }
                />
                <Tooltip
                  formatter={(val: unknown, name: unknown) => [
                    name === "revenue" ? formatCurrency(val) : String(val),
                    name === "revenue" ? "Revenue" : "Units",
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="revenue"
                  fill="#ad8de9"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ── Coupons + AOV Trend + Ratings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Coupon Performance"
          subtitle="Top coupons by redemptions."
        >
          <div className="h-[200px] sm:h-[220px] w-full relative">
            {!hasCouponData && (
              <EmptyState message="Coupon analytics appear after first redemption." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={advanced.couponPerformance}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  type="number"
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="code"
                  width={72}
                  stroke="#d4d4d4"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val: unknown, name: unknown) => [
                    name === "totalDiscount"
                      ? formatCurrency(val)
                      : String(val),
                    name === "totalDiscount"
                      ? "Total Discount"
                      : "Redemptions",
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="redemptions"
                  fill="#ad8de9"
                  radius={[0, 6, 6, 0]}
                  name="redemptions"
                >
                  {advanced.couponPerformance.map((_e, i) => (
                    <Cell
                      key={`coupon-${i}`}
                      fill={DONUT_COLORS[i % DONUT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Avg. Order Value"
          subtitle="Weekly AOV trend (last 30 days)."
        >
          <div className="h-[200px] sm:h-[220px] w-full relative">
            {advanced.aovWeekly.every((w) => w.aov === 0) && (
              <EmptyState message="AOV trend appears after paid orders." />
            )}
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={advanced.aovWeekly}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="week"
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#d4d4d4"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(val: unknown, name: unknown) => [
                    name === "aov" ? formatCurrency(val) : String(val),
                    name === "aov" ? "AOV" : "Orders",
                  ]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Bar
                  dataKey="aov"
                  fill="#ad8de9"
                  radius={[6, 6, 0, 0]}
                  opacity={0.3}
                  name="aov"
                />
                <Line
                  type="monotone"
                  dataKey="aov"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                    fill: "#6366f1",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  name="aov"
                />
                {advanced.overallAOV > 0 && (
                  <Line
                    type="monotone"
                    dataKey={() => advanced.overallAOV}
                    stroke="#e5e5e5"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    dot={false}
                    name="benchmark"
                    legendType="none"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Review Ratings"
          subtitle={`${advanced.totalReviews} total review${advanced.totalReviews !== 1 ? "s" : ""}.`}
        >
          <div className="h-[200px] sm:h-[220px] w-full relative">
            {!hasRatingData && (
              <EmptyState message="Ratings appear after customers review products." />
            )}
            {hasRatingData && (
              <div className="flex flex-col gap-2.5 justify-center h-full px-1">
                {advanced.ratingDistribution.map((item, index) => {
                  const maxCount = Math.max(
                    ...advanced.ratingDistribution.map((r) => r.count),
                    1,
                  );
                  const width =
                    item.count > 0
                      ? Math.max((item.count / maxCount) * 100, 6)
                      : 0;
                  return (
                    <div key={item.rating} className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1 w-12 shrink-0 justify-end">
                        <span className="text-xs font-bold text-neutral-600 tabular-nums">
                          {item.rating}
                        </span>
                        <Star
                          className="w-3 h-3"
                          fill={RATING_COLORS[4 - index]}
                          stroke="none"
                        />
                      </div>
                      <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${width}%`,
                            backgroundColor: RATING_COLORS[4 - index],
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-neutral-400 tabular-nums w-6 text-right">
                        {item.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* ── Heatmap + Payment Status ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          title="Order Heatmap"
          subtitle="Peak shopping hours (last 30 days)."
          className="xl:col-span-2"
        >
          <div className="relative">
            {!hasHeatmapData && (
              <EmptyState message="Heatmap populates as orders come in." />
            )}
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="flex ml-9 mb-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={`h-${i}`}
                      className="flex-1 text-center text-[8px] text-neutral-400"
                    >
                      {i % 3 === 0 ? `${i}h` : ""}
                    </div>
                  ))}
                </div>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div key={day} className="flex items-center gap-1 mb-[2px]">
                      <span className="w-8 text-[9px] font-medium text-neutral-500 text-right pr-1 shrink-0">
                        {day}
                      </span>
                      <div className="flex flex-1 gap-[1.5px]">
                        {Array.from({ length: 24 }, (_, hour) => {
                          const cell = advanced.heatmapData.find(
                            (h) => h.dayOfWeek === day && h.hour === hour,
                          );
                          const count = cell?.count ?? 0;
                          const intensity =
                            heatmapMax > 0 ? count / heatmapMax : 0;
                          return (
                            <div
                              key={`${day}-${hour}`}
                              className="flex-1 aspect-square rounded-[2px]"
                              style={{
                                backgroundColor:
                                  count === 0
                                    ? "#faf8ff"
                                    : `rgba(173, 141, 233, ${0.12 + intensity * 0.88})`,
                              }}
                              title={`${day} ${hour}:00 — ${count} order${count !== 1 ? "s" : ""}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
                <div className="flex items-center justify-end gap-1.5 mt-2 mr-1">
                  <span className="text-[9px] text-neutral-400">Less</span>
                  <div className="flex gap-[1px]">
                    {[0, 0.2, 0.4, 0.6, 0.8, 1].map((i) => (
                      <div
                        key={`leg-${i}`}
                        className="w-2.5 h-2.5 rounded-[2px]"
                        style={{
                          backgroundColor:
                            i === 0
                              ? "#faf8ff"
                              : `rgba(173, 141, 233, ${0.12 + i * 0.88})`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] text-neutral-400">More</span>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Payment Status"
          subtitle="Breakdown of all order payments."
        >
          <div className="h-[200px] sm:h-[220px] w-full relative flex flex-col justify-center gap-4 px-1">
            {advanced.paymentStatusBreakdown.length === 0 && (
              <EmptyState message="Payment status appears after first order." />
            )}
            {advanced.paymentStatusBreakdown.map((item) => {
              const total = advanced.paymentStatusBreakdown.reduce(
                (s, i) => s + i.count,
                0,
              );
              const pct =
                total > 0 ? Math.round((item.count / total) * 100) : 0;
              const color = PAYMENT_STATUS_COLORS[item.status] ?? "#9ca3af";
              return (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-medium text-neutral-600 capitalize">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-neutral-800 font-mono tabular-nums">
                      {item.count}{" "}
                      <span className="text-neutral-400 font-normal text-[10px]">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* ── Recent Activity ── */}
      <ChartCard
        title="Recent Activity"
        subtitle="Latest orders, enquiries, and reviews."
      >
        {advanced.recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-neutral-400">
              No recent activity to display.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {advanced.recentActivity.map((item, index) => {
              const iconMap: Record<
                string,
                { icon: React.ReactNode; bg: string }
              > = {
                order: {
                  icon: (
                    <ShoppingBag className="w-3.5 h-3.5 text-[#ad8de9]" />
                  ),
                  bg: "bg-[#ad8de9]/10",
                },
                enquiry: {
                  icon: (
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                  ),
                  bg: "bg-indigo-50",
                },
                review: {
                  icon: <Star className="w-3.5 h-3.5 text-amber-500" />,
                  bg: "bg-amber-50",
                },
              };
              const cfg = iconMap[item.type] ?? {
                icon: <Package className="w-3.5 h-3.5 text-neutral-400" />,
                bg: "bg-neutral-50",
              };
              return (
                <div
                  key={`act-${index}`}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-700 leading-snug line-clamp-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5 text-neutral-300" />
                      <span className="text-[10px] text-neutral-400">
                        {timeAgo(item.time)}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
                    {item.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
