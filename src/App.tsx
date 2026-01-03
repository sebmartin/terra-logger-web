import Sidebar from "./components/Sidebar/Sidebar";
import MapboxContainer from "./components/Map/MapContainer";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="map-wrapper">
        <MapboxContainer />
      </div>
    </div>
  );
}

export default App;
