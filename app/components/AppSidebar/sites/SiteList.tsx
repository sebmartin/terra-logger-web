"use client";

import { useState } from "react";
import type { Site, SiteBounds } from "@/app/types/site";
import { useSiteStore } from "@/app/stores/siteStore";
import { Map } from "lucide-react";
import SiteItem from "./SiteItem";
import NewSiteDialog from "./NewSiteDialog";
import BoundsSelector from "@/app/components/BoundsSelector/BoundsSelector";

export default function SiteList() {
  const [showNewSiteDialog, setShowNewSiteDialog] = useState(false);
  const [showBoundsSelector, setShowBoundsSelector] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [pendingSiteName, setPendingSiteName] = useState("");

  const sites = useSiteStore((state) => state.sites);
  const selectedSite = useSiteStore((state) => state.selectedSite());
  const setSelectedSiteId = useSiteStore((state) => state.setSelectedSiteId);
  const loading = useSiteStore((state) => state.loading);
  const initialized = useSiteStore((state) => state.initialized);
  const createSite = useSiteStore((state) => state.createSite);
  const updateSite = useSiteStore((state) => state.updateSite);
  const deleteSite = useSiteStore((state) => state.deleteSite);

  const handleStartCreateSite = (siteName: string) => {
    setPendingSiteName(siteName);
    setShowNewSiteDialog(false);
    setShowBoundsSelector(true);
  };

  const handleCaptureBounds = async (bounds: SiteBounds) => {
    if (editingSite) {
      try {
        await updateSite(editingSite.id, { bounds });
        setShowBoundsSelector(false);
        setEditingSite(null);
      } catch (error) {
        console.error("Failed to update site bounds:", error);
        alert("Failed to update site bounds");
      }
    } else {
      try {
        const site = await createSite({
          name: pendingSiteName,
          description: "",
          bounds,
        });
        setSelectedSiteId(site.id);
        setPendingSiteName("");
        setShowBoundsSelector(false);
      } catch (error) {
        console.error("Failed to create site:", error);
        alert("Failed to create site");
      }
    }
  };

  const handleCancelBounds = () => {
    setShowBoundsSelector(false);
    setEditingSite(null);
    if (!editingSite) {
      setShowNewSiteDialog(true);
    }
  };

  const handleEditSiteBounds = (site: Site) => {
    setEditingSite(site);
    setShowBoundsSelector(true);
  };

  const handleDeleteSite = async (id: string) => {
    try {
      await deleteSite(id);
    } catch (error) {
      console.error("Failed to delete site:", error);
      alert("Failed to delete site");
    }
  };
  return (
    <>
      {!initialized || loading ? (
        <div className="px-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading sites...</span>
          </div>
        </div>
      ) : sites.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <div className="mb-3 flex justify-center">
            <Map size={40} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-600 mb-3 font-medium">No sites yet</p>
          <button
            onClick={() => setShowNewSiteDialog(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Create Your First Site
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {sites.map((site) => (
            <SiteItem
              key={site.id}
              site={site}
              isActive={selectedSite?.id === site.id}
              onSelect={(site) => setSelectedSiteId(site.id)}
              onEditBounds={handleEditSiteBounds}
              onDelete={handleDeleteSite}
            />
          ))}
        </div>
      )}

      {showNewSiteDialog && (
        <NewSiteDialog
          onNext={handleStartCreateSite}
          onCancel={() => setShowNewSiteDialog(false)}
        />
      )}

      {showBoundsSelector && (
        <BoundsSelector
          initialBounds={editingSite?.bounds}
          onCapture={handleCaptureBounds}
          onCancel={handleCancelBounds}
          title={editingSite ? "Adjust Site Bounds" : "Position Map to Capture Site Area"}
        />
      )}
    </>
  );
}
