import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/app/test/test-utils";
import LayerList from "./LayerList";
import { useSiteStore } from "@/app/stores/siteStore";
import { useLayerStore } from "@/app/stores/layerStore";
import type { Site } from "@/app/types/site";
import type { Layer } from "@/app/types/layer";

const mockSite: Site = {
  id: "site-1",
  name: "Test Site",
  description: null,
  bounds: { north: 1, south: 0, east: 1, west: 0 },
  created_at: 1,
  updated_at: 1,
};

const mockLayer: Layer = {
  id: "layer-1",
  site_id: "site-1",
  name: "Test Layer",
  description: null,
  visible: true,
  color: null,
  created_at: 1,
  updated_at: 1,
};

describe("LayerList", () => {
  it("does not render list content when no site selected", () => {
    useSiteStore.setState({ selectedSiteId: null });
    renderWithProviders(
      <LayerList showDialog={false} setShowDialog={() => {}} />
    );
    expect(screen.queryByText("No layers yet")).not.toBeInTheDocument();
  });

  it("shows empty state when site has no layers", () => {
    useSiteStore.setState({
      sites: [mockSite],
      selectedSiteId: mockSite.id,
    });
    useLayerStore.setState({ layers: [], visibleLayerIds: new Set() });
    renderWithProviders(
      <LayerList showDialog={false} setShowDialog={() => {}} />
    );
    expect(screen.getByText("No layers yet")).toBeInTheDocument();
    expect(screen.getByText("Create a layer to organize your features")).toBeInTheDocument();
  });

  it("renders layer names when layers exist", () => {
    useSiteStore.setState({
      sites: [mockSite],
      selectedSiteId: mockSite.id,
    });
    useLayerStore.setState({
      layers: [mockLayer],
      visibleLayerIds: new Set([mockLayer.id]),
    });
    renderWithProviders(
      <LayerList showDialog={false} setShowDialog={() => {}} />
    );
    expect(screen.getByText("Test Layer")).toBeInTheDocument();
  });
});
