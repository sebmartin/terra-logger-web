import { useState } from "react";
import type { Layer } from "../../../types/layer";
import { IconButton } from "../../common";
import CollapsibleSection from "../CollapsibleSection";
import LayerItem from "./LayerItem";
import NewLayerDialog from "./NewLayerDialog";

interface LayerListProps {
  layers: Layer[];
  selectedLayerId: string | null;
  siteId: string;
  onSelectLayer: (id: string | null) => void;
  onToggleVisibility: (id: string) => void;
  onCreateLayer: (data: {
    site_id: string;
    name: string;
    description: string;
    visible: boolean;
  }) => Promise<Layer>;
  onDeleteLayer: (id: string) => Promise<void>;
  onRefreshLayers: (siteId: string) => Promise<void>;
}

export default function LayerList({
  layers,
  selectedLayerId,
  siteId,
  onSelectLayer,
  onToggleVisibility,
  onCreateLayer,
  onDeleteLayer,
  onRefreshLayers,
}: LayerListProps) {
  const [showNewLayerDialog, setShowNewLayerDialog] = useState(false);

  const handleCreateLayer = async (layerName: string) => {
    try {
      const layer = await onCreateLayer({
        site_id: siteId,
        name: layerName,
        description: "",
        visible: true,
      });
      onSelectLayer(layer.id);
      setShowNewLayerDialog(false);
      await onRefreshLayers(siteId);
    } catch (error) {
      console.error("Failed to create layer:", error);
      alert("Failed to create layer");
    }
  };

  const handleDeleteLayer = async (id: string, name: string) => {
    if (confirm(`Delete layer "${name}" and all its features?`)) {
      try {
        await onDeleteLayer(id);
        if (selectedLayerId === id) {
          onSelectLayer(null);
        }
        await onRefreshLayers(siteId);
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
                onSelect={onSelectLayer}
                onToggleVisibility={onToggleVisibility}
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
