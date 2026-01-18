import { useMapContext } from "@/app/components/Map/MapProvider";
import { Crosshair, ExternalLink, Search } from "lucide-react";

export function MapDebugOverlay() {
  const { map } = useMapContext();
  if (!map) return null;

  const { lat: latitude, lng: longitude } = map.getCenter();
  const zoom = map.getZoom();

  return (
    <div className="flex gap-4 absolute bottom-2 right-2 bg-white bg-opacity-75 px-2 py-1 rounded z-10 text-sm">
      <div className="flex items-center">
        <Search size={12} />
        <p className="pl-2">{zoom.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <Crosshair size={12} />
        <p className="pl-2">
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