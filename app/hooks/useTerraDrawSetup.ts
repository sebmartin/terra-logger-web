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
  mapReady: boolean
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

    // Clean up existing Terra Draw instance if it exists
    if (terraDrawRef.current) {
      terraDrawRef.current.stop();
      terraDrawRef.current = null;
      setReady(false);
    }

    const initializeTerraDrawWhenReady = () => {
      // Initialize Terra Draw with all drawing and editing modes
      const draw = new TerraDraw({
        adapter: new TerraDrawMapboxGLAdapter({ map }),
        modes: [
          new TerraDrawSelectMode({
            flags: {
              arbitary: {
                feature: {},
              },
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
    };

    // Wait for style to be fully loaded before initializing Terra Draw
    const initWhenStyleReady = () => {
      if (map.isStyleLoaded()) {
        initializeTerraDrawWhenReady();
      } else {
        map.once("style.load", initializeTerraDrawWhenReady);
      }
    };

    // Use idle event to ensure map is fully initialized
    if (map.isStyleLoaded() && map.loaded()) {
      initializeTerraDrawWhenReady();
    } else {
      map.once("idle", initWhenStyleReady);
    }

    return () => {
      map.off("style.load", initializeTerraDrawWhenReady);
      map.off("idle", initWhenStyleReady);
      if (terraDrawRef.current) {
        terraDrawRef.current.stop();
        terraDrawRef.current = null;
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
    draw: terraDrawRef.current,
    ready,
    currentMode,
    setMode,
  };
}
