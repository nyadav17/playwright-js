// @ts-check

import { test, expect } from "@playwright/test";
import { webkit } from "playwright";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";
import process from "process";
import { users } from "../../data/sauce-demo/users.json";
import { LoginPage } from "../../pages/sauce-demo/LoginPage.js";
import { ProductPage } from "../../pages/sauce-demo/ProductPage.js";
import { CartPage } from "../../pages/sauce-demo/CartPage.js";
import { CheckoutOverviewPage } from "../../pages/sauce-demo/CheckoutOverviewPage.js";
import { CheckoutYourInfoPage } from "../../pages/sauce-demo/CheckoutYourInfoPage.js";
import { HomeMenu } from "../../pages/sauce-demo/HomeMenu.js";

let loginPage;
let productPage;
let cartPage;
let checkoutOverviewPage;
let checkoutYourInfoPage;
let homeMenu;

test.beforeAll(async () => {});

test.beforeEach("before each", async ({ page }) => {
  loginPage = new LoginPage(page);
  productPage = new ProductPage(page);
  cartPage = new CartPage(page);
  checkoutOverviewPage = new CheckoutOverviewPage(page);
  checkoutYourInfoPage = new CheckoutYourInfoPage(page);
  homeMenu = new HomeMenu(page);
});

for (const [okey, ovalue] of Object.entries(users)) {
  const [userName, userPassword, productNames] = Object.values(ovalue);
  test.describe("@All @SauceDemoSmoke", () => {
    test(`@SingleProduct | Add single product | testing with ${okey}: ${userName}`, async ({
      page,
    }) => {
      await loginPage.navigate();
      await loginPage.waitForPageLoad();
      const productMapIO = new Map();
      await loginPage.login(userName, userPassword);

      if (userName.includes("locked_out")) {
        await loginPage.validateLockedUserMessage();
      } else if (userName.includes("error")) {
        await loginPage.validateErrorUserMessage();
      } else {
        await loginPage.validateSessionStorage(userName);
        await productPage.waitForPageLoad();
        await productPage.applyFilter("Name (A to Z)");

        // add product/products
        for (const productName of productNames) {
          const productPrice = await productPage.addProduct(productName);
          productMapIO.set(productName, productPrice);
        }

        let sum = 0;
        productMapIO.forEach((v) => {
          sum += Number(v);
        });

        await productPage.moveToCart();
        // verify added/removed products at checkou
        expect(
          await cartPage.captureCheckoutProducts(),
          "mismatch at checkout"
        ).toStrictEqual(productMapIO);

        await cartPage.checkout();
        await checkoutYourInfoPage.fillInfo("Nitesh", "Yadav", "122001");
        await checkoutYourInfoPage.continueCheckoutYourInfo();
        await checkoutOverviewPage.validateCheckoutOverviewDetails(
          userName,
          sum
        );
        await checkoutOverviewPage.finishCheckoutOverviewPage();
      }
    });
  });
}

test.afterEach("after each", async ({ page }) => {
  await homeMenu.cleanUp();
  await page.close();
});

test.afterAll(async () => {});
