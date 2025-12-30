/**
 * FeatureRenderer Component
 * Responsible for rendering features on the map
 * Separated from map interaction logic for better separation of concerns
 */

import { useEffect, useRef } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import L from "leaflet";
import { useFeatureContext } from "../../context/FeatureContext";
import { useLayerContext } from "../../context/LayerContext";
import { formatDistance, formatArea } from "../../utils/measurements";
import type { Feature } from "../../types/feature";

export default function FeatureRenderer() {
  const leafletMap = useLeafletMap();
  const { features } = useFeatureContext();
  const { selectedLayerId } = useLayerContext();
  const layersRef = useRef<Map<string, L.Layer>>(new Map());

  useEffect(() => {
    if (!leafletMap || !selectedLayerId) return;

    // Clear existing layers
    layersRef.current.forEach((layer) => {
      leafletMap.removeLayer(layer);
    });
    layersRef.current.clear();

    // Add features to map
    features.forEach((feature: Feature) => {
      try {
        // Create GeoJSON layer
        const geoJsonLayer = L.geoJSON(
          {
            type: "Feature",
            geometry: feature.geometry as any,
            properties: feature.properties || {},
          } as GeoJSON.Feature,
          {
            style: () => {
              return {
                color: feature.style?.color || "#3388ff",
                weight: feature.style?.weight || 4,
                opacity: feature.style?.opacity || 0.8,
                fillColor: feature.style?.fillColor || "#3388ff",
                fillOpacity: feature.style?.fillOpacity || 0.3,
              };
            },
            pointToLayer: (_geoJsonPoint, latlng) => {
              return L.marker(latlng);
            },
          },
        );

        // Add to map
        geoJsonLayer.addTo(leafletMap);

        // Get the actual Leaflet layer (GeoJSON creates a FeatureGroup)
        const layers = (geoJsonLayer as any).getLayers();
        if (layers.length > 0) {
          const layer = layers[0];

          // Store feature ID and locked status on layer
          (layer as any).featureId = feature.id;
          (layer as any).isLocked = feature.locked;

          // Enable/disable Leaflet.PM editing based on locked status
          if (layer.pm) {
            if (feature.locked) {
              layer.pm.disable();
              // Add visual indication that feature is locked
              if ("setStyle" in layer) {
                const currentStyle = (layer as any).options;
                (layer as any).setStyle({
                  ...currentStyle,
                  opacity: currentStyle.opacity * 0.7,
                  fillOpacity: currentStyle.fillOpacity * 0.7,
                });
              }
            } else {
              layer.pm.enable();
            }
          }

          // Store layer reference
          layersRef.current.set(feature.id, layer);

          // Build tooltip content with name and measurements
          let tooltipContent = feature.name || "Unnamed Feature";

          if (feature.locked) {
            tooltipContent += " 🔒";
          }

          if (feature.properties) {
            if (feature.properties.distance) {
              tooltipContent += `\n${formatDistance(feature.properties.distance)}`;
            }
            if (feature.properties.area) {
              tooltipContent += `\n${formatArea(feature.properties.area)}`;
            }
          }

          // Add tooltip
          layer.bindTooltip(tooltipContent, {
            permanent: false,
            direction: "top",
          });
        }
      } catch (error) {
        console.error("Failed to render feature:", feature.id, error);
      }
    });

    // Cleanup
    return () => {
      layersRef.current.forEach((layer) => {
        if (leafletMap.hasLayer(layer)) {
          leafletMap.removeLayer(layer);
        }
      });
      layersRef.current.clear();
    };
  }, [leafletMap, features, selectedLayerId]);

  return null;
}
