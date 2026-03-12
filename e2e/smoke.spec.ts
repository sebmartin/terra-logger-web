import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("app loads and shows sidebar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Terra Logger")).toBeVisible();
    await expect(page.getByTestId("app-sidebar")).toBeVisible();
  });
});
