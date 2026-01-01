import { AppProviders } from "./providers/AppProviders";
import Sidebar from "./components/Sidebar/Sidebar";
import MapLibreContainer from "./components/Map/MapLibreContainer";
import "./App.css";

function App() {
  return (
    <AppProviders>
      <div className="app">
        <Sidebar />
        <div className="map-wrapper">
          <MapLibreContainer />
        </div>
      </div>
    </AppProviders>
  );
}

export default App;
