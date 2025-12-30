import { useState } from "react";
import type { Site, SiteBounds } from "../../../types/site";
import { IconButton } from "../../common";
import CollapsibleSection from "../CollapsibleSection";
import SiteItem from "./SiteItem";
import NewSiteDialog from "./NewSiteDialog";
import BoundsSelector from "../../BoundsSelector/BoundsSelector";

interface SiteListProps {
  sites: Site[];
  currentSite: Site | null;
  loading: boolean;
  onSelectSite: (site: Site) => void;
  onCreateSite: (data: {
    name: string;
    description: string;
    bounds: SiteBounds;
  }) => Promise<Site>;
  onUpdateSite: (id: string, data: { bounds: SiteBounds }) => Promise<Site>;
  onDeleteSite: (id: string) => Promise<void>;
}

export default function SiteList({
  sites,
  currentSite,
  loading,
  onSelectSite,
  onCreateSite,
  onUpdateSite,
  onDeleteSite,
}: SiteListProps) {
  const [showNewSiteDialog, setShowNewSiteDialog] = useState(false);
  const [showBoundsSelector, setShowBoundsSelector] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [pendingSiteName, setPendingSiteName] = useState("");

  const handleStartCreateSite = (siteName: string) => {
    setPendingSiteName(siteName);
    setShowNewSiteDialog(false);
    setShowBoundsSelector(true);
  };

  const handleCaptureBounds = async (bounds: SiteBounds) => {
    if (editingSite) {
      try {
        await onUpdateSite(editingSite.id, { bounds });
        setShowBoundsSelector(false);
        setEditingSite(null);
      } catch (error) {
        console.error("Failed to update site bounds:", error);
        alert("Failed to update site bounds");
      }
    } else {
      try {
        const site = await onCreateSite({
          name: pendingSiteName,
          description: "",
          bounds,
        });
        onSelectSite(site);
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
        await onDeleteSite(id);
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
                isActive={currentSite?.id === site.id}
                onSelect={onSelectSite}
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
