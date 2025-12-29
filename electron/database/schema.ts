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

  -- Projects table
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning',  -- 'planning', 'in_progress', 'completed', 'archived'
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    completed_at INTEGER,
    bounds TEXT,      -- JSON: {north, south, east, west}
    center TEXT,      -- JSON: {lat, lng}
    zoom INTEGER,     -- Map zoom level
    settings TEXT,    -- JSON: additional project settings
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
  );

  -- Features table (drawn shapes, markers, etc.)
  CREATE TABLE IF NOT EXISTS features (
    id TEXT PRIMARY KEY,
    site_id TEXT,                 -- For existing/permanent features
    project_id TEXT,              -- For proposed/planning features
    type TEXT NOT NULL,           -- 'Marker', 'Polyline', 'Polygon', 'Rectangle', 'Circle'
    name TEXT,
    description TEXT,
    geometry TEXT NOT NULL,       -- GeoJSON geometry
    properties TEXT,              -- JSON: custom properties
    style TEXT,                   -- JSON: {color, weight, opacity, fillColor, fillOpacity, etc.}
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CHECK ((site_id IS NOT NULL AND project_id IS NULL) OR (site_id IS NULL AND project_id IS NOT NULL))
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
  CREATE INDEX IF NOT EXISTS idx_features_site ON features(site_id);
  CREATE INDEX IF NOT EXISTS idx_features_project ON features(project_id);
  CREATE INDEX IF NOT EXISTS idx_features_updated ON features(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_measurements_project ON measurements(project_id);
  CREATE INDEX IF NOT EXISTS idx_projects_site ON projects(site_id);
  CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  CREATE INDEX IF NOT EXISTS idx_sites_updated ON sites(updated_at DESC);
`;

export interface DBSite {
  id: string;
  name: string;
  description: string | null;
  bounds: string;  // JSON
  created_at: number;
  updated_at: number;
}

export interface DBProject {
  id: string;
  site_id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
  bounds: string | null;  // JSON
  center: string | null;  // JSON
  zoom: number | null;
  settings: string | null;  // JSON
}

export interface DBFeature {
  id: string;
  site_id: string | null;
  project_id: string | null;
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
