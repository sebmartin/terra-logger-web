/**
 * Service layer for feature operations
 * Encapsulates all feature-related business logic and API calls
 */

import type { Feature, NewFeature, FeatureUpdate, FeatureType } from "../types/feature";
import { parseFeature, parseFeatures } from "../utils/geojson";
import { calculateMeasurements, type Measurements } from "../utils/measurements";

export class FeatureService {
  /**
   * List all features for a specific layer
   */
  async list(layerId: string): Promise<Feature[]> {
    const response = await fetch(`/api/layers/${layerId}/features`);
    if (!response.ok) throw new Error("Failed to fetch features");
    const rawFeatures = await response.json();
    return parseFeatures(rawFeatures);
  }

  /**
   * Get a single feature by ID
   */
  async get(featureId: string): Promise<Feature | null> {
    try {
      const response = await fetch(`/api/features/${featureId}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch feature");
      const raw = await response.json();
      return parseFeature(raw);
    } catch (error) {
      console.error("Failed to get feature:", error);
      return null;
    }
  }

  /**
   * Create a new feature
   */
  async create(layerId: string, featureData: Omit<NewFeature, "layer_id">): Promise<Feature> {
    const response = await fetch(`/api/layers/${layerId}/features`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...featureData,
        layer_id: layerId,
      }),
    });
    if (!response.ok) throw new Error("Failed to create feature");
    const created = await response.json();
    return parseFeature(created);
  }

  /**
   * Update an existing feature
   */
  async update(featureId: string, updates: FeatureUpdate): Promise<Feature> {
    const response = await fetch(`/api/features/${featureId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update feature");
    const updated = await response.json();
    return parseFeature(updated);
  }

  /**
   * Delete a feature
   */
  async delete(featureId: string): Promise<void> {
    const response = await fetch(`/api/features/${featureId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete feature");
  }

  /**
   * Calculate measurements for a feature's geometry
   */
  calculateMeasurements(geoJSON: any, featureType: FeatureType): Measurements {
    return calculateMeasurements(geoJSON, featureType);
  }

  /**
   * Create a feature with automatic measurement calculation
   */
  async createWithMeasurements(
    layerId: string,
    featureData: Omit<NewFeature, "layer_id" | "properties"> & {
      properties?: any;
    },
  ): Promise<Feature> {
    // Calculate measurements
    const measurements = this.calculateMeasurements(
      { geometry: featureData.geometry },
      featureData.type,
    );

    // Merge measurements with existing properties
    const properties = {
      ...(featureData.properties || {}),
      ...measurements,
    };

    return this.create(layerId, {
      ...featureData,
      properties,
    });
  }

  /**
   * Update feature geometry and recalculate measurements
   */
  async updateGeometryWithMeasurements(
    featureId: string,
    geometry: any,
    featureType: FeatureType,
  ): Promise<Feature> {
    // Get existing feature to preserve properties
    const existing = await this.get(featureId);
    if (!existing) {
      throw new Error(`Feature ${featureId} not found`);
    }

    // Calculate new measurements
    const measurements = this.calculateMeasurements({ geometry }, featureType);

    // Merge with existing properties (preserve custom properties)
    const properties = {
      ...(existing.properties || {}),
      ...measurements,
    };

    return this.update(featureId, {
      geometry,
      properties,
    });
  }
}

// Export singleton instance
export const featureService = new FeatureService();
