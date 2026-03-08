"use client";

import { useState } from "react";
import { MapPin, Minus, Pentagon, Square, Circle, LockKeyhole, LockKeyholeOpen, Trash2, Ruler, Move } from "lucide-react";
import { useMapContext } from "@/app/components/Map/MapProvider";
import type { GeometryType } from "@/app/components/Map/MapProvider";
import { useLayerStore } from "@/app/stores/layerStore";
import { useFeatureStore } from "@/app/stores/featureStore";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/ui";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { FeatureSheet } from "@/app/components/FeatureSheet/FeatureSheet";

const DRAW_TOOLS: { geometryType: GeometryType; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { geometryType: "point", label: "Marker", Icon: MapPin },
  { geometryType: "linestring", label: "Polyline", Icon: Minus },
  { geometryType: "polygon", label: "Polygon", Icon: Pentagon },
  { geometryType: "rectangle", label: "Rectangle", Icon: Square },
  { geometryType: "circle", label: "Circle", Icon: Circle },
];

const INSTRUCTIONS: Record<GeometryType, string> = {
  point: "Click on the map to place a marker",
  linestring: "Click to add points · Double-click to finish",
  polygon: "Click to add points · Double-click to finish",
  rectangle: "Click and drag to draw a rectangle",
  circle: "Click and drag to draw a circle",
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono bg-slate-100 border border-slate-300 rounded px-1">
      {children}
    </kbd>
  );
}

