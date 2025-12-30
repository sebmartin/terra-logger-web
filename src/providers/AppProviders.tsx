/**
 * Composite Provider Component
 * Consolidates all application providers in the correct hierarchy
 * Makes App.tsx cleaner and provides a single point of provider configuration
 */

import { ReactNode } from "react";
import { MapProvider } from "../context/MapContext";
import { SiteProvider } from "../context/SiteContext";
import { LayerProvider } from "../context/LayerContext";
import { FeatureProvider } from "../context/FeatureContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MapProvider>
      <SiteProvider>
        <LayerProvider>
          <FeatureProvider>
            {children}
          </FeatureProvider>
        </LayerProvider>
      </SiteProvider>
    </MapProvider>
  );
}
