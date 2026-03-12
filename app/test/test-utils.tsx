import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MapContext } from "@/app/components/Map/MapProvider";
import type { MapContextValue, MapViewMode } from "@/app/components/Map/MapProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSiteStore } from "@/app/stores/siteStore";
import { useLayerStore } from "@/app/stores/layerStore";
import { useFeatureStore } from "@/app/stores/featureStore";
import { useMapStore } from "@/app/stores/mapStore";

const defaultViewport = {
  center: null as { lat: number; lng: number } | null,
  zoom: 13,
  bounds: null as { north: number; south: number; east: number; west: number } | null,
};

export function createMockMapContextValue(overrides?: Partial<MapContextValue>): MapContextValue {
  return {
    map: null,
    setMap: () => {},
    draw: null,
    setDraw: () => {},
    mapStyle: "mapbox://styles/mapbox/light-v11",
    setMapStyle: () => {},
    mode: { type: "viewing" } as MapViewMode,
    setMode: () => {},
    viewport: defaultViewport,
    ...overrides,
  };
}

export function MockMapProvider({
  value,
  children,
}: {
  value?: Partial<MapContextValue>;
  children: React.ReactNode;
}) {
  const contextValue = createMockMapContextValue(value);
  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
}

export function resetStores(): void {
  useSiteStore.setState({
    sites: [],
    selectedSiteId: null,
    loading: false,
    initialized: false,
    error: null,
  });
  useLayerStore.setState({
    layers: [],
    selectedLayerId: null,
    loading: false,
    initialized: false,
    visibleLayerIds: new Set<string>(),
  });
  useFeatureStore.setState({
    features: [],
    selectedFeatureId: null,
    editingFeatureId: null,
  });
  useMapStore.setState({
    map: null,
    draw: null,
    drawMode: null,
    mapState: {
      center: null,
      zoom: 13,
      bounds: null,
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  mapContextOverrides?: Partial<MapContextValue>;
}

function createWrapper(options: CustomRenderOptions) {
  const { mapContextOverrides } = options;
  return function Wrapper({ children }: WrapperProps) {
    return (
      <SidebarProvider>
        <MockMapProvider value={mapContextOverrides}>
          {children}
        </MockMapProvider>
      </SidebarProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const Wrapper = createWrapper(options);
  return render(ui, {
    ...options,
    wrapper: Wrapper,
  });
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
