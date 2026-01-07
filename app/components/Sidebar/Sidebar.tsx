'use client';

import SiteList from "./sites/SiteList";
import LayerList from "./layers/LayerList";
import FeatureList from "./features/FeatureList";

export default function Sidebar() {
  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-transform duration-300 relative z-10">
      <div className="px-5 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 m-0">Terra Logger</h2>
      </div>

      <SiteList />
      <LayerList />
      <FeatureList />
    </div>
  );
}