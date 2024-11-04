const { expect, test } = require("@playwright/test");
const browserUtil = require("../utils/browserUtil.js");

test("home page", async ({ page }) => {
  await page.goto("https://www.demoblaze.com/");
  //browserUtil.launchBrowser("https://www.demoblaze.com");
  await expect(page).toHaveTitle("STORE");
  await expect(page).toHaveURL("https://www.demoblaze.com/");
  page.close();
});
