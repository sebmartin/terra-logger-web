export interface SiteBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Site {
  id: string;
  name: string;
  description: string | null;
  bounds: SiteBounds;
  created_at: number;
  updated_at: number;
}

export interface NewSite {
  name: string;
  description?: string;
  bounds: SiteBounds;
}

export type SiteUpdate = Partial<
  Omit<Site, "id" | "created_at" | "updated_at">
>;
