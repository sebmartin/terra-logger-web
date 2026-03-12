import { useState } from "react";
import {
  calculateDistance,
  calculateArea,
  type DistanceMeasurements,
  type AreaMeasurements,
} from "../utils/measurements";

type LatLng = { lat: number; lng: number };

export interface MeasurementResult {
  distance?: DistanceMeasurements;
  area?: AreaMeasurements;
}

export function useMeasure() {
  const [activeMeasurement, setActiveMeasurement] =
    useState<MeasurementResult | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const measureDistance = (
    latlngs: LatLng[],
  ): DistanceMeasurements | null => {
    const coords = latlngs.map((ll) => [ll.lng, ll.lat] as [number, number]);
    return calculateDistance(coords);
  };

  const measureArea = (latlngs: LatLng[]): AreaMeasurements | null => {
    const coords = latlngs.map((ll) => [ll.lng, ll.lat] as [number, number]);
    return calculateArea(coords);
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
