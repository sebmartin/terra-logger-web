import { test, expect } from "@playwright/test";

test.describe("sidebar sections", () => {
  test("shows Sites, Layers, and Features section headers", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("app-sidebar")).toBeVisible();
    await expect(page.getByText("Sites", { exact: true })).toBeVisible();
    await expect(page.getByText("Layers", { exact: true })).toBeVisible();
    await expect(page.getByText("Features", { exact: true })).toBeVisible();
  });
});