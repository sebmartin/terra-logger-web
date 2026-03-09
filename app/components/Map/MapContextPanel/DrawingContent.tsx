"use client";

import { Circle, X } from "lucide-react";
import type { GeometryType } from "@/app/components/Map/MapProvider";
import { DRAW_TOOLS, INSTRUCTIONS } from "./constants";
import { ToolbarIconButton } from "@/components/ui/toolbar-icon-button";

interface DrawingContentProps {
  geometryType: GeometryType;
  onCancel: () => void;
}

export function DrawingContent({ geometryType, onCancel }: DrawingContentProps) {
  const tool = DRAW_TOOLS.find((t) => t.geometryType === geometryType);
  const Icon = tool?.Icon ?? Circle;
  return (
    <>
      <div className="px-3 py-2.5 flex items-center gap-2">
        <Icon size={14} className="text-slate-600 shrink-0" />
        <span className="font-semibold text-sm">{tool?.label ?? "Drawing"}</span>
      </div>
      <div className="border-t border-slate-100 px-1.5 py-1">
        <ToolbarIconButton icon={X} label="Cancel" onClick={onCancel} />
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-3 py-1.5">
        <p className="text-xs text-muted-foreground">{INSTRUCTIONS[geometryType]}</p>
      </div>
    </>
  );
}
