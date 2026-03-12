"use client";

import { Map } from "mapbox-gl";
import { createContext, useContext, useEffect, useState } from "react";
import { TerraDraw } from "terra-draw";

export type GeometryType = "point" | "linestring" | "polygon" | "rectangle" | "circle"; // TODO: normalize this type of thing, I think there are dupes

// TODO: selected feature and editing feature ID are stored differently between this and FeatureStore...
//  I think the selected feature belongs here since it's map-instance-specific
//  Stores are global state and probably shouldn't have UI state like "selected feature" and "editing feature ID"
//  But layer visibility is in the store and that gets persisted too... hmm.
export type MapViewMode =
  | { type: 'viewing' }
  | { type: 'editing', featureId: string }
  | { type: 'moving', featureId: string }
  | { type: 'drawing', geometryType: GeometryType }
  | { type: 'measuring', geometryType: GeometryType } // TODO: like drawing mode but temporary shape to measure is not saved
  | { type: 'tracking' }; // TODO

export interface MapContextValue {
  map: Map | null;
  setMap: (map: Map) => void;
  draw: TerraDraw | null;
  setDraw: (draw: TerraDraw | null) => void;
  mapStyle: string;
  setMapStyle: (style: string) => void;
  mode: MapViewMode;
  setMode: (mode: MapViewMode) => void;
  viewport: Viewport;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapCenter {
  lat: number;
  lng: number;
}

interface Viewport {
  // TODO: Do we need both center and bounds?
  center: MapCenter | null;
  zoom: number;
  bounds: Bounds | null;
}

export const MapContext = createContext<MapContextValue | null>(null);

const VIEWPORT_STORAGE_KEY = 'terra-logger-viewport';

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Map | null>(null);
  const [draw, setDraw] = useState<TerraDraw | null>(null);
  const [mapStyle, setMapStyle] = useState<string>("mapbox://styles/sebmartin/cl0daly1b002j15ldl6d0xcmh");
  const [mode, setMode] = useState<MapViewMode>({ type: "viewing" });
  const [viewport, setViewport] = useState<Viewport>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(VIEWPORT_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('[MapProvider] Failed to parse stored viewport:', e);
        }
      }
    }
    return {
      center: null,
      zoom: 13,
      bounds: null,
    };
  });

  // Persist viewport to localStorage (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const timeoutId = setTimeout(() => {
      localStorage.setItem(VIEWPORT_STORAGE_KEY, JSON.stringify(viewport));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [viewport]);

  // Keep map viewport in sync
  useEffect(() => {
    if (!map) return;

    const handleMove = () => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      setViewport({
        center: {
          lat: center.lat,
          lng: center.lng,
        },
        zoom: map.getZoom(),
        bounds: bounds ? {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        } : null,
      });
    }

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
    };
  }, [map, setViewport]);

  return (
    <MapContext.Provider value={{
      map,
      setMap,
      draw,
      setDraw,
      mapStyle,
      setMapStyle,
      mode,
      setMode,
      viewport
    }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
