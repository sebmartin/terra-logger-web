import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import { promises as fs } from "node:fs";
import { SCHEMA, DBSite, DBLayer, DBFeature, DBMeasurement } from "./schema";

export class DatabaseService {
  private db: Database.Database;
  private static instance: DatabaseService | null = null;

  constructor() {
    // For Next.js, store database in project directory
    const dbPath = path.join(process.cwd(), "data", "terra-logger.db");

    console.log("Database path:", dbPath);

    // Ensure database directory exists (synchronously, since we need it before opening DB)
    try {
      const fsSync = require("node:fs");
      const dataDir = path.join(process.cwd(), "data");
      fsSync.mkdirSync(dataDir, { recursive: true });
    } catch (error) {
      console.error("Error creating database directory:", error);
    }

    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");

    this.initialize();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initialize(): void {
    // Run schema - creates tables if they don't exist
    this.db.exec(SCHEMA);

    console.log("Database initialized successfully");
  }

  close(): void {
    this.db.close();
  }

  // ==================== SITE OPERATIONS ====================

  createSite(site: {
    name: string;
    description?: string;
    bounds: any;
  }): DBSite {
    const now = Date.now();
    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO sites (id, name, description, bounds, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      site.name,
      site.description || null,
      JSON.stringify(site.bounds),
      now,
      now,
    );

    return this.getSite(id)!;
  }

  getSite(id: string): DBSite | null {
    const stmt = this.db.prepare("SELECT * FROM sites WHERE id = ?");
    const row = stmt.get(id) as DBSite | undefined;
    return row || null;
  }

  listSites(): DBSite[] {
    const stmt = this.db.prepare(
      "SELECT * FROM sites ORDER BY updated_at DESC",
    );
    return stmt.all() as DBSite[];
  }

  updateSite(
    id: string,
    updates: {
      name?: string;
      description?: string;
      bounds?: any;
    },
  ): DBSite {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push("description = ?");
      values.push(updates.description);
    }
    if (updates.bounds !== undefined) {
      fields.push("bounds = ?");
      values.push(JSON.stringify(updates.bounds));
    }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE sites SET ${fields.join(", ")} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getSite(id)!;
  }

  deleteSite(id: string): void {
    const stmt = this.db.prepare("DELETE FROM sites WHERE id = ?");
    stmt.run(id);
  }

  listLayersForSite(siteId: string): DBLayer[] {
    const stmt = this.db.prepare(
      "SELECT * FROM layers WHERE site_id = ? ORDER BY updated_at DESC",
    );
    return stmt.all(siteId) as DBLayer[];
  }

  listFeaturesForSite(siteId: string): DBFeature[] {
    const stmt = this.db.prepare(
      "SELECT * FROM features WHERE site_id = ? ORDER BY updated_at DESC",
    );
    return stmt.all(siteId) as DBFeature[];
  }

  // ==================== LAYER OPERATIONS ====================

  createLayer(layer: {
    site_id: string;
    name: string;
    description?: string;
    visible?: boolean;
    color?: string;
  }): DBLayer {
    const now = Date.now();
    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO layers (id, site_id, name, description, visible, color, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      layer.site_id,
      layer.name,
      layer.description || null,
      layer.visible !== undefined ? (layer.visible ? 1 : 0) : 1,
      layer.color || null,
      now,
      now,
    );

    return this.getLayer(id)!;
  }

  getLayer(id: string): DBLayer | null {
    const stmt = this.db.prepare("SELECT * FROM layers WHERE id = ?");
    const row = stmt.get(id) as DBLayer | undefined;
    return row || null;
  }

  listLayers(): DBLayer[] {
    const stmt = this.db.prepare(
      "SELECT * FROM layers ORDER BY updated_at DESC",
    );
    return stmt.all() as DBLayer[];
  }

