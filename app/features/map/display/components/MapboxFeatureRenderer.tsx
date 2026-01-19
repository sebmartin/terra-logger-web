import React, { useEffect } from "react";
import { FeatureRenderer, createFeatureRenderer } from "../featureRenderer";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useMapContext } from "@/app/components/Map/MapProvider";

export function MapboxFeatureRenderer() {
  const { map } = useMapContext();
  const allFeatures = useFeatureStore((state) => state.features);
  const rendererRef = React.useRef<FeatureRenderer>(null);

  // Initialize renderer when map is ready
  useEffect(() => {
    if (!map) return;

    console.log("[MapboxFeatureRenderer] Initializing feature renderer");
    rendererRef.current = createFeatureRenderer(map);

    return () => {
      rendererRef.current?.destroy();
    };
  }, [map]);

  // TODO: update renderer features when they change
  useEffect(() => {
    rendererRef.current?.updateFeatures(allFeatures);
  }, [rendererRef, allFeatures]);

  // No components to render, this renderer works directly with the Mapbox map instance
  return null;
}