import { DropdownMenu, DropdownMenuTrigger, Button, DropdownMenuContent } from "@/components/ui";
import { EllipsisVertical } from "lucide-react";
import { PropsWithChildren } from "react";

interface ItemContextMenuProps extends PropsWithChildren {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ItemMenuButton({ open, onOpenChange, children }: ItemContextMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="icon-btn-ghost h-6 w-4 p-0 transparent">
          <EllipsisVertical size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}