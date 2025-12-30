/**
 * Service layer for layer operations
 * Encapsulates all layer-related business logic and API calls
 */

import type { Layer, NewLayer, LayerUpdate } from "../types/layer";
import { parseLayer, parseLayers } from "../utils/geojson";

export class LayerService {
  /**
   * List all layers
   */
  async list(): Promise<Layer[]> {
    const rawLayers = await window.electron.listLayers();
    return parseLayers(rawLayers);
  }

  /**
   * List layers for a specific site
   */
  async listForSite(siteId: string): Promise<Layer[]> {
    const rawLayers = await window.electron.listSiteLayers(siteId);
    return parseLayers(rawLayers);
  }

  /**
   * Get a single layer by ID
   */
  async get(layerId: string): Promise<Layer | null> {
    try {
      const raw = await window.electron.getLayer(layerId);
      if (!raw) return null;
      return parseLayer(raw);
    } catch (error) {
      console.error("Failed to get layer:", error);
      return null;
    }
  }

  /**
   * Create a new layer
   */
  async create(layerData: NewLayer): Promise<Layer> {
    const created = await window.electron.createLayer(layerData);
    return parseLayer(created);
  }

  /**
   * Update an existing layer
   */
  async update(layerId: string, updates: LayerUpdate): Promise<Layer> {
    const updated = await window.electron.updateLayer(layerId, updates);
    return parseLayer(updated);
  }

  /**
   * Delete a layer
   */
  async delete(layerId: string): Promise<void> {
    await window.electron.deleteLayer(layerId);
  }

  /**
   * Toggle layer visibility
   */
  async toggleVisibility(layerId: string, currentVisibility: boolean): Promise<Layer> {
    return this.update(layerId, { visible: !currentVisibility });
  }
}

// Export singleton instance
export const layerService = new LayerService();
