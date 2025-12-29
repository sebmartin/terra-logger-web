import { contextBridge, ipcRenderer } from 'electron';
import type { IpcRendererEvent } from 'electron';

// Define the API interface that will be exposed to renderer
export interface ElectronAPI {
  // Site operations
  createSite: (site: any) => Promise<any>;
  getSite: (id: string) => Promise<any>;
  listSites: () => Promise<any[]>;
  updateSite: (id: string, updates: any) => Promise<any>;
  deleteSite: (id: string) => Promise<void>;
  listSiteProjects: (siteId: string) => Promise<any[]>;
  listSiteFeatures: (siteId: string) => Promise<any[]>;

  // Project operations
  createProject: (project: any) => Promise<any>;
  getProject: (id: string) => Promise<any>;
  listProjects: () => Promise<any[]>;
  updateProject: (id: string, updates: any) => Promise<any>;
  deleteProject: (id: string) => Promise<void>;

  // Feature operations
  createFeature: (projectId: string, feature: any) => Promise<any>;
  getFeature: (id: string) => Promise<any>;
  listFeatures: (projectId: string) => Promise<any[]>;
  updateFeature: (id: string, updates: any) => Promise<any>;
  deleteFeature: (id: string) => Promise<void>;

  // Measurement operations
  createMeasurement: (projectId: string, measurement: any) => Promise<any>;
  listMeasurements: (projectId: string) => Promise<any[]>;
  deleteMeasurement: (id: string) => Promise<void>;

  // GeoJSON operations
  exportGeoJSON: (projectId: string) => Promise<string>;
  importGeoJSON: (projectId: string, geojson: any) => Promise<any[]>;

  // File dialog operations
  showOpenDialog: () => Promise<any>;
  showSaveDialog: () => Promise<any>;

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => void;
  off: (channel: string, callback: (...args: any[]) => void) => void;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // Site operations
  createSite: (site: any) => ipcRenderer.invoke('site:create', site),
  getSite: (id: string) => ipcRenderer.invoke('site:get', id),
  listSites: () => ipcRenderer.invoke('site:list'),
  updateSite: (id: string, updates: any) =>
    ipcRenderer.invoke('site:update', id, updates),
  deleteSite: (id: string) => ipcRenderer.invoke('site:delete', id),
  listSiteProjects: (siteId: string) =>
    ipcRenderer.invoke('site:listProjects', siteId),
  listSiteFeatures: (siteId: string) =>
    ipcRenderer.invoke('site:listFeatures', siteId),

  // Project operations
  createProject: (project: any) => ipcRenderer.invoke('project:create', project),
  getProject: (id: string) => ipcRenderer.invoke('project:get', id),
  listProjects: () => ipcRenderer.invoke('project:list'),
  updateProject: (id: string, updates: any) =>
    ipcRenderer.invoke('project:update', id, updates),
  deleteProject: (id: string) => ipcRenderer.invoke('project:delete', id),

  // Feature operations
  createFeature: (projectId: string, feature: any) =>
    ipcRenderer.invoke('feature:create', projectId, feature),
  getFeature: (id: string) => ipcRenderer.invoke('feature:get', id),
  listFeatures: (projectId: string) =>
    ipcRenderer.invoke('feature:list', projectId),
  updateFeature: (id: string, updates: any) =>
    ipcRenderer.invoke('feature:update', id, updates),
  deleteFeature: (id: string) => ipcRenderer.invoke('feature:delete', id),

  // Measurement operations
  createMeasurement: (projectId: string, measurement: any) =>
    ipcRenderer.invoke('measurement:create', projectId, measurement),
  listMeasurements: (projectId: string) =>
    ipcRenderer.invoke('measurement:list', projectId),
  deleteMeasurement: (id: string) =>
    ipcRenderer.invoke('measurement:delete', id),

  // GeoJSON operations
  exportGeoJSON: (projectId: string) =>
    ipcRenderer.invoke('geojson:export', projectId),
  importGeoJSON: (projectId: string, geojson: any) =>
    ipcRenderer.invoke('geojson:import', projectId, geojson),

  // File dialog operations
  showOpenDialog: () => ipcRenderer.invoke('dialog:openFile'),
  showSaveDialog: () => ipcRenderer.invoke('dialog:saveFile'),

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);
  },
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', electronAPI);

// TypeScript type augmentation for window.electron
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
