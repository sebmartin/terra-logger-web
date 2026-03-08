import { useFeatureStore } from "@/app/stores/featureStore";
import { useMapContext } from "@/app/components/Map/MapProvider";
import { ScrollArea } from "@/components/ui";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function FeatureSheet() {
  const selectedFeature = useFeatureStore((s) => s.selectedFeature());
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);
  const { setMode } = useMapContext();

  const handleEdit = () => {
    if (!selectedFeature || selectedFeature.locked) return;
    setMode({ type: "editing", featureId: selectedFeature.id });
    setSelectedFeatureId(null);
  };

  return (
    <Sheet open={!!selectedFeature} onOpenChange={(open) => {
      if (open === false) {
        setSelectedFeatureId(null);
      }
    }}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>{selectedFeature?.name ?? "Unnamed Feature"}</SheetTitle>
          <SheetDescription>
            This is going to be an awesome feature detail view. Some might say it&apos;s the best detail view. AMAZING DETAIL VIEW. Billions and billions.
          </SheetDescription>
          <Button
            size="sm"
            disabled={selectedFeature?.locked}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <pre className="p-2 text-xs">{JSON.stringify(selectedFeature, null, 2)}</pre>
        </ScrollArea>
      </SheetContent>
    </Sheet >
  );
}