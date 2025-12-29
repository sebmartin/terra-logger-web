import { MapProvider } from './context/MapContext';
import { SiteProvider } from './context/SiteContext';
import { ProjectProvider } from './context/ProjectContext';
import Sidebar from './components/Sidebar/Sidebar';
import MapContainer from './components/Map/MapContainer';
import './App.css';

function App() {
  return (
    <MapProvider>
      <SiteProvider>
        <ProjectProvider>
          <div className="app">
            <Sidebar />
            <div className="map-wrapper">
              <MapContainer />
            </div>
          </div>
        </ProjectProvider>
      </SiteProvider>
    </MapProvider>
  );
}

export default App;
