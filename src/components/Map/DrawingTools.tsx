import { useEffect, useRef } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import L from "leaflet";
import * as turf from "@turf/turf";
import { useFeatures } from "../../hooks/useFeatures";
import { useLayer } from "../../context/LayerContext";
import type { FeatureType } from "../../types/feature";
import type { Feature } from "../../types/feature";

export default function DrawingTools() {
  const leafletMap = useLeafletMap();
  const { features, createFeature, updateFeature, deleteFeature } =
    useFeatures();
  const { selectedLayerId } = useLayer();
  const layersRef = useRef<Map<string, L.Layer>>(new Map());

  useEffect(() => {
    if (!leafletMap) return;

    // Add Leaflet.PM controls
    leafletMap.pm.addControls({
      position: "topleft",
      drawText: !!selectedLayerId,
      drawMarker: !!selectedLayerId,
      drawPolyline: !!selectedLayerId,
      drawPolygon: !!selectedLayerId,
      drawRectangle: !!selectedLayerId,
      editMode: !!selectedLayerId,
      dragMode: !!selectedLayerId,
      removalMode: !!selectedLayerId,
      rotateMode: !!selectedLayerId
    });

    // Configure global options
    leafletMap.pm.setGlobalOptions({
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      templineStyle: {
        color: "#3388ff",
        weight: 4,
      },
      hintlineStyle: {
        color: "#3388ff",
        dashArray: "5,5",
        weight: 2,
      },
      pathOptions: {
        color: "#3388ff",
        weight: 4,
        opacity: 0.8,
        fillColor: "#3388ff",
        fillOpacity: 0.3,
      },
    });

    // Calculate measurements for a feature
    const calculateMeasurements = (geoJSON: any, featureType: FeatureType) => {
      const measurements: any = {};

      try {
        if (featureType === "Polyline") {
          const line = turf.lineString(geoJSON.geometry.coordinates);
          const lengthKm = turf.length(line, { units: "kilometers" });
          measurements.distance = {
            km: lengthKm,
            miles: lengthKm * 0.621371,
            meters: lengthKm * 1000,
            feet: lengthKm * 3280.84,
          };
        } else if (featureType === "Polygon" || featureType === "Rectangle") {
          const polygon = turf.polygon(geoJSON.geometry.coordinates);
          const areaSqm = turf.area(polygon);
          measurements.area = {
            sqm: areaSqm,
            sqkm: areaSqm / 1_000_000,
            acres: areaSqm * 0.000247105,
            hectares: areaSqm / 10_000,
            sqft: areaSqm * 10.7639,
          };
        }
      } catch (error) {
        console.error("Failed to calculate measurements:", error);
      }

      return measurements;
    };

    // Handle shape creation
    const handleCreate = async (e: any) => {
      const layer = e.layer;
      const shape = e.shape;

      try {
        // Convert layer to GeoJSON
        const geoJSON = layer.toGeoJSON();

        // Determine feature type
        let featureType: FeatureType;
        switch (shape) {
          case "Marker":
            featureType = "Marker";
            break;
          case "Line":
            featureType = "Polyline";
            break;
          case "Polygon":
            featureType = "Polygon";
            break;
          case "Rectangle":
            featureType = "Rectangle";
            break;
          default:
            featureType = "Polygon";
        }

        // Get layer style
        const style = {
          color: (layer.options as any).color || "#3388ff",
          weight: (layer.options as any).weight || 4,
          opacity: (layer.options as any).opacity || 0.8,
          fillColor: (layer.options as any).fillColor || "#3388ff",
          fillOpacity: (layer.options as any).fillOpacity || 0.3,
        };

        // Calculate measurements
        const measurements = calculateMeasurements(geoJSON, featureType);

        // Save feature to database
        await createFeature({
          type: featureType,
          name: `${featureType} ${new Date().toLocaleTimeString()}`,
          geometry: geoJSON.geometry,
          style,
          properties: measurements,
        });

        // Remove the temporary drawing layer - it will be re-rendered by the features useEffect
        leafletMap.removeLayer(layer);

        console.log("Feature created:", featureType, measurements);
      } catch (error) {
        console.error("Failed to create feature:", error);
        // Remove layer on error
        leafletMap.removeLayer(layer);
      }
    };

    // Handle shape editing
    const handleEdit = async (e: any) => {
      const layer = e.layer;
      const featureId = (layer as any).featureId;
      const isLocked = (layer as any).isLocked;

      if (!featureId) {
        console.warn("No feature ID found on edited layer");
        return;
      }

      // Prevent editing locked features
      if (isLocked) {
        console.warn("Cannot edit locked feature:", featureId);
        return;
      }

      try {
        // Convert layer to GeoJSON
        const geoJSON = layer.toGeoJSON();

        // Get layer style
        const style = {
          color: (layer.options as any).color || "#3388ff",
          weight: (layer.options as any).weight || 4,
          opacity: (layer.options as any).opacity || 0.8,
          fillColor: (layer.options as any).fillColor || "#3388ff",
          fillOpacity: (layer.options as any).fillOpacity || 0.3,
        };

        // Update feature in database
        await updateFeature(featureId, {
          geometry: geoJSON.geometry,
          style,
        });

        console.log("Feature updated:", featureId);
      } catch (error) {
        console.error("Failed to update feature:", error);
      }
    };

    // Handle shape removal
    const handleRemove = async (e: any) => {
      const layer = e.layer;
      const featureId = (layer as any).featureId;
      const isLocked = (layer as any).isLocked;

      if (!featureId) {
        console.warn("No feature ID found on removed layer");
        return;
      }

      // Prevent deleting locked features
      if (isLocked) {
        console.warn("Cannot delete locked feature:", featureId);
        alert("This feature is locked. Unlock it first to delete.");
        // Re-add the layer since PM removes it
        leafletMap.addLayer(layer);
        return;
      }

      try {
        // Remove feature from database
        await deleteFeature(featureId);

        // Remove from layers ref
        layersRef.current.delete(featureId);

        console.log("Feature deleted:", featureId);
      } catch (error) {
        console.error("Failed to delete feature:", error);
        // Re-add layer on error
        leafletMap.addLayer(layer);
      }
    };

    // Register event listeners
    leafletMap.on("pm:create", handleCreate);
    leafletMap.on("pm:edit", handleEdit);
    leafletMap.on("pm:remove", handleRemove);

    // Cleanup
    return () => {
      leafletMap.pm.removeControls();
      leafletMap.off("pm:create", handleCreate);
      leafletMap.off("pm:edit", handleEdit);
      leafletMap.off("pm:remove", handleRemove);
    };
  }, [leafletMap, createFeature, updateFeature, deleteFeature]);

  // Render features on map
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
              const d = feature.properties.distance;
              tooltipContent += `\n${d.km.toFixed(2)} km (${d.miles.toFixed(2)} mi)`;
            }
            if (feature.properties.area) {
              const a = feature.properties.area;
              tooltipContent += `\n${a.acres.toFixed(2)} acres (${a.hectares.toFixed(2)} ha)`;
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

  // Handle Escape key to cancel drawing/editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && leafletMap) {
        // Disable all active PM drawing/editing modes
        if (leafletMap.pm.globalDrawModeEnabled()) {
          leafletMap.pm.disableDraw();
        }

        if (leafletMap.pm.globalEditModeEnabled()) {
          leafletMap.pm.disableGlobalEditMode();
        }

        if (leafletMap.pm.globalDragModeEnabled()) {
          leafletMap.pm.disableGlobalDragMode();
        }

        if (leafletMap.pm.globalRemovalModeEnabled()) {
          leafletMap.pm.disableGlobalRemovalMode();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [leafletMap]);

  return null;
}
