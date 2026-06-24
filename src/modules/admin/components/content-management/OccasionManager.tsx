"use client";

import { useMutation, useQuery } from "convex/react";
import { Plus, Minus, CalendarHeart, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../../../convex/_generated/api";

const SECTION_PRESETS = [
  { label: "Father's Day", slug: "fathers-day" },
  { label: "Birthday", slug: "birthday" },
  { label: "Anniversary", slug: "anniversary" },
  { label: "Valentine's", slug: "valentines" },
  { label: "Baby Shower", slug: "baby-shower" },
  { label: "Graduation", slug: "graduation" },
  { label: "Wedding", slug: "wedding" },
  { label: "Diwali", slug: "diwali" },
  { label: "Holi", slug: "holi" },
  { label: "Christmas", slug: "christmas" },
];

const DEFAULT_TABS = [
  { label: "Father's Day", slug: "fathers-day", icon: "" },
  { label: "Birthday", slug: "birthday", icon: "" },
  { label: "Anniversary", slug: "anniversary", icon: "" },
  { label: "Valentine's", slug: "valentines", icon: "" },
  { label: "Baby Shower", slug: "baby-shower", icon: "" },
  { label: "Graduation", slug: "graduation", icon: "" },
];

const DEFAULT_NAVBAR_LINKS: { heading: string; label: string; link?: string }[] = [
  { heading: "Milestones", label: "Birthday" },
  { heading: "Milestones", label: "Anniversary" },
  { heading: "Milestones", label: "Wedding" },
  { heading: "Milestones", label: "Engagement" },
  { heading: "Love & Family", label: "Valentine's Day" },
  { heading: "Love & Family", label: "Mother's Day" },
  { heading: "Love & Family", label: "Father's Day" },
  { heading: "Love & Family", label: "Baby Shower & Newborn" },
  { heading: "Festive & Events", label: "Raksha Bandhan" },
  { heading: "Festive & Events", label: "Graduation & Achievement" },
  { heading: "Festive & Events", label: "Festivals & Celebrations" },
];

export function OccasionManager() {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState("0");

  // Inline forms state for each navbar category column
  const [milestonesName, setMilestonesName] = useState("");
  const [milestonesLink, setMilestonesLink] = useState("");

  const [loveName, setLoveName] = useState("");
  const [loveLink, setLoveLink] = useState("");

  const [festiveName, setFestiveName] = useState("");
  const [festiveLink, setFestiveLink] = useState("");

  const occasions = useQuery(api.occasions.getOccasions);
  const createOccasion = useMutation(api.occasions.createOccasion);
  const deleteOccasion = useMutation(api.occasions.deleteOccasion);

  const navbarOccasions = useQuery(api.occasions.getNavbarOccasions);
  const createNavbarOccasion = useMutation(api.occasions.createNavbarOccasion);
  const deleteNavbarOccasion = useMutation(api.occasions.deleteNavbarOccasion);

  // Active items mapping (loading fallback or defaults if empty DB)
  const activeTabs = occasions && occasions.length > 0
    ? occasions
    : DEFAULT_TABS.map(t => ({ ...t, _id: undefined }));

  const activeNavbarLinks = navbarOccasions && navbarOccasions.length > 0
    ? navbarOccasions
    : DEFAULT_NAVBAR_LINKS.map(l => ({ ...l, _id: undefined }));

  // Add homepage section tab
  const handleAddSectionTab = async () => {
    const preset = SECTION_PRESETS[parseInt(selectedPresetIdx, 10)];
    if (!preset) return;

    if (activeTabs.some(t => t.slug === preset.slug)) {
      toast.error(`"${preset.label}" is already added.`);
      return;
    }

    const promise = async () => {
      // If DB is currently empty, seed other defaults first
      if (!occasions || occasions.length === 0) {
        for (const item of DEFAULT_TABS) {
          await createOccasion({
            label: item.label,
            slug: item.slug,
            icon: item.icon,
          });
        }
      }
      // Add new tab
      await createOccasion({
        label: preset.label,
        slug: preset.slug,
        icon: "",
      });
    };

    toast.promise(promise(), {
      loading: `Adding "${preset.label}" tab...`,
      success: `"${preset.label}" tab added!`,
      error: "Failed to add tab.",
    });
  };

  // Delete homepage section tab
  const handleDeleteTab = async (occItem: any) => {
    const promise = async () => {
      if (occItem._id) {
        await deleteOccasion({ id: occItem._id });
      } else {
        // DB empty, seed defaults except deleted one
        const remaining = DEFAULT_TABS.filter(t => t.slug !== occItem.slug);
        for (const item of remaining) {
          await createOccasion({
            label: item.label,
            slug: item.slug,
            icon: item.icon,
          });
        }
      }
    };

    toast.promise(promise(), {
      loading: `Removing "${occItem.label}"...`,
      success: `"${occItem.label}" removed!`,
      error: "Failed to remove.",
    });
  };

  // Add navbar link
  const handleAddNavbarLink = async (heading: string, label: string, linkOverride: string, clearInputs: () => void) => {
    if (!label.trim()) {
      toast.error("Label name is required.");
      return;
    }

    const promise = async () => {
      // If DB is currently empty, seed defaults first
      if (!navbarOccasions || navbarOccasions.length === 0) {
        for (const item of DEFAULT_NAVBAR_LINKS) {
          await createNavbarOccasion({
            heading: item.heading,
            label: item.label,
          });
        }
      }
      // Add the new one
      await createNavbarOccasion({
        heading,
        label: label.trim(),
        link: linkOverride.trim() || undefined,
      });
      clearInputs();
    };

    toast.promise(promise(), {
      loading: `Adding link to ${heading}...`,
      success: "Navbar link added!",
      error: "Failed to add link.",
    });
  };

  // Delete navbar link
  const handleDeleteNavbarLink = async (targetItem: any) => {
    const promise = async () => {
      if (targetItem._id) {
        await deleteNavbarOccasion({ id: targetItem._id });
      } else {
        // DB empty, seed defaults except deleted one
        const remaining = DEFAULT_NAVBAR_LINKS.filter(
          l => !(l.heading === targetItem.heading && l.label === targetItem.label)
        );
        for (const item of remaining) {
          await createNavbarOccasion({
            heading: item.heading,
            label: item.label,
          });
        }
      }
    };

    toast.promise(promise(), {
      loading: `Removing "${targetItem.label}"...`,
      success: `"${targetItem.label}" removed!`,
      error: "Failed to remove.",
    });
  };

  return (
    <div className="space-y-10">
      {/* ─── HOMEPAGE TABS MANAGER ─── */}
      <div className="border border-border rounded-xl p-6 bg-white space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CalendarHeart className="h-5 w-5 text-primary" />
            Shop by Occasion (Homepage Tabs)
          </h2>

          {/* Simple Dropdown + Add button */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPresetIdx}
              onChange={(e) => setSelectedPresetIdx(e.target.value)}
              className="flex h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SECTION_PRESETS.map((p, idx) => (
                <option key={idx} value={idx}>{p.label}</option>
              ))}
            </select>
            <Button onClick={handleAddSectionTab} size="sm" className="gap-1.5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        {/* Current Active Tabs List (shows default tabs if DB is empty) */}
        {occasions === undefined ? (
          <div className="h-16 bg-muted animate-pulse rounded-lg" />
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {activeTabs.map((occ, idx) => (
              <div
                key={occ._id || idx}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-4 pr-1 py-1.5 rounded-full text-sm font-medium hover:bg-slate-100/70 transition-all"
              >
                <span className="text-slate-800">{occ.label}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10 rounded-full cursor-pointer flex items-center justify-center"
                  onClick={() => handleDeleteTab(occ)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── NAVBAR DROPDOWN LINKS MANAGER ─── */}
      <div className="border border-border rounded-xl p-6 bg-white space-y-6 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-4">
          <Menu className="h-5 w-5 text-primary" />
          Shop by Occasion (Navbar Mega Menu)
        </h2>

        {/* Grouped Columns List (shows default links if DB is empty) */}
        {navbarOccasions === undefined ? (
          <div className="h-16 bg-muted animate-pulse rounded-lg" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Milestones */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">Milestones</h3>
                <div className="space-y-2">
                  {activeNavbarLinks
                    .filter((occ) => occ.heading === "Milestones")
                    .map((item, idx) => (
                      <div key={item._id || idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/50 hover:shadow-xs transition-all text-xs font-medium">
                        <div className="min-w-0 pr-2">
                          <p className="text-slate-800 truncate">{item.label}</p>
                          <p className="text-[9px] text-muted-foreground truncate font-mono">{item.link || `/products?tag=${item.label}`}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10 rounded-full flex-none cursor-pointer flex items-center justify-center"
                          onClick={() => handleDeleteNavbarLink(item)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Add form at card bottom */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Link Name</Label>
                  <Input
                    placeholder="e.g. Engagement"
                    value={milestonesName}
                    onChange={(e) => setMilestonesName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Custom Link (optional)</Label>
                  <Input
                    placeholder="e.g. /products?tag=Engagement"
                    value={milestonesLink}
                    onChange={(e) => setMilestonesLink(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <Button
                  onClick={() => handleAddNavbarLink("Milestones", milestonesName, milestonesLink, () => {
                    setMilestonesName("");
                    setMilestonesLink("");
                  })}
                  size="sm"
                  className="w-full h-8 text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-3 w-3" /> Add Link
                </Button>
              </div>
            </div>

            {/* 2. Love & Family */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">Love & Family</h3>
                <div className="space-y-2">
                  {activeNavbarLinks
                    .filter((occ) => occ.heading === "Love & Family")
                    .map((item, idx) => (
                      <div key={item._id || idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/50 hover:shadow-xs transition-all text-xs font-medium">
                        <div className="min-w-0 pr-2">
                          <p className="text-slate-800 truncate">{item.label}</p>
                          <p className="text-[9px] text-muted-foreground truncate font-mono">{item.link || `/products?tag=${item.label}`}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10 rounded-full flex-none cursor-pointer flex items-center justify-center"
                          onClick={() => handleDeleteNavbarLink(item)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Add form at card bottom */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Link Name</Label>
                  <Input
                    placeholder="e.g. Daughter's Day"
                    value={loveName}
                    onChange={(e) => setLoveName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Custom Link (optional)</Label>
                  <Input
                    placeholder="e.g. /products?tag=Daughter's%20Day"
                    value={loveLink}
                    onChange={(e) => setLoveLink(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <Button
                  onClick={() => handleAddNavbarLink("Love & Family", loveName, loveLink, () => {
                    setLoveName("");
                    setLoveLink("");
                  })}
                  size="sm"
                  className="w-full h-8 text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-3 w-3" /> Add Link
                </Button>
              </div>
            </div>

            {/* 3. Festive & Events */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">Festive & Events</h3>
                <div className="space-y-2">
                  {activeNavbarLinks
                    .filter((occ) => occ.heading === "Festive & Events")
                    .map((item, idx) => (
                      <div key={item._id || idx} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/50 hover:shadow-xs transition-all text-xs font-medium">
                        <div className="min-w-0 pr-2">
                          <p className="text-slate-800 truncate">{item.label}</p>
                          <p className="text-[9px] text-muted-foreground truncate font-mono">{item.link || `/products?tag=${item.label}`}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10 rounded-full flex-none cursor-pointer flex items-center justify-center"
                          onClick={() => handleDeleteNavbarLink(item)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Add form at card bottom */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Link Name</Label>
                  <Input
                    placeholder="e.g. Diwali"
                    value={festiveName}
                    onChange={(e) => setFestiveName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Custom Link (optional)</Label>
                  <Input
                    placeholder="e.g. /products?tag=Diwali"
                    value={festiveLink}
                    onChange={(e) => setFestiveLink(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <Button
                  onClick={() => handleAddNavbarLink("Festive & Events", festiveName, festiveLink, () => {
                    setFestiveName("");
                    setFestiveLink("");
                  })}
                  size="sm"
                  className="w-full h-8 text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-3 w-3" /> Add Link
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
