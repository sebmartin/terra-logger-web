import { useState } from "react";
import * as turf from "@turf/turf";

type LatLng = { lat: number; lng: number };

export interface MeasurementResult {
  distance?: {
    km: number;
    miles: number;
    meters: number;
    feet: number;
  };
  area?: {
    sqm: number;
    sqkm: number;
    acres: number;
    hectares: number;
    sqft: number;
  };
}

export function useMeasure() {
  const [activeMeasurement, setActiveMeasurement] =
    useState<MeasurementResult | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const measureDistance = (
    latlngs: LatLng[],
  ): MeasurementResult["distance"] => {
    if (latlngs.length < 2) {
      return { km: 0, miles: 0, meters: 0, feet: 0 };
    }

    const line = turf.lineString(latlngs.map((ll) => [ll.lng, ll.lat]));
    const lengthKm = turf.length(line, { units: "kilometers" });

    return {
      km: lengthKm,
      miles: lengthKm * 0.621371,
      meters: lengthKm * 1000,
      feet: lengthKm * 3280.84,
    };
  };

  const measureArea = (latlngs: LatLng[]): MeasurementResult["area"] => {
    if (latlngs.length < 3) {
      return { sqm: 0, sqkm: 0, acres: 0, hectares: 0, sqft: 0 };
    }

    // Close the polygon if it's not already closed
    const coords = latlngs.map((ll) => [ll.lng, ll.lat]);
    if (
      coords[0][0] !== coords[coords.length - 1][0] ||
      coords[0][1] !== coords[coords.length - 1][1]
    ) {
      coords.push(coords[0]);
    }

    const polygon = turf.polygon([coords]);
    const areaSqm = turf.area(polygon);

    return {
      sqm: areaSqm,
      sqkm: areaSqm / 1_000_000,
      acres: areaSqm * 0.000247105,
      hectares: areaSqm / 10_000,
      sqft: areaSqm * 10.7639,
    };
  };

  const startMeasuring = () => {
    setIsMeasuring(true);
    setActiveMeasurement(null);
  };

  const stopMeasuring = () => {
    setIsMeasuring(false);
  };

  const clearMeasurement = () => {
    setActiveMeasurement(null);
  };

  return {
    measureDistance,
    measureArea,
    activeMeasurement,
    setActiveMeasurement,
    isMeasuring,
    startMeasuring,
    stopMeasuring,
    clearMeasurement,
  };
}
