import { useFeatureContext } from "@/context/FeatureContext";
import CollapsibleSection from "../CollapsibleSection";
import FeatureItem from "./FeatureItem";

export default function FeatureList() {
  const { features, updateFeature } = useFeatureContext();

  const handleToggleLock = async (featureId: string, currentLocked: boolean) => {
    try {
      await updateFeature(featureId, { locked: !currentLocked });
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
