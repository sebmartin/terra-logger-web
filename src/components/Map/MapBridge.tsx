/**
 * MapBridge Component
 * Bridges React-Leaflet's internal context with the application's MapContext
 * This component is necessary because useLeafletMap() only works inside MapContainer
 * and we need to expose the Leaflet map instance to the rest of the application
 */

import { useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../../context/MapContext";
import MapInteractions from "./MapInteractions";
import FeatureRenderer from "./FeatureRenderer";
import { useSiteContext } from "@/context/SiteContext";
import { Layer } from "leaflet";

interface MapBridgeProps {
  baseMaps?: { [key: string]: Layer };
}

export default function MapBridge({ baseMaps }: MapBridgeProps) {
  const leafletMap = useLeafletMap();
  const { map, setMap, updateMapState } = useMap();
  const { selectedSite } = useSiteContext();

  useEffect(() => {
    if (leafletMap) {
      setMap(leafletMap);

      // Update map state on move/zoom
      const handleMoveEnd = () => {
        updateMapState({
          center: leafletMap.getCenter(),
          zoom: leafletMap.getZoom(),
          bounds: leafletMap.getBounds(),
        });
      };

      leafletMap.on("moveend", handleMoveEnd);
      leafletMap.on("zoomend", handleMoveEnd);

      // Initial state
      handleMoveEnd();

      return () => {
        leafletMap.off("moveend", handleMoveEnd);
        leafletMap.off("zoomend", handleMoveEnd);
      };
    }
  }, [leafletMap, setMap, updateMapState]);

  // Navigate to site bounds when site is selected
  useEffect(() => {
    if (!map) return;

    const boundsToShow = selectedSite?.bounds;

    if (boundsToShow) {
      map.fitBounds(
        [
          [boundsToShow.south, boundsToShow.west],
          [boundsToShow.north, boundsToShow.east],
        ],
        {
          padding: [50, 50],
          animate: true,
          duration: 0.5,
        },
      );
    }
  }, [map, selectedSite]);

  return (
    <>
      <MapInteractions baseMaps={baseMaps} />
      <FeatureRenderer />
    </>
  );
}
