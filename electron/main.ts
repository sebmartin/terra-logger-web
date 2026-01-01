import { app, BrowserWindow, ipcMain, dialog, session } from "electron";
import path from "node:path";
import { DatabaseService } from "./database/db";
import { registerSiteHandlers } from "./ipc/site-handlers";
import { registerLayerHandlers } from "./ipc/layer-handlers";
import { registerFeatureHandlers } from "./ipc/feature-handlers";

process.env.DIST_ELECTRON = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.DIST_ELECTRON, "../dist-renderer");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.DIST_ELECTRON, "../../public")
  : process.env.DIST;

let mainWindow: BrowserWindow | null = null;
let db: DatabaseService | null = null;

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    titleBarStyle: "default",
    show: false, // Don't show until ready-to-show
  });

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Load the app
  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(process.env.DIST!, "index.html"));
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Content Security Policy
function setupCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const isDev = VITE_DEV_SERVER_URL !== undefined;

    // In development, Vite needs 'unsafe-inline' and 'unsafe-eval' for HMR
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self'";

    // In development, allow connections to Vite dev server
    // Also allow mapbox:// protocol for MapLibre terrain data
    // Allow MapLibre and Maptiler tile servers
    const connectSrc = isDev
      ? "connect-src 'self' http://localhost:* ws://localhost:* https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com https://demotiles.maplibre.org https://api.maptiler.com https://*.maptiler.com mapbox:"
      : "connect-src 'self' https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com https://demotiles.maplibre.org https://api.maptiler.com https://*.maptiler.com mapbox:";

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          [
            "default-src 'self'",
            scriptSrc,
            "style-src 'self' 'unsafe-inline'", // Leaflet requires inline styles
            "img-src 'self' data: https://*.mapbox.com https://api.mapbox.com https://cdnjs.cloudflare.com https://tile.openstreetmap.org https://tiles.stadiamaps.com https://server.arcgisonline.com",
            connectSrc,
            "font-src 'self' data:",
            "worker-src 'self' blob:",
          ].join("; "),
        ],
      },
    });
  });
}

// Initialize database and IPC handlers
function initializeServices() {
  // Initialize database
  db = new DatabaseService();

  // Register IPC handlers
  registerSiteHandlers(db);
  registerLayerHandlers(db);
  registerFeatureHandlers(db);

  // File dialog handlers
  ipcMain.handle("dialog:openFile", async () => {
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ["openFile"],
      filters: [
        { name: "GeoJSON", extensions: ["json", "geojson"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });
    return result;
  });

  ipcMain.handle("dialog:saveFile", async () => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      filters: [
        { name: "GeoJSON", extensions: ["geojson"] },
        { name: "JSON", extensions: ["json"] },
      ],
      defaultPath: "layer.geojson",
    });
    return result;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  setupCSP();
  initializeServices();
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

// Clean up on app quit
app.on("before-quit", () => {
  if (db) {
    db.close();
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
