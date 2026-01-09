import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Layer, NewLayer, LayerUpdate } from "../types/layer";
import { layerService } from "../services/LayerService";
import { useSiteStore } from "./siteStore";

interface LayerStore {
  // State
  layers: Layer[];
  selectedLayerId: string | null;
  loading: boolean;
  initialized: boolean;

  // Computed getters
  visibleLayerIds: () => Set<string>;

  // Actions
  setSelectedLayerId: (id: string | null) => void;
  loadLayers: (siteId: string | null) => Promise<void>;
  toggleLayerVisibility: (layerId: string) => Promise<void>;
  createLayer: (layerData: NewLayer) => Promise<Layer>;
  updateLayer: (id: string, updates: LayerUpdate) => Promise<Layer>;
  deleteLayer: (id: string) => Promise<void>;
  getLayer: (id: string) => Promise<Layer | null>;
}

export const useLayerStore = create<LayerStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
        // Initial State
        layers: [],
        selectedLayerId: null,
        loading: false,
        initialized: false,

        // Computed getter
        visibleLayerIds: () => {
          const { layers } = get();
          return new Set(layers.filter((l) => l.visible).map((l) => l.id));
        },

        // Actions
        setSelectedLayerId: (id) =>
          set((state) => {
            state.selectedLayerId = id;
          }),

        loadLayers: async (siteId) => {
          if (!siteId) {
            set((state) => {
              state.layers = [];
              state.loading = false;
              state.initialized = false;
            });
            return;
          }

          set((state) => {
            state.loading = true;
          });

          try {
            const loadedLayers = await layerService.listForSite(siteId);
            console.log(`[LayerStore] Loaded ${loadedLayers.length} layers for site ${siteId}`);
            loadedLayers.forEach((l) =>
              console.log(`  - ${l.name} (${l.id}): visible=${l.visible}`)
            );
            set((state) => {
              state.layers = loadedLayers;
              state.loading = false;
              state.initialized = true;
            });
          } catch (err) {
            console.error("Failed to load layers for site:", err);
            set((state) => {
              state.loading = false;
              state.initialized = true;
            });
          }
        },

        toggleLayerVisibility: async (layerId) => {
          const { layers } = get();
          const layer = layers.find((l) => l.id === layerId);
          if (!layer) {
            return;
          }
          console.log("[LayerStore] Toggling visibility for layer:", layerId);

          try {
            // Update in database using service
            const updated = await layerService.toggleVisibility(layerId, layer.visible);

            // Update local state
            set((state) => {
              const index = state.layers.findIndex((l) => l.id === layerId);
              if (index !== -1) {
                state.layers[index] = updated;
              }
            });
          } catch (error) {
            console.error("Failed to toggle layer visibility:", error);
          }
        },

        createLayer: async (layerData) => {
          try {
            const created = await layerService.create(layerData);
            set((state) => {
              state.layers.unshift(created);
            });
            return created;
          } catch (err) {
            console.error("Failed to create layer:", err);
            throw err;
          }
        },

        updateLayer: async (id, updates) => {
          try {
            const updated = await layerService.update(id, updates);
            set((state) => {
              const index = state.layers.findIndex((l) => l.id === id);
              if (index !== -1) {
                state.layers[index] = updated;
              }
            });
            return updated;
          } catch (err) {
            console.error("Failed to update layer:", err);
            throw err;
          }
        },

        deleteLayer: async (id) => {
          try {
            await layerService.delete(id);
            set((state) => {
              state.layers = state.layers.filter((l) => l.id !== id);
              // Clear selection if deleted layer was selected
              if (state.selectedLayerId === id) {
                state.selectedLayerId = null;
              }
            });
          } catch (err) {
            console.error("Failed to delete layer:", err);
            throw err;
          }
        },

        getLayer: async (id) => {
          try {
            return await layerService.get(id);
          } catch (err) {
            console.error("Failed to get layer:", err);
            return null;
          }
        },
      })
    )
  )
);

// Subscribe to site changes and reload layers
useSiteStore.subscribe(
  (state) => state.selectedSiteId,
  (selectedSiteId: string | null) => {
    console.log(`[LayerStore] Site changed to: ${selectedSiteId}`);
    useLayerStore.getState().loadLayers(selectedSiteId);
  }
);
