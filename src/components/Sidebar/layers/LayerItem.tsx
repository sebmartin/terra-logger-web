import type { Layer } from "../../../types/layer";
import { IconButton } from "../../common";

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
  return (
    <div
      className={`layer-item ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(layer.id)}
    >
      <input
        type="checkbox"
        checked={layer.visible}
        onChange={(e) => {
          e.stopPropagation();
          onToggleVisibility(layer.id);
        }}
        title="Toggle visibility"
        className="layer-visibility"
      />
      <div className="layer-info">
        <div className="layer-name">{layer.name}</div>
      </div>
      <IconButton
        variant="delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(layer.id, layer.name);
        }}
        title="Delete"
        icon="×"
      />
    </div>
  );
}
