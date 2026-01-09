/**
 * Utility functions for GeoJSON parsing and manipulation using Zod schemas
 */

import { z } from "zod";
import type { Feature } from "../types/feature";
import type { Site } from "../types/site";
import type { Layer } from "../types/layer";

// Zod schema for parsing JSON strings to objects
const jsonString = z.string().transform((val) => JSON.parse(val));

// Schema for GeoJSON geometry (accepts both string and object)
const geometrySchema = z.union([jsonString, z.object({}).passthrough()]);

// Schema for parsing feature properties (accepts both string and object)
const propertiesSchema = z
  .union([jsonString, z.object({}).passthrough(), z.null()])
  .nullable();

// Schema for parsing feature style (accepts both string and object)
const styleSchema = z
  .union([jsonString, z.object({}).passthrough(), z.null()])
  .nullable();

// Schema for parsing SQLite boolean (0 or 1) to actual boolean
const sqliteBooleanSchema = z.union([
  z.number().transform((val) => Boolean(val)),
  z.boolean(),
]);

// Feature schema for parsing database records
const featureSchema = z.object({
  id: z.string(),
  site_id: z.string().nullable(),
  layer_id: z.string().nullable(),
  type: z.enum(["Marker", "Polyline", "Polygon", "Rectangle", "Circle"]),
  name: z.string().nullable(),
  description: z.string().nullable(),
  geometry: geometrySchema,
  properties: propertiesSchema,
  style: styleSchema,
  locked: sqliteBooleanSchema,
  created_at: z.number(),
  updated_at: z.number(),
});

// Site bounds schema
const siteBoundsSchema = z.union([
  z.string().transform((val) => JSON.parse(val)),
  z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }),
]);

// Site schema for parsing database records
const siteSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  bounds: siteBoundsSchema,
  created_at: z.number(),
  updated_at: z.number(),
});

// Layer schema for parsing database records
const layerSchema = z.object({
  id: z.string(),
  site_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  visible: sqliteBooleanSchema,
  color: z.string().nullable(),
  created_at: z.number(),
  updated_at: z.number(),
});

/**
 * Parse a feature from the database using Zod schema
 * Validates and transforms JSON strings to objects automatically
 */
export function parseFeature(raw: unknown): Feature {
  return featureSchema.parse(raw) as Feature;
}

/**
 * Parse multiple features from database
 */
export function parseFeatures(rawFeatures: unknown[]): Feature[] {
  return rawFeatures.map(parseFeature);
}

/**
 * Parse a site from the database using Zod schema
 * Validates and transforms JSON strings to objects automatically
 */
export function parseSite(raw: unknown): Site {
  return siteSchema.parse(raw) as Site;
}

/**
 * Parse multiple sites from database
 */
export function parseSites(rawSites: unknown[]): Site[] {
  return rawSites.map(parseSite);
}

/**
 * Parse a layer from the database using Zod schema
 * Validates and converts SQLite integers to booleans automatically
 */
export function parseLayer(raw: unknown): Layer {
  return layerSchema.parse(raw) as Layer;
}

/**
 * Parse multiple layers from database
 */
export function parseLayers(rawLayers: unknown[]): Layer[] {
  return rawLayers.map(parseLayer);
}
