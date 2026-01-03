'use client';

import Sidebar from "./components/Sidebar/Sidebar";
import MapboxContainer from "./components/Map/MapContainer";
import "./globals.css";

export default function Home() {
  return (
    <div className="app">
      <Sidebar />
      <div className="map-wrapper">
        <MapboxContainer />
      </div>
    </div>
  );
}
