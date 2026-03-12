import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/app/test/test-utils";
import { DrawToolsContent } from "./DrawToolsContent";

describe("DrawToolsContent", () => {
  it("calls onSelectTool when a draw tool button is clicked", async () => {
    const onSelectTool = vi.fn();
    render(<DrawToolsContent onSelectTool={onSelectTool} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    await userEvent.click(buttons[0]);
    expect(onSelectTool).toHaveBeenCalled();
  });
});
