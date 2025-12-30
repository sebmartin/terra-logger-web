import { ipcMain } from "electron";
import { DatabaseService } from "../database/db";

export function registerFeatureHandlers(db: DatabaseService): void {
  // Create a new feature
  ipcMain.handle(
    "feature:create",
    async (_event, layerId: string, feature: any) => {
      try {
        return db.createFeature(layerId, feature);
      } catch (error) {
        console.error("Error creating feature:", error);
        throw error;
      }
    },
  );

  // Get a feature by ID
  ipcMain.handle("feature:get", async (_event, id: string) => {
    try {
      return db.getFeature(id);
    } catch (error) {
      console.error("Error getting feature:", error);
      throw error;
    }
  });

  // List features for a layer
  ipcMain.handle("feature:list", async (_event, layerId: string) => {
    try {
      return db.listFeatures(layerId);
    } catch (error) {
      console.error("Error listing features:", error);
      throw error;
    }
  });

  // Update a feature
  ipcMain.handle("feature:update", async (_event, id: string, updates: any) => {
    try {
      return db.updateFeature(id, updates);
    } catch (error) {
      console.error("Error updating feature:", error);
      throw error;
    }
  });

  // Delete a feature
  ipcMain.handle("feature:delete", async (_event, id: string) => {
    try {
      db.deleteFeature(id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting feature:", error);
      throw error;
    }
  });

  // Create a measurement
  ipcMain.handle(
    "measurement:create",
    async (_event, layerId: string, measurement: any) => {
      try {
        return db.createMeasurement(layerId, measurement);
      } catch (error) {
        console.error("Error creating measurement:", error);
        throw error;
      }
    },
  );

  // List measurements for a layer
  ipcMain.handle("measurement:list", async (_event, layerId: string) => {
    try {
      return db.listMeasurements(layerId);
    } catch (error) {
      console.error("Error listing measurements:", error);
      throw error;
    }
  });

  // Delete a measurement
  ipcMain.handle("measurement:delete", async (_event, id: string) => {
    try {
      db.deleteMeasurement(id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting measurement:", error);
      throw error;
    }
  });
}
