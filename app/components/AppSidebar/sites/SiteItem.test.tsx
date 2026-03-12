import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/app/test/test-utils";
import SiteItem from "./SiteItem";
import type { Site } from "@/app/types/site";

const mockSite: Site = {
  id: "site-1",
  name: "Test Site",
  description: null,
  bounds: { north: 1, south: 0, east: 1, west: 0 },
  created_at: 1,
  updated_at: 1,
};

describe("SiteItem", () => {
  it("renders site name and calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    const onEditBounds = vi.fn();
    const onDelete = vi.fn();
    renderWithProviders(
      <SiteItem
        site={mockSite}
        isSelected={false}
        onSelect={onSelect}
        onEditBounds={onEditBounds}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText("Test Site")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Test Site"));
    expect(onSelect).toHaveBeenCalledWith(mockSite);
  });
});
