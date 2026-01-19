import type * as GeoJSON from "geojson";

export type FeatureType =
  | "Marker"
  | "Polyline"
  | "Polygon"
  | "Rectangle"
  | "Circle";

export interface Feature {
  id: string;
  site_id: string | null; // For site-level features -- is this still necessary?
  layer_id: string | null; // For layer-specific features
  type: FeatureType;
  name: string | null;
  description: string | null;
  geometry: GeoJSON.Geometry;
  properties: Record<string, any> | null;
  style: FeatureStyle | null;
  locked: boolean; // Prevent editing when true
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
  site_id?: string; // Either site_id or layer_id must be provided
  layer_id?: string; // Either site_id or layer_id must be provided
  type: FeatureType;
  name?: string;
  description?: string;
  geometry: GeoJSON.Geometry;
  properties?: Record<string, any>;
  style?: FeatureStyle;
}

export type FeatureUpdate = Partial<
  Omit<
    Feature,
    "id" | "site_id" | "layer_id" | "type" | "created_at" | "updated_at"
  >
>;

export interface Measurement {
  id: string;
  layer_id: string;
  feature_id: string | null;
  type: "distance" | "area";
  value: number;
  unit: string;
  geometry: GeoJSON.Geometry;
  label: string | null;
  created_at: number;
}

export interface NewMeasurement {
  layer_id: string;
  feature_id?: string;
  type: "distance" | "area";
  value: number;
  unit: string;
  geometry: GeoJSON.Geometry;
  label?: string;
}
