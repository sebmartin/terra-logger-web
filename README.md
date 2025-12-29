# Terra Logger

An Electron desktop application for designing offgrid cabin layouts using geospatial tools. Built with React, Leaflet, and Mapbox for satellite imagery visualization.

## Features

- 🗺️ **Interactive Map** with Mapbox satellite imagery
- ✏️ **Drawing Tools** - Draw polylines, polygons, rectangles, and place markers
- 📏 **Measurement Tools** - Measure distances and areas with Turf.js
- 💾 **Project Management** - Save and manage multiple cabin design projects
- 📦 **GeoJSON Support** - Import and export designs as GeoJSON
- 📱 **Mobile-Friendly** - Responsive design with touch-optimized controls
- 🗄️ **Local Storage** - SQLite database for fast, offline-first data persistence

## Technology Stack

- **Electron** - Cross-platform desktop framework
- **React** - UI library
- **TypeScript** - Type safety
- **Leaflet** - Mapping library
- **Leaflet.PM** - Drawing and editing tools
- **Mapbox** - Satellite imagery tiles
- **SQLite (better-sqlite3)** - Local database
- **Turf.js** - Geospatial analysis
- **Vite** - Fast build tool

## Prerequisites

- Node.js 18+
- npm or yarn
- A free Mapbox account and access token

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd terra-logger-web

# Install dependencies
npm install
```

### 2. Configure Mapbox Token

1. Create a free Mapbox account at [mapbox.com](https://account.mapbox.com/access-tokens/)
2. Copy your default public token
3. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

4. Edit `.env` and add your token:

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.your_actual_token_here
```

### 3. Run Development Mode

```bash
# Start the app in development mode
npm run electron:dev
```

This will:
- Start the Vite dev server with hot module replacement
- Launch the Electron app
- Open DevTools automatically

### 4. Build for Production

```bash
# Build for current platform
npm run electron:build

# Or build for specific platforms:
npm run electron:build:mac    # macOS
npm run electron:build:win    # Windows
npm run electron:build:linux  # Linux
```

Built apps will be in `dist-electron/builder/`

## Usage Guide

### Creating a Project

1. Click the **+** button in the Projects section
2. Enter a project name
3. Click **Create**

### Drawing on the Map

The map toolbar (left side) provides several drawing tools:

- **Marker** - Place point markers
- **Polyline** - Draw lines (roads, boundaries)
- **Polygon** - Draw enclosed areas (building footprints)
- **Rectangle** - Draw rectangular shapes
- **Edit** - Modify existing shapes
- **Delete** - Remove shapes

### Measuring

Features are automatically saved with their measurements:
- **Lines** - Distance in km, miles, meters, feet
- **Polygons** - Area in sq meters, sq km, acres, hectares

### Importing/Exporting GeoJSON

**Export:**
1. Select a project
2. File > Export GeoJSON (coming soon in UI)
3. Use `window.electron.exportGeoJSON(projectId)` in console

**Import:**
1. Select a project
2. File > Import GeoJSON (coming soon in UI)
3. Use `window.electron.importGeoJSON(projectId, geojson)` in console

## Project Structure

```
terra-logger-web/
├── electron/              # Electron main process
│   ├── main.ts           # Entry point, window setup
│   ├── preload.ts        # IPC bridge (security)
│   ├── database/         # SQLite database
│   └── ipc/              # IPC handlers
├── src/                  # React renderer
│   ├── components/       # React components
│   ├── context/          # State management
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── App.tsx           # Root component
├── public/               # Static assets
└── package.json
```

## Database

Projects and features are stored in a local SQLite database at:
- **macOS**: `~/Library/Application Support/terra-logger/terra-logger.db`
- **Windows**: `%APPDATA%/terra-logger/terra-logger.db`
- **Linux**: `~/.config/terra-logger/terra-logger.db`

## Development Tips

### Opening DevTools

DevTools open automatically in development. In production builds:
- **macOS**: Cmd+Option+I
- **Windows/Linux**: Ctrl+Shift+I

### Debugging

Console logs from the main process appear in the terminal.
Console logs from the renderer appear in DevTools.

### Hot Reload

The Vite dev server provides hot module replacement for React components.
Changes to Electron main process files require restarting the app.

## Troubleshooting

### "Mapbox Token Required" Error

Make sure you've created a `.env` file with your Mapbox token.

### Drawing Tools Not Appearing

Ensure Leaflet.PM CSS is loaded. Check the browser console for errors.

### Database Errors

The database is created automatically on first run. If you encounter issues, try deleting the database file and restarting the app.

### Build Errors with better-sqlite3

The `better-sqlite3` package needs to be rebuilt for Electron:

```bash
npm run postinstall
```

This runs automatically after `npm install`.

## Roadmap

Future enhancements:
- [ ] GeoJSON import/export UI
- [ ] Measurement display on map
- [ ] Custom styling for features
- [ ] Multiple layers support
- [ ] Offline tile caching
- [ ] GPS integration
- [ ] Print/PDF export
- [ ] Cloud sync
- [ ] Collaboration features

## Contributing

This is a personal project for cabin planning. Feel free to fork and customize for your needs!

## License

MIT

## Support

For issues or questions, please create an issue on GitHub.
