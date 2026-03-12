import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@/app/test/test-utils";
import NewSiteDialog from "./NewSiteDialog";

describe("NewSiteDialog", () => {
  it("renders title and input", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    renderWithProviders(
      <NewSiteDialog onSave={onSave} onCancel={onCancel} />
    );
    expect(screen.getByText("Name Your Site")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Site name")).toBeInTheDocument();
  });

  it("disables Save when input is empty", () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    renderWithProviders(
      <NewSiteDialog onSave={onSave} onCancel={onCancel} />
    );
    expect(screen.getByRole("button", { name: /save site/i })).toBeDisabled();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();
    renderWithProviders(
      <NewSiteDialog onSave={onSave} onCancel={onCancel} />
    );
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("enables Save when input has text and calls onSave on submit", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();
    renderWithProviders(
      <NewSiteDialog onSave={onSave} onCancel={onCancel} />
    );
    await userEvent.type(screen.getByPlaceholderText("Site name"), "My Site");
    expect(screen.getByRole("button", { name: /save site/i })).not.toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /save site/i }));
    expect(onSave).toHaveBeenCalledWith("My Site");
  });
});
