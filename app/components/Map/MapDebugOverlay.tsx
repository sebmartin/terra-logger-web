import { useMapContext } from "@/app/components/Map/MapProvider";
import { useFeatureStore } from "@/app/stores/featureStore";
import { Crosshair, ExternalLink, Search, VectorSquare } from "lucide-react";

export function MapDebugOverlay() {
  const { map } = useMapContext();
  const selectedFeature = useFeatureStore((s) => s.selectedFeature());

  if (!map) return null;

  const { lat: latitude, lng: longitude } = map.getCenter();
  const zoom = map.getZoom();

  return (
    <div className="flex gap-4 absolute top-2 right-2 md:top-auto md:bottom-2 bg-white bg-opacity-75 px-2 py-1 rounded text-sm pointer-events-auto">
      {selectedFeature && (
        <div className="flex items-center gap-1">
          <VectorSquare size={12} />
          <p>
            <strong>{selectedFeature.properties?.name ?? "No name"}</strong>
          </p>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Search size={12} />
        <p>{zoom.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-1">
        <Crosshair size={12} />
        <p>
          [{latitude.toFixed(6)}, {longitude.toFixed(6)}]
        </p>
      </div>
      <ExternalLink size={18} className="cursor-pointer" onClick={() => {
        const url = `https://maps.google.com/maps/@${latitude.toFixed(4)},${longitude.toFixed(4)},${Math.round(zoom + 1)}z`;
        window.open(url, "_blank");
      }} />
    </div>
  );
}