export function MapContextPanel() {
  const { mode, setMode } = useMapContext();
  const selectedLayer = useLayerStore((s) => s.selectedLayer());
  const selectedFeature = useFeatureStore((s) => s.selectedFeature());
  const features = useFeatureStore((s) => s.features);
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);
  const updateFeature = useFeatureStore((s) => s.updateFeature);
  const deleteFeature = useFeatureStore((s) => s.deleteFeature);

  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const editingFeature =
    mode.type === "editing" || mode.type === "moving"
      ? features.find((f) => f.id === mode.featureId)
      : null;

  // The feature relevant to action buttons in any active panel.
  const activeFeature = editingFeature ?? selectedFeature;

  // Hide when viewing with no layer context
  if (mode.type === "viewing" && !selectedLayer) return null;

  const handleToggleLock = () => {
    if (!activeFeature) return;
    const newLocked = !activeFeature.locked;
    updateFeature(activeFeature.id, { locked: newLocked }).catch(
      (error) => console.error("Failed to toggle lock:", error)
    );
    // Locking while in move/edit exits the mode and shows the locked feature info.
    if (mode.type === "moving" || mode.type === "editing") {
      setMode({ type: "viewing" });
      if (newLocked) setSelectedFeatureId(activeFeature.id);
    }
  };

  const handleConfirmDelete = () => {
    if (!activeFeature) return;
    setShowDeleteDialog(false);
    setSelectedFeatureId(null);
    setMode({ type: "viewing" });
    deleteFeature(activeFeature.id).catch(
      (error) => console.error("Failed to delete feature:", error)
    );
  };

  const activeTool =
    mode.type === "drawing"
      ? DRAW_TOOLS.find((t) => t.geometryType === mode.geometryType)
      : null;

  const getMeasurement = (feature: typeof activeFeature | undefined) => {
    if (!feature) return "";
    if (feature.properties?.distance) return `${feature.properties.distance.km.toFixed(2)} km`;
    if (feature.properties?.area) return `${feature.properties.area.acres.toFixed(2)} acres`;
    return "";
  };

  let content: React.ReactNode;

  if (mode.type === "editing") {
    content = (
      <>
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 w-64">
          <div className="flex items-center gap-2 mb-2">
            {editingFeature && <FeatureIcon name={editingFeature.type} />}
            <span className="font-medium text-sm truncate">
              {editingFeature?.name ?? "Unnamed Feature"}
            </span>
          </div>
          {getMeasurement(editingFeature) && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 bg-slate-200/50 rounded-md">
              <Ruler size={12} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-500">{getMeasurement(editingFeature)}</span>
            </div>
          )}
          <p className="text-xs text-slate-500 mb-1.5">
            Hold <Kbd>R</Kbd>{" + drag to rotate · "}<Kbd>S</Kbd>{" + drag to scale"}
          </p>
          <div className="flex gap-1.5 mb-1.5">
            <Button size="sm" variant="outline" onClick={handleToggleLock}>
              {editingFeature?.locked ? (
                <><LockKeyholeOpen size={14} /> Unlock</>
              ) : (
                <><LockKeyhole size={14} /> Lock</>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
              Details →
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 size={14} />
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start gap-1.5"
            onClick={() => setMode({ type: "moving", featureId: mode.featureId })}
          >
            <Move size={14} /> Back to move
          </Button>
          <p className="text-xs text-slate-400 mt-0.5">
            Click away or <Kbd>Esc</Kbd>{" to exit"}
          </p>
        </div>
        <DeleteDialog
          open={showDeleteDialog}
          title={`Delete "${activeFeature?.name ?? "Unnamed Feature"}"?`}
          description="This action cannot be undone."
          onCancel={() => setShowDeleteDialog(false)}
          onDelete={handleConfirmDelete}
        />
        <FeatureSheet open={showDetails} onOpenChange={setShowDetails} />
      </>
    );
  } else if (mode.type === "moving") {
    content = (
      <>
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 w-64">
          <div className="flex items-center gap-2 mb-2">
            {editingFeature && <FeatureIcon name={editingFeature.type} />}
            <span className="font-medium text-sm truncate">
              {editingFeature?.name ?? "Unnamed Feature"}
            </span>
          </div>
          {getMeasurement(editingFeature) && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 bg-slate-200/50 rounded-md">
              <Ruler size={12} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-500">{getMeasurement(editingFeature)}</span>
            </div>
          )}
          <p className="text-xs text-slate-500 mb-1.5">
            Drag to move · Hold <Kbd>R</Kbd>{" to rotate · "}<Kbd>S</Kbd>{" to scale"}
          </p>
          <div className="flex gap-1.5 mb-1.5">
            <Button size="sm" variant="outline" onClick={handleToggleLock}>
              {editingFeature?.locked ? (
                <><LockKeyholeOpen size={14} /> Unlock</>
              ) : (
                <><LockKeyhole size={14} /> Lock</>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
              Details →
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 size={14} />
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setMode({ type: "editing", featureId: mode.featureId })}
          >
            Edit vertices
          </Button>
          <p className="text-xs text-slate-400 mt-0.5">
            Double-click or <Kbd>Esc</Kbd>{" to exit"}
          </p>
        </div>
        <DeleteDialog
          open={showDeleteDialog}
          title={`Delete "${activeFeature?.name ?? "Unnamed Feature"}"?`}
          description="This action cannot be undone."
          onCancel={() => setShowDeleteDialog(false)}
          onDelete={handleConfirmDelete}
        />
        <FeatureSheet open={showDetails} onOpenChange={setShowDetails} />
      </>
    );
  } else if (mode.type === "drawing") {
    const Icon = activeTool?.Icon ?? Circle;
    content = (
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 w-64">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={14} className="text-slate-600" />
          <span className="font-medium text-sm">{activeTool?.label ?? "Drawing"}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {INSTRUCTIONS[mode.geometryType]}
          {" · Esc to cancel"}
        </p>
        <Button
          size="sm"
          variant="ghost"
          className="mt-2 w-full"
          onClick={() => setMode({ type: "viewing" })}
        >
          Cancel
        </Button>
      </div>
    );
  } else if (selectedFeature) {
    const measurement = getMeasurement(selectedFeature);
    content = (
      <>
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-3 w-64">
          <div className="flex items-center gap-2 mb-2">
            <FeatureIcon name={selectedFeature.type} />
            <span className="font-medium text-sm truncate">
              {selectedFeature.name ?? "Unnamed Feature"}
            </span>
          </div>
          {measurement && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 bg-slate-200/50 rounded-md">
              <Ruler size={12} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-500">{measurement}</span>
            </div>
          )}
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" onClick={handleToggleLock}>
              {selectedFeature.locked ? (
                <><LockKeyholeOpen size={14} /> Unlock</>
              ) : (
                <><LockKeyhole size={14} /> Lock</>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowDetails(true)}>
              Details →
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        <DeleteDialog
          open={showDeleteDialog}
          title={`Delete "${selectedFeature.name ?? "Unnamed Feature"}"?`}
          description="This action cannot be undone."
          onCancel={() => setShowDeleteDialog(false)}
          onDelete={handleConfirmDelete}
        />
        <FeatureSheet open={showDetails} onOpenChange={setShowDetails} />
      </>
    );
  } else {
    // Draw tools — layer selected, viewing, no feature selected
    content = (
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-3 py-2 flex items-center gap-1">
        {DRAW_TOOLS.map(({ geometryType, label, Icon }) => (
          <Button
            key={geometryType}
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setSelectedFeatureId(null);
              setMode({ type: "drawing", geometryType });
            }}
          >
            <Icon size={14} />
            {label}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-[1050] pointer-events-auto">
      {content}
    </div>
  );
}
