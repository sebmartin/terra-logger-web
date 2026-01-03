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
import Map, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
  MapRef,
} from "react-map-gl/mapbox";
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
import { useMapStore } from "../../stores/mapStore";
import { useSiteStore } from "../../stores/siteStore";
import { useFeatureStore } from "../../stores/featureStore";
import { useLayerStore } from "../../stores/layerStore";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

// Map styles - direct Mapbox style URLs with native vector tiles (~20-50KB)
const MAP_STYLES = {
  topology: "mapbox://styles/sebmartin/cl0daly1b002j15ldl6d0xcmh",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  streets: "mapbox://styles/mapbox/streets-v12",
};

export default function MapboxContainer() {
  const mapRef = useRef<MapRef>(null);
  const terraDrawRef = useRef<TerraDraw | null>(null);
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.topology);
  const [mapReady, setMapReady] = useState(false);
  const [currentMode, setCurrentMode] = useState<string | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

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

  // Auto-enable visibility when selecting a layer
  useEffect(() => {
    if (!selectedLayerId) return;

    const layer = layers.find(l => l.id === selectedLayerId);
    if (layer && !layer.visible) {
      toggleLayerVisibility(selectedLayerId);
    }
  }, [selectedLayerId, layers, toggleLayerVisibility]);

  // Drawing tool button styles helper
  const getToolButtonStyle = (mode: string | null) => ({
    padding: "10px",
    border: currentMode === mode ? "2px solid #3388ff" : "1px solid #e0e0e0",
    background: currentMode === mode ? "#e3f2fd" : "white",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "20px",
    fontWeight: currentMode === mode ? "600" : "normal",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "44px",
    minHeight: "44px",
  });

  // Default center (US)
  const initialViewState = {
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 5,
  };

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
          <p>Please set your VITE_MAPBOX_ACCESS_TOKEN in a .env file</p>
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

  // Initialize Terra Draw once map is ready
  useEffect(() => {
    if (!mapReady || terraDrawRef.current) return;

    const map = mapRef.current?.getMap();
    if (!map) return;

    // Store map instance in context
    setMap(map as any);

    // Update map state on move/zoom
    const handleMove = () => {
      if (!map) return;
      const center = map.getCenter();
      const zoom = map.getZoom();
      updateMapState({ center, zoom });
    };

    map.on("move", handleMove);

    // Initialize Terra Draw - for drawing AND editing
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

    // Handle feature completion - save newly drawn features to DB
    draw.on("finish", (id, context) => {
      // Only save if this is a draw action (not drag/resize)
      if (context.action !== "draw") return;

      if (!selectedLayerId) {
        console.warn("No layer selected");
        return;
      }

      const snapshot = draw.getSnapshot();
      const feature = snapshot.find((f) => f.id === id);

      if (feature) {
        // Map Terra Draw geometry types to our feature types
        let featureType: any = "Marker";
        if (feature.geometry.type === "Point") featureType = "Marker";
        else if (feature.geometry.type === "LineString") featureType = "Polyline";
        else if (feature.geometry.type === "Polygon") {
          if (feature.properties?.mode === "rectangle") featureType = "Rectangle";
          else if (feature.properties?.mode === "circle") featureType = "Circle";
          else featureType = "Polygon";
        }

        // Save to database
        createFeature({
          type: featureType,
          layer_id: selectedLayerId,
          geometry: feature.geometry,
          properties: feature.properties || {},
        })
          .then((savedFeature) => {
            console.log(`Feature saved to database:`, savedFeature.id);
            // Update Terra Draw feature with database ID
            const updatedFeature = {
              ...feature,
              properties: { ...feature.properties, dbId: savedFeature.id },
            };
            draw.removeFeatures([id]);
            draw.addFeatures([updatedFeature as any]);
            // Return to select mode
            draw.setMode("select");
            setCurrentMode("select");
          })
          .catch((error) => {
            console.error("Failed to save feature:", error);
          });
      }
    });

    // Handle feature selection in Terra Draw
    draw.on("select", (id) => {
      const snapshot = draw.getSnapshot();
      const feature = snapshot.find((f: any) => f.id === id);
      if (feature?.properties?.dbId) {
        setSelectedFeatureId(String(feature.properties.dbId));
      }
    });

    // Handle feature deselection
    draw.on("deselect", () => {
      setSelectedFeatureId(null);
    });

    // Handle feature changes (editing)
    draw.on("change", (ids, changeType, context) => {
      const snapshot = draw.getSnapshot();

      if (changeType === "delete") {
        // Handle deletions
        ids.forEach((_featureId) => {
          // Find which database feature was deleted by checking the snapshot before deletion
          const dbId = selectedFeatureId;
          if (dbId) {
            deleteFeature(dbId).catch((error) => {
              console.error(`Failed to delete feature ${dbId}:`, error);
            });
          }
        });
      } else if (changeType === "update") {
        // Only update geometry if geometry changed (not just properties)
        if (context?.target === "geometry") {
          ids.forEach((featureId) => {
            const feature = snapshot.find((f) => f.id === featureId);
            if (feature?.properties?.dbId) {
              const dbId = String(feature.properties.dbId);
              updateFeature(dbId, {
                geometry: feature.geometry,
              })
                .then(() => {
                  console.log(`Feature ${dbId} geometry updated in database`);
                })
                .catch((error) => {
                  console.error(`Failed to update feature ${dbId}:`, error);
                });
            }
          });
        }
      }
    });

    draw.start();
    draw.setMode("select");
    setCurrentMode("select");
    terraDrawRef.current = draw;
    setDraw(draw);

    return () => {
      map.off("move", handleMove);
      if (terraDrawRef.current) {
        terraDrawRef.current.stop();
        terraDrawRef.current = null;
      }
    };
  }, [mapReady, setMap, updateMapState, setDraw, createFeature, updateFeature]);

  // Sync database features into Terra Draw for editing
  useEffect(() => {
    const draw = terraDrawRef.current;
    if (!draw) return;

    const snapshot = draw.getSnapshot();
    console.log(`[Sync] Features from DB: ${features.length}, Terra Draw snapshot: ${snapshot.length}`);

    const existingDbIds = new Set(
      snapshot.map((f) => f.properties?.dbId).filter(Boolean)
    );

    console.log(`[Sync] Existing DB IDs in Terra Draw:`, existingDbIds.size, Array.from(existingDbIds).slice(0, 3));
    console.log(`[Sync] Feature IDs from DB:`, features.length, features.slice(0, 3).map(f => f.id));

    // Add features from database that aren't in Terra Draw yet
    const featuresToAdd = features
      .filter((f) => !existingDbIds.has(f.id))
      .map((f) => {
        // Determine the mode property based on geometry type
        let mode = "polygon";
        if (f.geometry.type === "Point") {
          mode = "point";
        } else if (f.geometry.type === "LineString") {
          mode = "linestring";
        } else if (f.geometry.type === "Polygon") {
          // Check if it was a rectangle or circle based on properties
          if (f.properties?.mode === "rectangle") {
            mode = "rectangle";
          } else if (f.properties?.mode === "circle") {
            mode = "circle";
          } else {
            mode = "polygon";
          }
        }

        return {
          type: "Feature" as const,
          id: f.id,
          geometry: f.geometry,
          properties: {
            ...f.properties,
            dbId: f.id,
            mode: f.properties?.mode || mode
          },
        };
      });

    if (featuresToAdd.length > 0) {
      const results = draw.addFeatures(featuresToAdd as any);

      const failedResults = results.filter(r => !r.valid);
      if (failedResults.length > 0) {
        console.error(`[Terra Draw] ${failedResults.length} features failed to load:`, failedResults);
      }
    }

    // Remove features from Terra Draw that no longer exist in database
    const currentDbIds = new Set(features.map((f) => f.id));
    const toRemove = snapshot
      .filter((f) => f.properties?.dbId && !currentDbIds.has(String(f.properties.dbId)))
      .map((f) => f.id);

    if (toRemove.length > 0) {
      draw.removeFeatures(toRemove as string[]);
    }
  }, [features]);

  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedFeatureId) {
        e.preventDefault();
        const draw = terraDrawRef.current;
        if (!draw) return;

        // Find and remove from Terra Draw
        const snapshot = draw.getSnapshot();
        const feature = snapshot.find(
          (f: any) => String(f.properties?.dbId) === selectedFeatureId
        );

        if (feature) {
          draw.removeFeatures([feature.id as string]);
        }

        // Delete from database
        deleteFeature(selectedFeatureId);
        setSelectedFeatureId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedFeatureId, deleteFeature]);

  // Fit to selected site bounds
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !selectedSite) return;

    const { bounds } = selectedSite;
    if (bounds) {
      map.fitBounds(
        [
          [bounds.west, bounds.south],
          [bounds.east, bounds.north],
        ],
        { padding: 50, duration: 1000 }
      );
    }
  }, [selectedSite]);

  // Handle mode changes
  const handleModeChange = (mode: string) => {
    const draw = terraDrawRef.current;
    if (!draw) return;

    // Set mode directly - Terra Draw handles state internally
    draw.setMode(mode);
    setCurrentMode(mode);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        cursor={currentMode === "select" ? "default" : "crosshair"}
        attributionControl={false}
        onLoad={() => {
          setMapReady(true);
        }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        <ScaleControl position="bottom-left" />
        <FullscreenControl position="top-right" />

        {/* Map Style Selector */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 1,
          }}
        >
          <select
            value={Object.keys(MAP_STYLES).find(key => MAP_STYLES[key as keyof typeof MAP_STYLES] === mapStyle) || 'topology'}
            onChange={(e) => setMapStyle(MAP_STYLES[e.target.value as keyof typeof MAP_STYLES])}
            style={{
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
          >
            <option value="topology">Topology (Custom)</option>
            <option value="satellite">Satellite</option>
            <option value="outdoors">Outdoors</option>
            <option value="streets">Streets</option>
          </select>
        </div>

        {/* Drawing Tools */}
        {selectedLayerId && (
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 10,
              background: "white",
              padding: "6px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              zIndex: 1,
            }}
          >
            <button
              onClick={() => handleModeChange("select")}
              style={getToolButtonStyle("select")}
              title="Select & Edit - Click features to select, drag to move/edit"
            >
              <span style={{ fontSize: "18px" }}>↖️</span>
            </button>
            <div style={{ height: "1px", background: "#e0e0e0", margin: "2px 0" }} />
            <button
              onClick={() => handleModeChange("point")}
              style={getToolButtonStyle("point")}
              title="Marker - Click to place"
            >
              📍
            </button>
            <button
              onClick={() => handleModeChange("linestring")}
              style={getToolButtonStyle("linestring")}
              title="Line - Click points, double-click to finish"
            >
              📏
            </button>
            <button
              onClick={() => handleModeChange("polygon")}
              style={getToolButtonStyle("polygon")}
              title="Polygon - Click points, double-click to finish"
            >
              ⬟
            </button>
            <button
              onClick={() => handleModeChange("rectangle")}
              style={getToolButtonStyle("rectangle")}
              title="Rectangle - Click two corners"
            >
              ▭
            </button>
            <button
              onClick={() => handleModeChange("circle")}
              style={getToolButtonStyle("circle")}
              title="Circle - Click center, then radius"
            >
              ⭕
            </button>
          </div>
        )}
      </Map>
    </div>
  );
}
