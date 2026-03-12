import { useEffect } from "react";
import { useMapContext } from "@/app/components/Map/MapProvider";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useLayerStore } from "@/app/stores/layerStore";
import type { MapMouseEvent } from "mapbox-gl";

const CLICKABLE_LAYERS = [
  "marker-layer",
  "polygon-fill-layer",
  "polyline-layer",
  "rectangle-fill-layer",
  "circle-fill-layer",
];

/**
 * Hook to handle feature click interactions on the map
 */
export function useFeatureClick() {
  const { map, mode, setMode } = useMapContext();
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);
  const setSelectedLayerId = useLayerStore((s) => s.setSelectedLayerId);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      const mapFeatures = map.queryRenderedFeatures(e.point, {
        layers: CLICKABLE_LAYERS,
      });

      if (mapFeatures.length > 0) {
        const featureId = mapFeatures[0].properties?.id;
        const layerId = mapFeatures[0].properties?.layerId;
        if (!featureId) return;

        const feature = useFeatureStore
          .getState()
          .features.find((f) => f.id === featureId);

        if (feature?.locked) {
          // Locked feature clicks always show info and exit any active mode.
          if (layerId) setSelectedLayerId(layerId);
          setSelectedFeatureId(featureId);
          setMode({ type: "viewing" });
          return;
        }
      }

      // TerraDraw owns interactions with unlocked features when moving or editing.
      if (mode.type === "moving" || mode.type === "editing") return;

      if (mapFeatures.length > 0) {
        const featureId = mapFeatures[0].properties?.id;
        const layerId = mapFeatures[0].properties?.layerId;
        if (!featureId) return;

        if (layerId) setSelectedLayerId(layerId);
        setSelectedFeatureId(null);
        setMode({ type: "moving", featureId });
      } else {
        setSelectedFeatureId(null);
      }
    };

    const handleDblClick = (e: MapMouseEvent) => {
      if (mode.type !== "viewing") return;
      const mapFeatures = map.queryRenderedFeatures(e.point, { layers: CLICKABLE_LAYERS });
      if (!mapFeatures.length) return;
      const featureId = mapFeatures[0].properties?.id;
      if (!featureId) return;
      const feature = useFeatureStore.getState().features.find((f) => f.id === featureId);
      if (!feature || feature.locked) return;
      if (mapFeatures[0].properties?.layerId) setSelectedLayerId(mapFeatures[0].properties.layerId);
      setMode({ type: "editing", featureId });
    };

    // Change cursor on hover
    const handleMouseMove = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: CLICKABLE_LAYERS,
      });

      map.getCanvas().style.cursor = features.length > 0 ? "pointer" : "";
    };

    map.on("click", handleClick);
    map.on("dblclick", handleDblClick);
    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("click", handleClick);
      map.off("dblclick", handleDblClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, mode, setMode, setSelectedFeatureId, setSelectedLayerId]);
}
