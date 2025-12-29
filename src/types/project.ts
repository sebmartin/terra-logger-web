import type { LatLngBounds, LatLng } from 'leaflet';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: number;
  updated_at: number;
  bounds: ProjectBounds | null;
  center: ProjectCenter | null;
  zoom: number | null;
  settings: ProjectSettings | null;
}

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
  name: string;
  description?: string;
  bounds?: ProjectBounds;
  center?: ProjectCenter;
  zoom?: number;
  settings?: ProjectSettings;
}

export type ProjectUpdate = Partial<Omit<NewProject, 'id' | 'created_at' | 'updated_at'>>;
