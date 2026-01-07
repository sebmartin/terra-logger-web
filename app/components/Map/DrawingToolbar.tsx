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

  const getToolButtonStyle = (mode: string | null) => ({
    padding: "10px",
    border: currentMode === mode ? "2px solid #3388ff" : "1px solid #e0e0e0",
    background: currentMode === mode ? "#e3f2fd" : "white",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "20px",
    fontWeight: currentMode === mode ? "600" : "normal",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "44px",
    minHeight: "44px",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 10,
        background: "white",
        padding: "6px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        zIndex: 1,
      }}
    >
      <button
        onClick={() => onModeChange("select")}
        style={getToolButtonStyle("select")}
        title="Select & Edit - Click features to select, drag to move/edit"
      >
        <span style={{ fontSize: "18px" }}>↖️</span>
      </button>
      <div
        style={{ height: "1px", background: "#e0e0e0", margin: "2px 0" }}
      />
      <button
        onClick={() => onModeChange("point")}
        style={getToolButtonStyle("point")}
        title="Marker - Click to place"
      >
        📍
      </button>
      <button
        onClick={() => onModeChange("linestring")}
        style={getToolButtonStyle("linestring")}
        title="Line - Click points, double-click to finish"
      >
        📏
      </button>
      <button
        onClick={() => onModeChange("polygon")}
        style={getToolButtonStyle("polygon")}
        title="Polygon - Click points, double-click to finish"
      >
        ⬟
      </button>
      <button
        onClick={() => onModeChange("rectangle")}
        style={getToolButtonStyle("rectangle")}
        title="Rectangle - Click two corners"
      >
        ▭
      </button>
      <button
        onClick={() => onModeChange("circle")}
        style={getToolButtonStyle("circle")}
        title="Circle - Click center, then radius"
      >
        ⭕
      </button>
    </div>
  );
}
