import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/app/test/test-utils";
import FeatureList from "./FeatureList";
import { useSiteStore } from "@/app/stores/siteStore";
import { useLayerStore } from "@/app/stores/layerStore";
import { useFeatureStore } from "@/app/stores/featureStore";
import type { Site } from "@/app/types/site";
import type { Layer } from "@/app/types/layer";
import type { Feature } from "@/app/types/feature";

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

const mockFeature: Feature = {
  id: "feature-1",
  site_id: "site-1",
  layer_id: "layer-1",
  type: "Polygon",
  name: "Test Feature",
  description: null,
  geometry: { type: "Polygon", coordinates: [[]] },
  properties: null,
  style: null,
  locked: false,
  created_at: 1,
  updated_at: 1,
};

describe("FeatureList", () => {
  it("does not render list content when no site selected", () => {
    useSiteStore.setState({ selectedSiteId: null });
    renderWithProviders(<FeatureList />);
    expect(screen.queryByText("No layer selected")).not.toBeInTheDocument();
  });

  it("shows no layer selected message when site selected but no layer", () => {
    useSiteStore.setState({
      sites: [mockSite],
      selectedSiteId: mockSite.id,
    });
    useLayerStore.setState({ selectedLayerId: null });
    renderWithProviders(<FeatureList />);
    expect(screen.getByText("No layer selected")).toBeInTheDocument();
    expect(screen.getByText("Select a layer to see its features")).toBeInTheDocument();
  });

  it("shows no features yet when layer selected but no features", () => {
    useSiteStore.setState({
      sites: [mockSite],
      selectedSiteId: mockSite.id,
    });
    useLayerStore.setState({ selectedLayerId: mockLayer.id });
    useFeatureStore.setState({ features: [] });
    renderWithProviders(<FeatureList />);
    expect(screen.getByText("No features yet")).toBeInTheDocument();
  });

  it("renders feature names when layer has features", () => {
    useSiteStore.setState({
      sites: [mockSite],
      selectedSiteId: mockSite.id,
    });
    useLayerStore.setState({ selectedLayerId: mockLayer.id });
    useFeatureStore.setState({ features: [mockFeature] });
    renderWithProviders(<FeatureList />);
    expect(screen.getByText("Test Feature")).toBeInTheDocument();
  });
});