  updateLayer(
    id: string,
    updates: {
      name?: string;
      description?: string;
      visible?: boolean;
      color?: string;
    },
  ): DBLayer {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push("description = ?");
      values.push(updates.description);
    }
    if (updates.visible !== undefined) {
      fields.push("visible = ?");
      values.push(updates.visible ? 1 : 0);
    }
    if (updates.color !== undefined) {
      fields.push("color = ?");
      values.push(updates.color);
    }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE layers SET ${fields.join(", ")} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getLayer(id)!;
  }

  deleteLayer(id: string): void {
    const stmt = this.db.prepare("DELETE FROM layers WHERE id = ?");
    stmt.run(id);
  }

  // ==================== FEATURE OPERATIONS ====================

  createFeature(
    parentId: string,
    feature: {
      type: string;
      name?: string;
      description?: string;
      geometry: any;
      properties?: any;
      style?: any;
      site_id?: string;
      layer_id?: string;
    },
  ): DBFeature {
    const now = Date.now();
    const id = uuidv4();

    // Determine if this is a site or layer feature
    const siteId = feature.site_id || (feature.layer_id ? null : parentId);
    const layerId = feature.layer_id || (feature.site_id ? null : parentId);

    const stmt = this.db.prepare(`
      INSERT INTO features (id, site_id, layer_id, type, name, description, geometry, properties, style, locked, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      siteId,
      layerId,
      feature.type,
      feature.name || null,
      feature.description || null,
      JSON.stringify(feature.geometry),
      feature.properties ? JSON.stringify(feature.properties) : null,
      feature.style ? JSON.stringify(feature.style) : null,
      0, // locked defaults to false
      now,
      now,
    );

    // Update layer's updated_at timestamp
    if (layerId) {
      this.updateLayer(layerId, {});
    }

    return this.getFeature(id)!;
  }

  getFeature(id: string): DBFeature | null {
    const stmt = this.db.prepare("SELECT * FROM features WHERE id = ?");
    const row = stmt.get(id) as DBFeature | undefined;
    return row || null;
  }

  listFeatures(layerId: string): DBFeature[] {
    const stmt = this.db.prepare(
      "SELECT * FROM features WHERE layer_id = ? ORDER BY created_at ASC",
    );
    return stmt.all(layerId) as DBFeature[];
  }

  updateFeature(
    id: string,
    updates: {
      name?: string;
      description?: string;
      geometry?: any;
      properties?: any;
      style?: any;
      locked?: boolean;
    },
  ): DBFeature {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push("name = ?");
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push("description = ?");
      values.push(updates.description);
    }
    if (updates.geometry !== undefined) {
      fields.push("geometry = ?");
      values.push(JSON.stringify(updates.geometry));
    }
    if (updates.properties !== undefined) {
      fields.push("properties = ?");
      values.push(JSON.stringify(updates.properties));
    }
    if (updates.style !== undefined) {
      fields.push("style = ?");
      values.push(JSON.stringify(updates.style));
    }
    if (updates.locked !== undefined) {
      fields.push("locked = ?");
      values.push(updates.locked ? 1 : 0);
    }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE features SET ${fields.join(", ")} WHERE id = ?
    `);

    stmt.run(...values);

    // Update parent layer's updated_at
    const feature = this.getFeature(id);
    if (feature && feature.layer_id) {
      this.updateLayer(feature.layer_id, {});
    }

    return this.getFeature(id)!;
  }

  deleteFeature(id: string): void {
    const feature = this.getFeature(id);
    const stmt = this.db.prepare("DELETE FROM features WHERE id = ?");
    stmt.run(id);

    // Update parent layer's updated_at
    if (feature && feature.layer_id) {
      this.updateLayer(feature.layer_id, {});
    }
  }

  // ==================== MEASUREMENT OPERATIONS ====================

  createMeasurement(
    layerId: string,
    measurement: {
      featureId?: string;
      type: "distance" | "area";
      value: number;
      unit: string;
      geometry: any;
      label?: string;
    },
  ): DBMeasurement {
    const now = Date.now();
    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO measurements (id, layer_id, feature_id, type, value, unit, geometry, label, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      layerId,
      measurement.featureId || null,
      measurement.type,
      measurement.value,
      measurement.unit,
      JSON.stringify(measurement.geometry),
      measurement.label || null,
      now,
    );

    return this.getMeasurement(id)!;
  }

  getMeasurement(id: string): DBMeasurement | null {
    const stmt = this.db.prepare("SELECT * FROM measurements WHERE id = ?");
    const row = stmt.get(id) as DBMeasurement | undefined;
    return row || null;
  }

  listMeasurements(layerId: string): DBMeasurement[] {
    const stmt = this.db.prepare(
      "SELECT * FROM measurements WHERE layer_id = ? ORDER BY created_at DESC",
    );
    return stmt.all(layerId) as DBMeasurement[];
  }

  deleteMeasurement(id: string): void {
    const stmt = this.db.prepare("DELETE FROM measurements WHERE id = ?");
    stmt.run(id);
  }

  // ==================== GEOJSON OPERATIONS ====================

  exportLayerAsGeoJSON(layerId: string): string {
    const features = this.listFeatures(layerId);
    const featureCollection = {
      type: "FeatureCollection",
      features: features.map((feature) => ({
        type: "Feature",
        id: feature.id,
        geometry: JSON.parse(feature.geometry),
        properties: {
          name: feature.name,
          description: feature.description,
          type: feature.type,
          style: feature.style ? JSON.parse(feature.style) : null,
          ...(feature.properties ? JSON.parse(feature.properties) : {}),
        },
      })),
    };

    return JSON.stringify(featureCollection, null, 2);
  }

  async exportLayerToFile(layerId: string, filePath: string): Promise<void> {
    const geojson = this.exportLayerAsGeoJSON(layerId);
    await fs.writeFile(filePath, geojson, "utf-8");
  }

  importGeoJSONData(layerId: string, geojson: any): DBFeature[] {
    if (geojson.type !== "FeatureCollection") {
      throw new Error("Invalid GeoJSON: must be a FeatureCollection");
    }

    const importedFeatures: DBFeature[] = [];

    for (const feature of geojson.features) {
      const newFeature = this.createFeature(layerId, {
        type:
          feature.properties?.type || this.inferFeatureType(feature.geometry),
        name: feature.properties?.name || "Imported Feature",
        description: feature.properties?.description || null,
        geometry: feature.geometry,
        properties: feature.properties || {},
        style: feature.properties?.style || null,
      });

      importedFeatures.push(newFeature);
    }

    return importedFeatures;
  }

  private inferFeatureType(geometry: any): string {
    switch (geometry.type) {
      case "Point":
        return "Marker";
      case "LineString":
        return "Polyline";
      case "Polygon":
        return "Polygon";
      default:
        return "Feature";
    }
  }
}

// Export singleton instance getter
export const getDb = () => DatabaseService.getInstance();
