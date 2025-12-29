import { ipcMain } from 'electron';
import { DatabaseService } from '../database/db';

export function registerProjectHandlers(db: DatabaseService): void {
  // Create a new project
  ipcMain.handle('project:create', async (_event, project) => {
    try {
      return db.createProject(project);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  });

  // Get a project by ID
  ipcMain.handle('project:get', async (_event, id: string) => {
    try {
      return db.getProject(id);
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  });

  // List all projects
  ipcMain.handle('project:list', async () => {
    try {
      return db.listProjects();
    } catch (error) {
      console.error('Error listing projects:', error);
      throw error;
    }
  });

  // Update a project
  ipcMain.handle('project:update', async (_event, id: string, updates: any) => {
    try {
      return db.updateProject(id, updates);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  });

  // Delete a project
  ipcMain.handle('project:delete', async (_event, id: string) => {
    try {
      db.deleteProject(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  });

  // Export project as GeoJSON
  ipcMain.handle('geojson:export', async (_event, projectId: string) => {
    try {
      return db.exportProjectAsGeoJSON(projectId);
    } catch (error) {
      console.error('Error exporting GeoJSON:', error);
      throw error;
    }
  });

  // Import GeoJSON to project
  ipcMain.handle('geojson:import', async (_event, projectId: string, geojson: any) => {
    try {
      return db.importGeoJSONData(projectId, geojson);
    } catch (error) {
      console.error('Error importing GeoJSON:', error);
      throw error;
    }
  });
}
