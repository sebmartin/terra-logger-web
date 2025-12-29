export const SCHEMA = `
  -- Projects table
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    bounds TEXT,      -- JSON: {north, south, east, west}
    center TEXT,      -- JSON: {lat, lng}
    zoom INTEGER,     -- Map zoom level
    settings TEXT     -- JSON: additional project settings
  );

  -- Features table (drawn shapes, markers, etc.)
  CREATE TABLE IF NOT EXISTS features (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    type TEXT NOT NULL,           -- 'Marker', 'Polyline', 'Polygon', 'Rectangle', 'Circle'
    name TEXT,
    description TEXT,
    geometry TEXT NOT NULL,       -- GeoJSON geometry
    properties TEXT,              -- JSON: custom properties
    style TEXT,                   -- JSON: {color, weight, opacity, fillColor, fillOpacity, etc.}
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  -- Measurements table (for saved measurements)
  CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    feature_id TEXT,              -- Optional: link to a feature
    type TEXT NOT NULL,           -- 'distance' or 'area'
    value REAL NOT NULL,          -- Numeric value
    unit TEXT NOT NULL,           -- 'km', 'miles', 'meters', 'sqm', 'sqkm', 'acres', 'hectares'
    geometry TEXT NOT NULL,       -- GeoJSON for the measurement line/polygon
    label TEXT,                   -- Display label
    created_at INTEGER NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE SET NULL
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_features_project ON features(project_id);
  CREATE INDEX IF NOT EXISTS idx_features_updated ON features(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_measurements_project ON measurements(project_id);
  CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
`;

export interface DBProject {
  id: string;
  name: string;
  description: string | null;
  created_at: number;
  updated_at: number;
  bounds: string | null;  // JSON
  center: string | null;  // JSON
  zoom: number | null;
  settings: string | null;  // JSON
}

export interface DBFeature {
  id: string;
  project_id: string;
  type: string;
  name: string | null;
  description: string | null;
  geometry: string;  // JSON
  properties: string | null;  // JSON
  style: string | null;  // JSON
  created_at: number;
  updated_at: number;
}

export interface DBMeasurement {
  id: string;
  project_id: string;
  feature_id: string | null;
  type: 'distance' | 'area';
  value: number;
  unit: string;
  geometry: string;  // JSON
  label: string | null;
  created_at: number;
}
