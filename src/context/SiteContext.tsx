import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import type { Site } from "../types/site";
import type { Layer } from "../types/layer";

interface SiteContextType {
  currentSite: Site | null;
  setCurrentSite: Dispatch<SetStateAction<Site | null>>;
  sites: Site[];
  setSites: Dispatch<SetStateAction<Site[]>>;
  siteLayers: Layer[];
  setSiteLayers: Dispatch<SetStateAction<Layer[]>>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [siteLayers, setSiteLayers] = useState<Layer[]>([]);

  const value: SiteContextType = useMemo(
    () => ({
      currentSite,
      setCurrentSite,
      sites,
      setSites,
      siteLayers,
      setSiteLayers,
    }),
    [currentSite, sites, siteLayers],
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
