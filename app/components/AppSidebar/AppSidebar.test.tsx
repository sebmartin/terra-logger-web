import { describe, it, expect } from "vitest";
import { renderWithProviders, screen } from "@/app/test/test-utils";
import AppSidebar from "./AppSidebar";

describe("AppSidebar", () => {
  it("renders header with app name and Sites section", () => {
    renderWithProviders(<AppSidebar />);
    expect(screen.getByText("Terra Logger")).toBeInTheDocument();
    expect(screen.getByText("Sites")).toBeInTheDocument();
  });
});
