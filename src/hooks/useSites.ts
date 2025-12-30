import { useState, useEffect, useCallback } from "react";
import { useSiteContext } from "../context/SiteContext";
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
      const loadedSites = await window.electron.listSites();
      // Parse JSON fields
      const parsed = loadedSites.map((site: any) => ({
        ...site,
        bounds:
          typeof site.bounds === "string"
            ? JSON.parse(site.bounds)
            : site.bounds,
      }));
      setSites(parsed);
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
        const layers = await window.electron.listSiteLayers(siteId);
        // Parse visible field from SQLite integer to boolean
        const parsed = layers.map((layer: any) => ({
          ...layer,
          visible: Boolean(layer.visible),
        }));
        setSiteLayers(parsed);
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
        const created = await window.electron.createSite(siteData);
        const parsed = {
          ...created,
          bounds:
            typeof created.bounds === "string"
              ? JSON.parse(created.bounds)
              : created.bounds,
        };
        setSites((prev) => [parsed, ...prev]);
        return parsed;
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
        const updated = await window.electron.updateSite(id, updates);
        const parsed = {
          ...updated,
          bounds:
            typeof updated.bounds === "string"
              ? JSON.parse(updated.bounds)
              : updated.bounds,
        };
        setSites((prev) =>
          prev.map((site) => (site.id === id ? parsed : site)),
        );
        if (currentSite?.id === id) {
          setCurrentSite(parsed);
        }
        return parsed;
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
        await window.electron.deleteSite(id);
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
