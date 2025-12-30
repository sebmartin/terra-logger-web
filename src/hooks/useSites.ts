/**
 * Hook for site operations
 * Uses SiteService and LayerService for all API interactions
 */

import { useState, useEffect, useCallback } from "react";
import { useSiteContext } from "../context/SiteContext";
import { siteService } from "../services/SiteService";
import { layerService } from "../services/LayerService";
import type { NewSite, SiteUpdate } from "../types/site";

export function useSites() {
  const {
    sites,
    setSites,
    currentSite,
    setCurrentSite,
    siteLayers,
    setSiteLayers,
  } = useSiteContext();
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
  }, [setSites]);

  // Load layers for current site
  const loadSiteLayers = useCallback(
    async (siteId: string) => {
      try {
        const layers = await layerService.listForSite(siteId);
        setSiteLayers(layers);
      } catch (err) {
        console.error("Failed to load site layers:", err);
      }
    },
    [setSiteLayers],
  );

  // Create a new site
  const createSite = useCallback(
    async (siteData: NewSite) => {
      try {
        const created = await siteService.create(siteData);
        setSites((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.error("Failed to create site:", err);
        throw err;
      }
    },
    [setSites],
  );

  // Update a site
  const updateSite = useCallback(
    async (id: string, updates: SiteUpdate) => {
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
    },
    [setSites, currentSite, setCurrentSite],
  );

  // Delete a site
  const deleteSite = useCallback(
    async (id: string) => {
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
    },
    [setSites, currentSite, setCurrentSite],
  );

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
  }, [currentSite, loadSiteLayers, setSiteLayers]);

  return {
    sites,
    currentSite,
    setCurrentSite,
    siteLayers,
    loading,
    error,
    createSite,
    updateSite,
    deleteSite,
    refreshSites: loadSites,
    refreshSiteLayers: loadSiteLayers,
  };
}

  return {
    sites,
    currentSite,
    setCurrentSite,
    siteLayers,
    loading,
    error,
    createSite,
    updateSite,
    deleteSite,
    refreshSites: loadSites,
    refreshSiteLayers: loadSiteLayers,
  };
}
