export const SCHEMA = `
  -- Sites table (geographic locations)
  CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    bounds TEXT NOT NULL,         -- JSON: {north, south, east, west}
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  -- Layers table
  CREATE TABLE IF NOT EXISTS layers (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    visible INTEGER NOT NULL DEFAULT 1,  -- Show/hide layer (0 or 1)
    color TEXT,       -- Layer color for visual distinction
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
  );

  -- Features table (drawn shapes, markers, etc.)
  CREATE TABLE IF NOT EXISTS features (
    id TEXT PRIMARY KEY,
    site_id TEXT,                 -- For site-level features
    layer_id TEXT,                -- For layer-specific features
    type TEXT NOT NULL,           -- 'Marker', 'Polyline', 'Polygon', 'Rectangle', 'Circle'
    name TEXT,
    description TEXT,
    geometry TEXT NOT NULL,       -- GeoJSON geometry
    properties TEXT,              -- JSON: custom properties
    style TEXT,                   -- JSON: {color, weight, opacity, fillColor, fillOpacity, etc.}
    locked INTEGER NOT NULL DEFAULT 0,  -- Prevent editing when 1
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    FOREIGN KEY (layer_id) REFERENCES layers(id) ON DELETE CASCADE,
    CHECK ((site_id IS NOT NULL AND layer_id IS NULL) OR (site_id IS NULL AND layer_id IS NOT NULL))
  );

  -- Measurements table (for saved measurements)
  CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY,
    layer_id TEXT NOT NULL,
    feature_id TEXT,              -- Optional: link to a feature
    type TEXT NOT NULL,           -- 'distance' or 'area'
    value REAL NOT NULL,          -- Numeric value
    unit TEXT NOT NULL,           -- 'km', 'miles', 'meters', 'sqm', 'sqkm', 'acres', 'hectares'
    geometry TEXT NOT NULL,       -- GeoJSON for the measurement line/polygon
    label TEXT,                   -- Display label
    created_at INTEGER NOT NULL,
    FOREIGN KEY (layer_id) REFERENCES layers(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE SET NULL
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_features_site ON features(site_id);
  CREATE INDEX IF NOT EXISTS idx_features_layer ON features(layer_id);
  CREATE INDEX IF NOT EXISTS idx_features_updated ON features(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_measurements_layer ON measurements(layer_id);
  CREATE INDEX IF NOT EXISTS idx_layers_site ON layers(site_id);
  CREATE INDEX IF NOT EXISTS idx_layers_updated ON layers(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sites_updated ON sites(updated_at DESC);
`;

export interface DBSite {
  id: string;
  name: string;
  description: string | null;
  bounds: string; // JSON
  created_at: number;
  updated_at: number;
}

export interface DBLayer {
  id: string;
  site_id: string;
  name: string;
  description: string | null;
  visible: number; // 0 or 1
  color: string | null;
  created_at: number;
  updated_at: number;
}

export interface DBFeature {
  id: string;
  site_id: string | null;
  layer_id: string | null;
  type: string;
  name: string | null;
  description: string | null;
  geometry: string; // JSON
  properties: string | null; // JSON
  style: string | null; // JSON
  locked: number; // 0 or 1 (SQLite boolean)
  created_at: number;
  updated_at: number;
}

export interface DBMeasurement {
  id: string;
  layer_id: string;
  feature_id: string | null;
  type: "distance" | "area";
  value: number;
  unit: string;
  geometry: string; // JSON
  label: string | null;
  created_at: number;
}
