// @ts-check

import { test, expect } from "@playwright/test";
const { SauceDemoHomePage } = require("../../pages/sauce-demo/home.js");
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

const records = parse(
  fs.readFileSync(
    path.join(__dirname, "../../data", "sauce-demo", "users.csv")
  ),
  {
    columns: true,
    skip_empty_lines: true,
    delimiter: ",",
  }
);

test.beforeEach("before each", async ({ page }) => {
  const sauceDemoHome = new SauceDemoHomePage(page);
  sauceDemoHome.navigate();
});

for (const record of records) {
  test.describe("@All @SauceDemoFull", () => {
    test(`Add All product | testing with ${record.userName}`, async ({
      page,
    }) => {
      const productMapIO = new Map();
      const productMapCO = new Map();
      await page.locator("#user-name").fill(record.userName);
      await page.locator("#password").fill(record.userPassword);

      await page.locator("#login-button").click();
      const sessionData = await page.context().storageState();
      expect(
        sessionData.cookies.at(0)?.value,
        "cookie has data for user: " + record.userName
      ).toEqual(record.userName);

      //apply filter
      const filter = page.locator("css=.product_sort_container");
      filter.selectText("Name (Z to A)");

      // add product/products
      const liItemsIO = page.locator("//div[@data-test='inventory-item']");
      const liItemCounterIO = await liItemsIO.count();
      if (liItemCounterIO) {
        for (let i = 0; i < liItemCounterIO; i++) {
          const productName = await liItemsIO
            .nth(i)
            .locator(
              "//descendant-or-self::div[@data-test='inventory-item-name']"
            )
            .textContent();

          const price = (
            await liItemsIO
              .nth(i)
              .locator(
                "//descendant-or-self::div[@data-test='inventory-item-price']"
              )
              .textContent()
          )?.replace("$", "");

          await liItemsIO
            .nth(i)
            .locator("//descendant-or-self::button[text()='Add to cart']")
            .click();
          productMapIO.set(productName, price);
        }
      }
      let sum = 0;
      productMapIO.forEach((v) => {
        sum += Number(v);
      });
      await page.locator(".shopping_cart_link").click();

      // verify added/removed products at checkout
      const liItems = page.locator("//div[@data-test='inventory-item']");
      const liItemCounter = await liItems.count();
      if (liItemCounter) {
        for (let i = 0; i < liItemCounter; i++) {
          const productName = await liItems
            .nth(i)
            .locator(
              "//descendant-or-self::div[@data-test='inventory-item-name']"
            )
            .textContent();
          const price = (
            await liItems
              .nth(i)
              .locator(
                "//descendant-or-self::div[@data-test='inventory-item-price']"
              )
              .textContent()
          )?.replace("$", "");
          productMapCO.set(productName, price);
        }
      }
      expect(productMapCO, "mismatch at checkout").toStrictEqual(productMapIO);

      await page.locator("#checkout").click();
      await page.locator("#first-name").fill("Nitesh");
      await page.locator("#last-name").fill("Yadav");
      await page.locator("#postal-code").fill("122001");
      await page.locator("#continue").click();
      let checkOutTotPrice = await page
        .locator("//div[contains(text(),'Item total')]")
        .textContent();

      if (checkOutTotPrice != null) {
        checkOutTotPrice = checkOutTotPrice.replace("Item total: $", "");
        expect(Number(checkOutTotPrice), "total price does not match").toEqual(
          sum
        );
      }

      await page.locator("#finish").click();
      await page.getByText("Open Menu").click();
      await page.locator("#reset_sidebar_link").click();
      await page.locator("#logout_sidebar_link").click();
    });
  });
}
