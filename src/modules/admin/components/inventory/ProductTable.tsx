"use client";

import React, { useState } from "react";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Package,
  Tag,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Layers,
  IndianRupee,
  Boxes,
  CircleDot,
  Calendar,
  Zap,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductTableFilters, CATEGORIES_MAP } from "./ProductTableFilters";
import { ProductDetailsSheet } from "./ProductDetailsSheet";

const ITEMS_PER_PAGE = 10;
type SortField = "price" | "stock" | "launchedAt";
type SortDir = "asc" | "desc";

export function ProductTable() {
  // ── Filter & sort state (lives here so it never unmounts) ──
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("launchedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Id<"products"> | null>(null);

  // ── Sheet state ──
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const isSearching = debouncedSearch.trim().length > 0;

  // ── Paginated list (always subscribed — never unmounts) ──
  const {
    results: paginatedProducts,
    status,
    loadMore,
    isLoading: isPaginatedLoading,
  } = usePaginatedQuery(
    api.products.getPaginated,
    {},
    { initialNumItems: ITEMS_PER_PAGE },
  );

  // ── Search (only fires when there is a term; skipped otherwise) ──
  const searchResults = useQuery(
    api.products.search,
    isSearching ? { searchTerm: debouncedSearch } : "skip",
  );

  const removeProduct = useMutation(api.products.remove);
  const toggleActive = useMutation(api.products.toggleActive);

  // Choose source dataset
  const rawProducts = isSearching
    ? (searchResults ?? [])
    : (paginatedProducts ?? []);

  // Client-side filter + sort on top of the active dataset
  const filtered = [...rawProducts]
    .filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter)
        return false;
      if (statusFilter !== "all") {
        if (p.isActive !== (statusFilter === "active")) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "price") cmp = a.price - b.price;
      else if (sortField === "stock") cmp = a.stock - b.stock;
      else cmp = a.launchedAt - b.launchedAt;
      return sortDir === "asc" ? cmp : -cmp;
    });

  // Loading states:
  // - Table body loading: initial paginated load OR search results pending
  const isTableLoading =
    isPaginatedLoading || (isSearching && searchResults === undefined);

  const loadedCount = paginatedProducts?.length ?? 0;
  const currentPage = Math.max(1, Math.ceil(loadedCount / ITEMS_PER_PAGE));
  const isDone = status === "Exhausted";

  // ── Handlers ──
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(filtered.map((p) => p._id)));
    else setSelectedIds(new Set());
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeProduct({ id: deleteTarget });
      toast.success("Product deleted");
      setDeleteTarget(null);
      setSelectedIds((prev) => {
        const n = new Set(prev);
        n.delete(deleteTarget);
        return n;
      });
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleActive = async (id: Id<"products">) => {
    try {
      await toggleActive({ id });
      toast.success("Product status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Formatters ──
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(p);

  const formatDate = (ts: number) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(ts));

  // ── Header cell helpers ──
  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDir === "asc" ? (
        <ChevronUp size={12} className="text-primary" />
      ) : (
        <ChevronDown size={12} className="text-primary" />
      )
    ) : (
      <ChevronDown
        size={12}
        className="opacity-30 group-hover:opacity-60 transition-opacity"
      />
    );

  const Th = ({
    icon: Icon,
    label,
    sortable,
    className = "",
  }: {
    icon: React.ElementType;
    label: string;
    sortable?: SortField;
    className?: string;
  }) => (
    <TableHead className={`border-b border-l first:border-l-0 ${className}`}>
      {sortable ? (
        <button
          type="button"
          onClick={() => toggleSort(sortable)}
          className="group flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
        >
          <Icon size={12} className="shrink-0" />
          {label}
          <SortIcon field={sortable} />
        </button>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Icon size={12} className="shrink-0" />
          {label}
        </span>
      )}
    </TableHead>
  );

  return (
    <>
      {/* ── Filters (always rendered, never replaced by skeleton) ── */}
      <ProductTableFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* ── Table ── */}
      <div className="rounded-xl border bg-card/70 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-10 border-b">
                <Checkbox
                  checked={
                    filtered.length > 0 &&
                    filtered.every((p) => selectedIds.has(p._id))
                  }
                  onCheckedChange={(c) => handleSelectAll(c as boolean)}
                />
              </TableHead>
              <Th icon={ShoppingBag} label="Product" />
              <Th icon={Layers} label="Category" />
              <Th icon={IndianRupee} label="Price" sortable="price" />
              <Th icon={Boxes} label="Stock" sortable="stock" />
              <Th icon={Tag} label="Tags" />
              <Th icon={CircleDot} label="Status" />
              <Th icon={Calendar} label="Added" sortable="launchedAt" />
              <TableHead className="w-10 text-right border-b border-l">
                <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
                  <Zap size={12} />
                  Actions
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading state — inside the table, filter bar stays untouched */}
            {isTableLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skel-${i}`}>
                  <TableCell className="border-b">
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-36" />
                      <Skeleton className="h-2.5 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-3.5 w-16" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-3.5 w-8" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-3.5 w-20" />
                  </TableCell>
                  <TableCell className="border-b border-l">
                    <Skeleton className="h-6 w-6 rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-40 border-b">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package
                      size={32}
                      strokeWidth={1.2}
                      className="opacity-40"
                    />
                    <p className="text-sm font-medium">No products found</p>
                    <p className="text-xs">
                      {isSearching ||
                      categoryFilter !== "all" ||
                      statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Add your first product to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow
                  key={product._id}
                  className={`cursor-pointer transition-colors ${
                    selectedIds.has(product._id)
                      ? "bg-primary/5"
                      : "hover:bg-muted/30"
                  }`}
                  onClick={() => {
                    setSelectedProductId(product._id);
                    setIsSheetOpen(true);
                  }}
                >
                  <TableCell
                    className="border-b"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedIds.has(product._id)}
                      onCheckedChange={(c) =>
                        handleSelect(product._id, c as boolean)
                      }
                    />
                  </TableCell>

                  <TableCell className="border-b border-l">
                    <div className="flex items-center gap-3">
                      <ProductThumbnail storageId={product.thumbnail} />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground truncate max-w-48">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-48">
                          {product.slug}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="border-b border-l">
                    <Badge variant="outline" className="text-[10px]">
                      {CATEGORIES_MAP[product.category] || product.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="font-medium tabular-nums border-b border-l">
                    {formatPrice(product.price)}
                  </TableCell>

                  <TableCell className="border-b border-l">
                    <span
                      className={`tabular-nums font-medium ${
                        product.stock === 0
                          ? "text-destructive"
                          : product.stock < 10
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-foreground"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>

                  <TableCell className="border-b border-l">
                    <div className="flex flex-wrap gap-1 max-w-40">
                      {product.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 2 && (
                        <Badge variant="ghost" className="text-[9px] px-1 py-0">
                          +{product.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="border-b border-l">
                    <Badge
                      variant={product.isActive ? "default" : "destructive"}
                      className="text-[10px]"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground border-b border-l">
                    {formatDate(product.launchedAt)}
                  </TableCell>

                  <TableCell
                    className="text-right border-b border-l"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProductId(product._id);
                            setIsSheetOpen(true);
                          }}
                        >
                          <Package size={14} />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleActive(product._id as Id<"products">)
                          }
                        >
                          <Eye size={14} />
                          {product.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() =>
                            setDeleteTarget(product._id as Id<"products">)
                          }
                        >
                          <Trash2 size={14} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination — bottom of content area ── */}
      <div className="mt-4 bg-background/90 backdrop-blur-md border-t px-4 py-3 rounded-b-xl">
        <div className="flex items-center justify-between">
          {!isSearching ? (
            <>
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {loadedCount}
                </span>{" "}
                loaded products
                {isDone && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    (all loaded)
                  </span>
                )}
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">
                    {currentPage}
                  </span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadMore(ITEMS_PER_PAGE)}
                  disabled={isDone || status === "LoadingMore"}
                  className="h-7 gap-1.5 text-xs"
                >
                  {status === "LoadingMore" ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Loading...
                    </>
                  ) : isDone ? (
                    "All loaded"
                  ) : (
                    <>
                      Next page <ChevronRight size={13} />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              {searchResults === undefined ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin" /> Searching...
                </span>
              ) : (
                <>
                  Found{" "}
                  <span className="font-semibold text-foreground">
                    {searchResults.length}
                  </span>{" "}
                  result{searchResults.length !== 1 ? "s" : ""} for &ldquo;
                  {debouncedSearch}&rdquo;
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProductDetailsSheet
        productId={selectedProductId}
        isOpen={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) setSelectedProductId(null);
        }}
      />
    </>
  );
}

function ProductThumbnail({ storageId }: { storageId?: string }) {
  const imageUrl = useQuery(
    api.products.getImageUrl,
    storageId ? { storageId } : "skip",
  );

  return (
    <div className="h-10 w-10 rounded-lg bg-muted border overflow-hidden flex items-center justify-center shrink-0">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Product thumbnail"
          className="h-full w-full object-cover"
        />
      ) : (
        <Package size={16} className="text-muted-foreground" />
      )}
    </div>
  );
}
