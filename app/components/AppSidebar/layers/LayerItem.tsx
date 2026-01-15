import type { Layer } from "@/app/types/layer";
import { IconButton } from "@/components/ui";

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
      className={`mx-2 my-1 px-3 py-2.5 rounded-lg flex items-center gap-3 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm"
          : "hover:bg-slate-50 hover:shadow-sm"
      }`}
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
        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-800 truncate">{layer.name}</div>
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
