/**
 * Utility functions for GeoJSON parsing and manipulation
 */

import type { Feature } from "../types/feature";
import type { Site } from "../types/site";
import type { Layer } from "../types/layer";

/**
 * Parse a feature from the database, converting JSON strings to objects
 */
export function parseFeature(raw: any): Feature {
  return {
    ...raw,
    geometry:
      typeof raw.geometry === "string"
        ? JSON.parse(raw.geometry)
        : raw.geometry,
    properties: raw.properties
      ? typeof raw.properties === "string"
        ? JSON.parse(raw.properties)
        : raw.properties
      : null,
    style: raw.style
      ? typeof raw.style === "string"
        ? JSON.parse(raw.style)
        : raw.style
      : null,
    locked: Boolean(raw.locked),
  };
}

/**
 * Parse multiple features from database
 */
export function parseFeatures(rawFeatures: any[]): Feature[] {
  return rawFeatures.map(parseFeature);
}

/**
 * Parse a site from the database, converting JSON strings to objects
 */
export function parseSite(raw: any): Site {
  return {
    ...raw,
    bounds:
      typeof raw.bounds === "string" ? JSON.parse(raw.bounds) : raw.bounds,
  };
}

/**
 * Parse multiple sites from database
 */
export function parseSites(rawSites: any[]): Site[] {
  return rawSites.map(parseSite);
}

/**
 * Parse a layer from the database, converting SQLite integers to booleans
 */
export function parseLayer(raw: any): Layer {
  return {
    ...raw,
    visible: Boolean(raw.visible),
  };
}

/**
 * Parse multiple layers from database
 */
export function parseLayers(rawLayers: any[]): Layer[] {
  return rawLayers.map(parseLayer);
}
