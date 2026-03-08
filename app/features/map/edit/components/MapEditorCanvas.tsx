import { useMapContext } from "@/app/components/Map/MapProvider";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useLayerStore } from "@/app/stores/layerStore";
import { useTerraDrawSetup } from "@/app/hooks/useTerraDrawSetup";
import { useEffect, useRef } from "react";
import type { FeatureType } from "@/app/types/feature";

export function MapEditorCanvas() {
  const { map, mode, setMode, setDraw } = useMapContext();
  // Timestamp-based suppression window after entering move/edit mode.
  // TerraDraw fires "change" events during setup (mode switches, dblclick processing)
  // that look like deselects. Ignoring changes for 150ms absorbs all setup noise
  // without relying on TerraDraw's internal event timing.
  const suppressChangeUntilRef = useRef(0);
  const { draw: tdDraw, ready, setMode: setTdMode } = useTerraDrawSetup(map, !!map);
  const selectedLayerId = useLayerStore((s) => s.selectedLayerId);

  // Store TerraDraw instance in MapContext for other components
  useEffect(() => {
    setDraw(tdDraw);
  }, [tdDraw, setDraw]);

  // Handle edit/move mode entry/exit
  useEffect(() => {
    if (!tdDraw || !ready) return;

    if (mode.type === "editing" || mode.type === "moving") {
      suppressChangeUntilRef.current = Date.now() + 150;
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
      const tdModeName = mode.type === "moving" ? "move" : "select";
      setTdMode(tdModeName);
      tdDraw.selectFeature(mode.featureId);
      map?.doubleClickZoom.disable();
    } else {
      tdDraw.clear();
      useFeatureStore.getState().setEditingFeatureId(null);
      map?.doubleClickZoom.enable();
    }
  }, [mode, tdDraw, ready, setTdMode, map]);

  // Activate drawing mode in Terra-Draw when mode.type === 'drawing'
  useEffect(() => {
    if (!tdDraw || !ready) return;
    if (mode.type === "drawing") {
      setTdMode(mode.geometryType);
    }
  }, [tdDraw, ready, mode, setTdMode]);

  // Exit edit/move mode when the feature is deselected in TerraDraw (e.g. click away)
  useEffect(() => {
    if (!tdDraw || !ready || (mode.type !== "editing" && mode.type !== "moving")) return;

    const handleChange = () => {
      if (Date.now() < suppressChangeUntilRef.current) return;
      const snapshot = tdDraw.getSnapshot();
      const isStillSelected = snapshot.some(
        (f) => f.id === mode.featureId && f.properties?.selected === true
      );
      if (!isStillSelected) {
        setMode({ type: "viewing" });
      }
    };

    tdDraw.on("change", handleChange);
    return () => {
      tdDraw.off("change", handleChange);
    };
  }, [tdDraw, ready, mode, setMode]);

  // Double-click in moving mode → upgrade to editing mode
  useEffect(() => {
    if (!map || mode.type !== "moving") return;
    const handleDblClick = () => {
      setMode({ type: "editing", featureId: mode.featureId });
    };
    map.on("dblclick", handleDblClick);
    return () => { map.off("dblclick", handleDblClick); };
  }, [map, mode, setMode]);

  // Auto-save geometry on TerraDraw edits, and create feature on draw finish
  useEffect(() => {
    if (!tdDraw || !ready) return;

    const handleFinish = (id: string | number, context: { action: string }) => {
      if (context.action === "draw") {
        if (mode.type !== "drawing" || !selectedLayerId) return;

        const snapshot = tdDraw.getSnapshot();
        const feature = snapshot.find((f) => f.id === id);
        if (!feature) return;

        let featureType: FeatureType = "Marker";
        if (feature.geometry.type === "Point") {
          featureType = "Marker";
        } else if (feature.geometry.type === "LineString") {
          featureType = "Polyline";
        } else if (feature.geometry.type === "Polygon") {
          if (feature.properties?.mode === "rectangle") featureType = "Rectangle";
          else if (feature.properties?.mode === "circle") featureType = "Circle";
          else featureType = "Polygon";
        }

        useFeatureStore
          .getState()
          .createFeature({
            type: featureType,
            layer_id: selectedLayerId,
            geometry: feature.geometry,
            properties: feature.properties || {},
          })
          .then(() => setMode({ type: "viewing" }))
          .catch((err) => {
            console.error("Failed to save drawn feature:", err);
            setMode({ type: "viewing" });
          });
        return;
      }

      if (mode.type !== "editing" && mode.type !== "moving") return;

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
  }, [tdDraw, ready, mode, selectedLayerId, setMode]);

  // Escape key to cancel drawing
  useEffect(() => {
    if (mode.type !== "drawing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode({ type: "viewing" });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, setMode]);

  return null;
}
