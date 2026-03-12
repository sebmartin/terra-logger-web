"use client";

import { Move, Spline } from "lucide-react";
import type { GeometryType, MapViewMode } from "@/app/components/Map/MapProvider";
import type { Feature } from "@/app/types/feature";
import { VERTEX_EDITABLE_TYPES } from "./constants";
import { DrawToolsContent } from "./DrawToolsContent";
import { DrawingContent } from "./DrawingContent";
import { FeatureCardContent } from "./FeatureCardContent";
import { ToolbarIconButton } from "@/components/ui/toolbar-icon-button";

interface MapContextPanelContentProps {
  mode: MapViewMode;
  editingFeature: Feature | null;
  selectedFeature: Feature | null;
  setMode: (mode: MapViewMode) => void;
  setSelectedFeatureId: (id: string | null) => void;
  onSelectTool: (geometryType: GeometryType) => void;
  onLock: () => void;
  onDetails: () => void;
  onDelete: () => void;
}

export function MapContextPanelContent({
  mode,
  editingFeature,
  selectedFeature,
  setMode,
  setSelectedFeatureId,
  onSelectTool,
  onLock,
  onDetails,
  onDelete,
}: MapContextPanelContentProps) {
  const featureActions = { onLock, onDetails, onDelete };

  if (mode.type === "moving" && editingFeature) {
    const canEditVertices = VERTEX_EDITABLE_TYPES.includes(editingFeature.type);
    return (
      <FeatureCardContent
        feature={editingFeature}
        hint="Drag to move · R to rotate · S to scale"
        modeButton={
          canEditVertices ? (
            <ToolbarIconButton
              icon={Spline}
              label="Edit vertices"
              onClick={() => setMode({ type: "editing", featureId: mode.featureId })}
            />
          ) : undefined
        }
        {...featureActions}
      />
    );
  }

  if (mode.type === "editing" && editingFeature) {
    return (
      <FeatureCardContent
        feature={editingFeature}
        hint="Drag vertices · R to rotate · S to scale"
        modeButton={
          <ToolbarIconButton
            icon={Move}
            label="Move"
            onClick={() => setMode({ type: "moving", featureId: mode.featureId })}
          />
        }
        {...featureActions}
      />
    );
  }

  if (mode.type === "drawing") {
    return (
      <DrawingContent
        geometryType={mode.geometryType}
        onCancel={() => setMode({ type: "viewing" })}
      />
    );
  }

  if (selectedFeature) {
    return (
      <FeatureCardContent
        feature={selectedFeature}
        hint="Locked · Click elsewhere to dismiss"
        {...featureActions}
      />
    );
  }

  return (
    <DrawToolsContent
      onSelectTool={(geometryType) => {
        setSelectedFeatureId(null);
        onSelectTool(geometryType);
      }}
    />
  );
}
