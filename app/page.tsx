'use client';

import { ErrorBoundary } from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar/Sidebar";
import MapboxContainer from "./components/Map/MapContainer";
import "./globals.css";

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="flex w-full h-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full relative">
          <MapboxContainer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
