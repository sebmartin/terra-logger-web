import { describe, it, expect } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/app/test/test-utils";
import FeatureItem from "./FeatureItem";
import type { Feature } from "@/app/types/feature";
import { useFeatureStore } from "@/app/stores/featureStore";

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

describe("FeatureItem", () => {
  it("selects feature when clicked", async () => {
    useFeatureStore.setState({
      features: [mockFeature],
      selectedFeatureId: null,
    });

    const onToggleLock = () => {};
    renderWithProviders(
      <FeatureItem feature={mockFeature} onToggleLock={onToggleLock} />
    );

    expect(screen.getByText("Test Feature")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Test Feature"));

    expect(useFeatureStore.getState().selectedFeatureId).toBe("feature-1");
  });
});
