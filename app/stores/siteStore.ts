import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Site, NewSite, SiteUpdate } from "../types/site";
import { siteService } from "../services/SiteService";

interface SiteStore {
  // State
  sites: Site[];
  selectedSiteId: string | null;
  loading: boolean;
  initialized: boolean;
  error: Error | null;

  // Computed getters
  selectedSite: () => Site | null;

  // Actions
  setSelectedSiteId: (id: string | null) => void;
  loadSites: () => Promise<void>;
  createSite: (siteData: NewSite) => Promise<Site>;
  updateSite: (id: string, updates: SiteUpdate) => Promise<Site>;
  deleteSite: (id: string) => Promise<void>;
}

export const useSiteStore = create<SiteStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial State
      sites: [],
      selectedSiteId: null,
      loading: false,
      initialized: false,
      error: null,

      // Computed getter
      selectedSite: () => {
        const { sites, selectedSiteId } = get();
        return sites.find((s) => s.id === selectedSiteId) ?? null;
      },

      // Actions
      setSelectedSiteId: (id) =>
        set((state) => {
          state.selectedSiteId = id;
        }),

      loadSites: async () => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const loadedSites = await siteService.list();
          set((state) => {
            state.sites = loadedSites;
            state.loading = false;
            state.initialized = true;
          });
        } catch (err) {
          console.error("Failed to load sites:", err);
          set((state) => {
            state.error = err as Error;
            state.loading = false;
            state.initialized = true;
          });
        }
      },

      createSite: async (siteData) => {
        try {
          const created = await siteService.create(siteData);
          set((state) => {
            state.sites.unshift(created);
          });
          return created;
        } catch (err) {
          console.error("Failed to create site:", err);
          throw err;
        }
      },

      updateSite: async (id, updates) => {
        try {
          const updated = await siteService.update(id, updates);
          set((state) => {
            const index = state.sites.findIndex((s) => s.id === id);
            if (index !== -1) {
              state.sites[index] = updated;
            }
          });
          return updated;
        } catch (err) {
          console.error("Failed to update site:", err);
          throw err;
        }
      },

      deleteSite: async (id) => {
        try {
          await siteService.delete(id);
          set((state) => {
            state.sites = state.sites.filter((s) => s.id !== id);
            if (state.selectedSiteId === id) {
              state.selectedSiteId = null;
            }
          });
        } catch (err) {
          console.error("Failed to delete site:", err);
          throw err;
        }
      },
    }))
  )
);

// Auto-load sites on store creation (only in browser)
if (typeof window !== 'undefined') {
  useSiteStore.getState().loadSites();
}
