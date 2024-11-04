const { expect, test } = require("@playwright/test");

test("locators", async ({ page }) => {
  await page.goto("https://www.demoblaze.com/");
  //property
  await page.click("id=login2");
  //css
  await page.fill("#loginusername", "admin");
  await page.fill("#loginpassword", "admin");

  //property
  await page.click("button[onclick='logIn()']");

  //xpath
  await expect(page.locator("//a[@id='logout2']")).toBeEnabled();
  await page.locator("#logout2").click();
  await page.locator("id=login2").isEnabled();
  await page.close();
});
