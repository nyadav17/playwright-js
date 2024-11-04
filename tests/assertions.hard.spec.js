const { expect, test } = require("@playwright/test");

test("assertions", async ({ page }) => {
  await page.goto("https://demo.nopcommerce.com/register");
  await expect(page).toHaveURL("https://demo.nopcommerce.com/register");
  await expect(page).toHaveTitle("nopCommerce demo store. Register");
  const logo = page.locator(".header-logo");
  await expect(logo).toBeVisible();
  const searchStoreBox = page.locator("#small-searchterms");
  await searchStoreBox.fill("google");
  await page.waitForTimeout(5000);
  await expect(searchStoreBox).toBeEnabled();
  const genderMale = page.locator("#gender-male");
  const genderFemale = page.locator("#gender-female");
  await genderMale.click();
  await expect(genderMale).toBeChecked();
  await expect(genderFemale).not.toBeChecked();

  const newsLetter = page.locator("#Newsletter");
  await newsLetter.check();
  await expect(newsLetter).toBeChecked();

  const register = page.locator("#register-button");
  await expect(register).toHaveAttribute("type", "submit");
  const registerTitle = page.locator(".page-title h1");
  await expect(registerTitle).toHaveText("Register");
  await expect(registerTitle).toContainText("Reg");
  await expect(searchStoreBox).toHaveValue("google");
  const dayDOBOptions = page.locator("select[name='DateOfBirthMonth'] option");
  await expect(dayDOBOptions).toHaveCount(13);
  await page.close();
});
