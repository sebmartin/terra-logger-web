/**
 * Site Context Provider
 * Manages site state and operations
 * Handles persistence via SiteService and LayerService
 */

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import type { Site, NewSite, SiteUpdate } from "../types/site";
import type { Layer } from "../types/layer";
import { siteService } from "../services/SiteService";
import { layerService } from "../services/LayerService";

interface SiteContextType {
  // State
  currentSite: Site | null;
  sites: Site[];
  siteLayers: Layer[];
  loading: boolean;
  error: Error | null;

  // Operations
  setCurrentSite: (site: Site | null) => void;
  loadSites: () => Promise<void>;
  loadSiteLayers: (siteId: string) => Promise<void>;
  createSite: (siteData: NewSite) => Promise<Site>;
  updateSite: (id: string, updates: SiteUpdate) => Promise<Site>;
  deleteSite: (id: string) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteLayers, setSiteLayers] = useState<Layer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load all sites
  const loadSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedSites = await siteService.list();
      setSites(loadedSites);
    } catch (err) {
      console.error("Failed to load sites:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load layers for a specific site
  const loadSiteLayers = useCallback(async (siteId: string) => {
    try {
      const layers = await layerService.listForSite(siteId);
      setSiteLayers(layers);
    } catch (err) {
      console.error("Failed to load site layers:", err);
    }
  }, []);

  // Create a new site
  const createSite = useCallback(async (siteData: NewSite) => {
    try {
      const created = await siteService.create(siteData);
      setSites((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Failed to create site:", err);
      throw err;
    }
  }, []);

  // Update a site
  const updateSite = useCallback(async (id: string, updates: SiteUpdate) => {
    try {
      const updated = await siteService.update(id, updates);
      setSites((prev) =>
        prev.map((site) => (site.id === id ? updated : site)),
      );
      if (currentSite?.id === id) {
        setCurrentSite(updated);
      }
      return updated;
    } catch (err) {
      console.error("Failed to update site:", err);
      throw err;
    }
  }, [currentSite]);

  // Delete a site
  const deleteSite = useCallback(async (id: string) => {
    try {
      await siteService.delete(id);
      setSites((prev) => prev.filter((site) => site.id !== id));
      if (currentSite?.id === id) {
        setCurrentSite(null);
      }
    } catch (err) {
      console.error("Failed to delete site:", err);
      throw err;
    }
  }, [currentSite]);

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, [loadSites]);

  // Load layers when current site changes
  useEffect(() => {
    if (currentSite) {
      loadSiteLayers(currentSite.id);
    } else {
      setSiteLayers([]);
    }
  }, [currentSite, loadSiteLayers]);

  const value: SiteContextType = useMemo(
    () => ({
      currentSite,
      sites,
      siteLayers,
      loading,
      error,
      setCurrentSite,
      loadSites,
      loadSiteLayers,
      createSite,
      updateSite,
      deleteSite,
    }),
    [
      currentSite,
      sites,
      siteLayers,
      loading,
      error,
      loadSites,
      loadSiteLayers,
      createSite,
      updateSite,
      deleteSite,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return context;
}
