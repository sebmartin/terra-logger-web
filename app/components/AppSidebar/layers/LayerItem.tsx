import type { Layer } from "@/app/types/layer";
import { DropdownMenuItem } from "@/components/ui";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Toggle } from "@/components/ui/toggle";
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { ItemMenuButton } from "../common/ItemMenuButton";
import { Item } from "../common/Item";

interface LayerItemProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export default function LayerItem({
  layer,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: LayerItemProps) {
  const [showDeleteLayerPrompt, setShowDeleteLayerPrompt] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  return (
    <Item
      content={layer.name}
      isSelected={isSelected}
      onClick={() => onSelect(layer.id)}
      onContextMenu={(_e) => {
        setShowContextMenu(true);
      }}
    >
      <Toggle
        aria-label="Toggle visibility"
        size="sm"
        className="icon-btn-ghost h-6 w-6"
        pressed={layer.visible}
        onPressedChange={(_pressed) => {
          onToggleVisibility(layer.id);
        }}
      >
        {layer.visible ? <Eye /> : <EyeOff />}
      </Toggle>
      <ItemMenuButton label={layer.name} open={showContextMenu} onOpenChange={setShowContextMenu}>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            // onEditBounds(site);
          }}
        >
          <Edit size={14} /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteLayerPrompt(true);
          }}
        >
          <Trash2 size={14} /> Delete
        </DropdownMenuItem>
      </ItemMenuButton>
      <DeleteDialog
        open={showDeleteLayerPrompt}
        title={`Delete the layer "${layer.name}"?`}
        description="All features associated with this layer will also be deleted."
        onCancel={() => setShowDeleteLayerPrompt(false)}
        onDelete={() => {
          setShowDeleteLayerPrompt(false);
          onDelete(layer.id, layer.name);
        }}
      />
    </Item>
  );
}
