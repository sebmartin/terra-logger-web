import { test, expect } from "@playwright/test";

test.describe("sidebar flow", () => {
  test("Sites section is visible and add site button can be clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Sites", { exact: true })).toBeVisible();
    await page.getByTestId("sidebar-add-site").click();
    await expect(page.getByTestId("bounds-selector")).toBeVisible();
  });
});
