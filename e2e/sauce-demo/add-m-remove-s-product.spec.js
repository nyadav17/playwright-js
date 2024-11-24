// @ts-check

import { test, expect } from "@playwright/test";
import templateStringUtil from "../../utils/templateStringUtil.js";
import mapUtil from "../../utils/MapUtil.js";

import { SauceDemoHomePage } from "../../pages/sauce-demo/home.js";
import exp from "constants";

[
  {
    userName: "standard_user",
    userPassword: "secret_sauce",
    productNames: ["Sauce Labs Backpack", "Sauce Labs Bike Light"],
    removeProductNames: ["Sauce Labs Bike Light"],
  },
  {
    userName: "performance_glitch_user",
    userPassword: "secret_sauce",
    productNames: ["Sauce Labs Backpack", "Sauce Labs Bike Light"],
    removeProductNames: ["Sauce Labs Bike Light"],
  },
  {
    userName: "visual_user",
    userPassword: "secret_sauce",
    productNames: ["Sauce Labs Backpack", "Sauce Labs Bike Light"],
    removeProductNames: ["Sauce Labs Bike Light"],
  },
].forEach(({ userName, userPassword, productNames, removeProductNames }) => {
  test.describe("@All @SauceDemoFull", () => {
    test(`Add multiple remove single product | testing with ${userName}`, async ({
      page,
    }) => {
      const productMapIO = new Map();
      const productMapCO = new Map();

      // open base url
      await page.goto("https://www.saucedemo.com", {
        waitUntil: "domcontentloaded",
      });

      //login
      await page.locator("#user-name").fill(userName);
      await page.locator("#password").fill(userPassword);
      await page.locator("#login-button").click();

      // session check
      const sessionData = await page.context().storageState();
      expect(
        sessionData.cookies.at(0)?.value,
        "cookie has data for user: " + userName
      ).toEqual(userName);

      // add product/products
      for (const productName of productNames) {
        await page.locator("//div[text()='" + productName + "']").click();
        await page.locator("//button[text()='Add to cart']").click();
        const itemPrice = (
          await page
            .locator("//div[@class='inventory_details_price']")
            .textContent()
        )?.replace("$", "");
        await page.locator("//button[text()='Back to products']").click();
        productMapIO.set(productName, itemPrice);
      }

      await page.locator(".shopping_cart_link").click();

      if (removeProductNames.length != 0) {
        // remove product/products
        for (const removeProductName of removeProductNames) {
          await page
            .locator("//div[text()='" + removeProductName + "']")
            .click();
          await page.locator("//button[text()='Remove']").click();
          await page.locator("//button[text()='Back to products']").click();
          await expect(page.locator(".shopping_cart_link")).toBeAttached();
          await page.locator(".shopping_cart_link").click();
          productMapIO.delete(removeProductName);
        }
      }

      let sum = 0;
      productMapIO.forEach((v) => {
        sum += Number(v);
      });

      // verify added/removed products at checkout
      const liItems = await page.locator("//div[@data-test='inventory-item']");
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
});
