import SiteList from "./sites/SiteList";
import LayerList from "./layers/LayerList";
import FeatureList from "./features/FeatureList";
import "./Sidebar.css";

export default function Sidebar() {
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