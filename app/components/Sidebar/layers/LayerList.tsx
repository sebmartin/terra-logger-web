'use client';

import { useState } from "react";
import { IconButton } from "../../common";
import CollapsibleSection from "../CollapsibleSection";
import LayerItem from "./LayerItem";
import NewLayerDialog from "./NewLayerDialog";
import { useLayerStore } from "../../../stores/layerStore";
import { useSiteStore } from "../../../stores/siteStore";

export default function LayerList() {
  const [showNewLayerDialog, setShowNewLayerDialog] = useState(false);

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
      <CollapsibleSection
        title="Layers"
        headerActions={
          <div className="header-actions">
            <span className="count">{layers.length}</span>
            <IconButton
              onClick={() => setShowNewLayerDialog(true)}
              title="New Layer"
              icon="+"
            />
          </div>
        }
      >
        <div className="layer-list">
          {layers.length === 0 ? (
            <div className="empty-state-small">
              <p>No layers yet. Create a layer to organize your features.</p>
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
      </CollapsibleSection>

      {showNewLayerDialog && (
        <NewLayerDialog
          onCreate={handleCreateLayer}
          onCancel={() => setShowNewLayerDialog(false)}
        />
      )}
    </>
  );
}
