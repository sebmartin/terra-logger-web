import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';
import { app } from 'electron';
import { promises as fs } from 'node:fs';
import { SCHEMA, DBProject, DBFeature, DBMeasurement } from './schema';

export class DatabaseService {
  private db: Database.Database;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'terra-logger.db');

    console.log('Database path:', dbPath);

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    this.initialize();
  }

  private initialize(): void {
    this.db.exec(SCHEMA);
    console.log('Database initialized successfully');
  }

  close(): void {
    this.db.close();
  }

  // ==================== PROJECT OPERATIONS ====================

  createProject(project: {
    name: string;
    description?: string;
    bounds?: any;
    center?: any;
    zoom?: number;
    settings?: any;
  }): DBProject {
    const now = Date.now();
    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO projects (id, name, description, created_at, updated_at, bounds, center, zoom, settings)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      project.name,
      project.description || null,
      now,
      now,
      project.bounds ? JSON.stringify(project.bounds) : null,
      project.center ? JSON.stringify(project.center) : null,
      project.zoom || null,
      project.settings ? JSON.stringify(project.settings) : null
    );

    return this.getProject(id)!;
  }

  getProject(id: string): DBProject | null {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(id) as DBProject | undefined;
    return row || null;
  }

  listProjects(): DBProject[] {
    const stmt = this.db.prepare('SELECT * FROM projects ORDER BY updated_at DESC');
    return stmt.all() as DBProject[];
  }

  updateProject(
    id: string,
    updates: {
      name?: string;
      description?: string;
      bounds?: any;
      center?: any;
      zoom?: number;
      settings?: any;
    }
  ): DBProject {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.bounds !== undefined) {
      fields.push('bounds = ?');
      values.push(JSON.stringify(updates.bounds));
    }
    if (updates.center !== undefined) {
      fields.push('center = ?');
      values.push(JSON.stringify(updates.center));
    }
    if (updates.zoom !== undefined) {
      fields.push('zoom = ?');
      values.push(updates.zoom);
    }
    if (updates.settings !== undefined) {
      fields.push('settings = ?');
      values.push(JSON.stringify(updates.settings));
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE projects SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);
    return this.getProject(id)!;
  }

  deleteProject(id: string): void {
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
  }

  // ==================== FEATURE OPERATIONS ====================

  createFeature(
    projectId: string,
    feature: {
      type: string;
      name?: string;
      description?: string;
      geometry: any;
      properties?: any;
      style?: any;
    }
  ): DBFeature {
    const now = Date.now();
    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO features (id, project_id, type, name, description, geometry, properties, style, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      projectId,
      feature.type,
      feature.name || null,
      feature.description || null,
      JSON.stringify(feature.geometry),
      feature.properties ? JSON.stringify(feature.properties) : null,
      feature.style ? JSON.stringify(feature.style) : null,
      now,
      now
    );

    // Update project's updated_at timestamp
    this.updateProject(projectId, {});

    return this.getFeature(id)!;
  }

  getFeature(id: string): DBFeature | null {
    const stmt = this.db.prepare('SELECT * FROM features WHERE id = ?');
    const row = stmt.get(id) as DBFeature | undefined;
    return row || null;
  }

  listFeatures(projectId: string): DBFeature[] {
    const stmt = this.db.prepare('SELECT * FROM features WHERE project_id = ? ORDER BY created_at ASC');
    return stmt.all(projectId) as DBFeature[];
  }

  updateFeature(
    id: string,
    updates: {
      name?: string;
      description?: string;
      geometry?: any;
      properties?: any;
      style?: any;
    }
  ): DBFeature {
    const now = Date.now();
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.geometry !== undefined) {
      fields.push('geometry = ?');
      values.push(JSON.stringify(updates.geometry));
    }
    if (updates.properties !== undefined) {
      fields.push('properties = ?');
      values.push(JSON.stringify(updates.properties));
    }
    if (updates.style !== undefined) {
      fields.push('style = ?');
      values.push(JSON.stringify(updates.style));
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE features SET ${fields.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    // Update parent project's updated_at
    const feature = this.getFeature(id);
    if (feature) {
      this.updateProject(feature.project_id, {});
    }

    return this.getFeature(id)!;
  }

  deleteFeature(id: string): void {
    const feature = this.getFeature(id);
    const stmt = this.db.prepare('DELETE FROM features WHERE id = ?');
    stmt.run(id);

    // Update parent project's updated_at
    if (feature) {
      this.updateProject(feature.project_id, {});
    }
  }

  // ==================== MEASUREMENT OPERATIONS ====================

  createMeasurement(
    projectId: string,
    measurement: {
      featureId?: string;
      type: 'distance' | 'area';
      value: number;
      unit: string;
      geometry: any;
      label?: string;
    }
  ): DBMeasurement {
    const now = Date.now();
    const id = uuidv4();

    const stmt = this.db.prepare(`
      INSERT INTO measurements (id, project_id, feature_id, type, value, unit, geometry, label, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      projectId,
      measurement.featureId || null,
      measurement.type,
      measurement.value,
      measurement.unit,
      JSON.stringify(measurement.geometry),
      measurement.label || null,
      now
    );

    return this.getMeasurement(id)!;
  }

  getMeasurement(id: string): DBMeasurement | null {
    const stmt = this.db.prepare('SELECT * FROM measurements WHERE id = ?');
    const row = stmt.get(id) as DBMeasurement | undefined;
    return row || null;
  }

  listMeasurements(projectId: string): DBMeasurement[] {
    const stmt = this.db.prepare('SELECT * FROM measurements WHERE project_id = ? ORDER BY created_at DESC');
    return stmt.all(projectId) as DBMeasurement[];
  }

  deleteMeasurement(id: string): void {
    const stmt = this.db.prepare('DELETE FROM measurements WHERE id = ?');
    stmt.run(id);
  }

  // ==================== GEOJSON OPERATIONS ====================

  exportProjectAsGeoJSON(projectId: string): string {
    const features = this.listFeatures(projectId);
    const featureCollection = {
      type: 'FeatureCollection',
      features: features.map((feature) => ({
        type: 'Feature',
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

  async exportProjectToFile(projectId: string, filePath: string): Promise<void> {
    const geojson = this.exportProjectAsGeoJSON(projectId);
    await fs.writeFile(filePath, geojson, 'utf-8');
  }

  async importGeoJSONToProject(projectId: string, geojsonPath: string): Promise<DBFeature[]> {
    const content = await fs.readFile(geojsonPath, 'utf-8');
    const geojson = JSON.parse(content);

    if (geojson.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: must be a FeatureCollection');
    }

    const importedFeatures: DBFeature[] = [];

    for (const feature of geojson.features) {
      const newFeature = this.createFeature(projectId, {
        type: feature.properties?.type || this.inferFeatureType(feature.geometry),
        name: feature.properties?.name || 'Imported Feature',
        description: feature.properties?.description || null,
        geometry: feature.geometry,
        properties: feature.properties || {},
        style: feature.properties?.style || null,
      });

      importedFeatures.push(newFeature);
    }

    return importedFeatures;
  }

  importGeoJSONData(projectId: string, geojson: any): DBFeature[] {
    if (geojson.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: must be a FeatureCollection');
    }

    const importedFeatures: DBFeature[] = [];

    for (const feature of geojson.features) {
      const newFeature = this.createFeature(projectId, {
        type: feature.properties?.type || this.inferFeatureType(feature.geometry),
        name: feature.properties?.name || 'Imported Feature',
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
      case 'Point':
        return 'Marker';
      case 'LineString':
        return 'Polyline';
      case 'Polygon':
        return 'Polygon';
      default:
        return 'Feature';
    }
  }
}
