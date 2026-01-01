import { useRef } from "react";
import {
  MapContainer as LeafletMapContainer,
} from "react-leaflet";
import L from "leaflet";
import MapBridge from "./MapBridge";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function MapComponent() {
  const mapRef = useRef(null);

  // Default center (US)
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 5;

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div>
          <h2>Mapbox Token Required</h2>
          <p>Please set your VITE_MAPBOX_ACCESS_TOKEN in a .env file</p>
          <p>
            Get a free token at:{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  var baseMaps = {
    "Topology": L.tileLayer(
      `https://api.mapbox.com/styles/v1/sebmartin/cl0daly1b002j15ldl6d0xcmh/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
        attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
      }
    ),
    "Mapbox Satellite": L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`,
      {
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
        attribution: '© <a href="https://www.mapbox.com/">Mapbox</a>',
      }
    ),
    "Stamens Terrain": L.tileLayer(
      'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
      {
        maxZoom: 18,
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
          '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
          'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ),
    "Stadia Outdoors": L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        attribution:
          'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
          'Imagery © <a href="https://stadiamaps.com/">Stadia Maps</a>',
      }
    ),
    "Stadia Satellite": L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
    "Esri World Imagery": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    "OpenStreetMap": L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }),
  };

  return (
    <LeafletMapContainer
      ref={mapRef}
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
      preferCanvas={true}
      layers={[baseMaps["Topology"]]}
    >
      <MapBridge baseMaps={baseMaps} />
    </LeafletMapContainer>
  );
}
