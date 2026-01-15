import type { Feature } from "@/app/types/feature";
import { FeatureIcon, ToggleButton } from "@/components/ui";
import { Ruler } from "lucide-react";

interface FeatureItemProps {
  feature: Feature;
  onToggleLock: (featureId: string, currentLocked: boolean) => void;
}

export default function FeatureItem({ feature, onToggleLock }: FeatureItemProps) {
  let measurement = "";
  if (feature.properties?.distance) {
    const d = feature.properties.distance;
    measurement = `${d.km.toFixed(2)} km`;
  } else if (feature.properties?.area) {
    const a = feature.properties.area;
    measurement = `${a.acres.toFixed(2)} acres`;
  }

  return (
    <div className="mx-2 my-1 px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-slate-50 hover:shadow-sm transition-all duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <FeatureIcon name={feature.type} />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {feature.type}
          </span>
        </div>
        <div className="font-medium text-sm text-slate-800 truncate mb-0.5">
          {feature.name || "Unnamed Feature"}
        </div>
        {measurement && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md">
            <Ruler size={12} className="text-slate-600" />
            <span className="text-xs font-medium text-slate-700">{measurement}</span>
          </div>
        )}
      </div>
      <div className="ml-3">
        <ToggleButton
          isActive={feature.locked}
          onClick={() => onToggleLock(feature.id, feature.locked)}
          title={feature.locked ? "Locked" : "Unlocked"}
          ariaLabel={feature.locked ? "Unlock feature" : "Lock feature"}
        />
      </div>
    </div>
  );
}
