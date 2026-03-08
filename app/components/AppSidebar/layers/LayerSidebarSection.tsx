"use client";

import { Layers, Plus, Upload } from "lucide-react";
import { useState } from "react";
import ResizableSection from "../common/ResizableSection";
import LayerList from "./LayerList";
import { useSiteStore } from "@/app/stores/siteStore";
import { useLayerStore } from "@/app/stores/layerStore";
import { PanelProps } from "react-resizable-panels";

export default function LayerSidebarSection({ ...props }: PanelProps) {
  const [showNewLayerDialog, setShowNewLayerDialog] = useState(false);
  const selectedSiteId = useSiteStore((state) => state.selectedSiteId);
  const setSelectedLayer = useLayerStore((state) => state.setSelectedLayerId);

  const handleAddLayer = () => {
    setShowNewLayerDialog(true);
  }

  const handleUploadFeatures = () => {
    // TODO: implement upload GeoJSON
  }

  return (
    <ResizableSection
      header={
        <>
          <Layers size={14} /> <span>Layers</span>
        </>
      }
      icons={selectedSiteId ? [
        { icon: Upload, onClick: handleUploadFeatures, tooltip: "Upload Feature(s)" },
        { icon: Plus, onClick: handleAddLayer, tooltip: "Add a new Layer" },
      ] : []}
      onClick={() => {
        setSelectedLayer(null);
      }}
      {...props}
    >
      <LayerList showDialog={showNewLayerDialog} setShowDialog={setShowNewLayerDialog} />
    </ResizableSection>
  );
}
