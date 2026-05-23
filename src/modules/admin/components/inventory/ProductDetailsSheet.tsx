"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { upload } from "@imagekit/next";
import { api } from "../../../../../convex/_generated/api";
import {
  IndianRupee,
  Boxes,
  Layers,
  Tag,
  Calendar,
  ImagePlus,
  Package,
  ExternalLink,
  Trash2,
  Loader2,
  Sparkles,
  TrendingUp,
  Settings2,
  ChevronDown,
  ChevronUp,
  Zap,
  Percent,
  Check,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../../../../convex/_generated/dataModel";

interface ProductDetailsSheetProps {
  productId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsSheet({
  productId,
  isOpen,
  onOpenChange,
}: ProductDetailsSheetProps) {
  // Fetch real-time product data
  const product = useQuery(
    api.products.getById,
    productId ? { id: productId as Id<"products"> } : "skip",
  );

  const updateProduct = useMutation(api.products.update);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
  const [isThumbnailUploading, setIsThumbnailUploading] = React.useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = React.useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  const [discountInput, setDiscountInput] = React.useState("");

  // Sync discount input when product changes
  React.useEffect(() => {
    if (product) {
      setDiscountInput(product.discount?.toString() || "");
    }
  }, [product]);

  const handleSaveDiscount = async () => {
    if (!product) return;
    const val = parseInt(discountInput);

    // If empty, set to 0 or undefined
    if (!discountInput) {
      await updateProduct({ id: product._id, discount: 0 });
      toast.success("Discount removed");
      return;
    }

    if (isNaN(val) || val < 1 || val > 99) {
      toast.error("Discount must be between 1 and 99%");
      setDiscountInput(product.discount?.toString() || "");
      return;
    }

    await updateProduct({ id: product._id, discount: val });
    toast.success(`Discount updated to ${val}%`);
  };

  const authenticator = async () => {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) throw new Error("Auth failed");
    return await response.json();
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    const uploadPromise = async () => {
      setIsGalleryUploading(true);
      try {
        const authParams = await authenticator();
        const uploadResponse = await upload({
          file,
          fileName: `product_gallery_${Date.now()}`,
          folder: "/products/gallery",
          ...authParams,
        });

        if (uploadResponse.url) {
          const currentImages = product.images || [];
          await updateProduct({
            id: product._id,
            images: [...currentImages, uploadResponse.url],
          });
          return "Gallery image added";
        }
        throw new Error("Upload failed");
      } finally {
        setIsGalleryUploading(false);
        if (e.target) e.target.value = "";
      }
    };

    toast.promise(uploadPromise(), {
      loading: "Uploading gallery image...",
      success: (data) => data,
      error: "Failed to upload image",
    });
  };

  const handleUpdateThumbnail = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;

    const uploadPromise = async () => {
      setIsThumbnailUploading(true);
      try {
        const authParams = await authenticator();
        const uploadResponse = await upload({
          file,
          fileName: `product_thumbnail_${Date.now()}`,
          folder: "/products/thumbnails",
          ...authParams,
        });

        if (uploadResponse.url) {
          await updateProduct({
            id: product._id,
            thumbnail: uploadResponse.url,
          });
          return "Thumbnail updated";
        }
        throw new Error("Upload failed");
      } finally {
        setIsThumbnailUploading(false);
        if (e.target) e.target.value = "";
      }
    };

    toast.promise(uploadPromise(), {
      loading: "Updating thumbnail...",
      success: (data) => data,
      error: "Failed to update thumbnail",
    });
  };

  // Resolve thumbnail URL if it's a storageId
  const imageUrl = useQuery(
    api.products.getImageUrl,
    product?.thumbnail ? { storageId: product.thumbnail } : "skip",
  );

  if (productId && product === undefined) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading product details...
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!product) return null;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(p);

  const formatDate = (ts: number) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(ts));

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-2 px-4">
          <div className="flex items-center justify-between">
            <Badge
              variant={product.isActive ? "default" : "destructive"}
              className="w-fit"
            >
              {product.isActive ? "Active" : "Inactive"}
            </Badge>

            <div className="flex items-center gap-3">
              <Button>
                Edit <Settings2 className="h-3 w-3" />
              </Button>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold pr-10">
                <span className="font-medium">Launched:</span>{" "}
                <Calendar size={12} /> {formatDate(product.launchedAt)}
              </span>
            </div>
          </div>
          <div>
            <SheetTitle className="text-xl font-bold">
              <span className="font-medium text-base">Product Name:</span>{" "}
              {product.name}
            </SheetTitle>
            <SheetDescription className="font-mono text-xs mt-1 truncate">
              ID: {product._id} | Slug: {product.slug}
            </SheetDescription>
          </div>
        </SheetHeader>

        <Separator className="my-3" />

        <div className="space-y-4 px-4">
          {/* Thumbnail Section */}
          <div className="space-y-3">
            <h4 className="text-base font-medium flex items-center gap-2">
              <Package size={16} /> Thumbnail
            </h4>
            <div className="relative aspect-video scale-90 rounded-xl border bg-muted overflow-hidden flex items-center justify-center group">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Package size={32} strokeWidth={1} />
                  <span className="text-xs">No thumbnail provided</span>
                </div>
              )}

              {isThumbnailUploading && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              )}

              <div className="absolute top-2 right-2 flex gap-2">
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  className="hidden"
                  onChange={handleUpdateThumbnail}
                  accept="image/*"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => thumbnailInputRef.current?.click()}
                  disabled={isThumbnailUploading}
                >
                  <ImagePlus size={14} /> Change
                </Button>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border bg-primary/10 space-y-1">
              <span className="text-sm flex items-center gap-1">
                <IndianRupee size={12} /> Price
              </span>
              <p className="text-lg font-mono">{formatPrice(product.price)}</p>
            </div>
            <div className="p-3 rounded-xl border bg-primary/10 space-y-1">
              <span className="text-sm  flex items-center gap-1">
                <Boxes size={12} /> Stock
              </span>
              <p
                className={`text-lg font-mono ${product.stock < 5 ? "text-destructive" : ""}`}
              >
                {product.stock}
              </p>
            </div>
            <div className="p-3 rounded-xl border bg-primary/10 border-primary/20 space-y-1 group relative">
              <span className="text-sm flex items-center gap-1 font-medium">
                <Percent size={12} /> Discount
              </span>
              <div className="flex items-center gap-1">
                <p className="text-lg font-mono">{product.discount || 0}%</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg border">
              {product.description || "No description provided."}
            </p>
          </div>

          <Separator className="opacity-50" />

          {/* Advanced Configuration */}
          <div className="space-y-3">
            <Button
              variant="default"
              className="w-full flex items-center justify-between p-2 h-auto hover:bg-muted/50 rounded-lg group bg-primary/15"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Settings2 size={18} className="text-primary/70" />
                Advanced Configuration
              </div>
              {isAdvancedOpen ? (
                <ChevronUp size={16} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground" />
              )}
            </Button>

            {isAdvancedOpen && (
              <div className="space-y-5  animate-in fade-in slide-in-from-top-2 duration-200 px-3">
                <div className="grid grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Layers size={14} /> Category
                    </h4>
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      {product.category}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Tag size={14} /> Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.length > 0 ? (
                        product.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-secondary text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No tags added
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Discount Configuration */}
                <div className="space-y-3 bg-primary/5 p-2 rounded-lg border border-primary/20">
                  <h4 className="text-xs font-mono  tracking-wider  flex items-center gap-2">
                    <Percent size={14} /> Configure Discount
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveDiscount()
                        }
                        className="h-7 bg-secondary pl-3 pr-8 font-mono text-sm"
                        placeholder="0"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold pointer-events-none">
                        %
                      </div>
                    </div>
                    {discountInput !== (product.discount?.toString() || "") && (
                      <Button
                        size="icon"
                        className="h-6 w-6 shrink-0 shadow-lg shadow-primary/20 animate-in zoom-in duration-200"
                        onClick={handleSaveDiscount}
                      >
                        <Check size={18} strokeWidth={3} />
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium italic">
                    Value must be between 1-99. Leave empty to remove discount.
                  </p>
                </div>

                {/* Status Flags */}
                <div className="space-y-3 ">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Flag size={14} /> Status Flags
                  </h4>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border bg-card/50 transition-colors hover:bg-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${product.markNewArrival ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                          >
                            <Sparkles
                              size={16}
                              className={
                                product.markNewArrival ? "fill-emerald-600" : ""
                              }
                            />
                          </div>
                          <div className="flex flex-col">
                            <Label
                              htmlFor="new-arrival"
                              className="text-sm font-semibold cursor-pointer"
                            >
                              New Arrival
                            </Label>
                            <span className="text-[10px] text-muted-foreground">
                              Showcase in latest collection
                            </span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        id="new-arrival"
                        checked={product.markNewArrival}
                        onCheckedChange={(checked) =>
                          updateProduct({
                            id: product._id,
                            markNewArrival: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border bg-card/50 transition-colors hover:bg-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${product.markTrending ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"}`}
                          >
                            <TrendingUp size={16} />
                          </div>
                          <div className="flex flex-col">
                            <Label
                              htmlFor="trending"
                              className="text-sm font-semibold cursor-pointer"
                            >
                              Trending Item
                            </Label>
                            <span className="text-[10px] text-muted-foreground">
                              Highlight as popular choice
                            </span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        id="trending"
                        checked={product.markTrending}
                        onCheckedChange={(checked) =>
                          updateProduct({
                            id: product._id,
                            markTrending: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Variants */}
                <div className="space-y-3 pt-2 border-t border-dashed">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Product Variants
                  </h4>
                  {product.variants ? (
                    <div className="grid grid-cols-2 gap-4">
                      {product.variants.sizes && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Available Sizes
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {product.variants.sizes.map((s: string) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded text-[10px] border bg-background font-medium"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.variants.colors && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Available Colors
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {product.variants.colors.map((c: string) => (
                              <div
                                key={c}
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] border bg-background font-medium"
                              >
                                <div
                                  className="w-2 h-2 rounded-full border border-black/10"
                                  style={{ backgroundColor: c.toLowerCase() }}
                                />
                                {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground italic bg-muted/50 p-2 rounded border border-dashed flex items-center justify-center">
                      No variants selected for this product
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Gallery / Extra Images Section */}
          <div className="space-y-4 pb-10">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                Product Gallery
              </h4>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAddImage}
                accept="image/*"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 border- bg-primary text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={14} /> Add Image
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {product.images?.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg border bg-muted overflow-hidden group"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={async () => {
                        const newImages = product?.images?.filter(
                          (_: any, i: number) => i !== idx,
                        );
                        await updateProduct({
                          id: product?._id,
                          images: newImages,
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Uploading Placeholder */}
              {isGalleryUploading && (
                <div className="relative aspect-square rounded-lg border-2 border-primary/30 bg-primary/5 overflow-hidden flex items-center justify-center animate-pulse">
                  <Loader2 size={20} className="animate-spin text-primary" />
                </div>
              )}

              <div
                className="aspect-square bg-popover rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground  cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={20} strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
