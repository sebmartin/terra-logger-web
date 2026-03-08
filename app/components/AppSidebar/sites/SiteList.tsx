"use client";

import { useSiteStore } from "@/app/stores/siteStore";
import { Map } from "lucide-react";
import { Button } from "@/components/ui";
import SiteItem from "./SiteItem";

interface SiteListProps {
  onAddSite: () => void;
}

export default function SiteList({ onAddSite }: SiteListProps) {
  const sites = useSiteStore((state) => state.sites);
  const selectedSite = useSiteStore((state) => state.selectedSite());
  const setSelectedSiteId = useSiteStore((state) => state.setSelectedSiteId);
  const loading = useSiteStore((state) => state.loading);
  const initialized = useSiteStore((state) => state.initialized);
  const deleteSite = useSiteStore((state) => state.deleteSite);

  const handleDeleteSite = async (id: string, _name: string) => {
    try {
      await deleteSite(id);
    } catch (error) {
      console.error("Failed to delete site:", error);
    }
  };

  return (
    <>
      {!initialized || loading ? (
        <div className="px-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading sites...</span>
          </div>
        </div>
      ) : sites.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <div className="mb-3 flex justify-center">
            <Map size={40} className="text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-slate-600 mb-3 font-medium">No sites yet</p>
          <Button onClick={onAddSite}>Create Your First Site</Button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {sites.map((site) => (
            <SiteItem
              key={site.id}
              site={site}
              isSelected={selectedSite?.id === site.id}
              onSelect={(site) => setSelectedSiteId(site.id)}
              onEditBounds={() => { }}
              onDelete={handleDeleteSite}
            />
          ))}
        </div>
      )}
    </>
  );
}
