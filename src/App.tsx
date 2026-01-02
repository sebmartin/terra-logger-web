import { AppProviders } from "./providers/AppProviders";
import Sidebar from "./components/Sidebar/Sidebar";
import MapboxContainer from "./components/Map/MapLibreContainer";
import "./App.css";

function App() {
  return (
    <AppProviders>
      <div className="app">
        <Sidebar />
        <div className="map-wrapper">
          <MapboxContainer />
        </div>
      </div>
    </AppProviders>
  );
}

export default App;
