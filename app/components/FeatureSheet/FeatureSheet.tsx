import { useFeatureStore } from "@/app/stores/featureStore";
import { ScrollArea } from "@/components/ui";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

interface FeatureSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeatureSheet({ open, onOpenChange }: FeatureSheetProps) {
  const selectedFeature = useFeatureStore((s) => s.selectedFeature());
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);
  const updateFeature = useFeatureStore((s) => s.updateFeature);

  const handleToggleLock = () => {
    if (!selectedFeature) return;
    updateFeature(selectedFeature.id, { locked: !selectedFeature.locked }).catch(
      (error) => console.error("Failed to toggle lock:", error)
    );
  };

  return (
    <Sheet open={open} onOpenChange={(v) => {
      onOpenChange(v);
      if (!v) setSelectedFeatureId(null);
    }}>
      <SheetContent side="right" className="w-full md:w-96" overlay={false}>
        <SheetHeader>
          <SheetTitle>{selectedFeature?.name ?? "Unnamed Feature"}</SheetTitle>
          <SheetDescription>
            This is going to be an awesome feature detail view. Some might say it&apos;s the best detail view. AMAZING DETAIL VIEW. Billions and billions.
          </SheetDescription>
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggleLock}
          >
            {selectedFeature?.locked ? (
              <><LockKeyholeOpen size={14} /> Unlock</>
            ) : (
              <><LockKeyhole size={14} /> Lock</>
            )}
          </Button>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <pre className="p-2 text-xs">{JSON.stringify(selectedFeature, null, 2)}</pre>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
