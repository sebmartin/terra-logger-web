/**
 * MapInteractions Component
 * Handles Leaflet.PM drawing controls and user interactions
 * Separated from feature rendering for better separation of concerns
 */

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import { useFeatureContext } from "../../context/FeatureContext";
import { useLayerContext } from "../../context/LayerContext";
import type { FeatureType } from "../../types/feature";
import L from "leaflet";

interface MapInteractionsProps {
  baseMaps?: { [key: string]: L.Layer };
}

export default function MapInteractions({ baseMaps }: MapInteractionsProps) {
  const map = useMap();
  const { createFeature, updateFeature, deleteFeature } = useFeatureContext();
  const { selectedLayerId } = useLayerContext();
  const layersControlRef = useRef<L.Control.Layers | null>(null);

  useEffect(() => {
    if (!map) return;

    // Add Leaflet.PM controls
    map.pm.addControls({
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

      // Consider supporting these in future
      drawCircle: false,
      drawCircleMarker: false,
      cutPolygon: false,
    });

    // Initialize the map with layers control
    if (map && baseMaps) {
      // Remove previous control if it exists
      if (layersControlRef.current) {
        map.removeControl(layersControlRef.current);
      }

      // Add new control and store reference
      layersControlRef.current = L.control.layers(baseMaps).addTo(map);
    }

    // Configure global options
    map.pm.setGlobalOptions({
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
        map.removeLayer(layer);

        console.log("Feature created:", featureType);
      } catch (error) {
        console.error("Failed to create feature:", error);
        // Remove layer on error
        map.removeLayer(layer);
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
        map.addLayer(layer);
        return;
      }

      try {
        // Remove feature from database
        await deleteFeature(featureId);

        console.log("Feature deleted:", featureId);
      } catch (error) {
        console.error("Failed to delete feature:", error);
        // Re-add layer on error
        map.addLayer(layer);
      }
    };

    // Register event listeners
    map.on("pm:create", handleCreate);
    map.on("pm:edit", handleEdit);
    map.on("pm:remove", handleRemove);

    // Cleanup
    return () => {
      map.pm.removeControls();
      map.off("pm:create", handleCreate);
      map.off("pm:edit", handleEdit);
      map.off("pm:remove", handleRemove);
    };
  }, [map, baseMaps, createFeature, updateFeature, deleteFeature, selectedLayerId]);

  // Handle Escape key to cancel drawing/editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && map) {
        // Disable all active PM drawing/editing modes
        if (map.pm.globalDrawModeEnabled()) {
          map.pm.disableDraw();
        }

        if (map.pm.globalEditModeEnabled()) {
          map.pm.disableGlobalEditMode();
        }

        if (map.pm.globalDragModeEnabled()) {
          map.pm.disableGlobalDragMode();
        }

        if (map.pm.globalRemovalModeEnabled()) {
          map.pm.disableGlobalRemovalMode();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [map]);

  return null;
}
