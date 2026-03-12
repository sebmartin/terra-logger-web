import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/app/test/test-utils";
import LayerItem from "./LayerItem";
import type { Layer } from "@/app/types/layer";

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

describe("LayerItem", () => {
  it("renders layer name and calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const onToggleVisibility = vi.fn();
    const onDelete = vi.fn();
    renderWithProviders(
      <LayerItem
        layer={mockLayer}
        isSelected={false}
        onSelect={onSelect}
        onToggleVisibility={onToggleVisibility}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Test Layer")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Test Layer"));
    expect(onSelect).toHaveBeenCalledWith("layer-1");
  });
});
