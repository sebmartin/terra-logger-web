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
    const response = await fetch("/api/sites");
    if (!response.ok) throw new Error("Failed to fetch sites");
    const rawSites = await response.json();
    return parseSites(rawSites);
  }

  /**
   * Get a single site by ID
   */
  async get(siteId: string): Promise<Site | null> {
    try {
      const response = await fetch(`/api/sites/${siteId}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch site");
      const raw = await response.json();
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
    const response = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteData),
    });
    if (!response.ok) throw new Error("Failed to create site");
    const created = await response.json();
    return parseSite(created);
  }

  /**
   * Update an existing site
   */
  async update(siteId: string, updates: SiteUpdate): Promise<Site> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update site");
    const updated = await response.json();
    return parseSite(updated);
  }

  /**
   * Delete a site
   */
  async delete(siteId: string): Promise<void> {
    const response = await fetch(`/api/sites/${siteId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete site");
  }
}

// Export singleton instance
export const siteService = new SiteService();
