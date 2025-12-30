import { MapProvider } from "./context/MapContext";
import { SiteProvider } from "./context/SiteContext";
import { LayerProvider } from "./context/LayerContext";
import Sidebar from "./components/Sidebar/Sidebar";
import MapContainer from "./components/Map/MapContainer";
import "./App.css";

function App() {
  return (
    <MapProvider>
      <SiteProvider>
        <LayerProvider>
          <div className="app">
            <Sidebar />
            <div className="map-wrapper">
              <MapContainer />
            </div>
          </div>
        </LayerProvider>
      </SiteProvider>
    </MapProvider>
  );
}

export default App;
