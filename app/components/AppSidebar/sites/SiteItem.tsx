import { Edit, Trash2 } from "lucide-react";
import type { Site } from "@/app/types/site";
import { useState } from "react";
import {
  DropdownMenuItem
} from "@/components/ui";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Item } from "../common/Item";
import { ItemMenuButton } from "../common/ItemMenuButton";

interface SiteItemProps {
  site: Site;
  isSelected: boolean;
  onSelect: (site: Site) => void;
  onEditBounds: (site: Site) => void;
  onDelete: (id: string, name: string) => void;
}

export default function SiteItem({
  site,
  isSelected,
  onSelect,
  onEditBounds,
  onDelete,
}: SiteItemProps) {
  const [showDeleteSitePrompt, setShowDeleteSitePrompt] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  return (
    <>
      <Item
        text={site.name}
        isSelected={isSelected}
        onClick={() => onSelect(site)}
        onContextMenu={(_e) => {
          setShowContextMenu(true);
        }}
      >
        <ItemMenuButton open={showContextMenu} onOpenChange={setShowContextMenu}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEditBounds(site);
            }}
          >
            <Edit size={14} /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              console.log(setShowDeleteSitePrompt);
              setShowDeleteSitePrompt(true);
            }}
          >
            <Trash2 size={14} /> Delete
          </DropdownMenuItem>
        </ItemMenuButton>
      </Item>
      <DeleteDialog
        open={showDeleteSitePrompt}
        title={`Delete the site "${site.name}"?`}
        description="All layers and features associated with this site will also be deleted."
        onCancel={() => setShowDeleteSitePrompt(false)}
        onDelete={() => {
          setShowDeleteSitePrompt(false);
          onDelete(site.id, site.name);
        }}
      />
    </>
  );
}
