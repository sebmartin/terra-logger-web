/**
 * Service layer for site operations
 * Encapsulates all site-related business logic and API calls
 */

import type { Site, NewSite, SiteUpdate } from "../types/site";
import { parseSite, parseSites } from "../utils/geojson";

export class SiteService {
  /**
   * List all sites
   */
  async list(): Promise<Site[]> {
    const rawSites = await window.electron.listSites();
    return parseSites(rawSites);
  }

  /**
   * Get a single site by ID
   */
  async get(siteId: string): Promise<Site | null> {
    try {
      const raw = await window.electron.getSite(siteId);
      if (!raw) return null;
      return parseSite(raw);
    } catch (error) {
      console.error("Failed to get site:", error);
      return null;
    }
  }

  /**
   * Create a new site
   */
  async create(siteData: NewSite): Promise<Site> {
    const created = await window.electron.createSite(siteData);
    return parseSite(created);
  }

  /**
   * Update an existing site
   */
  async update(siteId: string, updates: SiteUpdate): Promise<Site> {
    const updated = await window.electron.updateSite(siteId, updates);
    return parseSite(updated);
  }

  /**
   * Delete a site
   */
  async delete(siteId: string): Promise<void> {
    await window.electron.deleteSite(siteId);
  }
}

// Export singleton instance
export const siteService = new SiteService();
