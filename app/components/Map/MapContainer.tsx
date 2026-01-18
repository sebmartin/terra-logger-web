import { MapDebugOverlay } from "@/app/features/map/MapDebugOverlay";
import { MapCanvas } from "./MapCanvas";

export default function MapContainer() {
  const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";

  return (
    <div className="relative w-full h-full">
      <MapCanvas>
        {debugMode && (<MapDebugOverlay />)}
      </MapCanvas>
    </div>
  );
}