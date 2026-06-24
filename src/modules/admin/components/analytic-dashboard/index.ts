// ═══════════════════════════════════════════════════
// Analytic Dashboard — Barrel Export
// ═══════════════════════════════════════════════════

// Shared utilities
export {
  type DashboardStats,
  type AdvancedStats,
  EMPTY_STATS,
  EMPTY_ADVANCED,
} from "./dashboard-utils";

// Shared UI
export { ChartCard, EmptyState, RangeToggle } from "./ChartCard";

// Dashboard sections
export { PendingActionsBanner } from "./PendingActionsBanner";
export { QuickActions } from "./QuickActions";
export { KPICards } from "./KPICards";
export { RevenueChart } from "./RevenueChart";
export { CategoryRevenueChart } from "./CategoryRevenueChart";
export { DailyVolumeChart } from "./DailyVolumeChart";
export { FulfillmentPipeline } from "./FulfillmentPipeline";
export { InventoryHealth } from "./InventoryHealth";
export { TopProductsTable } from "./TopProductsTable";
export { CouponPerformance } from "./CouponPerformance";
export { AOVTrendChart } from "./AOVTrendChart";
export { ReviewRatings } from "./ReviewRatings";
export { OrderHeatmap } from "./OrderHeatmap";
export { PaymentStatus } from "./PaymentStatus";
export { RecentActivity } from "./RecentActivity";
