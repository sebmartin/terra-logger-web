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
    const rawFeatures = await window.electron.listFeatures(layerId);
    return parseFeatures(rawFeatures);
  }

  /**
   * Get a single feature by ID
   */
  async get(featureId: string): Promise<Feature | null> {
    try {
      const raw = await window.electron.getFeature(featureId);
      if (!raw) return null;
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
    const created = await window.electron.createFeature(layerId, {
      ...featureData,
      layer_id: layerId,
    });
    return parseFeature(created);
  }

  /**
   * Update an existing feature
   */
  async update(featureId: string, updates: FeatureUpdate): Promise<Feature> {
    const updated = await window.electron.updateFeature(featureId, updates);
    return parseFeature(updated);
  }

  /**
   * Delete a feature
   */
  async delete(featureId: string): Promise<void> {
    await window.electron.deleteFeature(featureId);
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
