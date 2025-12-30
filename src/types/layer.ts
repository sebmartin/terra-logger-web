export interface Layer {
  id: string;
  site_id: string;
  name: string;
  description: string | null;
  visible: boolean;
  color: string | null;
  created_at: number;
  updated_at: number;
}

export interface NewLayer {
  site_id: string;
  name: string;
  description?: string;
  visible?: boolean;
  color?: string;
}

export type LayerUpdate = Partial<Omit<NewLayer, "site_id">>;
