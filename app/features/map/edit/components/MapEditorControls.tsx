import { useMapContext } from "@/app/components/Map/MapProvider";

export function MapEditorControls() {
  const { mode } = useMapContext();
  if (mode.type !== 'editing') return null;

  return (
    <div className="relative top-[60px] left-4 z-50 flex flex-col gap-2 pointer-events-auto">
      {/* Placeholder for map editor controls */}
      <div className="max-w-[40px]">
        <button className="bg-white p-2 rounded shadow">X</button>
        <button className="bg-white p-2 rounded shadow">Y</button>
      </div>
    </div>
  );
}