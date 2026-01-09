'use client';

import SiteList from "./sites/SiteList";
import LayerList from "./layers/LayerList";
import FeatureList from "./features/FeatureList";

export default function Sidebar() {
  return (
    <div className="w-96 h-screen bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 flex flex-col overflow-hidden shadow-xl">
      <div className="px-5 py-4 border-b border-slate-200/80 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex-none shadow-md">
        <h2 className="text-xl font-bold text-white tracking-tight">Terra Logger</h2>
        <p className="text-blue-100 text-xs mt-0.5">Geospatial Planning Tool</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0">
        <SiteList />
        <LayerList />
        <FeatureList />
      </div>
    </div>
  );
}