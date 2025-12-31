/**
 * Site Context Provider
 * Manages site state and operations
 * Handles persistence via SiteService
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
import { siteService } from "../services/SiteService";

interface SiteContextType {
  // State
  selectedSite: Site | null;
  sites: Site[];
  loading: boolean;
  error: Error | null;

  // Operations
  setSelectedSite: (site: Site | null) => void;
  loadSites: () => Promise<void>;
  createSite: (siteData: NewSite) => Promise<Site>;
  updateSite: (id: string, updates: SiteUpdate) => Promise<Site>;
  deleteSite: (id: string) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
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
      if (selectedSite?.id === id) {
        setSelectedSite(updated);
      }
      return updated;
    } catch (err) {
      console.error("Failed to update site:", err);
      throw err;
    }
  }, [selectedSite]);

  // Delete a site
  const deleteSite = useCallback(async (id: string) => {
    try {
      await siteService.delete(id);
      setSites((prev) => prev.filter((site) => site.id !== id));
      if (selectedSite?.id === id) {
        setSelectedSite(null);
      }
    } catch (err) {
      console.error("Failed to delete site:", err);
      throw err;
    }
  }, [selectedSite]);

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const value: SiteContextType = useMemo(
    () => ({
      selectedSite,
      sites,
      loading,
      error,
      setSelectedSite,
      loadSites,
      createSite,
      updateSite,
      deleteSite,
    }),
    [
      selectedSite,
      sites,
      loading,
      error,
      loadSites,
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
