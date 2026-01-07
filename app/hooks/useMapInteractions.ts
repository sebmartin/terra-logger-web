import { useEffect } from "react";
import { TerraDraw } from "terra-draw";
import { MapRef } from "react-map-gl/mapbox";
import { Site } from "../types/site";

/**
 * Custom hook to handle map interactions
 * - Keyboard shortcuts (delete/backspace)
 * - Fitting bounds to selected site
 */
export function useMapInteractions(
  mapRef: React.RefObject<MapRef | null>,
  draw: TerraDraw | null,
  selectedFeatureId: string | null,
  setSelectedFeatureId: (id: string | null) => void,
  selectedSite: Site | null | undefined,
  onFeatureDelete: (id: string) => Promise<void>
): void {
  // Handle keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedFeatureId) {
        e.preventDefault();
        if (!draw) return;

        // Find and remove from Terra Draw
        const snapshot = draw.getSnapshot();
        const feature = snapshot.find(
          (f: any) => String(f.properties?.dbId) === selectedFeatureId
        );

        if (feature) {
          draw.removeFeatures([feature.id as string]);
        }

        // Delete from database
        onFeatureDelete(selectedFeatureId);
        setSelectedFeatureId(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedFeatureId, draw, onFeatureDelete, setSelectedFeatureId]);

  // Fit to selected site bounds
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !selectedSite) return;

    const { bounds } = selectedSite;
    if (bounds) {
      map.fitBounds(
        [
          [bounds.west, bounds.south],
          [bounds.east, bounds.north],
        ],
        { padding: 50, duration: 1000 }
      );
    }
  }, [selectedSite, mapRef]);
}
