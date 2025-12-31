import { useState } from "react";
import type { Site, SiteBounds } from "../../../types/site";
import { IconButton } from "../../common";
import CollapsibleSection from "../CollapsibleSection";
import SiteItem from "./SiteItem";
import NewSiteDialog from "./NewSiteDialog";
import BoundsSelector from "../../BoundsSelector/BoundsSelector";
import { useSiteContext } from "@/context/SiteContext";

export default function SiteList() {
  const [showNewSiteDialog, setShowNewSiteDialog] = useState(false);
  const [showBoundsSelector, setShowBoundsSelector] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [pendingSiteName, setPendingSiteName] = useState("");

  const {
    sites,
    selectedSite,
    setSelectedSite,
    loading,
    createSite,
    updateSite,
    deleteSite,
  } = useSiteContext();

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
        setSelectedSite(site);
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
          <div className="loading">Loading sites...</div>
        ) : sites.length === 0 ? (
          <div className="empty-state">
            <p>No sites yet</p>
            <button onClick={() => setShowNewSiteDialog(true)}>
              Create Your First Site
            </button>
          </div>
        ) : (
          <div className="site-list">
            {sites.map((site) => (
              <SiteItem
                key={site.id}
                site={site}
                isActive={selectedSite?.id === site.id}
                onSelect={setSelectedSite}
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
