import { ipcMain } from "electron";
import { DatabaseService } from "../database/db";

export function registerLayerHandlers(db: DatabaseService): void {
  // Create a new layer
  ipcMain.handle("layer:create", async (_event, layer) => {
    try {
      return db.createLayer(layer);
    } catch (error) {
      console.error("Error creating layer:", error);
      throw error;
    }
  });

  // Get a layer by ID
  ipcMain.handle("layer:get", async (_event, id: string) => {
    try {
      return db.getLayer(id);
    } catch (error) {
      console.error("Error getting layer:", error);
      throw error;
    }
  });

  // List all layers
  ipcMain.handle("layer:list", async () => {
    try {
      return db.listLayers();
    } catch (error) {
      console.error("Error listing layers:", error);
      throw error;
    }
  });

  // Update a layer
  ipcMain.handle("layer:update", async (_event, id: string, updates: any) => {
    try {
      return db.updateLayer(id, updates);
    } catch (error) {
      console.error("Error updating layer:", error);
      throw error;
    }
  });

  // Delete a layer
  ipcMain.handle("layer:delete", async (_event, id: string) => {
    try {
      db.deleteLayer(id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting layer:", error);
      throw error;
    }
  });

  // ==================== GEOJSON OPERATIONS ====================

  // Export layer as GeoJSON
  ipcMain.handle("geojson:export", async (_event, layerId: string) => {
    try {
      return db.exportLayerAsGeoJSON(layerId);
    } catch (error) {
      console.error("Error exporting GeoJSON:", error);
      throw error;
    }
  });

  // Import GeoJSON to layer
  ipcMain.handle(
    "geojson:import",
    async (_event, layerId: string, geojson: any) => {
      try {
        return db.importGeoJSONData(layerId, geojson);
      } catch (error) {
        console.error("Error importing GeoJSON:", error);
        throw error;
      }
    },
  );
}
