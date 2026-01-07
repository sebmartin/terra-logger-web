'use client';

/**
 * Mapbox GL JS Container
 * Native Mapbox rendering with Terra Draw for drawing and editing
 *
 * Architecture:
 * - Terra Draw: Handles ALL feature interaction (draw, select, edit, display)
 * - Database: Persistent storage synced with Terra Draw
 * - Features are loaded from DB into Terra Draw for unified editing experience
 */

import { useRef, useEffect, useState } from "react";
import { MapRef } from "react-map-gl/mapbox";
import { useMapStore } from "../../stores/mapStore";
import { useSiteStore } from "../../stores/siteStore";
import { useFeatureStore } from "../../stores/featureStore";
import { useLayerStore } from "../../stores/layerStore";
import { useTerraDrawSetup } from "../../hooks/useTerraDrawSetup";
import { useTerraDrawSync } from "../../hooks/useTerraDrawSync";
import { useTerraDrawEvents } from "../../hooks/useTerraDrawEvents";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import { MapView } from "./MapView";
import { MapControls } from "./MapControls";
import { MapStyleSelector, MAP_STYLES } from "./MapStyleSelector";
import { DrawingToolbar } from "./DrawingToolbar";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";


export default function MapboxContainer() {
  const mapRef = useRef<MapRef>(null);
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.topology);
  const [mapReady, setMapReady] = useState(false);

  // Store actions
  const setMap = useMapStore((state) => state.setMap);
  const updateMapState = useMapStore((state) => state.updateMapState);
  const setDraw = useMapStore((state) => state.setDraw);

  const selectedSite = useSiteStore((state) => state.selectedSite());

  const createFeature = useFeatureStore((state) => state.createFeature);
  const features = useFeatureStore((state) => state.features);
  const deleteFeature = useFeatureStore((state) => state.deleteFeature);
  const updateFeature = useFeatureStore((state) => state.updateFeature);

  const selectedLayerId = useLayerStore((state) => state.selectedLayerId);
  const toggleLayerVisibility = useLayerStore((state) => state.toggleLayerVisibility);
  const layers = useLayerStore((state) => state.layers);

  // Get map instance
  const map = mapRef.current?.getMap() || null;

  // Setup Terra Draw with all modes
  const { draw, ready: terraDrawReady, currentMode, setMode } = useTerraDrawSetup(map, mapReady);

  // Handle Terra Draw events (finish, select, change, deselect)
  const { selectedFeatureId, setSelectedFeatureId } = useTerraDrawEvents(
    draw,
    terraDrawReady,
    selectedLayerId,
    createFeature,
    updateFeature,
    deleteFeature,
    setMode
  );

  // Sync database features with Terra Draw
  useTerraDrawSync(draw, terraDrawReady, features);

  // Handle keyboard shortcuts and site bounds
  useMapInteractions(
    mapRef,
    draw,
    selectedFeatureId,
    setSelectedFeatureId,
    selectedSite,
    deleteFeature
  );

  // Store map instance in Zustand when ready
  useEffect(() => {
    if (!map) return;
    setMap(map as any);
  }, [map, setMap]);

  // Store Terra Draw instance in Zustand
  useEffect(() => {
    if (!draw) return;
    setDraw(draw);
  }, [draw, setDraw]);

  // Update map state on move/zoom
  useEffect(() => {
    if (!map) return;

    const handleMove = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      updateMapState({ center, zoom });
    };

    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
    };
  }, [map, updateMapState]);

  // Auto-enable visibility when selecting a layer
  useEffect(() => {
    if (!selectedLayerId) return;

    const layer = layers.find((l) => l.id === selectedLayerId);
    if (layer && !layer.visible) {
      toggleLayerVisibility(selectedLayerId);
    }
  }, [selectedLayerId, layers, toggleLayerVisibility]);


  // Check for Mapbox token
  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div>
          <h2>Mapbox Token Required</h2>
          <p>Please set your NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in a .env file</p>
          <p>
            Get a free token at:{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapView
        ref={mapRef}
        mapStyle={mapStyle}
        currentMode={currentMode}
        onLoad={() => setMapReady(true)}
      >
        <MapControls />
        <MapStyleSelector currentStyle={mapStyle} onStyleChange={setMapStyle} />
        <DrawingToolbar
          currentMode={currentMode}
          onModeChange={setMode}
          visible={!!selectedLayerId}
        />
      </MapView>
    </div>
  );
}
