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

export default function MapBridge() {
  const leafletMap = useLeafletMap();
  const { setMap, updateMapState } = useMap();

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

  return (
    <>
      <MapInteractions />
      <FeatureRenderer />
    </>
  );
}
