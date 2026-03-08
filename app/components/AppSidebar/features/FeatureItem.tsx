import { useFeatureStore } from "@/app/stores/featureStore";
import { useMapContext } from "@/app/components/Map/MapProvider";
import type { Feature } from "@/app/types/feature";
import { DropdownMenuItem, FeatureIcon } from "@/components/ui";
import { Toggle } from "@/components/ui/toggle";
import { Edit, LockKeyhole, LockKeyholeOpen, Ruler, Trash2 } from "lucide-react";
import { Item } from "../common/Item";
import { useState } from "react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { ItemMenuButton } from "../common/ItemMenuButton";
import { useSidebar } from "@/components/ui/sidebar";

interface FeatureItemProps {
  feature: Feature;
  onToggleLock: (featureId: string, currentLocked: boolean) => void;
}

export default function FeatureItem({ feature, onToggleLock }: FeatureItemProps) {
  const selectedFeatureId = useFeatureStore((s) => s.selectedFeatureId);
  const setSelectedFeatureId = useFeatureStore((s) => s.setSelectedFeatureId);
  const deleteFeature = useFeatureStore((s) => s.deleteFeature);
  const { setMode } = useMapContext();
  const { setOpen } = useSidebar();

  const isSelected = selectedFeatureId === feature.id;
  const featureName = feature.name || "Unnamed Feature";

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDeleteFeaturePrompt, setShowDeleteFeaturePrompt] = useState(false);

  let measurement = "";
  if (feature.properties?.distance) {
    const d = feature.properties.distance;
    measurement = `${d.km.toFixed(2)} km`;
  } else if (feature.properties?.area) {
    const a = feature.properties.area;
    measurement = `${a.acres.toFixed(2)} acres`;
  }

  return (
    <Item
      content={
        <div className="flex-1 min-w-0 items-center {}">
          <div className="flex items-center gap-2">
            <FeatureIcon name={feature.type} />
            <div className="font-medium text-sm text-slate-800 truncate mb-0.5">
              {feature.name || "Unnamed Feature"}
            </div>
          </div>
          {measurement && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1.5 bg-slate-200/50 rounded-md">
              <Ruler size={12} className="text-slate-500" />
              <span className="text-xs font-medium text-slate-500">{measurement}</span>
            </div>
          )}
        </div>
      }
      isSelected={isSelected}
      onClick={() => setSelectedFeatureId(feature.id)}
      onContextMenu={(_e) => {
        setShowContextMenu(true);
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Toggle
          aria-label="Toggle visibility"
          size="sm"
          className={`h-6 w-6 icon-btn-ghost `}
          pressed={feature.locked}
          onPressedChange={(_pressed) => {
            onToggleLock(feature.id, feature.locked);
          }}
        >
          {feature.locked ? <LockKeyhole /> : <LockKeyholeOpen />}
        </Toggle>
      </div>
      <ItemMenuButton label={featureName} open={showContextMenu} onOpenChange={setShowContextMenu}>
        <DropdownMenuItem
          disabled={feature.locked}
          onClick={(e) => {
            e.stopPropagation();
            if (!feature.locked) {
              setMode({ type: "editing", featureId: feature.id });
              setOpen(false);
            }
          }}
        >
          <Edit size={14} /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteFeaturePrompt(true);
          }}
        >
          <Trash2 size={14} /> Delete
        </DropdownMenuItem>
      </ItemMenuButton>
      <DeleteDialog
        open={showDeleteFeaturePrompt}
        title={`Delete the feature "${featureName}"?`}
        description="This action cannot be undone."
        onCancel={() => setShowDeleteFeaturePrompt(false)}
        onDelete={() => {
          setShowDeleteFeaturePrompt(false);
          deleteFeature(feature.id);
        }}
      />
    </Item>
  );
}
