"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
type AddressType = "home" | "work" | "other";

interface AddressFormData {
  fullName: string;
  phone: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  addressType: AddressType;
  isDefault: boolean;
}

const EMPTY_FORM: AddressFormData = {
  fullName: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "",
  landmark: "",
  addressType: "home",
  isDefault: false,
};

/* ─── Address type icon ─── */
const TypeIcon = ({ type }: { type: AddressType }) => {
  if (type === "home") return <Home className="w-3.5 h-3.5" />;
  if (type === "work") return <Briefcase className="w-3.5 h-3.5" />;
  return <MoreHorizontal className="w-3.5 h-3.5" />;
};

/* ─── Main component ─── */
export const AddressSection = () => {
  const addresses = useQuery(api.addresses.list);
  const addAddress = useMutation(api.addresses.add);
  const setDefault = useMutation(api.addresses.setDefault);
  const removeAddress = useMutation(api.addresses.remove);

  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const isLoading = addresses === undefined;
  const hasAddresses = !isLoading && addresses.length > 0;
  const defaultAddr = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const visibleAddresses = showAll ? addresses : addresses?.slice(0, 2);

  /* ── Field change ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.pincode || !form.address || !form.city || !form.state) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSaving(true);
      await addAddress({
        ...form,
        landmark: form.landmark || undefined,
      });
      toast.success("Address saved!");
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  /* ── Set default ── */
  const handleSetDefault = async (id: Id<"addresses">) => {
    try {
      await setDefault({ addressId: id });
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  /* ── Remove ── */
  const handleRemove = async (id: Id<"addresses">) => {
    try {
      await removeAddress({ addressId: id });
      toast.success("Address removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  /* ── Render ── */
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-neutral-100 bg-gradient-to-r from-primary/8 to-primary/2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="text-[12px] font-bold text-primary uppercase tracking-widest">
            Deliver To
          </h3>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Address
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="p-5 flex flex-col gap-3 animate-pulse">
          <div className="h-4 bg-neutral-100 rounded w-3/4" />
          <div className="h-3 bg-neutral-100 rounded w-full" />
          <div className="h-3 bg-neutral-100 rounded w-2/3" />
        </div>
      )}

      {/* No addresses */}
      {!isLoading && !hasAddresses && !showForm && (
        <div className="p-6 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-neutral-700">No saved address</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">Add an address to continue checkout</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>
      )}

      {/* Addresses list */}
      {hasAddresses && !showForm && (
        <div className="divide-y divide-neutral-100">
          {visibleAddresses?.map((addr) => (
            <div
              key={addr._id}
              onClick={() => handleSetDefault(addr._id)}
              className={`p-4 cursor-pointer transition-colors ${
                addr.isDefault || addr._id === defaultAddr?._id
                  ? "bg-primary/5"
                  : "hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Radio indicator */}
                <div className="mt-0.5 shrink-0">
                  {addr.isDefault || addr._id === defaultAddr?._id ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                  )}
                </div>

                {/* Address info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-semibold text-neutral-800">
                      {addr.fullName}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase">
                      <TypeIcon type={addr.addressType} />
                      {addr.addressType}
                    </span>
                    {(addr.isDefault || addr._id === defaultAddr?._id) && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-500 leading-relaxed">
                    {addr.address}, {addr.locality}, {addr.city} – {addr.pincode}
                    {addr.landmark && `, Near ${addr.landmark}`}
                  </p>
                  <p className="text-[12px] text-neutral-400 mt-0.5">
                    {addr.state} · {addr.phone}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(addr._id);
                  }}
                  className="shrink-0 w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 text-neutral-400 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Show more toggle */}
          {addresses && addresses.length > 2 && (
            <button
              onClick={() => setShowAll((p) => !p)}
              className="w-full py-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {showAll ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Show {addresses.length - 2} more <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}

          {/* Add new link */}
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 flex items-center justify-center gap-2 text-[12px] font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer border-t border-dashed border-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Address
          </button>
        </div>
      )}

      {/* Add address form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[13px] font-semibold text-neutral-700">New Delivery Address</p>
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="w-7 h-7 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Row: Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter name"
                className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile"
                className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
            </div>
          </div>

          {/* Pincode + Locality */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Pincode *</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode"
                className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Locality *</label>
              <input name="locality" value={form.locality} onChange={handleChange} placeholder="Area / Colony"
                className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Address (Flat, House No, Street) *</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="House/Flat No, Building, Street"
              className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">City *</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City"
                className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">State *</label>
              <input name="state" value={form.state} onChange={handleChange} placeholder="State"
                className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
            </div>
          </div>

          {/* Landmark */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Landmark (Optional)</label>
            <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near school, temple, etc."
              className="border border-neutral-200 rounded-xl px-3 py-2 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-neutral-300" />
          </div>

          {/* Address Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Address Type</label>
            <div className="flex gap-2">
              {(["home", "work", "other"] as AddressType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, addressType: t }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold capitalize transition-all cursor-pointer ${
                    form.addressType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-neutral-200 text-neutral-500 hover:border-primary/40"
                  }`}
                >
                  <TypeIcon type={t} />
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Default checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-[12px] text-neutral-600 font-medium">Make this my default address</span>
          </label>

          {/* Actions */}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="flex-1 py-2.5 border border-neutral-200 rounded-xl text-[13px] font-semibold text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[13px] font-bold shadow-md shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              {saving ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressSection;
