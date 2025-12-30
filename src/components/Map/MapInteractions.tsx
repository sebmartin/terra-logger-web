/**
 * MapInteractions Component
 * Handles Leaflet.PM drawing controls and user interactions
 * Separated from feature rendering for better separation of concerns
 */

import { useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import { useFeatureContext } from "../../context/FeatureContext";
import { useLayerContext } from "../../context/LayerContext";
import type { FeatureType } from "../../types/feature";

export default function MapInteractions() {
  const leafletMap = useLeafletMap();
  const { createFeature, updateFeature, deleteFeature } = useFeatureContext();
  const { selectedLayerId } = useLayerContext();

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
      rotateMode: !!selectedLayerId,
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

        // Save feature to database (measurements calculated in service)
        await createFeature({
          type: featureType,
          name: `${featureType} ${new Date().toLocaleTimeString()}`,
          geometry: geoJSON.geometry,
          style,
        });

        // Remove the temporary drawing layer - it will be re-rendered by FeatureRenderer
        leafletMap.removeLayer(layer);

        console.log("Feature created:", featureType);
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
  }, [leafletMap, createFeature, updateFeature, deleteFeature, selectedLayerId]);

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
