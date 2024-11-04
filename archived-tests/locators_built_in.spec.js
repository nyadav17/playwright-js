const { expect, test } = require("@playwright/test");

test("home page", async ({ page }) => {
  await page.goto("https://www.demoblaze.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForLoadState("load");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");

  const logo = await page.getByAltText("Second slide");
  await expect(logo).toBeVisible();
  await page.getByRole("link", { name: "Log in" }).click();
  await page.locator("#loginusername").fill("admin");
  await page.locator("#loginpassword").fill("admin");
  await page.getByRole("button", { name: "Log in" }).click();
});
