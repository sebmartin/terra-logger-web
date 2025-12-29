import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import type { Site } from '../types/site';
import type { Project } from '../types/project';

interface SiteContextType {
  currentSite: Site | null;
  setCurrentSite: (site: Site | null) => void;
  sites: Site[];
  setSites: (sites: Site[]) => void;
  siteProjects: Project[];
  setSiteProjects: (projects: Project[]) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteProjects, setSiteProjects] = useState<Project[]>([]);

  const value: SiteContextType = useMemo(() => ({
    currentSite,
    setCurrentSite,
    sites,
    setSites,
    siteProjects,
    setSiteProjects,
  }), [currentSite, sites, siteProjects]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
}
