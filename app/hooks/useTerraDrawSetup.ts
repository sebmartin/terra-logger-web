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

/**
 * Custom hook to initialize and manage Terra Draw instance
 * Handles mode registration and lifecycle management
 */
export function useTerraDrawSetup(
  map: MapboxMap | null,
  mapReady: boolean,
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
        tracked: true,
        adapter: new TerraDrawMapboxGLAdapter({ 
          map,
          coordinatePrecision: 9,
        }),
        modes: [
          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  scaleable: true,
                  rotateable: true,
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              linestring: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              point: {
                feature: {
                  draggable: true,
                },
              },
              circle: {
                feature: {
                  draggable: true,
                },
              },
              rectangle: {
                feature: {
                  draggable: true,
                  coordinates: {
                    resizable: "opposite",
                  },
                },
              },
            },
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

      // Store ref BEFORE starting so it's available immediately
      terraDrawRef.current = draw;
      
      // Start TerraDraw - this begins listening to map events
      console.log("[useTerraDrawSetup] Calling draw.start()");
      draw.start();
      console.log("[useTerraDrawSetup] draw.start() completed, setting mode to select");
      draw.setMode("select");
      setCurrentMode("select");
      
      // Set ready state and notify - this triggers a re-render
      console.log("[useTerraDrawSetup] TerraDraw ready, calling onReady callback");
      setReady(true);
      onReady?.(draw);
    };

    // Configure Terra Draw once the map style is fully loaded
    // We also need to reconfigure when the map style changes
    // Always listen for style.load first, then check if already loaded
    // This avoids a race condition where both fire
    map.on("style.load", initializeTerraDrawWhenReady);
    
    if (map.isStyleLoaded()) {
      initializeTerraDrawWhenReady();
    }

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
