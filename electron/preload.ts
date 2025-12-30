import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

// Define the API interface that will be exposed to renderer
export interface ElectronAPI {
  // Site operations
  createSite: (site: any) => Promise<any>;
  getSite: (id: string) => Promise<any>;
  listSites: () => Promise<any[]>;
  updateSite: (id: string, updates: any) => Promise<any>;
  deleteSite: (id: string) => Promise<void>;
  listSiteLayers: (siteId: string) => Promise<any[]>;
  listSiteFeatures: (siteId: string) => Promise<any[]>;

  // Layer operations
  createLayer: (layer: any) => Promise<any>;
  getLayer: (id: string) => Promise<any>;
  listLayers: () => Promise<any[]>;
  updateLayer: (id: string, updates: any) => Promise<any>;
  deleteLayer: (id: string) => Promise<void>;

  // Feature operations
  createFeature: (layerId: string, feature: any) => Promise<any>;
  getFeature: (id: string) => Promise<any>;
  listFeatures: (layerId: string) => Promise<any[]>;
  updateFeature: (id: string, updates: any) => Promise<any>;
  deleteFeature: (id: string) => Promise<void>;

  // Measurement operations
  createMeasurement: (layerId: string, measurement: any) => Promise<any>;
  listMeasurements: (layerId: string) => Promise<any[]>;
  deleteMeasurement: (id: string) => Promise<void>;

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
  createSite: (site: any) => ipcRenderer.invoke("site:create", site),
  getSite: (id: string) => ipcRenderer.invoke("site:get", id),
  listSites: () => ipcRenderer.invoke("site:list"),
  updateSite: (id: string, updates: any) =>
    ipcRenderer.invoke("site:update", id, updates),
  deleteSite: (id: string) => ipcRenderer.invoke("site:delete", id),
  listSiteLayers: (siteId: string) =>
    ipcRenderer.invoke("site:listLayers", siteId),
  listSiteFeatures: (siteId: string) =>
    ipcRenderer.invoke("site:listFeatures", siteId),

  // Layer operations
  createLayer: (layer: any) => ipcRenderer.invoke("layer:create", layer),
  getLayer: (id: string) => ipcRenderer.invoke("layer:get", id),
  listLayers: () => ipcRenderer.invoke("layer:list"),
  updateLayer: (id: string, updates: any) =>
    ipcRenderer.invoke("layer:update", id, updates),
  deleteLayer: (id: string) => ipcRenderer.invoke("layer:delete", id),

  // Feature operations
  createFeature: (layerId: string, feature: any) =>
    ipcRenderer.invoke("feature:create", layerId, feature),
  getFeature: (id: string) => ipcRenderer.invoke("feature:get", id),
  listFeatures: (layerId: string) =>
    ipcRenderer.invoke("feature:list", layerId),
  updateFeature: (id: string, updates: any) =>
    ipcRenderer.invoke("feature:update", id, updates),
  deleteFeature: (id: string) => ipcRenderer.invoke("feature:delete", id),

  // Measurement operations
  createMeasurement: (layerId: string, measurement: any) =>
    ipcRenderer.invoke("measurement:create", layerId, measurement),
  listMeasurements: (layerId: string) =>
    ipcRenderer.invoke("measurement:list", layerId),
  deleteMeasurement: (id: string) =>
    ipcRenderer.invoke("measurement:delete", id),

  // File dialog operations
  showOpenDialog: () => ipcRenderer.invoke("dialog:openFile"),
  showSaveDialog: () => ipcRenderer.invoke("dialog:saveFile"),

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
contextBridge.exposeInMainWorld("electron", electronAPI);

// TypeScript type augmentation for window.electron
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
