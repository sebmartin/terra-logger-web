import { TerraDraw } from "terra-draw";
import { Feature } from "../types/feature";

/**
 * Load features from database into Terra Draw
 * Call this whenever Terra Draw initializes or features change
 */
export function loadFeaturesIntoTerraDraw(
  draw: TerraDraw,
  features: Feature[]
): void {
  const snapshot = draw.getSnapshot();
  console.log(
    `[Sync] Features from DB: ${features.length}, Terra Draw snapshot: ${snapshot.length}`
  );

  const existingDbIds = new Set(
    snapshot.map((f) => f.properties?.dbId).filter(Boolean)
  );

  console.log(
    `[Sync] Existing DB IDs in Terra Draw:`,
    existingDbIds.size
  );
  console.log(
    `[Sync] Feature IDs from DB:`,
    features.length,
  );

  // Add features from database that aren't in Terra Draw yet
  const featuresToAdd = features
    .filter((f) => !existingDbIds.has(f.id))
    .map((f) => {
      // Determine the mode property based on geometry type
      let mode = "polygon";
      if (f.geometry.type === "Point") {
        mode = "point";
      } else if (f.geometry.type === "LineString") {
        mode = "linestring";
      } else if (f.geometry.type === "Polygon") {
        // Check if it was a rectangle or circle based on properties
        if (f.properties?.mode === "rectangle") {
          mode = "rectangle";
        } else if (f.properties?.mode === "circle") {
          mode = "circle";
        } else {
          mode = "polygon";
        }
      }

      return {
        type: "Feature" as const,
        id: f.id,
        geometry: f.geometry,
        properties: {
          ...f.properties,
          dbId: f.id,
          mode: f.properties?.mode || mode,
        },
      };
    });

  if (featuresToAdd.length > 0) {
    const results = draw.addFeatures(featuresToAdd as any);

    const failedResults = results.filter((r) => !r.valid);
    if (failedResults.length > 0) {
      console.error(
        `[Terra Draw] ${failedResults.length} features failed to load:`,
        failedResults
      );
    }
  }

  // Remove features from Terra Draw that no longer exist in database
  const currentDbIds = new Set(features.map((f) => f.id));
  const toRemove = snapshot
    .filter(
      (f) => f.properties?.dbId && !currentDbIds.has(String(f.properties.dbId))
    )
    .map((f) => f.id);

  if (toRemove.length > 0) {
    draw.removeFeatures(toRemove as string[]);
  }
}
