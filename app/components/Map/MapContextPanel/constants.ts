import { MapPin, Minus, Pentagon, Square, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { GeometryType } from "@/app/components/Map/MapProvider";
import type { Feature, FeatureType } from "@/app/types/feature";

export const DRAW_TOOLS: {
  geometryType: GeometryType;
  label: string;
  Icon: LucideIcon;
}[] = [
  { geometryType: "point", label: "Marker", Icon: MapPin },
  { geometryType: "linestring", label: "Polyline", Icon: Minus },
  { geometryType: "polygon", label: "Polygon", Icon: Pentagon },
  { geometryType: "rectangle", label: "Rectangle", Icon: Square },
  { geometryType: "circle", label: "Circle", Icon: Circle },
];

export const INSTRUCTIONS: Record<GeometryType, string> = {
  point: "Click on the map to place a marker",
  linestring: "Click to add points · Double-click to finish",
  polygon: "Click to add points · Double-click to finish",
  rectangle: "Click and drag to draw a rectangle",
  circle: "Click and drag to draw a circle",
};

export const VERTEX_EDITABLE_TYPES: FeatureType[] = ["Polyline", "Polygon", "Rectangle"];

export const PANEL_CLASS =
  "bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden w-96";

export function getMeasurement(feature: Feature | null | undefined): string {
  if (!feature) return "";
  if (feature.properties?.distance) return `${feature.properties.distance.km.toFixed(2)} km`;
  if (feature.properties?.area) return `${feature.properties.area.acres.toFixed(2)} acres`;
  return "";
}

export function getContentKey(
  mode: { type: string; featureId?: string; geometryType?: string },
  selectedFeature: Feature | null
): string {
  if (mode.type === "moving" && mode.featureId) return `moving-${mode.featureId}`;
  if (mode.type === "editing" && mode.featureId) return `editing-${mode.featureId}`;
  if (mode.type === "drawing" && mode.geometryType) return `drawing-${mode.geometryType}`;
  if (selectedFeature) return `feature-${selectedFeature.id}`;
  return "draw-tools";
}
