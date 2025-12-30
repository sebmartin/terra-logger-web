import { useCallback } from "react";
import { useLayer } from "../context/LayerContext";
import type { NewFeature, FeatureUpdate } from "../types/feature";

export function useFeatures() {
  const {
    selectedLayerId,
    features,
    addFeature,
    updateFeatureInList,
    removeFeature,
  } = useLayer();

  const createFeature = useCallback(
    async (featureData: Omit<NewFeature, "layer_id">) => {
      if (!selectedLayerId) {
        throw new Error("No layer selected");
      }

      try {
        const created = await window.electron.createFeature(selectedLayerId, {
          ...featureData,
          layer_id: selectedLayerId,
        });

        // Parse JSON fields
        const parsed = {
          ...created,
          geometry:
            typeof created.geometry === "string"
              ? JSON.parse(created.geometry)
              : created.geometry,
          properties: created.properties
            ? typeof created.properties === "string"
              ? JSON.parse(created.properties)
              : created.properties
            : null,
          style: created.style
            ? typeof created.style === "string"
              ? JSON.parse(created.style)
              : created.style
            : null,
          locked: Boolean(created.locked),
        };

        addFeature(parsed);
        return parsed;
      } catch (error) {
        console.error("Failed to create feature:", error);
        throw error;
      }
    },
    [selectedLayerId, addFeature],
  );

  const updateFeature = useCallback(
    async (id: string, updates: FeatureUpdate) => {
      try {
        const updated = await window.electron.updateFeature(id, updates);

        // Parse JSON fields
        const parsed = {
          ...updated,
          geometry:
            typeof updated.geometry === "string"
              ? JSON.parse(updated.geometry)
              : updated.geometry,
          properties: updated.properties
            ? typeof updated.properties === "string"
              ? JSON.parse(updated.properties)
              : updated.properties
            : null,
          style: updated.style
            ? typeof updated.style === "string"
              ? JSON.parse(updated.style)
              : updated.style
            : null,
          locked: Boolean(updated.locked),
        };

        updateFeatureInList(id, parsed);
        return parsed;
      } catch (error) {
        console.error("Failed to update feature:", error);
        throw error;
      }
    },
    [updateFeatureInList],
  );

  const deleteFeature = useCallback(
    async (id: string) => {
      try {
        await window.electron.deleteFeature(id);
        removeFeature(id);
      } catch (error) {
        console.error("Failed to delete feature:", error);
        throw error;
      }
    },
    [removeFeature],
  );

  return {
    features,
    createFeature,
    updateFeature,
    deleteFeature,
  };
}
