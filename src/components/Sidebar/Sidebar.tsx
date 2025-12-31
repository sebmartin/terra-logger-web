import { useEffect } from "react";
import { useSiteContext } from "../../context/SiteContext";
import { useMap } from "../../context/MapContext";
import SiteList from "./sites/SiteList";
import LayerList from "./layers/LayerList";
import FeatureList from "./features/FeatureList";
import "./Sidebar.css";

export default function Sidebar() {
  const { selectedSite } = useSiteContext();
  const { map } = useMap();

  // Navigate to site bounds when site is selected
  // TODO: Move this to the SiteList component?
  useEffect(() => {
    if (!map) return;

    const boundsToShow = selectedSite?.bounds;

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
  }, [map, selectedSite]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Terra Logger</h2>
      </div>

      <SiteList />
      <LayerList />
      <FeatureList />
    </div>
  );
}