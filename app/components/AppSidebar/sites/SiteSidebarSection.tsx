"use client";

import { MapPinned, Plus } from "lucide-react";
import ResizableSection from "../common/ResizableSection";
import SiteList from "./SiteList";
import NewSiteDialog from "./NewSiteDialog";
import BoundsSelector from "@/app/components/BoundsSelector/BoundsSelector";
import { useSidebar } from "@/components/ui/sidebar";
import { useSiteStore } from "@/app/stores/siteStore";
import { useState } from "react";
import type { SiteBounds } from "@/app/types/site";
import { PanelProps } from "react-resizable-panels";

type AddSiteStage =
  | null
  | { stage: "capturing_bounds" }
  | { stage: "naming"; bounds: SiteBounds };

export default function SiteSidebarSection({ ...props }: PanelProps) {
  const { setOpen: setSidebarOpen } = useSidebar();
  const createSite = useSiteStore((state) => state.createSite);
  const setSelectedSiteId = useSiteStore((state) => state.setSelectedSiteId);
  const [addSiteStage, setAddSiteStage] = useState<AddSiteStage>(null);

  const handleStartAddSite = () => {
    setSidebarOpen(false);
    setAddSiteStage({ stage: "capturing_bounds" });
  };

  const handleBoundsCapture = (bounds: SiteBounds) => {
    setAddSiteStage({ stage: "naming", bounds });
  };

  const handleCancel = () => {
    setAddSiteStage(null);
    setSidebarOpen(true);
  };

  const handleSave = async (name: string) => {
    if (addSiteStage?.stage !== "naming") return;
    const site = await createSite({ name, bounds: addSiteStage.bounds });
    setSelectedSiteId(site.id);
    setAddSiteStage(null);
    setSidebarOpen(true);
  };

  return (
    <>
      <ResizableSection
        header={
          <>
            <MapPinned size={14} /> <span>Sites</span>
          </>
        }
        icons={[
          {
            icon: Plus,
            onClick: handleStartAddSite,
            tooltip: "Add a new Site",
            testId: "sidebar-add-site",
          },
        ]}
        {...props}
      >
        <SiteList onAddSite={handleStartAddSite} />
      </ResizableSection>

      {addSiteStage?.stage === "capturing_bounds" && (
        <BoundsSelector
          onCapture={handleBoundsCapture}
          onCancel={handleCancel}
        />
      )}

      {addSiteStage?.stage === "naming" && (
        <NewSiteDialog
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
