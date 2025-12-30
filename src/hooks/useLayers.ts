import { useState, useEffect } from "react";
import type { Layer, NewLayer, LayerUpdate } from "../types/layer";

export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLayers();
  }, []);

  const loadLayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await window.electron.listLayers();
      // Parse and convert visible field from SQLite integer to boolean
      const parsedLayers = data.map((l: any) => ({
        ...l,
        visible: Boolean(l.visible),
      }));
      setLayers(parsedLayers);
    } catch (err) {
      console.error("Failed to load layers:", err);
      setError("Failed to load layers");
    } finally {
      setLoading(false);
    }
  };

  const createLayer = async (layer: NewLayer): Promise<Layer> => {
    try {
      const created = await window.electron.createLayer(layer);
      const parsed = {
        ...created,
        visible: Boolean(created.visible),
      };
      setLayers((prev) => [parsed, ...prev]);
      return parsed;
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
      const updated = await window.electron.updateLayer(id, updates);
      const parsed = {
        ...updated,
        visible: Boolean(updated.visible),
      };
      setLayers((prev) => prev.map((l) => (l.id === id ? parsed : l)));
      return parsed;
    } catch (err) {
      console.error("Failed to update layer:", err);
      throw err;
    }
  };

  const deleteLayer = async (id: string): Promise<void> => {
    try {
      await window.electron.deleteLayer(id);
      setLayers((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete layer:", err);
      throw err;
    }
  };

  const getLayer = async (id: string): Promise<Layer | null> => {
    try {
      const layer = await window.electron.getLayer(id);
      if (!layer) return null;

      return {
        ...layer,
        visible: Boolean(layer.visible),
      };
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
