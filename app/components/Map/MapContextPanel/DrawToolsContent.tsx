"use client";

import type { GeometryType } from "@/app/components/Map/MapProvider";
import { ItemSeparator } from "@/components/ui";
import { ToolbarIconButton } from "@/components/ui/toolbar-icon-button";
import { Settings } from "lucide-react";
import { DRAW_TOOLS } from "./constants";

interface DrawToolsContentProps {
  onSelectTool: (geometryType: GeometryType) => void;
}

export function DrawToolsContent({ onSelectTool }: DrawToolsContentProps) {
  return (
    <div className="flex justify-between gap-2 px-1.5 py-1">
      {DRAW_TOOLS.map(({ geometryType, label, Icon }) => (
        <ToolbarIconButton
          key={geometryType}
          icon={Icon}
          label={label}
          size="large"
          onClick={() => onSelectTool(geometryType)}
        />
      ))}
      <ItemSeparator orientation="vertical" className="min-h-10"/>
      <ToolbarIconButton
        label="Settings"
        icon={Settings}
        size="large"
        onClick={() => null}
      />
    </div>
  );
}
