const { expect, test } = require("@playwright/test");

test("assertions", async ({ page }) => {
  await page.goto("https://www.demoblaze.com/");
  await expect.soft(page).toHaveTitle("STORE");
  await expect.soft(page).toHaveURL("https://www.demoblaze.com");
  await expect.soft(page.locator(".navbar-brand")).toBeVisible();
  page.close();
});
