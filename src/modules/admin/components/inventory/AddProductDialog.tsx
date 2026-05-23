"use client";

import React, { useState, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { upload } from "@imagekit/next";
import { api } from "../../../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ImageUploadIcon,
  Loading03Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CATEGORIES = [
  { value: "mens", label: "Men's" },
  { value: "womens", label: "Women's" },
  { value: "anniversary-birthday", label: "Anniversary & Birthday" },
  { value: "festival-corporate", label: "Festival & Corporate" },
  { value: "frames-bouquet", label: "Frames & Bouquet" },
  { value: "custom-hampers", label: "Custom Hampers" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<CategoryValue | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [stock, setStock] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);

  const authenticator = async () => {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) throw new Error("Auth failed");
    return await response.json();
  };

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setTags([]);
    setTagInput("");
    setStock("");
    setThumbnailPreview(null);
  }, []);

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleTagKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
      if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
        setTags((prev) => prev.slice(0, -1));
      }
    },
    [handleAddTag, tagInput, tags.length],
  );

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        toast.error("Product name is required");
        return;
      }
      if (!price || Number(price) <= 0) {
        toast.error("Please enter a valid price");
        return;
      }
      if (!category) {
        toast.error("Please select a category");
        return;
      }
      if (tags.length < 2) {
        toast.error("Add at least 2 tags");
        return;
      }


      setLoading(true);
      const currentName = name.trim();
      const currentThumbnailFile = thumbnailFile;

      try {
        // 1. Create product immediately with no thumbnail
        const productId = await createProduct({
          name: currentName,
          description: description.trim(),
          price: Number(price),
          thumbnail: "", // Temporary empty thumbnail
          category: category as CategoryValue,
          tags,
          stock: Number(stock) || 0,
        });

        // 2. Success UI feedback immediately
        toast.success("Product created! Uploading thumbnail...");
        resetForm();
        setOpen(false);

        // 3. Background Upload
        if (currentThumbnailFile) {
          // We fire and forget this async operation
          (async () => {
            try {
              const authParams = await authenticator();
              const uploadResponse = await upload({
                file: currentThumbnailFile,
                fileName: `thumb_${Date.now()}`,
                folder: "/products/thumbnails",
                ...authParams,
              });
              // @ts-ignore
              const thumbnailImageUrl = uploadResponse.url;

              // Update product with actual thumbnail
              await updateProduct({
                id: productId,
                thumbnail: thumbnailImageUrl,
              });
              toast.success(`Thumbnail for "${currentName}" uploaded!`);
            } catch (error) {
              console.error("Background upload error:", error);
              toast.error(`Thumbnail upload failed for "${currentName}".`);
            }
          })();
        }
      } catch (error) {
        console.error("Product creation error:", error);
        toast.error("Failed to create product. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      name,
      description,
      price,
      category,
      tags,
      stock,
      thumbnailFile,
      createProduct,
      updateProduct,
      resetForm,
    ],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="add-product-btn" size="lg">
          <HugeiconsIcon
            icon={Add01Icon}
            size={16}
            strokeWidth={2}
            data-icon="inline-start"
          />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto bg-sidebar">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {/* Product Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="product-name">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product-name"
              placeholder="e.g. Premium Gift Hamper"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="bg-card"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              placeholder="Describe this product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="min-h-20 bg-card"
            />
          </div>

          {/* Price & Stock – side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="product-price">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
                className="bg-card px-2"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={loading}
                className="bg-card px-2"
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="grid gap-1.5">
            <Label>Thumbnail</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {thumbnailPreview ? (
              <div className="relative group w-full h-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/40 bg-muted/30 hover:bg-muted/50 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                disabled={loading}
              >
                <HugeiconsIcon
                  icon={ImageUploadIcon}
                  size={24}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                  strokeWidth={1.5}
                />
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Click to upload thumbnail
                </span>
              </button>
            )}
          </div>

          {/* Category */}
          <div className="grid gap-1.5">
            <Label htmlFor="product-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as CategoryValue)}
              disabled={loading}
            >
              <SelectTrigger id="product-category" className="w-full bg-card">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="grid gap-1.5">
            <Label>
              Tags <span className="text-muted-foreground">(min 2)</span>
            </Label>
            <div className="flex flex-wrap items-center gap-1.5 min-h-9 rounded-md border border-input bg-card px-2 py-1.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30 transition-colors">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-0.5 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5 transition-colors"
                  >
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      size={10}
                      strokeWidth={2.5}
                    />
                  </button>
                </Badge>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                className="flex-1 min-w-20 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Press Enter to add a tag. Backspace to remove the last one.
            </p>
          </div>

          <Separator className="my-2" />



          {/* Footer */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={14}
                    className="animate-spin"
                    data-icon="inline-start"
                  />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
