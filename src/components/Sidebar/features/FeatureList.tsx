import type { Feature } from "../../../types/feature";
import CollapsibleSection from "../CollapsibleSection";
import FeatureItem from "./FeatureItem";

interface FeatureListProps {
  features: Feature[];
  onUpdateFeature: (
    featureId: string,
    data: { locked: boolean },
  ) => Promise<void>;
}

export default function FeatureList({
  features,
  onUpdateFeature,
}: FeatureListProps) {
  const handleToggleLock = async (featureId: string, currentLocked: boolean) => {
    try {
      await onUpdateFeature(featureId, { locked: !currentLocked });
    } catch (error) {
      console.error("Failed to toggle feature lock:", error);
      alert("Failed to toggle feature lock");
    }
  };
  return (
    <CollapsibleSection
      title="Features"
      headerActions={<span className="count">{features.length}</span>}
    >
      <div className="feature-list">
        {features.length === 0 ? (
          <div className="empty-state-small">
            <p>
              No features yet. Use the drawing tools on the map to add shapes
              and markers.
            </p>
          </div>
        ) : (
          features.map((feature) => (
            <FeatureItem
              key={feature.id}
              feature={feature}
              onToggleLock={handleToggleLock}
            />
          ))
        )}
      </div>
    </CollapsibleSection>
  );
}
