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
    <div className="absolute top-2.5 left-2.5 bg-white px-3 py-2 rounded shadow z-10">
      <select
        value={getCurrentStyleKey()}
        onChange={(e) =>
          onStyleChange(MAP_STYLES[e.target.value as keyof typeof MAP_STYLES])
        }
        className="border-none outline-none cursor-pointer text-sm font-sans"
      >
        <option value="topology">Topology (Custom)</option>
        <option value="satellite">Satellite</option>
        <option value="outdoors">Outdoors</option>
        <option value="streets">Streets</option>
      </select>
    </div>
  );
}
