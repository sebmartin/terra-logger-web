/**
 * Feature Context Provider
 * Manages feature state for the selected layer
 * Separated from LayerContext for better separation of concerns
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import type { Feature } from "../types/feature";

interface FeatureContextType {
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
  addFeature: (feature: Feature) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  removeFeature: (id: string) => void;
  selectedFeatureId: string | null;
  setSelectedFeatureId: (id: string | null) => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  clearFeatures: () => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const addFeature = useCallback((feature: Feature) => {
    setFeatures((prev) => [...prev, feature]);
    setIsDirty(true);
  }, []);

  const updateFeature = useCallback((id: string, updates: Partial<Feature>) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
    setIsDirty(true);
  }, []);

  const removeFeature = useCallback((id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    setIsDirty(true);
    // Clear selection if the removed feature was selected
    setSelectedFeatureId((current) => (current === id ? null : current));
  }, []);

  const clearFeatures = useCallback(() => {
    setFeatures([]);
    setSelectedFeatureId(null);
    setIsDirty(false);
  }, []);

  const value: FeatureContextType = useMemo(
    () => ({
      features,
      setFeatures,
      addFeature,
      updateFeature,
      removeFeature,
      selectedFeatureId,
      setSelectedFeatureId,
      isDirty,
      setIsDirty,
      clearFeatures,
    }),
    [
      features,
      addFeature,
      updateFeature,
      removeFeature,
      selectedFeatureId,
      isDirty,
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
