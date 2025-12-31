import { FeatureType } from "@/types/feature";

export default function LeafletIcon({ name, size }: { name: FeatureType, size?: number }) {
  const defaultSize = 16;
  return (
    <span className="leaflet-pm-toolbar leaflet-standalone-icon" style={{
      display: "inline-block",
      height: `${size || defaultSize}px`,
      width: `${size || defaultSize}px`,
    }}>
      <span
        className={`control-icon leaflet-pm-icon-${name.toLowerCase()}`}
        style={{
          display: "inline-block",
          height: `${size || defaultSize}px`,
          width: `${size || defaultSize}px`,
        }}
      />
    </span >
  );
}