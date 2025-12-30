/**
 * Layer Context Provider
 * Manages layer state and visibility
 * Feature management moved to FeatureContext for better separation of concerns
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
import type { Layer } from "../types/layer";
import { layerService } from "../services/LayerService";

interface LayerContextType {
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  visibleLayerIds: Set<string>;
  toggleLayerVisibility: (layerId: string) => Promise<void>;
  selectedLayerId: string | null;
  setSelectedLayerId: (layerId: string | null) => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [visibleLayerIds, setVisibleLayerIds] = useState<Set<string>>(new Set());
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

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

  // Update visible layer IDs when layers change
  useEffect(() => {
    const visible = new Set(layers.filter((l) => l.visible).map((l) => l.id));
    setVisibleLayerIds(visible);
  }, [layers]);

  const value: LayerContextType = useMemo(
    () => ({
      layers,
      setLayers,
      visibleLayerIds,
      toggleLayerVisibility,
      selectedLayerId,
      setSelectedLayerId,
    }),
    [layers, visibleLayerIds, toggleLayerVisibility, selectedLayerId],
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
