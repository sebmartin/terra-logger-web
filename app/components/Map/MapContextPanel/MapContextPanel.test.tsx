import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/app/test/test-utils";
import { MapContextPanel } from "./index";
import { useLayerStore } from "@/app/stores/layerStore";

describe("MapContextPanel", () => {
  it("renders draw tools when a layer is selected and mode is viewing", () => {
    useLayerStore.setState({
      layers: [
        {
          id: "layer-1",
          site_id: "site-1",
          name: "Test Layer",
          description: null,
          visible: true,
          color: null,
          created_at: 1,
          updated_at: 1,
        },
      ],
      selectedLayerId: "layer-1",
      visibleLayerIds: new Set(["layer-1"]),
    });

    renderWithProviders(<MapContextPanel />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
