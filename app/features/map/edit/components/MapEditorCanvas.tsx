import { useMapContext } from "@/app/components/Map/MapProvider";
import { useEffect, useRef } from "react";
import { createMapEditor, MapEditor as MapEditorType } from "../editor";

export function MapEditorCanvas() {
  const { map } = useMapContext();
  const editorRef = useRef<MapEditorType>(null);

  useEffect(() => {
    if (!map) return;

    editorRef.current = createMapEditor(map);

    return () => {
      editorRef.current?.destroy();
    };
  }, [map]);

  return (
    <div className="absolute top-0 left-0 h-full w-full z-20 flex flex-col items-center gap-2 pointer-events-none">
      {/* Wait do we need this? Doesn't terra-draw add itself to the map canvas?? */}
    </div>
  )
};