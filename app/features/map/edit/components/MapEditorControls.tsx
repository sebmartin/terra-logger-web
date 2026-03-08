import { useMapContext } from "@/app/components/Map/MapProvider";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FeatureIcon } from "@/components/ui";

export function MapEditorControls() {
  const { mode, setMode } = useMapContext();
  const { setOpen } = useSidebar();
  const features = useFeatureStore((s) => s.features);

  if (mode.type !== "editing") return null;

  const feature = features.find((f) => f.id === mode.featureId);

  const handleDone = () => {
    setMode({ type: "viewing" });
    setOpen(true);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1050] pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-4 py-2 flex items-center gap-3">
        {feature && <FeatureIcon name={feature.type} />}
        <span className="text-sm font-medium text-slate-700">
          {feature?.name || "Unnamed Feature"}
        </span>
        <Button size="sm" onClick={handleDone}>
          Done
        </Button>
      </div>
    </div>
  );
}
