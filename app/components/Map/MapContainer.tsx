import { MapDebugOverlay } from "@/app/components/Map/MapDebugOverlay";
import { MapCanvas } from "./MapCanvas";
import { MapboxFeatureRenderer } from "@/app/features/map/display/components/MapboxFeatureRenderer";
import { MapInteractions } from "../../features/map/interactions/components/MapInteractions";
import { MapEditorCanvas } from "@/app/features/map/edit/components/MapEditorCanvas";
import { MapContextPanel } from "./MapContextPanel";
import { useSidebar } from "@/components/ui/sidebar";

export default function MapContainer() {
  const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
  const { open, width } = useSidebar(); // Ensure sidebar context is available

  return (
    <div className={`absolute w-full h-full`}>
      <MapboxFeatureRenderer />
      <MapCanvas>
        <MapEditorCanvas />
        <div className={`absolute z-100 top-0 left-0 w-full h-full transition-all duration-200 ease-linear pointer-events-none`} style={{ paddingLeft: open ? width : '0px' }}>
          <MapInteractions />
          <MapContextPanel />
          {debugMode && (<MapDebugOverlay />)}
        </div>
      </MapCanvas>
    </div>
  );
}
