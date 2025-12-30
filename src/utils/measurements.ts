/**
 * Utility functions for calculating geometric measurements
 * Uses @turf/turf for accurate geospatial calculations
 */

import * as turf from "@turf/turf";
import type { FeatureType } from "../types/feature";

export interface DistanceMeasurements {
  km: number;
  miles: number;
  meters: number;
  feet: number;
}

export interface AreaMeasurements {
  sqm: number;
  sqkm: number;
  acres: number;
  hectares: number;
  sqft: number;
}

export interface Measurements {
  distance?: DistanceMeasurements;
  area?: AreaMeasurements;
}

/**
 * Calculate measurements for a feature based on its geometry and type
 */
export function calculateMeasurements(
  geoJSON: any,
  featureType: FeatureType,
): Measurements {
  const measurements: Measurements = {};

  try {
    if (featureType === "Polyline") {
      const line = turf.lineString(geoJSON.geometry.coordinates);
      const lengthKm = turf.length(line, { units: "kilometers" });

      measurements.distance = {
        km: lengthKm,
        miles: lengthKm * 0.621371,
        meters: lengthKm * 1000,
        feet: lengthKm * 3280.84,
      };
    } else if (featureType === "Polygon" || featureType === "Rectangle") {
      const polygon = turf.polygon(geoJSON.geometry.coordinates);
      const areaSqm = turf.area(polygon);

      measurements.area = {
        sqm: areaSqm,
        sqkm: areaSqm / 1_000_000,
        acres: areaSqm * 0.000247105,
        hectares: areaSqm / 10_000,
        sqft: areaSqm * 10.7639,
      };
    }
  } catch (error) {
    console.error("Failed to calculate measurements:", error);
  }

  return measurements;
}

/**
 * Format distance measurements for display
 */
export function formatDistance(distance: DistanceMeasurements): string {
  return `${distance.km.toFixed(2)} km (${distance.miles.toFixed(2)} mi)`;
}

/**
 * Format area measurements for display
 */
export function formatArea(area: AreaMeasurements): string {
  return `${area.acres.toFixed(2)} acres (${area.hectares.toFixed(2)} ha)`;
}
