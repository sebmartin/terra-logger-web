'use client';

import {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
} from "react-map-gl/mapbox";

/**
 * Map controls component
 * Provides navigation, geolocation, scale, and fullscreen controls
 */
export function MapControls() {
  return (
    <>
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" />
      <ScaleControl position="bottom-left" />
      <FullscreenControl position="top-right" />
    </>
  );
}
