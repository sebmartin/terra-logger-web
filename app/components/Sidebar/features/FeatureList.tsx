'use client';

import { useSiteStore } from "@/app/stores/siteStore";
import { useFeatureStore } from "@/app/stores/featureStore";
import { Badge } from "@/app/components/ui/badge";
import CollapsibleSection from "../CollapsibleSection";
import FeatureItem from "./FeatureItem";
import { PenTool } from "lucide-react";

export default function FeatureList() {
  const features = useFeatureStore((state) => state.features);
  const updateFeature = useFeatureStore((state) => state.updateFeature);

  const selectedSite = useSiteStore((state) => state.selectedSite());

  if (!selectedSite) {
    return null;
  }


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
      headerActions={
        <Badge variant="secondary" className="h-8 min-w-[2rem] px-3 justify-center font-semibold">{features.length}</Badge>
      }
    >
      <div className="flex flex-col">
        {features.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <div className="mb-3 flex justify-center">
              <PenTool size={40} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">No features yet</p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Use the drawing tools on the map to add shapes and markers
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
