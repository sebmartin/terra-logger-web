import React, { useEffect, useRef } from "react";
import { FeatureRenderer, createFeatureRenderer } from "../featureRenderer";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useMapContext } from "@/app/components/Map/MapProvider";
import { useLayerStore } from "@/app/stores/layerStore";

export function MapboxFeatureRenderer() {
  const { map } = useMapContext();
  const visibleLayerIds = useLayerStore((state) => state.visibleLayerIds);
  const allFeatures = useFeatureStore((state) => state.features);
  const editingFeatureId = useFeatureStore((state) => state.editingFeatureId);
  const selectedFeatureId = useFeatureStore((state) => state.selectedFeatureId);
  const rendererRef = React.useRef<FeatureRenderer>(null);
  const prevSelectedRef = useRef<string | null>(null);

  // Initialize renderer when map is ready
  useEffect(() => {
    if (!map) return;

    rendererRef.current = createFeatureRenderer(map);

    return () => {
      rendererRef.current?.destroy();
    };
  }, [map]);

  // Update renderer features when they change, hiding the feature being edited
  useEffect(() => {
    const featuresToRender = editingFeatureId
      ? allFeatures.filter((f) => f.id !== editingFeatureId)
      : allFeatures;
    rendererRef.current?.updateFeatures(featuresToRender);
  }, [rendererRef, allFeatures, visibleLayerIds, editingFeatureId]);

  // Push feature-state selection highlight to Mapbox
  useEffect(() => {
    if (!map) return;
    const sourceId = "features-source";
    if (prevSelectedRef.current) {
      map.setFeatureState({ source: sourceId, id: prevSelectedRef.current }, { selected: false });
    }
    if (selectedFeatureId) {
      map.setFeatureState({ source: sourceId, id: selectedFeatureId }, { selected: true });
    }
    prevSelectedRef.current = selectedFeatureId;
  }, [map, selectedFeatureId]);

  // No components to render, this renderer works directly with the Mapbox map instance
  return null;
}