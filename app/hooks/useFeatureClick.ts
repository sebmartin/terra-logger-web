import { useEffect } from "react";
import { useMapContext } from "@/app/components/Map/MapProvider";
import { useFeatureStore } from "@/app/stores/featureStore";
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
  const { map } = useMapContext();
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      // Query all rendered features at the click point
      const features = map.queryRenderedFeatures(e.point, {
        layers: CLICKABLE_LAYERS,
      });

      if (features.length > 0) {
        const featureId = features[0].properties?.id;
        if (featureId) {
          setSelectedFeatureId(featureId);
        }
      } else {
        setSelectedFeatureId(null);
      }
    };

    // Change cursor on hover
    const handleMouseMove = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: CLICKABLE_LAYERS,
      });

      map.getCanvas().style.cursor = features.length > 0 ? "pointer" : "";
    };

    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
    };
  }, [map, setSelectedFeatureId]);
}
