import { MapProvider } from './context/MapContext';
import { ProjectProvider } from './context/ProjectContext';
import Sidebar from './components/Sidebar/Sidebar';
import MapContainer from './components/Map/MapContainer';
import './App.css';

function App() {
  return (
    <MapProvider>
      <ProjectProvider>
        <div className="app">
          <Sidebar />
          <div className="map-wrapper">
            <MapContainer />
          </div>
        </div>
      </ProjectProvider>
    </MapProvider>
  );
}

export default App;
