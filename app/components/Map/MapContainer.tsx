import { MapDebugOverlay } from "@/app/components/Map/MapDebugOverlay";
import { MapCanvas } from "./MapCanvas";
import { MapboxFeatureRenderer } from "@/app/features/map/display/components/MapboxFeatureRenderer";
import { MapInteractions } from "../../features/map/interactions/components/MapInteractions";
import { FeatureSheet } from "../FeatureSheet/FeatureSheet";

export default function MapContainer() {
  const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

  return (
    <div className="relative w-full h-full">
      <MapboxFeatureRenderer />
      <MapCanvas>
        {debugMode && (<MapDebugOverlay />)}
        <MapInteractions />
        <FeatureSheet />
      </MapCanvas>
    </div>
  );
}