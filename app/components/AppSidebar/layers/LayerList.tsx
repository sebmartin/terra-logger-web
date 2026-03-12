"use client";

import { useLayerStore } from "@/app/stores/layerStore";
import { useSiteStore } from "@/app/stores/siteStore";
import { Layers } from "lucide-react";
import LayerItem from "./LayerItem";
import NewLayerDialog from "./NewLayerDialog";

interface LayerListProps {
  showDialog: boolean;
  setShowDialog: (v: boolean) => void;
}

export default function LayerList({ showDialog: showNewLayerDialog, setShowDialog: setShowNewLayerDialog }: LayerListProps) {

  const layers = useLayerStore((state) => state.layers);
  const toggleLayerVisibility = useLayerStore((state) => state.toggleLayerVisibility);
  const selectedLayerId = useLayerStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useLayerStore((state) => state.setSelectedLayerId);
  const createLayer = useLayerStore((state) => state.createLayer);
  const deleteLayer = useLayerStore((state) => state.deleteLayer);

  const selectedSite = useSiteStore((state) => state.selectedSite());

  if (!selectedSite) {
    return null;
  }

  const handleCreateLayer = async (layerName: string) => {
    try {
      const layer = await createLayer({
        site_id: selectedSite.id,
        name: layerName,
        description: "",
        visible: true,
      });
      setSelectedLayerId(layer.id);
      setShowNewLayerDialog(false);
      // No need to reload - store subscription handles it
    } catch (error) {
      console.error("Failed to create layer:", error);
      alert("Failed to create layer");
    }
  };

  const handleDeleteLayer = async (id: string, name: string) => {
    if (confirm(`Delete layer "${name}" and all its features?`)) {
      try {
        await deleteLayer(id);
        // No need to reload or clear selection - store handles it
      } catch (error) {
        console.error("Failed to delete layer:", error);
        alert("Failed to delete layer");
      }
    }
  };
  return (
    <>
      <div className="flex flex-col">
        {layers.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <div className="mb-3 flex justify-center">
              <Layers size={40} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-slate-600 font-medium">No layers yet</p>
            <p className="text-xs text-slate-500 mt-2">Create a layer to organize your features</p>
          </div>
        ) : (
          layers.map((layer) => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isSelected={selectedLayerId === layer.id}
              onSelect={setSelectedLayerId}
              onToggleVisibility={toggleLayerVisibility}
              onDelete={handleDeleteLayer}
            />
          ))
        )}
      </div>

      {showNewLayerDialog && (
        <NewLayerDialog
          onCreate={handleCreateLayer}
          onCancel={() => setShowNewLayerDialog(false)}
        />
      )}
    </>
  );
}
