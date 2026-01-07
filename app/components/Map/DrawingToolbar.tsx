'use client';

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
      "min-w-11 min-h-11 flex items-center justify-center rounded border text-2xl transition-all",
      currentMode === mode
        ? "border-blue-600 bg-blue-50 font-semibold"
        : "border-gray-300 bg-white",
    ].join(" ");

  return (
    <div className="absolute top-[60px] left-[10px] bg-white p-1.5 rounded-lg shadow-md flex flex-col gap-1 z-10">
      <button
        onClick={() => onModeChange("select")}
        className={getToolButtonClass("select")}
        title="Select & Edit - Click features to select, drag to move/edit"
      >
        <span className="text-xl">↖️</span>
      </button>
      <div className="h-px bg-gray-200 my-0.5" />
      <button
        onClick={() => onModeChange("point")}
        className={getToolButtonClass("point")}
        title="Marker - Click to place"
      >
        📍
      </button>
      <button
        onClick={() => onModeChange("linestring")}
        className={getToolButtonClass("linestring")}
        title="Line - Click points, double-click to finish"
      >
        📏
      </button>
      <button
        onClick={() => onModeChange("polygon")}
        className={getToolButtonClass("polygon")}
        title="Polygon - Click points, double-click to finish"
      >
        ⬟
      </button>
      <button
        onClick={() => onModeChange("rectangle")}
        className={getToolButtonClass("rectangle")}
        title="Rectangle - Click two corners"
      >
        ▭
      </button>
      <button
        onClick={() => onModeChange("circle")}
        className={getToolButtonClass("circle")}
        title="Circle - Click center, then radius"
      >
        ⭕
      </button>
    </div>
  );
}
