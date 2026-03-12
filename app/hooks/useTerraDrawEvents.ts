import { useEffect, useState } from "react";
import { TerraDraw } from "terra-draw";

/**
 * Custom hook to manage Terra Draw event handlers
 * Handles finish, select, deselect, and change events
 */
export function useTerraDrawEvents(
  draw: TerraDraw | null,
  ready: boolean,
  selectedLayerId: string | null,
  onFeatureCreate: (feature: {
    type: any;
    layer_id: string;
    geometry: any;
    properties: any;
  }) => Promise<any>,
  onFeatureUpdate: (id: string, updates: { geometry: any }) => Promise<any>,
  onFeatureDelete: (id: string) => Promise<void>,
  setMode: (mode: string) => void
): {
  selectedFeatureId: string | null;
  setSelectedFeatureId: (id: string | null) => void;
} {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  useEffect(() => {
    if (!draw || !ready) return;

    // Handle feature completion - save newly drawn features to DB
    const handleFinish = (id: string | number, context: any) => {
      // Only save if this is a draw action (not drag/resize)
      if (context.action !== "draw") return;

      if (!selectedLayerId) {
        console.warn("No layer selected");
        return;
      }
      
      const snapshot = draw.getSnapshot();
      const feature = snapshot.find((f) => f.id === id);
      
      if (feature) {
        // Map Terra Draw geometry types to our feature types
        let featureType: any = "Marker";
        if (feature.geometry.type === "Point") featureType = "Marker";
        else if (feature.geometry.type === "LineString") featureType = "Polyline";
        else if (feature.geometry.type === "Polygon") {
          if (feature.properties?.mode === "rectangle") featureType = "Rectangle";
          else if (feature.properties?.mode === "circle") featureType = "Circle";
          else featureType = "Polygon";
        }

        // Save to database
        onFeatureCreate({
          type: featureType,
          layer_id: selectedLayerId,
          geometry: feature.geometry,
          properties: feature.properties || {},
        })
          .then((savedFeature) => {
            const updatedFeature = {
              ...feature,
              properties: { ...feature.properties, dbId: savedFeature.id },
            };
            draw.removeFeatures([id]);
            draw.addFeatures([updatedFeature as any]);
            // Return to select mode
            setMode("select");
          })
          .catch((error) => {
            console.error("Failed to save feature:", error);
          });
      } else {
        console.error("[useTerraDrawEvents] Finished drawing feature, it could not be saved because it was not found in the snapshot:", id);
      }
    };

    // Handle feature selection in Terra Draw
    const handleSelect = (id: string | number) => {
      const snapshot = draw.getSnapshot();
      const feature = snapshot.find((f: any) => f.id === id);
      if (feature?.properties?.dbId) {
        setSelectedFeatureId(String(feature.properties.dbId));
      }
    };

    // Handle feature deselection
    const handleDeselect = () => {
      setSelectedFeatureId(null);
    };

    // Handle feature changes (editing)
    const handleChange = (ids: (string | number)[], changeType: string, _context: any) => {
      const snapshot = draw.getSnapshot();

      if (changeType === "delete") {      
        const dbIds = snapshot.filter((f) => f.id && ids.includes(f.id)).map((f) => f.properties?.dbId);
        dbIds.forEach((dbId) => {
          onFeatureDelete(String(dbId)).catch((error) => {
            console.error(`Failed to delete feature ${dbId}:`, error);
          });
        });
      }
      // TODO: handle geometry updates in the finish event instead of change event
    };

    draw.on("finish", handleFinish);
    draw.on("select", handleSelect);
    draw.on("deselect", handleDeselect);
    draw.on("change", handleChange);

    return () => {
      draw.off("finish", handleFinish);
      draw.off("select", handleSelect);
      draw.off("deselect", handleDeselect);
      draw.off("change", handleChange);
    };
  }, [
    draw,
    ready,
    selectedLayerId,
    selectedFeatureId,
    onFeatureCreate,
    onFeatureUpdate,
    onFeatureDelete,
    setMode,
  ]);

  return {
    selectedFeatureId,
    setSelectedFeatureId,
  };
}
