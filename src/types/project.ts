import type { LatLngBounds, LatLng } from 'leaflet';

export interface Project {
  id: string;
  site_id: string;  // Projects must belong to a site
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_at: number;
  updated_at: number;
  completed_at: number | null;
  bounds: ProjectBounds | null;
  center: ProjectCenter | null;
  zoom: number | null;
  settings: ProjectSettings | null;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';

export interface ProjectBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ProjectCenter {
  lat: number;
  lng: number;
}

export interface ProjectSettings {
  units?: 'metric' | 'imperial';
  theme?: 'light' | 'dark';
  [key: string]: any;
}

export interface NewProject {
  site_id: string;  // Required
  name: string;
  description?: string;
  status?: ProjectStatus;
  bounds?: ProjectBounds;
  center?: ProjectCenter;
  zoom?: number;
  settings?: ProjectSettings;
}

export type ProjectUpdate = Partial<Omit<NewProject, 'id' | 'created_at' | 'updated_at'>>;
