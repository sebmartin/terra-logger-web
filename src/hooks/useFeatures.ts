/**
 * Hook for feature operations
 * Uses FeatureService for all API interactions
 * Manages feature state through FeatureContext
 */

import { useCallback, useEffect } from "react";
import { useLayerContext } from "../context/LayerContext";
import { useFeatureContext } from "../context/FeatureContext";
import { featureService } from "../services/FeatureService";
import type { NewFeature, FeatureUpdate } from "../types/feature";

export function useFeatures() {
  const { selectedLayerId, visibleLayerIds } = useLayerContext();
  const {
    features,
    addFeature,
    updateFeature: updateFeatureInContext,
    removeFeature,
    setFeatures,
    setIsDirty,
  } = useFeatureContext();

  /**
   * Load features from all visible layers
   */
  const loadFeatures = useCallback(async () => {
    if (visibleLayerIds.size === 0) {
      setFeatures([]);
      return;
    }

    try {
      const allFeatures = [];

      for (const layerId of visibleLayerIds) {
        const layerFeatures = await featureService.list(layerId);
        allFeatures.push(...layerFeatures);
      }

      setFeatures(allFeatures);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to load features:", error);
    }
  }, [visibleLayerIds, setFeatures, setIsDirty]);

  /**
   * Reload features when visible layers change
   */
  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  /**
   * Create a new feature
   */
  const createFeature = useCallback(
    async (featureData: Omit<NewFeature, "layer_id">) => {
      if (!selectedLayerId) {
        throw new Error("No layer selected");
      }

      try {
        const created = await featureService.createWithMeasurements(
          selectedLayerId,
          featureData,
        );

        addFeature(created);
        return created;
      } catch (error) {
        console.error("Failed to create feature:", error);
        throw error;
      }
    },
    [selectedLayerId, addFeature],
  );

  /**
   * Update an existing feature
   */
  const updateFeature = useCallback(
    async (id: string, updates: FeatureUpdate) => {
      try {
        const updated = await featureService.update(id, updates);
        updateFeatureInContext(id, updated);
        return updated;
      } catch (error) {
        console.error("Failed to update feature:", error);
        throw error;
      }
    },
    [updateFeatureInContext],
  );

  /**
   * Delete a feature
   */
  const deleteFeature = useCallback(
    async (id: string) => {
      try {
        await featureService.delete(id);
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
    loadFeatures,
  };
}
