import { Button, ScrollArea } from "@/components/ui";
import { ResizablePanel } from "@/components/ui/resizable";
import { Plus } from "lucide-react";
import { Panel } from "react-resizable-panels";

interface SidebarGroupHeaderProps {
  children: React.ReactNode;
  onAdd?: () => void;
}

function SidebarGroupHeader({ children, onAdd }: SidebarGroupHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted border-b border-border/50">
      <div className="flex items-center gap-1.5">{children}</div>
      {onAdd && (
        <Button variant="ghost" size="icon" className="size-5" onClick={onAdd}>
          <Plus size={12} />
        </Button>
      )}
    </div>
  );
}

export interface ResizableSectionProps extends Omit<
  React.ComponentProps<typeof Panel>,
  "className" | "content"
> {
  header: React.ReactNode;
  onAdd?: () => void;
}

export default function ResizableSection({
  header,
  children,
  onAdd,
  ...props
}: ResizableSectionProps) {
  return (
    <ResizablePanel {...props} className="flex flex-col">
      <SidebarGroupHeader onAdd={onAdd}>{header}</SidebarGroupHeader>
      <ScrollArea className="flex-1">{children}</ScrollArea>
    </ResizablePanel>
  );
}
