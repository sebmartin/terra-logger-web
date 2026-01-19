/**
 * Utilities for parsing and validating GeoJSON data.
 */

import { Feature } from "./feature";

export function featureAsGeoJSON(f: Feature): GeoJSON.Feature {
  return {
    id: f.id,
    type: "Feature",
    geometry: f.geometry,
    properties: {
      // Custom properties first so they don't overwrite reserved ones
      ...f.properties,

      // Reserved properties
      id: f.id,
      layerId: f.layer_id,
      featureType: f.type,
      name: f.name,
      description: f.description,
      style: f.style,
      locked: f.locked,
      createdAt: f.created_at,
      updatedAt: f.updated_at,
    }
  };
}