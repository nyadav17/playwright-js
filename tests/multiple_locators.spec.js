const { expect, test } = require("@playwright/test");

test("multiple locators", async ({ page }) => {
  await page.goto("https://www.demoblaze.com/");
  await page.waitForSelector("//div[@id='tbodyid']//h4//a");
  const products = await page.$$("//div[@id='tbodyid']//h4//a");
  for (const product of products) {
    const productName = await product.textContent();
    console.log(productName);
  }

  await page.close();
});
