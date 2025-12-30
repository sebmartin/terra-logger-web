/**
 * Feature Context Provider
 * Manages feature state and operations
 * Handles persistence via FeatureService
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import type { Feature, NewFeature, FeatureUpdate } from "../types/feature";
import { featureService } from "../services/FeatureService";
import { useLayerContext } from "./LayerContext";

interface FeatureContextType {
  // State
  features: Feature[];
  selectedFeatureId: string | null;
  isDirty: boolean;

  // Operations
  setSelectedFeatureId: (id: string | null) => void;
  loadFeatures: () => Promise<void>;
  createFeature: (featureData: Omit<NewFeature, "layer_id">) => Promise<Feature>;
  updateFeature: (id: string, updates: FeatureUpdate) => Promise<Feature>;
  deleteFeature: (id: string) => Promise<void>;
  clearFeatures: () => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { selectedLayerId, visibleLayerIds } = useLayerContext();

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
  }, [visibleLayerIds]);

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

        setFeatures((prev) => [...prev, created]);
        setIsDirty(true);
        return created;
      } catch (error) {
        console.error("Failed to create feature:", error);
        throw error;
      }
    },
    [selectedLayerId],
  );

  /**
   * Update an existing feature
   */
  const updateFeature = useCallback(
    async (id: string, updates: FeatureUpdate) => {
      try {
        const updated = await featureService.update(id, updates);

        setFeatures((prev) =>
          prev.map((f) => (f.id === id ? updated : f)),
        );
        setIsDirty(true);
        return updated;
      } catch (error) {
        console.error("Failed to update feature:", error);
        throw error;
      }
    },
    [],
  );

  /**
   * Delete a feature
   */
  const deleteFeature = useCallback(
    async (id: string) => {
      try {
        await featureService.delete(id);

        setFeatures((prev) => prev.filter((f) => f.id !== id));
        setIsDirty(true);

        // Clear selection if the removed feature was selected
        if (selectedFeatureId === id) {
          setSelectedFeatureId(null);
        }
      } catch (error) {
        console.error("Failed to delete feature:", error);
        throw error;
      }
    },
    [selectedFeatureId],
  );

  /**
   * Clear all features
   */
  const clearFeatures = useCallback(() => {
    setFeatures([]);
    setSelectedFeatureId(null);
    setIsDirty(false);
  }, []);

  /**
   * Reload features when visible layers change
   */
  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const value: FeatureContextType = useMemo(
    () => ({
      features,
      selectedFeatureId,
      isDirty,
      setSelectedFeatureId,
      loadFeatures,
      createFeature,
      updateFeature,
      deleteFeature,
      clearFeatures,
    }),
    [
      features,
      selectedFeatureId,
      isDirty,
      loadFeatures,
      createFeature,
      updateFeature,
      deleteFeature,
      clearFeatures,
    ],
  );

  return (
    <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>
  );
}

export function useFeatureContext() {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error("useFeatureContext must be used within a FeatureProvider");
  }
  return context;
}
