/**
 * Hook for layer operations
 * Uses LayerService for all API interactions
 */

import { useState, useEffect, useCallback } from "react";
import { layerService } from "../services/LayerService";
import type { Layer, NewLayer, LayerUpdate } from "../types/layer";

export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await layerService.list();
      setLayers(data);
    } catch (err) {
      console.error("Failed to load layers:", err);
      setError("Failed to load layers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLayers();
  }, [loadLayers]);

  const createLayer = async (layer: NewLayer): Promise<Layer> => {
    try {
      const created = await layerService.create(layer);
      setLayers((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Failed to create layer:", err);
      throw err;
    }
  };

  const updateLayer = async (
    id: string,
    updates: LayerUpdate,
  ): Promise<Layer> => {
    try {
      const updated = await layerService.update(id, updates);
      setLayers((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return updated;
    } catch (err) {
      console.error("Failed to update layer:", err);
      throw err;
    }
  };

  const deleteLayer = async (id: string): Promise<void> => {
    try {
      await layerService.delete(id);
      setLayers((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete layer:", err);
      throw err;
    }
  };

  const getLayer = async (id: string): Promise<Layer | null> => {
    try {
      return await layerService.get(id);
    } catch (err) {
      console.error("Failed to get layer:", err);
      return null;
    }
  };

  return {
    layers,
    loading,
    error,
    createLayer,
    updateLayer,
    deleteLayer,
    getLayer,
    reload: loadLayers,
  };
}
