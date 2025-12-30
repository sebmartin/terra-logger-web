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
import type { Feature } from "../types/feature";

interface LayerContextType {
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  visibleLayerIds: Set<string>;
  toggleLayerVisibility: (layerId: string) => void;
  selectedLayerId: string | null;
  setSelectedLayerId: (layerId: string | null) => void;
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
  addFeature: (feature: Feature) => void;
  updateFeatureInList: (id: string, updates: Partial<Feature>) => void;
  removeFeature: (id: string) => void;
  selectedFeatureId: string | null;
  setSelectedFeatureId: (id: string | null) => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  refreshFeatures: () => Promise<void>;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({ children }: { children: ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [visibleLayerIds, setVisibleLayerIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null,
  );
  const [isDirty, setIsDirty] = useState(false);

  const toggleLayerVisibility = useCallback(
    async (layerId: string) => {
      const layer = layers.find((l) => l.id === layerId);
      if (!layer) return;

      const newVisible = !layer.visible;

      // Update in database
      try {
        await window.electron.updateLayer(layerId, { visible: newVisible });

        // Update local state
        setLayers((prev) =>
          prev.map((l) =>
            l.id === layerId ? { ...l, visible: newVisible } : l,
          ),
        );

        // Update visible layer IDs
        setVisibleLayerIds((prev) => {
          const next = new Set(prev);
          if (newVisible) {
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

  const addFeature = useCallback((feature: Feature) => {
    setFeatures((prev) => [...prev, feature]);
    setIsDirty(true);
  }, []);

  const updateFeatureInList = useCallback(
    (id: string, updates: Partial<Feature>) => {
      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      );
      setIsDirty(true);
    },
    [],
  );

  const removeFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    setIsDirty(true);
  }, []);

  // Load features from all visible layers
  const refreshFeatures = useCallback(async () => {
    if (visibleLayerIds.size === 0) {
      setFeatures([]);
      return;
    }

    try {
      const allFeatures: Feature[] = [];

      for (const layerId of visibleLayerIds) {
        const layerFeatures = await window.electron.listFeatures(layerId);

        // Parse JSON strings from database
        const parsedFeatures = layerFeatures.map((f: any) => ({
          ...f,
          geometry:
            typeof f.geometry === "string"
              ? JSON.parse(f.geometry)
              : f.geometry,
          properties: f.properties
            ? typeof f.properties === "string"
              ? JSON.parse(f.properties)
              : f.properties
            : null,
          style: f.style
            ? typeof f.style === "string"
              ? JSON.parse(f.style)
              : f.style
            : null,
          locked: Boolean(f.locked), // Convert SQLite integer to boolean
        }));

        allFeatures.push(...parsedFeatures);
      }

      setFeatures(allFeatures);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to load features:", error);
    }
  }, [visibleLayerIds]);

  // Reload features when visible layers change
  useEffect(() => {
    refreshFeatures();
  }, [refreshFeatures]);

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
      features,
      setFeatures,
      addFeature,
      updateFeatureInList,
      removeFeature,
      selectedFeatureId,
      setSelectedFeatureId,
      isDirty,
      setIsDirty,
      refreshFeatures,
    }),
    [
      layers,
      visibleLayerIds,
      toggleLayerVisibility,
      selectedLayerId,
      features,
      addFeature,
      updateFeatureInList,
      removeFeature,
      selectedFeatureId,
      isDirty,
      refreshFeatures,
    ],
  );

  return (
    <LayerContext.Provider value={value}>{children}</LayerContext.Provider>
  );
}

export function useLayer() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error("useLayer must be used within a LayerProvider");
  }
  return context;
}
