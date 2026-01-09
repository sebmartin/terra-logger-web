'use client';

import { forwardRef } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapViewProps {
  mapStyle: string;
  currentMode: string | null;
  onLoad: () => void;
  children?: React.ReactNode;
}

/**
 * Pure Mapbox GL map wrapper component
 * Handles map rendering with react-map-gl
 */
export const MapView = forwardRef<MapRef, MapViewProps>(
  ({ mapStyle, currentMode, onLoad, children }, ref) => {
    const initialViewState = {
      longitude: -98.5795,
      latitude: 39.8283,
      zoom: 5,
    };

    const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

    return (
      <Map
        ref={ref}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxAccessToken}
        cursor={currentMode === "select" ? "default" : "crosshair"}
        attributionControl={false}
        onLoad={onLoad}
      >
        {children}
      </Map>
    );
  }
);

MapView.displayName = "MapView";
