'use client';

import { MousePointer2, MapPin, Minus, Pentagon, Square, Circle } from "lucide-react";

interface DrawingToolbarProps {
  currentMode: string | null;
  onModeChange: (mode: string) => void;
  visible: boolean;
}

/**
 * Drawing toolbar component
 * Provides UI for selecting drawing tools (select, point, line, polygon, etc.)
 */
export function DrawingToolbar({
  currentMode,
  onModeChange,
  visible,
}: DrawingToolbarProps) {
  if (!visible) return null;

  const getToolButtonClass = (mode: string | null) =>
    [
      "min-w-11 min-h-11 flex items-center justify-center rounded-lg border transition-all hover:bg-slate-50",
      currentMode === mode
        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
    ].join(" ");

  return (
    <div className="absolute top-[60px] left-[10px] bg-white p-2 rounded-lg shadow-lg border border-slate-200 flex flex-col gap-1 z-10">
      <button
        onClick={() => onModeChange("select")}
        className={getToolButtonClass("select")}
        title="Select & Edit - Click features to select, drag to move/edit"
      >
        <MousePointer2 size={20} strokeWidth={2} />
      </button>
      <div className="h-px bg-slate-200 my-0.5" />
      <button
        onClick={() => onModeChange("point")}
        className={getToolButtonClass("point")}
        title="Marker - Click to place"
      >
        <MapPin size={20} strokeWidth={2} />
      </button>
      <button
        onClick={() => onModeChange("linestring")}
        className={getToolButtonClass("linestring")}
        title="Line - Click points, double-click to finish"
      >
        <Minus size={20} strokeWidth={2} />
      </button>
      <button
        onClick={() => onModeChange("polygon")}
        className={getToolButtonClass("polygon")}
        title="Polygon - Click points, double-click to finish"
      >
        <Pentagon size={20} strokeWidth={2} />
      </button>
      <button
        onClick={() => onModeChange("rectangle")}
        className={getToolButtonClass("rectangle")}
        title="Rectangle - Click two corners"
      >
        <Square size={20} strokeWidth={2} />
      </button>
      <button
        onClick={() => onModeChange("circle")}
        className={getToolButtonClass("circle")}
        title="Circle - Click center, then radius"
      >
        <Circle size={20} strokeWidth={2} />
      </button>
    </div>
  );
}
