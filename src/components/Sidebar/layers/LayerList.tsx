import { useState } from "react";
import { IconButton } from "../../common";
import CollapsibleSection from "../CollapsibleSection";
import LayerItem from "./LayerItem";
import NewLayerDialog from "./NewLayerDialog";
import { useLayerContext } from "@/context/LayerContext";
import { useSiteContext } from "@/context/SiteContext";

export default function LayerList() {
  const [showNewLayerDialog, setShowNewLayerDialog] = useState(false);
  const {
    layers,
    toggleLayerVisibility,
    selectedLayerId,
    setSelectedLayerId,
    loadLayers,
    createLayer,
    deleteLayer,
  } = useLayerContext();
  const { selectedSite } = useSiteContext();

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
      await loadLayers(selectedSite.id);
    } catch (error) {
      console.error("Failed to create layer:", error);
      alert("Failed to create layer");
    }
  };

  const handleDeleteLayer = async (id: string, name: string) => {
    if (confirm(`Delete layer "${name}" and all its features?`)) {
      try {
        await deleteLayer(id);
        if (selectedLayerId === id) {
          setSelectedLayerId(null);
        }
        await loadLayers(selectedSite.id);
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
