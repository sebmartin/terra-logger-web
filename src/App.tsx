import { AppProviders } from "./providers/AppProviders";
import Sidebar from "./components/Sidebar/Sidebar";
import MapContainer from "./components/Map/MapContainer";
import "./App.css";

function App() {
  return (
    <AppProviders>
      <div className="app">
        <Sidebar />
        <div className="map-wrapper">
          <MapContainer />
        </div>
      </div>
    </AppProviders>
  );
}

export default App;
