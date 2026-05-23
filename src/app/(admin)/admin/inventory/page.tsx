"use client";

import React from "react";
import { ProductTable } from "@/modules/admin/components/inventory/ProductTable";
import { AddProductDialog } from "@/modules/admin/components/inventory/AddProductDialog";

const InventoryPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Inventory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your product catalog and stock levels
          </p>
        </div>
        <AddProductDialog />
      </div>

      {/* Product Table */}
      <ProductTable />
    </div>
  );
};

export default InventoryPage;
