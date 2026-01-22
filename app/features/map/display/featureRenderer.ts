import { Feature } from "@/app/types/feature";
import type { Map as MapboxMap } from "mapbox-gl";
import { LAYER_DEFINITIONS } from "./layerDefinitions";
import { featureAsGeoJSON } from "@/app/types/geojson";
import { loadImageIcon } from "./utils/icons";
import { useFeatureStore } from "@/app/stores/featureStore";

export function createFeatureRenderer(mapInstance: MapboxMap) {
  let map = mapInstance;
  const sourceId = "features-source";
  const layerIds = new Set<string>();

  // Ensure the source exists
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "geojson",
      dynamic: true,
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
  }
  const source = map.getSource(sourceId);
  if (!source || source.type !== "geojson") {
    throw new Error(`[FeatureRenderer] Map source ${sourceId} was not created successfully`);
  }

  // Load custom icons first (before adding layers that reference them)
  loadImageIcon(map, "marker-icon", "/icons/marker.png").catch((err) => {
    console.error("Failed to load marker icon:", err);
  });

  // Add the feature layers
  for (const layerSpecTemplate of Object.values(LAYER_DEFINITIONS).flat()) {
    const layerSpec = { ...layerSpecTemplate, source: sourceId };
    if (!map.getLayer(layerSpec.id)) {
      map.addLayer(layerSpec);
      layerIds.add(layerSpec.id);
    }
  }

  return {
    updateFeatures: function (features: Feature[]) {
      const editingFeatureId = useFeatureStore.getState().editingFeatureId;
      const visibleFeatures = features
        .filter((f) => !editingFeatureId || f.id !== editingFeatureId)
        .map(featureAsGeoJSON);
      source.setData({
        type: "FeatureCollection",
        features: visibleFeatures,
      });

      console.log(
        `[FeatureRenderer] Rendered ${visibleFeatures.length} features`
      );
    },

    destroy() {
      // Remove layers first
      console.log("Destroying feature renderer");
      for (const layerId of layerIds) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
      // Then remove the source
      map.removeSource(sourceId);
    },
  };
}

export type FeatureRenderer = ReturnType<typeof createFeatureRenderer>;