import { useEffect } from "react";
import { useSiteContext } from "../../context/SiteContext";
import { useLayerContext } from "../../context/LayerContext";
import { useFeatureContext } from "../../context/FeatureContext";
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
    loading,
    createSite,
    updateSite,
    deleteSite,
  } = useSiteContext();

  const {
    layers,
    loadLayersForSite,
    toggleLayerVisibility,
    selectedLayerId,
    setSelectedLayerId,
    createLayer,
    deleteLayer,
  } = useLayerContext();

  const { features, updateFeature } = useFeatureContext();
  const { map } = useMap();

  // Load layers when current site changes
  useEffect(() => {
    if (currentSite) {
      loadLayersForSite(currentSite.id);
    }
    // Clear layer selection when site changes
    setSelectedLayerId(null);
  }, [currentSite, loadLayersForSite, setSelectedLayerId]);

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
            layers={layers}
            selectedLayerId={selectedLayerId}
            siteId={currentSite.id}
            onSelectLayer={setSelectedLayerId}
            onToggleVisibility={toggleLayerVisibility}
            onCreateLayer={createLayer}
            onDeleteLayer={deleteLayer}
            onRefreshLayers={() => currentSite && loadLayersForSite(currentSite.id)}
          />

          <FeatureList features={features} onUpdateFeature={updateFeature} />
        </>
      )}
    </div>
  );
}