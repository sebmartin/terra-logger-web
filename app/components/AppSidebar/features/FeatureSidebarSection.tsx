import { Delete, Plus, VectorSquare } from "lucide-react";
import ResizableSection from "../common/ResizableSection";
import FeatureList from "./FeatureList";
import { useLayerStore } from "@/app/stores/layerStore";
import { Button } from "@/components/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function FeatureSidebarSection() {
  const selectedLayer = useLayerStore((state) => state.selectedLayer());
  const setSelectedLayerId = useLayerStore((state) => state.setSelectedLayerId);

  const handleAddFeature = () => {
    // TODO: implement add feature
  }

  const handleClearLayerSelection = () => {
    setSelectedLayerId(null);
  }

  return (
    <ResizableSection
      header={
        <>
          <VectorSquare size={14} />
          <span>Features</span>
          {selectedLayer && (
            <div className="flex normal-case items-center text-muted-foreground/60 italic gap-1 min-w-0">
              <div className="truncate">&mdash; {selectedLayer.name ?? 0}</div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-4 flex-shrink-0" onClick={handleClearLayerSelection}>
                    <Delete />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear Layer Selection</TooltipContent>
              </Tooltip>
            </div>
          )}
        </>
      }
      icons={selectedLayer ? [
        { icon: Plus, onClick: handleAddFeature, tooltip: "Add a new Feature" },
      ] : []}
    >
      <FeatureList />
    </ResizableSection>
  );
}
