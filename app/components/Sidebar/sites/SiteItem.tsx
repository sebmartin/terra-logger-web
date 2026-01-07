import { Pencil, X, Locate } from "lucide-react";
import type { Site } from "../../../types/site";
import { IconButton } from "../../common";

interface SiteItemProps {
  site: Site;
  isActive: boolean;
  onSelect: (site: Site) => void;
  onEditBounds: (site: Site) => void;
  onDelete: (id: string, name: string) => void;
}

export default function SiteItem({
  site,
  isActive,
  onSelect,
  onEditBounds,
  onDelete,
}: SiteItemProps) {
  return (
    <div
      className={`px-5 py-3 flex items-center justify-between cursor-pointer border-b border-gray-100 transition-colors ${
        isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-gray-50"
      }`}
      onClick={() => onSelect(site)}
    >
      <div className="flex-1">
        <div className="font-medium text-gray-800 mb-1 flex items-center gap-1">
          {site.name}
          {isActive && (
            <IconButton
              variant="action"
              onClick={(e) => {
                e.stopPropagation();
                onEditBounds(site);
              }}
              title="Edit Bounds"
              icon={<Pencil size={12} />}
            />
          )}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(site.updated_at).toLocaleDateString()}
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <IconButton
          variant="action"
          onClick={(e) => {
            e.stopPropagation();
          }}
          title="Show site on Map"
          icon={<Locate size={16} />}
        />
        <IconButton
          variant="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(site.id, site.name);
          }}
          title="Delete"
          icon={<X size={16} />}
        />
      </div>
    </div>
  );
}
