import type { Feature } from "@/app/types/feature";
import { FeatureIcon } from "@/components/ui";
import { Toggle } from "@/components/ui/toggle";
import { LockKeyhole, LockKeyholeOpen, Ruler } from "lucide-react";

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
      <div className="flex-1 min-w-0 items-center">
        <div className="flex items-center gap-2">
          <FeatureIcon name={feature.type} />
          <div className="font-medium text-sm text-slate-800 truncate mb-0.5">
            {feature.name || "Unnamed Feature"}
          </div>
        </div>
        {measurement && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1.5 bg-slate-200/50 rounded-md">
            <Ruler size={12} className="text-slate-500" />
            <span className="text-xs font-medium text-slate-500">{measurement}</span>
          </div>
        )}
      </div>
      <div className="ml-3">
        <Toggle
          aria-label="Toggle visibility"
          size="lg"
          className={`h-6 w-6 icon-btn-ghost `}
          pressed={feature.locked}
          onPressedChange={(_pressed) => {
            onToggleLock(feature.id, feature.locked);
          }}
        >
          {feature.locked ? <LockKeyhole /> : <LockKeyholeOpen />}
        </Toggle>
      </div>
    </div>
  );
}
