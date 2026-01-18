import { useRef } from "react";
import Map, { MapRef } from "react-map-gl/mapbox";
import { useMapContext } from "./MapProvider";

interface MapCanvasProps extends React.PropsWithChildren { }

export function MapCanvas(
  { children }: MapCanvasProps
) {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  const mapRef = useRef<MapRef>(null);
  const { setMap } = useMapContext();

  return (
    <Map
      ref={mapRef}
      // initialViewState={initialViewState}
      // mapStyle={mapStyle}
      mapStyle="mapbox://styles/sebmartin/cl0daly1b002j15ldl6d0xcmh"
      mapboxAccessToken={mapboxAccessToken}
      attributionControl={false}
      onLoad={() => {
        if (mapRef.current) {
          console.log("[MapCanvas] Map loaded");
          setMap(mapRef.current.getMap());
        }
      }}
    >
      {children}
    </Map>
  );
};