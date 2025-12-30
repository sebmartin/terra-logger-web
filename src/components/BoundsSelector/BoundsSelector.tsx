import { useEffect, useState } from "react";
import { useMap } from "../../context/MapContext";
import type { SiteBounds } from "../../types/site";
import "./BoundsSelector.css";

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
  const { map } = useMap();
  const [currentBounds, setCurrentBounds] = useState<SiteBounds | null>(null);

  // Set initial bounds if provided
  useEffect(() => {
    if (map && initialBounds) {
      map.fitBounds([
        [initialBounds.south, initialBounds.west],
        [initialBounds.north, initialBounds.east],
      ]);
    }
  }, [map, initialBounds]);

  // Update current bounds when map moves
  useEffect(() => {
    if (!map) return;

    const updateBounds = () => {
      const bounds = map.getBounds();
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

  return (
    <div className="bounds-selector-overlay">
      <div className="bounds-selector-frame">
        <div className="bounds-selector-border bounds-top" />
        <div className="bounds-selector-border bounds-right" />
        <div className="bounds-selector-border bounds-bottom" />
        <div className="bounds-selector-border bounds-left" />

        <div className="bounds-selector-corner corner-tl" />
        <div className="bounds-selector-corner corner-tr" />
        <div className="bounds-selector-corner corner-bl" />
        <div className="bounds-selector-corner corner-br" />
      </div>

      <div className="bounds-selector-controls">
        <div className="bounds-selector-header">
          <h3>{title}</h3>
          <p>
            Pan and zoom the map to frame your site area within the viewport
          </p>
        </div>

        {currentBounds && (
          <div className="bounds-selector-info">
            <div className="bounds-coord">
              <span className="label">North:</span>
              <span className="value">{currentBounds.north.toFixed(6)}°</span>
            </div>
            <div className="bounds-coord">
              <span className="label">South:</span>
              <span className="value">{currentBounds.south.toFixed(6)}°</span>
            </div>
            <div className="bounds-coord">
              <span className="label">East:</span>
              <span className="value">{currentBounds.east.toFixed(6)}°</span>
            </div>
            <div className="bounds-coord">
              <span className="label">West:</span>
              <span className="value">{currentBounds.west.toFixed(6)}°</span>
            </div>
          </div>
        )}

        <div className="bounds-selector-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleCapture}
            disabled={!currentBounds}
          >
            Capture This Area
          </button>
        </div>
      </div>
    </div>
  );
}
