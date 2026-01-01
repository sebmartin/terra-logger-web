/**
 * Mapbox GL JS Container
 * Native Mapbox rendering with vector tiles and full style support
 */

import { useRef, useEffect, useState, useCallback } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  FullscreenControl,
  MapRef,
  Layer,
  Source
} from "react-map-gl";
import { useMap } from "../../context/MapContext";
import { useSiteContext } from "../../context/SiteContext";
import { useFeatureContext } from "../../context/FeatureContext";
import { useLayerContext } from "../../context/LayerContext";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

// Map styles - direct Mapbox style URLs with native vector tiles
const MAP_STYLES = {
  topology: `mapbox://styles/sebmartin/cl0daly1b002j15ldl6d0xcmh`, // Your custom style!
  satellite: `mapbox://styles/mapbox/satellite-streets-v12`,
  outdoors: `mapbox://styles/mapbox/outdoors-v12`,
  streets: `mapbox://styles/mapbox/streets-v12`,
};

export default function MapboxContainer() {
  const mapRef = useRef<MapRef>(null);
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.topology);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);

  const { setMap, updateMapState } = useMap();
  const { selectedSite } = useSiteContext();
  const { createFeature, features } = useFeatureContext();
  const { selectedLayerId } = useLayerContext();

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

  // Initialize map
  useEffect(() => {
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
    return () => {
      map.off("move", handleMove);
    };
  }, [setMap, updateMapState]);

  // Fly to site when selected
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

  // Handle map click for drawing
  const handleMapClick = useCallback((event: any) => {
    if (!drawingMode || !selectedLayerId) return;

    const { lng, lat } = event.lngLat;

    if (drawingMode === "point") {
      // Create point feature
      createFeature({
        type: "point",
        layerId: selectedLayerId,
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {},
      }).then(() => {
        console.log("Point feature created");
        setDrawingMode(null);
      }).catch((error) => {
        console.error("Failed to create feature:", error);
      });
    }
  }, [drawingMode, selectedLayerId, createFeature]);

  // Handle Escape key to cancel drawing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawingMode(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        onClick={handleMapClick}
        cursor={drawingMode ? "crosshair" : "grab"}
        attributionControl={false}
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
          <select || 'topology'
            value={Object.keys(MAP_STYLES).find(key => MAP_STYLES[key as keyof typeof MAP_STYLES] === mapStyle)}
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
              padding: "8px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              zIndex: 1,
            }}
          >
            <button
              onClick={() => setDrawingMode(null)}
              style={{
                padding: "8px 12px",
                border: drawingMode === null ? "2px solid #3388ff" : "1px solid #ddd",
                background: drawingMode === null ? "#e3f2fd" : "white",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: drawingMode === null ? "600" : "normal",
                fontFamily: "inherit",
              }}
              title="Select (Esc)"
            >
              ⬜ Select
            </button>
            <button
              onClick={() => setDrawingMode("point")}
              style={{
                padding: "8px 12px",
                border: drawingMode === "point" ? "2px solid #3388ff" : "1px solid #ddd",
                background: drawingMode === "point" ? "#e3f2fd" : "white",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: drawingMode === "point" ? "600" : "normal",
                fontFamily: "inherit",
              }}
              title="Click map to add point"
            >
              📍 Point
            </button>
            <div
              style={{
                fontSize: "11px",
                color: "#666",
                padding: "8px 4px",
                textAlign: "center",
                lineHeight: "1.3",
              }}
            >
              🚧 Advanced drawing tools<br />(polygon, line, etc.)<br />coming soon!
            </div>
          </div>
        )}

        {/* Render features from database */}
        {features.map((feature) => {
          const geojson = {
            type: "Feature" as const,
            geometry: feature.geometry,
            properties: feature.properties || {},
          };

          if (feature.geometry.type === "Point") {
            return (
              <Source key={feature.id} id={`feature-${feature.id}`} type="geojson" data={geojson}>
                <Layer
                  id={`feature-layer-${feature.id}`}
                  type="circle"
                  paint={{
                    "circle-radius": 8,
                    "circle-color": "#3388ff",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                  }}
                />
              </Source>
            );
          } else if (feature.geometry.type === "LineString") {
            return (
              <Source key={feature.id} id={`feature-${feature.id}`} type="geojson" data={geojson}>
                <Layer
                  id={`feature-layer-${feature.id}`}
                  type="line"
                  paint={{
                    "line-color": "#3388ff",
                    "line-width": 3,
                  }}
                />
              </Source>
            );
          } else if (feature.geometry.type === "Polygon") {
            return (
              <Source key={feature.id} id={`feature-${feature.id}`} type="geojson" data={geojson}>
                <Layer
                  id={`feature-layer-fill-${feature.id}`}
                  type="fill"
                  paint={{
                    "fill-color": "#3388ff",
                    "fill-opacity": 0.3,
                  }}
                />
                <Layer
                  id={`feature-layer-outline-${feature.id}`}
                  type="line"
                  paint={{
                    "line-color": "#3388ff",
                    "line-width": 2,
                  }}
                />
              </Source>
            );
          }
          return null;
        })}
      </Map>
    </div>
  );
}
