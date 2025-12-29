import { ipcMain } from 'electron';
import { DatabaseService } from '../database/db';

export function registerSiteHandlers(db: DatabaseService): void {
  // Create a new site
  ipcMain.handle('site:create', async (_event, site) => {
    try {
      return db.createSite(site);
    } catch (error) {
      console.error('Error creating site:', error);
      throw error;
    }
  });

  // Get a site by ID
  ipcMain.handle('site:get', async (_event, id: string) => {
    try {
      return db.getSite(id);
    } catch (error) {
      console.error('Error getting site:', error);
      throw error;
    }
  });

  // List all sites
  ipcMain.handle('site:list', async () => {
    try {
      return db.listSites();
    } catch (error) {
      console.error('Error listing sites:', error);
      throw error;
    }
  });

  // Update a site
  ipcMain.handle('site:update', async (_event, id: string, updates: any) => {
    try {
      return db.updateSite(id, updates);
    } catch (error) {
      console.error('Error updating site:', error);
      throw error;
    }
  });

  // Delete a site
  ipcMain.handle('site:delete', async (_event, id: string) => {
    try {
      db.deleteSite(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting site:', error);
      throw error;
    }
  });

  // List projects for a site
  ipcMain.handle('site:listProjects', async (_event, siteId: string) => {
    try {
      return db.listProjectsForSite(siteId);
    } catch (error) {
      console.error('Error listing projects for site:', error);
      throw error;
    }
  });

  // List features for a site
  ipcMain.handle('site:listFeatures', async (_event, siteId: string) => {
    try {
      return db.listFeaturesForSite(siteId);
    } catch (error) {
      console.error('Error listing features for site:', error);
      throw error;
    }
  });
}
