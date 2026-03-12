"use client";

import { useSiteStore } from "@/app/stores/siteStore";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useLayerStore } from "@/app/stores/layerStore";
import FeatureItem from "./FeatureItem";
import { Layers, PenTool } from "lucide-react";

export default function FeatureList() {
  const features = useFeatureStore((state) => state.features);
  const updateFeature = useFeatureStore((state) => state.updateFeature);

  const selectedSite = useSiteStore((state) => state.selectedSite());
  const selectedLayerId = useLayerStore((state) => state.selectedLayerId);

  if (!selectedSite) {
    return null;
  }

  if (!selectedLayerId) {
    return (
      <div className="px-4 py-6 text-center">
        <div className="mb-3 flex justify-center">
          <Layers size={40} className="text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-slate-600 font-medium mb-1">No layer selected</p>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
          Select a layer to see its features
        </p>
      </div>
    );
  }

  const layerFeatures = features.filter((f) => f.layer_id === selectedLayerId);

  const handleToggleLock = async (featureId: string, currentLocked: boolean) => {
    try {
      await updateFeature(featureId, { locked: !currentLocked });
    } catch (error) {
      console.error("Failed to toggle feature lock:", error);
      alert("Failed to toggle feature lock");
    }
  };

  return (
    <div className="flex flex-col">
      {layerFeatures.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <div className="mb-3 flex justify-center">
            <PenTool size={40} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">No features yet</p>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Select a layer, then use the draw panel on the map to add features.
          </p>
        </div>
      ) : (
        layerFeatures.map((feature) => (
          <FeatureItem key={feature.id} feature={feature} onToggleLock={handleToggleLock} />
        ))
      )}
    </div>
  );
}
