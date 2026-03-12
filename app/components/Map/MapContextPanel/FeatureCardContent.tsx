"use client";

import { LockKeyhole, LockKeyholeOpen, Trash2, Ruler, Info } from "lucide-react";
import { FeatureIcon } from "@/components/ui";
import type { Feature } from "@/app/types/feature";
import { getMeasurement } from "./constants";
import { ToolbarIconButton } from "@/components/ui/toolbar-icon-button";

export interface FeatureCardContentProps {
  feature: Feature;
  hint: string;
  modeButton?: React.ReactNode;
  onLock: () => void;
  onDetails: () => void;
  onDelete: () => void;
}

export function FeatureCardContent({
  feature,
  hint,
  modeButton,
  onLock,
  onDetails,
  onDelete,
}: FeatureCardContentProps) {
  const measurement = getMeasurement(feature);
  return (
    <>
      <div className="px-3 pt-3 pb-2.5">
        <div className="flex items-center gap-2">
          <FeatureIcon name={feature.type} size={15} />
          <span className="font-semibold text-sm truncate leading-tight">
            {feature.name ?? "Unnamed Feature"}
          </span>
        </div>
        {measurement && (
          <div className="flex items-center gap-1 mt-1.5">
            <Ruler size={11} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">{measurement}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-0.5 border-t border-slate-100 px-1.5 py-1">
        <ToolbarIconButton
          icon={feature.locked ? LockKeyholeOpen : LockKeyhole}
          label={feature.locked ? "Unlock" : "Lock"}
          onClick={onLock}
        />
        {modeButton}
        <ToolbarIconButton icon={Info} label="Details" onClick={onDetails} />
        <div className="w-px h-4 bg-slate-200 mx-0.5 shrink-0" />
        <ToolbarIconButton
          icon={Trash2}
          label="Delete"
          onClick={onDelete}
          className="text-destructive"
        />
      </div>
      <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50">
        <p className="text-xs text-muted-foreground leading-snug">{hint}</p>
      </div>
    </>
  );
}
