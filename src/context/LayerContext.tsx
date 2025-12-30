/**
 * Layer Context Provider
 * Manages layer state and operations
 * Handles persistence via LayerService
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
import type { Layer, NewLayer, LayerUpdate } from "../types/layer";
import { layerService } from "../services/LayerService";

interface LayerContextType {
  // State
  layers: Layer[];
  visibleLayerIds: Set<string>;
  selectedLayerId: string | null;

  // Operations
  setLayers: (layers: Layer[]) => void;
  setSelectedLayerId: (layerId: string | null) => void;
  loadLayersForSite: (siteId: string) => Promise<void>;
  toggleLayerVisibility: (layerId: string) => Promise<void>;
  createLayer: (layerData: NewLayer) => Promise<Layer>;
  updateLayer: (id: string, updates: LayerUpdate) => Promise<Layer>;
  deleteLayer: (id: string) => Promise<void>;
  getLayer: (id: string) => Promise<Layer | null>;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [visibleLayerIds, setVisibleLayerIds] = useState<Set<string>>(new Set());
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const loadLayersForSite = useCallback(async (siteId: string) => {
    try {
      const loadedLayers = await layerService.listForSite(siteId);
      setLayers(loadedLayers);
    } catch (err) {
      console.error("Failed to load layers for site:", err);
    }
  }, []);

  const toggleLayerVisibility = useCallback(
    async (layerId: string) => {
      const layer = layers.find((l) => l.id === layerId);
      if (!layer) return;

      try {
        // Update in database using service
        const updated = await layerService.toggleVisibility(layerId, layer.visible);

        // Update local state
        setLayers((prev) =>
          prev.map((l) => (l.id === layerId ? updated : l)),
        );

        // Update visible layer IDs
        setVisibleLayerIds((prev) => {
          const next = new Set(prev);
          if (updated.visible) {
            next.add(layerId);
          } else {
            next.delete(layerId);
          }
          return next;
        });
      } catch (error) {
        console.error("Failed to toggle layer visibility:", error);
      }
    },
    [layers],
  );

  const createLayer = useCallback(async (layerData: NewLayer): Promise<Layer> => {
    try {
      const created = await layerService.create(layerData);
      setLayers((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Failed to create layer:", err);
      throw err;
    }
  }, []);

  const updateLayer = useCallback(async (id: string, updates: LayerUpdate): Promise<Layer> => {
    try {
      const updated = await layerService.update(id, updates);
      setLayers((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (err) {
      console.error("Failed to update layer:", err);
      throw err;
    }
  }, []);

  const deleteLayer = useCallback(async (id: string): Promise<void> => {
    try {
      await layerService.delete(id);
      setLayers((prev) => prev.filter((l) => l.id !== id));
      // Clear selection if deleted layer was selected
      if (selectedLayerId === id) {
        setSelectedLayerId(null);
      }
    } catch (err) {
      console.error("Failed to delete layer:", err);
      throw err;
    }
  }, [selectedLayerId]);

  const getLayer = useCallback(async (id: string): Promise<Layer | null> => {
    try {
      return await layerService.get(id);
    } catch (err) {
      console.error("Failed to get layer:", err);
      return null;
    }
  }, []);

  // Update visible layer IDs when layers change
  useEffect(() => {
    const visible = new Set(layers.filter((l) => l.visible).map((l) => l.id));
    setVisibleLayerIds(visible);
  }, [layers]);

  const value: LayerContextType = useMemo(
    () => ({
      layers,
      visibleLayerIds,
      selectedLayerId,
      setLayers,
      setSelectedLayerId,
      loadLayersForSite,
      toggleLayerVisibility,
      createLayer,
      updateLayer,
      deleteLayer,
      getLayer,
    }),
    [
      layers,
      visibleLayerIds,
      selectedLayerId,
      loadLayersForSite,
      toggleLayerVisibility,
      createLayer,
      updateLayer,
      deleteLayer,
      getLayer,
    ],
  );

  return (
    <LayerContext.Provider value={value}>{children}</LayerContext.Provider>
  );
}

export function useLayerContext() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error("useLayerContext must be used within a LayerProvider");
  }
  return context;
}
