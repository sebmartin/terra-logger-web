/**
 * Utility functions for calculating geometric measurements
 * Uses Turf.js for accurate geospatial calculations
 */

import { lineString, polygon } from "@turf/helpers";
import length from "@turf/length";
import area from "@turf/area";
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
 * Calculate distance from coordinate pairs (lng, lat)
 */
export function calculateDistance(coords: [number, number][]): DistanceMeasurements | null {
  if (coords.length < 2) {
    return null;
  }

  const line = lineString(coords);
  const lengthKm = length(line, { units: "kilometers" });

  return {
    km: lengthKm,
    miles: lengthKm * 0.621371,
    meters: lengthKm * 1000,
    feet: lengthKm * 3280.84,
  };
}

/**
 * Calculate area from coordinate pairs (lng, lat)
 */
export function calculateArea(coords: [number, number][]): AreaMeasurements | null {
  if (coords.length < 3) {
    return null;
  }

  // Close the polygon if not already closed
  const closedCoords = [...coords];
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    closedCoords.push(first);
  }

  const poly = polygon([closedCoords]);
  const areaSqm = area(poly);

  return {
    sqm: areaSqm,
    sqkm: areaSqm / 1_000_000,
    acres: areaSqm * 0.000247105,
    hectares: areaSqm / 10_000,
    sqft: areaSqm * 10.7639,
  };
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
      const distance = calculateDistance(geoJSON.geometry.coordinates);
      if (distance) {
        measurements.distance = distance;
      }
    } else if (featureType === "Polygon" || featureType === "Rectangle") {
      const areaResult = calculateArea(geoJSON.geometry.coordinates[0]);
      if (areaResult) {
        measurements.area = areaResult;
      }
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
