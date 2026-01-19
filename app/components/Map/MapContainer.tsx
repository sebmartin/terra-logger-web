import { MapDebugOverlay } from "@/app/components/Map/MapDebugOverlay";
import { MapCanvas } from "./MapCanvas";
import { MapboxFeatureRenderer } from "@/app/features/map/display/components/MapboxFeatureRenderer";
import { useFeatureClick } from "@/app/hooks/useFeatureClick";

export default function MapContainer() {
  const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

  // Enable feature click interactions
  useFeatureClick();  // TODO: this is temporary

  return (
    <div className="relative w-full h-full">
      <MapboxFeatureRenderer />
      <MapCanvas>
        {debugMode && (<MapDebugOverlay />)}
      </MapCanvas>
    </div>
  );
}