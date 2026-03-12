"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMapContext } from "@/app/components/Map/MapProvider";
import { Button } from "@/components/ui/button";
import type { SiteBounds } from "@/app/types/site";

interface BoundsSelectorProps {
  initialBounds?: SiteBounds;
  onCapture: (bounds: SiteBounds) => void;
  onCancel: () => void;
  title?: string;
}

export default function BoundsSelector({
  initialBounds,
  onCapture,
  onCancel,
  title = "Position Map to Capture Site Area",
}: BoundsSelectorProps) {
  const { map } = useMapContext();
  const [currentBounds, setCurrentBounds] = useState<SiteBounds | null>(null);

  // Set initial bounds if provided (Mapbox expects [lng, lat] per corner: [[west, south], [east, north]])
  useEffect(() => {
    if (map && initialBounds) {
      map.fitBounds([
        [initialBounds.west, initialBounds.south],
        [initialBounds.east, initialBounds.north],
      ]);
    }
  }, [map, initialBounds]);

  // Update current bounds when map moves
  useEffect(() => {
    if (!map) return;

    const updateBounds = () => {
      const bounds = map.getBounds();
      if (!bounds) return;
      setCurrentBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    };

    // Initial update
    updateBounds();

    // Listen for map movement
    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
      map.off("zoomend", updateBounds);
    };
  }, [map]);

  const handleCapture = () => {
    if (currentBounds) {
      onCapture(currentBounds);
    }
  };

  return createPortal(
    <div className="absolute inset-0 z-[1000] pointer-events-none" data-testid="bounds-selector">
      <div className="absolute inset-0 pointer-events-none">
        {/* Dark overlay borders */}
        <div className="absolute top-0 left-0 right-0 h-[60px] bg-black/50 pointer-events-none" />
        <div className="absolute top-[60px] right-0 bottom-[60px] w-[60px] bg-black/50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-black/50 pointer-events-none" />
        <div className="absolute top-[60px] left-0 bottom-[60px] w-[60px] bg-black/50 pointer-events-none" />

        {/* Corner markers */}
        <div className="absolute top-[60px] left-[60px] w-5 h-5 border-3 border-blue-600 border-r-0 border-b-0 pointer-events-none" />
        <div className="absolute top-[60px] right-[60px] w-5 h-5 border-3 border-blue-600 border-l-0 border-b-0 pointer-events-none" />
        <div className="absolute bottom-[60px] left-[60px] w-5 h-5 border-3 border-blue-600 border-r-0 border-t-0 pointer-events-none" />
        <div className="absolute bottom-[60px] right-[60px] w-5 h-5 border-3 border-blue-600 border-l-0 border-t-0 pointer-events-none" />
      </div>

      <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white p-5 rounded-lg shadow-lg min-w-[400px] max-w-[500px] pointer-events-auto z-[1001]">
        <div className="mb-4">
          <h3 className="m-0 mb-2 text-lg font-semibold text-gray-800">{title}</h3>
          <p className="m-0 text-sm text-gray-600 leading-relaxed">
            Pan and zoom the map to frame your site area within the viewport
          </p>
        </div>

        {currentBounds && (
          <div className="bg-gray-50 p-3 rounded mb-4 grid grid-cols-2 gap-2 text-[13px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">North:</span>
              <span className="text-gray-800">{currentBounds.north.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">South:</span>
              <span className="text-gray-800">{currentBounds.south.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">East:</span>
              <span className="text-gray-800">{currentBounds.east.toFixed(6)}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">West:</span>
              <span className="text-gray-800">{currentBounds.west.toFixed(6)}°</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleCapture} disabled={!currentBounds}>
            Capture This Area
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
