"use client";

import { useState, useCallback } from "react";
import type { Feature, FeatureUpdate } from "@/app/types/feature";
import type { GeometryType } from "@/app/components/Map/MapProvider";

type MapViewMode =
  | { type: "viewing" }
  | { type: "editing"; featureId: string }
  | { type: "moving"; featureId: string }
  | { type: "drawing"; geometryType: GeometryType }
  | { type: "measuring"; geometryType: GeometryType }
  | { type: "tracking" };

interface UseFeaturePanelActionsParams {
  activeFeature: Feature | null;
  mode: MapViewMode;
  setMode: (mode: MapViewMode) => void;
  setSelectedFeatureId: (id: string | null) => void;
  updateFeature: (id: string, updates: FeatureUpdate) => Promise<Feature>;
  deleteFeature: (id: string) => Promise<void>;
}

export function useFeaturePanelActions({
  activeFeature,
  mode,
  setMode,
  setSelectedFeatureId,
  updateFeature,
  deleteFeature,
}: UseFeaturePanelActionsParams) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleToggleLock = useCallback(() => {
    if (!activeFeature) return;
    const newLocked = !activeFeature.locked;
    updateFeature(activeFeature.id, { locked: newLocked }).catch((error) =>
      console.error("Failed to toggle lock:", error)
    );
    if (mode.type === "moving" || mode.type === "editing") {
      setMode({ type: "viewing" });
      if (newLocked) setSelectedFeatureId(activeFeature.id);
    }
  }, [activeFeature, mode.type, setMode, setSelectedFeatureId, updateFeature]);

  const handleConfirmDelete = useCallback(() => {
    if (!activeFeature) return;
    setDeleteDialogOpen(false);
    setSelectedFeatureId(null);
    setMode({ type: "viewing" });
    deleteFeature(activeFeature.id).catch((error) =>
      console.error("Failed to delete feature:", error)
    );
  }, [activeFeature, setMode, setSelectedFeatureId, deleteFeature]);

  return {
    handleToggleLock,
    handleConfirmDelete,
    detailsOpen,
    setDetailsOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  };
}
