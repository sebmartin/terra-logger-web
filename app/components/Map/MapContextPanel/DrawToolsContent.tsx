"use client";

import type { GeometryType } from "@/app/components/Map/MapProvider";
import { DRAW_TOOLS } from "./constants";
import { ToolbarIconButton } from "@/components/ui/toolbar-icon-button";

interface DrawToolsContentProps {
  onSelectTool: (geometryType: GeometryType) => void;
}

export function DrawToolsContent({ onSelectTool }: DrawToolsContentProps) {
  return (
    <div className="flex items-center gap-0.5 px-1.5 py-1">
      {DRAW_TOOLS.map(({ geometryType, label, Icon }) => (
        <ToolbarIconButton
          key={geometryType}
          icon={Icon}
          label={label}
          onClick={() => onSelectTool(geometryType)}
        />
      ))}
    </div>
  );
}
