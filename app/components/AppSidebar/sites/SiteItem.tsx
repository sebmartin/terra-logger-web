import { Ellipsis, Edit, Trash2 } from "lucide-react";
import type { Site } from "@/app/types/site";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@/components/ui";

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
  const [showDeleteSitePrompt, setShowDeleteSitePrompt] = useState(false);
  return (
    <div
      className={`mx-2 my-1 px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-600 shadow-sm"
          : "hover:bg-slate-50 hover:shadow-sm"
      }`}
      onClick={() => onSelect(site)}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-slate-800 mb-1 flex items-center gap-2">
          <span className="truncate">{site.name}</span>
        </div>
      </div>
      <div className="flex gap-1.5 items-center ml-3">
        {isActive && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 focus:ring-blue-400"
              >
                <Button variant="ghost">
                  <Ellipsis size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
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
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={showDeleteSitePrompt}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                  <AlertDialogDescription>{`Are you sure you want to delete site "${site.name}"?`}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setShowDeleteSitePrompt(false);
                    }}
                  >
                    No
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setShowDeleteSitePrompt(false);
                      onDelete(site.id, site.name);
                    }}
                    variant="destructive"
                  >
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
