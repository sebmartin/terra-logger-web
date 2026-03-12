import { test, expect } from "@playwright/test";

test.describe("empty states", () => {
  test("bounds selector Cancel returns to sidebar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Sites", { exact: true })).toBeVisible();
    await page.getByTestId("sidebar-add-site").click();
    await expect(page.getByTestId("bounds-selector")).toBeVisible();
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.getByTestId("app-sidebar")).toBeVisible();
  });
});