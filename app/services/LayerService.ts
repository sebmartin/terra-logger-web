/**
 * Service layer for layer operations
 * Encapsulates all layer-related business logic and API calls
 */

import type { Layer, NewLayer, LayerUpdate } from "../types/layer";
import { parseLayer, parseLayers } from "../types/schemas";

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export class LayerService {
  /**
   * List all layers
   */
  async list(): Promise<Layer[]> {
    const response = await fetch(`${getBaseUrl()}/api/layers`);
    if (!response.ok) throw new Error("Failed to fetch layers");
    const rawLayers = await response.json();
    return parseLayers(rawLayers);
  }

  /**
   * List layers for a specific site
   */
  async listForSite(siteId: string): Promise<Layer[]> {
    const response = await fetch(`${getBaseUrl()}/api/sites/${siteId}/layers`);
    if (!response.ok) throw new Error("Failed to fetch site layers");
    const rawLayers = await response.json();
    return parseLayers(rawLayers);
  }

  /**
   * Get a single layer by ID
   */
  async get(layerId: string): Promise<Layer | null> {
    try {
      const response = await fetch(`${getBaseUrl()}/api/layers/${layerId}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch layer");
      const raw = await response.json();
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
    const response = await fetch(`${getBaseUrl()}/api/layers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(layerData),
    });
    if (!response.ok) throw new Error("Failed to create layer");
    const created = await response.json();
    return parseLayer(created);
  }

  /**
   * Update an existing layer
   */
  async update(layerId: string, updates: LayerUpdate): Promise<Layer> {
    const response = await fetch(`${getBaseUrl()}/api/layers/${layerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update layer");
    const updated = await response.json();
    return parseLayer(updated);
  }

  /**
   * Delete a layer
   */
  async delete(layerId: string): Promise<void> {
    const response = await fetch(`${getBaseUrl()}/api/layers/${layerId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete layer");
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
