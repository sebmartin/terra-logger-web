import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Feature, NewFeature, FeatureUpdate } from "../types/feature";
import { featureService } from "../services/FeatureService";
import { useLayerStore } from "./layerStore";

interface FeatureStore {
  // State
  features: Feature[];
  selectedFeatureId: string | null;

  // Actions
  selectedFeature: () => Feature | null;
  setSelectedFeatureId: (id: string | null) => void;
  loadFeatures: () => Promise<void>;
  createFeature: (featureData: NewFeature) => Promise<Feature>;
  updateFeature: (id: string, updates: FeatureUpdate) => Promise<Feature>;
  deleteFeature: (id: string) => Promise<void>;
  clearFeatures: () => void;
}

export const useFeatureStore = create<FeatureStore>()(
  immer((set, _get) => ({
      // Initial State
      features: [],
      selectedFeatureId: null,

      // Getters
      selectedFeature: () => {
        const state = _get();
        return state.features.find((f) => f.id === state.selectedFeatureId) || null;
      },

      // Actions
      setSelectedFeatureId: (id) =>
        set((state) => {
          state.selectedFeatureId = id;
        }),

      loadFeatures: async () => {
        const visibleLayerIds = useLayerStore.getState().visibleLayerIds();
        console.log(
          `[FeatureStore] Loading features. Visible layers:`,
          Array.from(visibleLayerIds)
        );

        if (visibleLayerIds.size === 0) {
          console.log(`[FeatureStore] No visible layers, clearing features`);
          set((state) => {
            state.features = [];
          });
          return;
        }

        try {
          const visibleFeatures: Feature[] = [];

          for (const layerId of visibleLayerIds) {
            const layerFeatures = await featureService.list(layerId);
            console.log(
              `[FeatureStore] Loaded ${layerFeatures.length} features from layer ${layerId}`
            );
            visibleFeatures.push(...layerFeatures);
          }

          console.log(`[FeatureStore] Total visible features loaded:`, visibleFeatures.length);
          set((state) => {
            state.features = visibleFeatures;
          });
        } catch (error) {
          console.error("Failed to load features:", error);
        }
      },

      createFeature: async (featureData) => {
        // Use layer_id from featureData, or fall back to selectedLayerId
        const selectedLayerId = useLayerStore.getState().selectedLayerId;
        const layerId = featureData.layer_id || selectedLayerId;

        if (!layerId) {
          throw new Error("No layer specified or selected");
        }

        try {
          const created = await featureService.createWithMeasurements(
            layerId,
            featureData
          );

          set((state) => {
            state.features.push(created);
          });
          return created;
        } catch (error) {
          console.error("Failed to create feature:", error);
          throw error;
        }
      },

      updateFeature: async (id, updates) => {
        try {
          const updated = await featureService.update(id, updates);

          set((state) => {
            const index = state.features.findIndex((f) => f.id === id);
            if (index !== -1) {
              state.features[index] = updated;
            }
          });
          return updated;
        } catch (error) {
          console.error("Failed to update feature:", error);
          throw error;
        }
      },

      deleteFeature: async (id) => {
        try {
          await featureService.delete(id);

          set((state) => {
            state.features = state.features.filter((f) => f.id !== id);

            // Clear selection if the removed feature was selected
            if (state.selectedFeatureId === id) {
              state.selectedFeatureId = null;
            }
          });
        } catch (error) {
          console.error("Failed to delete feature:", error);
          throw error;
        }
      },

      clearFeatures: () =>
        set((state) => {
          state.features = [];
          state.selectedFeatureId = null;
        }),
    }))
);

// Subscribe to layer store changes and reload features when visible layers change
useLayerStore.subscribe(
  (state) => state.layers,
  () => {
    console.log(`[FeatureStore] Layer visibility changed, reloading features`);
    useFeatureStore.getState().loadFeatures();
  }
);
