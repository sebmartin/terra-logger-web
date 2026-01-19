import { Feature } from "@/app/types/feature";
import type { Map as MapboxMap } from "mapbox-gl";
import { LAYER_DEFINITIONS } from "./layerDefinitions";
import { featureAsGeoJSON } from "@/app/types/geojson";
import { loadImageIcon } from "./utils/icons";

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

  // Example implementation: Replace with actual rendering logic
  return {
    /**
     * Updates features in the source.
     * - If there's a feature with the same ID, overwrite it.
     * - If there's a feature with the same ID but the new one's geometry is `null`, remove it
     * - If there's no such ID in existing data, add it as a new feature.
     */
    updateFeatures: function (features: Feature[]) {
      source.updateData({
        type: "FeatureCollection",
        features: features.map(featureAsGeoJSON),
      });
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