import { Button, ScrollArea } from "@/components/ui";
import { ResizablePanel } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { Panel } from "react-resizable-panels";

interface SidebarGroupHeaderProps {
  children: React.ReactNode;
  icons?: Array<{ icon: LucideIcon; onClick: () => void; tooltip?: string }>;
}


export interface ResizableSectionProps extends Omit<
  React.ComponentProps<typeof Panel>,
  "content"
> {
  header: React.ReactNode;
  icons?: Array<{ icon: LucideIcon; onClick: () => void; tooltip?: string }>;
}

export default function ResizableSection({
  header,
  children,
  icons,
  className,
  ...props
}: ResizableSectionProps) {
  return (
    <ResizablePanel {...props} className={`flex flex-col ${className}`}>
      <SidebarGroupHeader icons={icons}>{header}</SidebarGroupHeader>
      <ScrollArea className="flex-1">{children}</ScrollArea>
    </ResizablePanel>
  );
}

function SidebarGroupHeader({ children, icons }: SidebarGroupHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 min-h-[33px] text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted border-b border-border/50">
      <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">{children}</div>
      {icons && icons.length > 0 && (
        <div className="flex items-center gap-1">
          {icons.map(({ icon: Icon, onClick, tooltip }, index) => {
            const button = (
              <Button variant="ghost" size="icon" className="size-5" onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}>
                <Icon size={12} />
              </Button>
            );

            if (!tooltip) return <div key={index}>{button}</div>;

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}