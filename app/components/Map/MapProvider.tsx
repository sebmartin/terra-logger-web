"use client";

import { Map } from "mapbox-gl";
import { createContext, useContext, useEffect, useState } from "react";
import { TerraDraw } from "terra-draw";

type GeometryType = "point" | "linestring" | "polygon" | "rectangle" | "circle";

type MapViewMode =
  | { type: 'viewing' }
  | { type: 'editing', featureId: string }
  | { type: 'drawing', geometryType: GeometryType }
  | { type: 'measuring', geometryType: GeometryType } // TODO: like drawing mode but temporary shape to measure is not saved
  | { type: 'tracking' }; // TODO

interface MapContextValue {
  map: Map | null;
  setMap: (map: Map) => void;
  draw: TerraDraw | null;
  setDraw: (draw: TerraDraw | null) => void;
  mode: MapViewMode;
  setMode: (mode: MapViewMode) => void;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
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

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Map | null>(null);
  const [draw, setDraw] = useState<TerraDraw | null>(null);
  const [mode, setMode] = useState<MapViewMode>({ type: "viewing" });
  const [viewport, setViewport] = useState<Viewport>({
    center: null,
    zoom: 13,
    bounds: null,
  });

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
      mode,
      setMode,
      viewport,
      setViewport,
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
