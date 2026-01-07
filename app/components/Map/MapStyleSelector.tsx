'use client';

export const MAP_STYLES = {
  topology: "mapbox://styles/sebmartin/cl0daly1b002j15ldl6d0xcmh",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  streets: "mapbox://styles/mapbox/streets-v12",
} as const;

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

/**
 * Map style selector component
 * Provides UI for selecting base map styles
 */
export function MapStyleSelector({
  currentStyle,
  onStyleChange,
}: MapStyleSelectorProps) {
  const getCurrentStyleKey = () => {
    return (
      (Object.keys(MAP_STYLES).find(
        (key) => MAP_STYLES[key as keyof typeof MAP_STYLES] === currentStyle
      ) as keyof typeof MAP_STYLES) || "topology"
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        background: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        zIndex: 1,
      }}
    >
      <select
        value={getCurrentStyleKey()}
        onChange={(e) =>
          onStyleChange(MAP_STYLES[e.target.value as keyof typeof MAP_STYLES])
        }
        style={{
          border: "none",
          outline: "none",
          cursor: "pointer",
          fontSize: "14px",
          fontFamily: "inherit",
        }}
      >
        <option value="topology">Topology (Custom)</option>
        <option value="satellite">Satellite</option>
        <option value="outdoors">Outdoors</option>
        <option value="streets">Streets</option>
      </select>
    </div>
  );
}
