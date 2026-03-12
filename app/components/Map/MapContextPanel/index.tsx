"use client";

import { useMapContext } from "@/app/components/Map/MapProvider";
import type { GeometryType } from "@/app/components/Map/MapProvider";
import { useLayerStore } from "@/app/stores/layerStore";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useFeaturePanelActions } from "@/app/hooks/useFeaturePanelActions";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { FeatureSheet } from "@/app/components/FeatureSheet/FeatureSheet";
import { PANEL_CLASS, getContentKey } from "./constants";
import { MapContextPanelContent } from "./MapContextPanelContent";

export function MapContextPanel() {
  const { mode, setMode } = useMapContext();
  const selectedLayer = useLayerStore((s) => s.selectedLayer());
  const selectedFeature = useFeatureStore((s) => s.selectedFeature());
  const features = useFeatureStore((s) => s.features);
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);
  const updateFeature = useFeatureStore((s) => s.updateFeature);
  const deleteFeature = useFeatureStore((s) => s.deleteFeature);

  const editingFeature =
    mode.type === "editing" || mode.type === "moving"
      ? features.find((f) => f.id === mode.featureId) ?? null
      : null;
  const activeFeature = editingFeature ?? selectedFeature;

  const {
    handleToggleLock,
    handleConfirmDelete,
    detailsOpen,
    setDetailsOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
  } = useFeaturePanelActions({
    activeFeature,
    mode,
    setMode,
    setSelectedFeatureId,
    updateFeature,
    deleteFeature,
  });

  if (mode.type === "viewing" && !selectedLayer) return null;

  const contentKey = getContentKey(mode, selectedFeature);

  const handleSelectTool = (geometryType: GeometryType) => {
    setSelectedFeatureId(null);
    setMode({ type: "drawing", geometryType });
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:top-4 md:right-4 z-[1050] pointer-events-auto">
      <div className={PANEL_CLASS}>
        <TooltipProvider delayDuration={400}>
          <div key={contentKey} className="animate-in fade-in-0 duration-200">
            <MapContextPanelContent
              mode={mode}
              editingFeature={editingFeature}
              selectedFeature={selectedFeature}
              setMode={setMode}
              setSelectedFeatureId={setSelectedFeatureId}
              onSelectTool={handleSelectTool}
              onLock={handleToggleLock}
              onDetails={() => setDetailsOpen(true)}
              onDelete={() => setDeleteDialogOpen(true)}
            />
          </div>
        </TooltipProvider>
      </div>
      {activeFeature && (
        <>
          <DeleteDialog
            open={deleteDialogOpen}
            title={`Delete "${activeFeature.name ?? "Unnamed Feature"}"?`}
            description="This action cannot be undone."
            onCancel={() => setDeleteDialogOpen(false)}
            onDelete={handleConfirmDelete}
          />
          <FeatureSheet open={detailsOpen} onOpenChange={setDetailsOpen} />
        </>
      )}
    </div>
  );
}
