"use client";

import type { icons, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarIconButtonProps {
  icon: LucideIcon;
  label: string;
  size?: "small" | "large";
  onClick: () => void;
  className?: string;
}

export function ToolbarIconButton({ icon: Icon, label, size = "small", onClick, className }: ToolbarIconButtonProps) {
  let iconSize: "icon-lg" | "icon-sm" = size == "large" ? "icon-lg" : "icon-sm";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size={iconSize} variant="outline" onClick={onClick} className={cn(className)}>
          <Icon size={14} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
