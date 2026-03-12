import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/app/test/test-utils";
import SiteList from "./SiteList";
import { useSiteStore } from "@/app/stores/siteStore";
import type { Site } from "@/app/types/site";

const mockSite: Site = {
  id: "site-1",
  name: "Test Site",
  description: null,
  bounds: { north: 1, south: 0, east: 1, west: 0 },
  created_at: 1,
  updated_at: 1,
};

describe("SiteList", () => {
  it("shows empty state when no sites", () => {
    useSiteStore.setState({ initialized: true, loading: false, sites: [] });
    renderWithProviders(<SiteList onAddSite={() => {}} />);
    expect(screen.getByText("No sites yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create your first site/i })).toBeInTheDocument();
  });

  it("shows loading state when loading", () => {
    useSiteStore.setState({ loading: true, initialized: false });
    renderWithProviders(<SiteList onAddSite={() => {}} />);
    expect(screen.getByText("Loading sites...")).toBeInTheDocument();
  });

  it("renders site names when sites exist", () => {
    useSiteStore.setState({
      sites: [mockSite],
      selectedSiteId: null,
      loading: false,
      initialized: true,
    });
    renderWithProviders(<SiteList onAddSite={() => {}} />);
    expect(screen.getByText("Test Site")).toBeInTheDocument();
  });
});
