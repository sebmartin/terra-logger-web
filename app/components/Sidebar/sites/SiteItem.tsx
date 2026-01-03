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
      className={`site-item ${isActive ? "active" : ""}`}
      onClick={() => onSelect(site)}
    >
      <div className="site-info">
        <div className="site-name">
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
        <div className="site-meta">
          {new Date(site.updated_at).toLocaleDateString()}
        </div>
      </div>
      <div className="site-actions">
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
