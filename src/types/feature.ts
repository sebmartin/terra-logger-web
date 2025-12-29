import type { GeoJSON } from 'geojson';

export type FeatureType = 'Marker' | 'Polyline' | 'Polygon' | 'Rectangle' | 'Circle';

export interface Feature {
  id: string;
  site_id: string | null;      // For existing/permanent features
  project_id: string | null;    // For proposed/planning features
  type: FeatureType;
  name: string | null;
  description: string | null;
  geometry: GeoJSON.Geometry;
  properties: Record<string, any> | null;
  style: FeatureStyle | null;
  created_at: number;
  updated_at: number;
}

export interface FeatureStyle {
  color?: string;
  weight?: number;
  opacity?: number;
  fillColor?: string;
  fillOpacity?: number;
  dashArray?: string;
}

export interface NewFeature {
  site_id?: string;      // Either site_id or project_id must be provided
  project_id?: string;   // Either site_id or project_id must be provided
  type: FeatureType;
  name?: string;
  description?: string;
  geometry: GeoJSON.Geometry;
  properties?: Record<string, any>;
  style?: FeatureStyle;
}

export type FeatureUpdate = Partial<Omit<Feature, 'id' | 'site_id' | 'project_id' | 'type' | 'created_at' | 'updated_at'>>;

export interface Measurement {
  id: string;
  project_id: string;
  feature_id: string | null;
  type: 'distance' | 'area';
  value: number;
  unit: string;
  geometry: GeoJSON.Geometry;
  label: string | null;
  created_at: number;
}

export interface NewMeasurement {
  project_id: string;
  feature_id?: string;
  type: 'distance' | 'area';
  value: number;
  unit: string;
  geometry: GeoJSON.Geometry;
  label?: string;
}
