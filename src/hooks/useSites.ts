import { useState, useEffect, useCallback } from 'react';
import { useSiteContext } from '../context/SiteContext';
import type { NewSite, SiteUpdate } from '../types/site';

export function useSites() {
  const { sites, setSites, currentSite, setCurrentSite, siteProjects, setSiteProjects } = useSiteContext();
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
        bounds: typeof site.bounds === 'string' ? JSON.parse(site.bounds) : site.bounds,
      }));
      setSites(parsed);
    } catch (err) {
      console.error('Failed to load sites:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [setSites]);

  // Load projects for current site
  const loadSiteProjects = useCallback(async (siteId: string) => {
    try {
      const projects = await window.electron.listSiteProjects(siteId);
      // Parse JSON fields
      const parsed = projects.map((project: any) => ({
        ...project,
        bounds: project.bounds ? (typeof project.bounds === 'string' ? JSON.parse(project.bounds) : project.bounds) : null,
        center: project.center ? (typeof project.center === 'string' ? JSON.parse(project.center) : project.center) : null,
        settings: project.settings ? (typeof project.settings === 'string' ? JSON.parse(project.settings) : project.settings) : null,
      }));
      setSiteProjects(parsed);
    } catch (err) {
      console.error('Failed to load site projects:', err);
    }
  }, [setSiteProjects]);

  // Create a new site
  const createSite = useCallback(async (siteData: NewSite) => {
    try {
      const created = await window.electron.createSite(siteData);
      const parsed = {
        ...created,
        bounds: typeof created.bounds === 'string' ? JSON.parse(created.bounds) : created.bounds,
      };
      setSites((prev) => [parsed, ...prev]);
      return parsed;
    } catch (err) {
      console.error('Failed to create site:', err);
      throw err;
    }
  }, [setSites]);

  // Update a site
  const updateSite = useCallback(async (id: string, updates: SiteUpdate) => {
    try {
      const updated = await window.electron.updateSite(id, updates);
      const parsed = {
        ...updated,
        bounds: typeof updated.bounds === 'string' ? JSON.parse(updated.bounds) : updated.bounds,
      };
      setSites((prev) => prev.map((site) => (site.id === id ? parsed : site)));
      if (currentSite?.id === id) {
        setCurrentSite(parsed);
      }
      return parsed;
    } catch (err) {
      console.error('Failed to update site:', err);
      throw err;
    }
  }, [setSites, currentSite, setCurrentSite]);

  // Delete a site
  const deleteSite = useCallback(async (id: string) => {
    try {
      await window.electron.deleteSite(id);
      setSites((prev) => prev.filter((site) => site.id !== id));
      if (currentSite?.id === id) {
        setCurrentSite(null);
      }
    } catch (err) {
      console.error('Failed to delete site:', err);
      throw err;
    }
  }, [setSites, currentSite, setCurrentSite]);

  // Load sites on mount
  useEffect(() => {
    loadSites();
  }, [loadSites]);

  // Load projects when current site changes
  useEffect(() => {
    if (currentSite) {
      loadSiteProjects(currentSite.id);
    } else {
      setSiteProjects([]);
    }
  }, [currentSite, loadSiteProjects, setSiteProjects]);

  return {
    sites,
    currentSite,
    setCurrentSite,
    siteProjects,
    loading,
    error,
    createSite,
    updateSite,
    deleteSite,
    refreshSites: loadSites,
  };
}
