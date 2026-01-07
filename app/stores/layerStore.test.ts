import { describe, it, expect, beforeEach } from "vitest";
import { useLayerStore } from "./layerStore";

describe("useLayerStore", () => {
  beforeEach(() => {
    // reset store state before each test
    useLayerStore.setState({ layers: [], selectedLayerId: null } as any);
  });

  it("computes visibleLayerIds correctly", () => {
    useLayerStore.setState({
      layers: [
        { id: "1", name: "A", visible: true } as any,
        { id: "2", name: "B", visible: false } as any,
        { id: "3", name: "C", visible: true } as any,
      ],
    } as any);

    const set = useLayerStore.getState();
    const visible = set.visibleLayerIds();
    expect(visible.has("1")).toBe(true);
    expect(visible.has("2")).toBe(false);
    expect(visible.has("3")).toBe(true);
  });

  it("updates selectedLayerId via setSelectedLayerId", () => {
    const store = useLayerStore.getState();
    store.setSelectedLayerId("layer-123");
    expect(useLayerStore.getState().selectedLayerId).toBe("layer-123");
  });
});
