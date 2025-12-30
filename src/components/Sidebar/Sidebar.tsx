import { useEffect } from "react";
import { useSites } from "../../hooks/useSites";
import { useLayers } from "../../hooks/useLayers";
import { useLayerContext } from "../../context/LayerContext";
import { useFeatureContext } from "../../context/FeatureContext";
import { useFeatures } from "../../hooks/useFeatures";
import { useMap } from "../../context/MapContext";
import SiteList from "./sites/SiteList";
import LayerList from "./layers/LayerList";
import FeatureList from "./features/FeatureList";
import "./Sidebar.css";

export default function Sidebar() {
  const {
    sites,
    currentSite,
    setCurrentSite,
    siteLayers,
    loading,
    createSite,
    updateSite,
    deleteSite,
    refreshSiteLayers,
  } = useSites();
  const { createLayer, deleteLayer } = useLayers();
  const {
    setLayers,
    toggleLayerVisibility,
    selectedLayerId,
    setSelectedLayerId,
  } = useLayerContext();
  const { features } = useFeatureContext();
  const { updateFeature } = useFeatures();
  const { map } = useMap();

  // Update layers in LayerContext when siteLayers change
  useEffect(() => {
    setLayers(siteLayers);
  }, [siteLayers, setLayers]);

  // When site changes, clear layer selection
  useEffect(() => {
    setSelectedLayerId(null);
  }, [currentSite, setSelectedLayerId]);

  // Navigate to site bounds when site is selected
  useEffect(() => {
    if (!map) return;

    const boundsToShow = currentSite?.bounds;

    if (boundsToShow) {
      map.fitBounds(
        [
          [boundsToShow.south, boundsToShow.west],
          [boundsToShow.north, boundsToShow.east],
        ],
        {
          padding: [50, 50],
          animate: true,
          duration: 0.5,
        },
      );
    }
  }, [map, currentSite]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Terra Logger</h2>
      </div>

      <SiteList
        sites={sites}
        currentSite={currentSite}
        loading={loading}
        onSelectSite={setCurrentSite}
        onCreateSite={createSite}
        onUpdateSite={updateSite}
        onDeleteSite={deleteSite}
      />

      {currentSite && (
        <>
          <LayerList
            layers={siteLayers}
            selectedLayerId={selectedLayerId}
            siteId={currentSite.id}
            onSelectLayer={setSelectedLayerId}
            onToggleVisibility={toggleLayerVisibility}
            onCreateLayer={createLayer}
            onDeleteLayer={deleteLayer}
            onRefreshLayers={refreshSiteLayers}
          />

          <FeatureList features={features} onUpdateFeature={updateFeature} />
        </>
      )}
    </div>
  );
}