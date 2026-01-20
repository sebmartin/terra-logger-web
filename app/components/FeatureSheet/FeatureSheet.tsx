import { useFeatureStore } from "@/app/stores/featureStore";
import { ScrollArea } from "@/components/ui";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet";

export function FeatureSheet() {
  const selectedFeature = useFeatureStore((s) => s.selectedFeature());
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);

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
            This is going to be an awesome feature detail view. Some might say it's the best detail view. AMAZING DETAIL VIEW. Billions and billions.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <pre className="p-2 text-xs">{JSON.stringify(selectedFeature, null, 2)}</pre>
        </ScrollArea>
      </SheetContent>
    </Sheet >
  );
}