import FeatureIcon from "@/components/common/FeatureIcon";
import type { Feature } from "../../../types/feature";
import { ToggleButton } from "../../common";

interface FeatureItemProps {
  feature: Feature;
  onToggleLock: (featureId: string, currentLocked: boolean) => void;
}

export default function FeatureItem({
  feature,
  onToggleLock,
}: FeatureItemProps) {
  let measurement = "";
  if (feature.properties?.distance) {
    const d = feature.properties.distance;
    measurement = `${d.km.toFixed(2)} km`;
  } else if (feature.properties?.area) {
    const a = feature.properties.area;
    measurement = `${a.acres.toFixed(2)} acres`;
  }

  return (
    <div className="feature-item">
      <div className="feature-info">
        <div className="feature-type">
          <FeatureIcon name={feature.type} />
          <p className="feature-type-text">{feature.type}</p>
        </div>
        <div className="feature-name">{feature.name || "Unnamed"}</div>
        {measurement && (
          <div className="feature-measurement">{measurement}</div>
        )}
      </div>
      <ToggleButton
        isActive={feature.locked}
        onClick={() => onToggleLock(feature.id, feature.locked)}
        title={feature.locked ? "Locked" : "Unlocked"}
        ariaLabel={feature.locked ? "Unlock feature" : "Lock feature"}
      />
    </div >
  );
}
