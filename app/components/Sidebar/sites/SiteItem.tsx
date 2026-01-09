import { Pencil, X, Locate, Calendar } from "lucide-react";
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
      className={`mx-2 my-1 px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm"
          : "hover:bg-slate-50 hover:shadow-sm"
      }`}
      onClick={() => onSelect(site)}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-slate-800 mb-1 flex items-center gap-2">
          <span className="truncate">{site.name}</span>
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
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Calendar size={12} />
          <span>{new Date(site.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex gap-1.5 items-center ml-3">
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
