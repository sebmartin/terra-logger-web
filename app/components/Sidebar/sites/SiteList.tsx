'use client';

import { useState } from "react";
import type { Site, SiteBounds } from "../../../types/site";
import { IconButton } from "../../common";
import CollapsibleSection from "../CollapsibleSection";
import SiteItem from "./SiteItem";
import NewSiteDialog from "./NewSiteDialog";
import BoundsSelector from "../../BoundsSelector/BoundsSelector";
import { useSiteStore } from "../../../stores/siteStore";

export default function SiteList() {
  const [showNewSiteDialog, setShowNewSiteDialog] = useState(false);
  const [showBoundsSelector, setShowBoundsSelector] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [pendingSiteName, setPendingSiteName] = useState("");

  const sites = useSiteStore((state) => state.sites);
  const selectedSite = useSiteStore((state) => state.selectedSite());
  const setSelectedSiteId = useSiteStore((state) => state.setSelectedSiteId);
  const loading = useSiteStore((state) => state.loading);
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

  const handleDeleteSite = async (id: string, name: string) => {
    if (confirm(`Delete site "${name}" and all its layers and features?`)) {
      try {
        await deleteSite(id);
      } catch (error) {
        console.error("Failed to delete site:", error);
        alert("Failed to delete site");
      }
    }
  };
  return (
    <>
      <CollapsibleSection
        title="Sites"
        headerActions={
          <IconButton
            onClick={() => setShowNewSiteDialog(true)}
            title="New Site"
            icon="+"
          />
        }
      >
        {loading ? (
          <div className="p-5 text-center text-gray-600">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="p-5 text-center text-gray-600">
            <p>No sites yet</p>
            <button
              onClick={() => setShowNewSiteDialog(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700"
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
      </CollapsibleSection>

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
          title={
            editingSite
              ? "Adjust Site Bounds"
              : "Position Map to Capture Site Area"
          }
        />
      )}
    </>
  );
}
