import { useMapContext } from "@/app/components/Map/MapProvider";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useTerraDrawSetup } from "@/app/hooks/useTerraDrawSetup";
import { useEffect } from "react";

export function MapEditorCanvas() {
  const { map, mode, setDraw } = useMapContext();
  const { draw: tdDraw, ready, setMode: setTdMode } = useTerraDrawSetup(map, !!map);

  // Store TerraDraw instance in MapContext for other components
  useEffect(() => {
    setDraw(tdDraw);
  }, [tdDraw, setDraw]);

  // Handle edit mode entry/exit
  useEffect(() => {
    if (!tdDraw || !ready) return;

    if (mode.type === "editing") {
      const feature = useFeatureStore
        .getState()
        .features.find((f) => f.id === mode.featureId);
      if (!feature) return;

      let tdMode = "polygon";
      if (feature.geometry.type === "Point") {
        tdMode = "point";
      } else if (feature.geometry.type === "LineString") {
        tdMode = "linestring";
      } else if (feature.geometry.type === "Polygon") {
        if (feature.properties?.mode === "rectangle") tdMode = "rectangle";
        else if (feature.properties?.mode === "circle") tdMode = "circle";
      }

      try {
        tdDraw.addFeatures([
          {
            type: "Feature" as const,
            id: feature.id,
            geometry: feature.geometry,
            properties: {
              ...feature.properties,
              dbId: feature.id,
              mode: feature.properties?.mode || tdMode,
            },
          } as any,
        ]);
      } catch (err) {
        console.error("[MapEditorCanvas] addFeatures threw:", err);
      }

      useFeatureStore.getState().setEditingFeatureId(mode.featureId);
      setTdMode("select");
      map?.doubleClickZoom.disable();
    } else {
      tdDraw.clear();
      useFeatureStore.getState().setEditingFeatureId(null);
      map?.doubleClickZoom.enable();
    }
  }, [mode, tdDraw, ready, setTdMode, map]);

  // Auto-save geometry on TerraDraw edits (drag, rotate, scale, reshape)
  useEffect(() => {
    if (!tdDraw || !ready) return;

    const handleFinish = (id: string | number, context: { action: string }) => {
      if (context.action === "draw") return;
      if (mode.type !== "editing") return;

      const snapshot = tdDraw.getSnapshot();
      const feature = snapshot.find((f) => f.id === id);
      if (feature) {
        useFeatureStore
          .getState()
          .updateFeature(mode.featureId, { geometry: feature.geometry })
          .catch((error) => {
            console.error("Failed to save feature geometry:", error);
          });
      }
    };

    tdDraw.on("finish", handleFinish);
    return () => {
      tdDraw.off("finish", handleFinish);
    };
  }, [tdDraw, ready, mode]);

  return null;
}
