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
  const [draw, setDraw] = useState<TerraDraw | null>(null);
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
        setDraw(null);
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
      try {
        draw.start();
      } catch (err) {
        console.error("[useTerraDrawSetup] draw.start() threw:", err);
        return;
      }
      draw.setMode("select");
      setCurrentMode("select");
      setDraw(draw);
      setReady(true);
      onReady?.(draw);
    };

    // Initialize immediately — mapReady=true means onLoad has fired, which means
    // the style is already loaded (onLoad fires after style.load in Mapbox GL JS v3).
    // Also listen for future style changes (e.g. user switches map style).
    map.on("style.load", initializeTerraDrawWhenReady);
    initializeTerraDrawWhenReady();

    return () => {
      map.off("style.load", initializeTerraDrawWhenReady);
      if (terraDrawRef.current) {
        try {
          terraDrawRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
        terraDrawRef.current = null;
        setDraw(null);
      }
    };
  }, [map, mapReady]);

  const setMode = (mode: string) => {
    const draw = terraDrawRef.current;
    if (!draw) return;

    draw.setMode(mode);
    setCurrentMode(mode);
  };

  return {
    draw,
    ready,
    currentMode,
    setMode,
  };
}
