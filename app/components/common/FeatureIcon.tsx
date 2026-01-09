import { FeatureType } from "../../types/feature";
import { MapPin, Minus, Pentagon, Square, Circle } from "lucide-react";

const FEATURE_ICONS: Record<FeatureType, React.ComponentType<{ size?: number }>> = {
  Marker: MapPin,
  Polyline: Minus,
  Polygon: Pentagon,
  Rectangle: Square,
  Circle: Circle,
};

const FEATURE_COLORS: Record<FeatureType, string> = {
  Marker: "text-red-600",
  Polyline: "text-blue-600",
  Polygon: "text-green-600",
  Rectangle: "text-purple-600",
  Circle: "text-orange-600",
};

export default function FeatureIcon({ name, size = 14 }: { name: FeatureType, size?: number }) {
  const Icon = FEATURE_ICONS[name] || Circle;
  const colorClass = FEATURE_COLORS[name] || "text-gray-600";

  return (
    <span className={`inline-flex items-center justify-center ${colorClass}`}>
      <Icon size={size} />
    </span>
  );
}