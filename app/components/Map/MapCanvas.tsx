import { useEffect, useMemo, useRef } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";
import { useMapContext } from "./MapProvider";
import { useSiteStore } from "@/app/stores/siteStore";

interface MapCanvasProps extends React.PropsWithChildren { }

export function MapCanvas({ children }: MapCanvasProps) {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const mapRef = useRef<MapRef>(null);
  const { setMap, viewport, mapStyle } = useMapContext();
  const selectedSite = useSiteStore((state) => state.selectedSite());

  // Try to initialize to last known viewport from the map context
  const initialViewState = useMemo(() => {
    return viewport?.center ? {
      longitude: viewport.center.lng,
      latitude: viewport.center.lat,
      zoom: viewport.zoom,
    } : {
      // North America
      longitude: -110.31557532488375,
      latitude: 56.56253180482756,
      zoom: 2,
    }
  }, [viewport]);

  // Fly to selected site when it changes
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
        { padding: { left: 240, top: 50, right: 50, bottom: 50 }, duration: 1000 }
      );
    }
  }, [selectedSite]);

  return (
    <Map
      ref={mapRef}
      initialViewState={initialViewState}
      mapStyle={mapStyle}
      mapboxAccessToken={mapboxAccessToken}
      attributionControl={false}
      onLoad={(e) => {
        setMap(e.target);
      }}
    >
      {/* Make this absolut positioning and flex? */}
      {children}
    </Map>
  );
}