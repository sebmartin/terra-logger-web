import { useEffect, useRef, useState } from "react";
import { Map as MapboxMap } from "mapbox-gl";
import {
  TerraDraw,
  TerraDrawSelectMode,
  TerraDrawPointMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawCircleMode,
} from "terra-draw";
import { TerraDrawMapboxGLAdapter } from "terra-draw-mapbox-gl-adapter";
import { polygon } from "@turf/helpers";

/**
 * Custom hook to initialize and manage Terra Draw instance
 * Handles mode registration and lifecycle management
 */
export function useTerraDrawSetup(
  map: MapboxMap | null,
  mapReady: boolean,
  mapStyle: string,
  onReady?: (draw: TerraDraw) => void
): {
  draw: TerraDraw | null;
  ready: boolean;
  currentMode: string | null;
  setMode: (mode: string) => void;
} {
  const terraDrawRef = useRef<TerraDraw | null>(null);
  const [ready, setReady] = useState(false);
  const [currentMode, setCurrentMode] = useState<string | null>(null);

  useEffect(() => {
    if (!mapReady || !map) return;

    const initializeTerraDrawWhenReady = () => {
      // Clean up existing instance
      if (terraDrawRef.current) {
        try {
          terraDrawRef.current.stop();
        } catch (error) {
          // Layers already destroyed by Mapbox
        }
        terraDrawRef.current = null;
        setReady(false);
      }

      // Initialize Terra Draw with all drawing and editing modes
      const draw = new TerraDraw({
        adapter: new TerraDrawMapboxGLAdapter({ map }),
        modes: [
          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                }
              }
            },
            pointerDistance: 10,
          }),
          new TerraDrawPointMode(),
          new TerraDrawLineStringMode({
            pointerDistance: 10,
          }),
          new TerraDrawPolygonMode({
            pointerDistance: 10,
          }),
          new TerraDrawRectangleMode(),
          new TerraDrawCircleMode(),
        ],
      });

      draw.start();
      draw.setMode("select");
      setCurrentMode("select");
      terraDrawRef.current = draw;
      setReady(true);
      onReady?.(draw);
    };

    // Configure Terra Draw once the map style is fully loaded
    // We also need to reconfigure when the map style changes
    if (map.isStyleLoaded()) {
      initializeTerraDrawWhenReady();
    }
    map.on("style.load", initializeTerraDrawWhenReady);

    return () => {
      map.off("style.load", initializeTerraDrawWhenReady);
      if (terraDrawRef.current) {
        try {
          terraDrawRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
        terraDrawRef.current = null;
      }
    };
  }, [map, mapReady]);

  const setMode = (mode: string) => {
    const draw = terraDrawRef.current;
    if (!draw) return;

    console.log(`[Terra Draw] Setting mode to: ${mode}`);

    draw.setMode(mode);
    setCurrentMode(mode);
  };

  return {
    draw: terraDrawRef.current,
    ready,
    currentMode,
    setMode,
  };
}
