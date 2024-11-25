// @ts-check

import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/sauce-demo/LoginPage.js";
import { ProductPage } from "../../pages/sauce-demo/ProductPage.js";
import { CartPage } from "../../pages/sauce-demo/CartPage.js";
import { CheckoutOverviewPage } from "../../pages/sauce-demo/CheckoutOverviewPage.js";
import { CheckoutYourInfoPage } from "../../pages/sauce-demo/CheckoutYourInfoPage.js";
import { HomeMenu } from "../../pages/sauce-demo/HomeMenu.js";
import { readCSV } from "../../utils/FileUtils.js";

let loginPage;
let productPage;
let cartPage;
let checkoutOverviewPage;
let checkoutYourInfoPage;
let homeMenu;
const records = readCSV("users.csv");

test.beforeAll(async () => {});

test.beforeEach("before each", async ({ page }) => {
  loginPage = new LoginPage(page);
  productPage = new ProductPage(page);
  cartPage = new CartPage(page);
  checkoutOverviewPage = new CheckoutOverviewPage(page);
  checkoutYourInfoPage = new CheckoutYourInfoPage(page);
  homeMenu = new HomeMenu(page);
});

for (const record of records) {
  test.describe("@All @SauceDemoSmoke", () => {
    test(`@SingleProduct | Add single product | testing with ${record.userName}`, async ({
      page,
    }) => {
      await loginPage.navigate();
      await loginPage.waitForPageLoad();
      let productMapIO = new Map();
      await loginPage.login(record.userName, record.userPassword);

      if (record.userName.includes("locked_out")) {
        await loginPage.validateLockedUserMessage();
      } else if (record.userName.includes("error")) {
        await loginPage.validateErrorUserMessage();
      } else {
        await loginPage.validateSessionStorage(record.userName);
        await productPage.waitForPageLoad();
        await productPage.applyFilter("Name (A to Z)");

        productMapIO = await productPage.addAllProduct();

        await productPage.moveToCart();
        // verify added/removed products at checkou
        expect(
          await cartPage.captureCheckoutProducts(),
          "mismatch at checkout"
        ).toStrictEqual(productMapIO);

        let sum = 0;
        productMapIO.forEach((v) => {
          sum += Number(v);
        });

        await cartPage.checkout();
        await checkoutYourInfoPage.fillInfo("Nitesh", "Yadav", "122001");
        await checkoutYourInfoPage.continueCheckoutYourInfo();
        await checkoutOverviewPage.validateCheckoutOverviewDetails(
          record.userName,
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
