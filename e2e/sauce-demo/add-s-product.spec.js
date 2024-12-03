// @ts-check

import { test, expect } from "@playwright/test";
import { users } from "../../data/sauce-demo/users.json";
import { LoginPage } from "../../pages/sauce-demo/LoginPage.js";
import { ProductPage } from "../../pages/sauce-demo/ProductPage.js";
import { CartPage } from "../../pages/sauce-demo/CartPage.js";
import { CheckoutOverviewPage } from "../../pages/sauce-demo/CheckoutOverviewPage.js";
import { CheckoutYourInfoPage } from "../../pages/sauce-demo/CheckoutYourInfoPage.js";
import { HomeMenu } from "../../pages/sauce-demo/HomeMenu.js";
import { decryptData } from "../../utils/EncryptUtil.js";

let loginPage;
let productPage;
let cartPage;
let checkoutOverviewPage;
let checkoutYourInfoPage;
let homeMenu;
let url;
let decryptedUsername;
let decryptedPassword;

for (const [okey, ovalue] of Object.entries(users)) {
  const [encryptedUserName, encryptedPassword, productNames] =
    Object.values(ovalue);
  test.describe("@All @SauceDemoSmoke", () => {
    test.beforeAll(async () => {
      url = process.env.APPURL;
      decryptedUsername = decryptData(encryptedUserName);
      decryptedPassword = decryptData(encryptedPassword);
    });

    test.beforeEach("before each", async ({ page }) => {
      loginPage = new LoginPage(page);
      productPage = new ProductPage(page);
      cartPage = new CartPage(page);
      checkoutOverviewPage = new CheckoutOverviewPage(page);
      checkoutYourInfoPage = new CheckoutYourInfoPage(page);
      homeMenu = new HomeMenu(page);
    });

    test(`@SingleProduct | Add single product | testing with ${okey}: ${decryptedUsername}`, async ({}) => {
      await loginPage.navigate(url);
      await loginPage.waitForPageLoad();
      const productMapIO = new Map();
      await loginPage.login(decryptedUsername, decryptedPassword);

      if (decryptedUsername.includes("locked_out")) {
        await loginPage.validateLockedUserMessage();
      } else if (decryptedUsername.includes("error")) {
        await loginPage.validateErrorUserMessage();
      } else {
        await loginPage.validateSessionStorage(decryptedUsername);
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
          decryptedUsername,
          sum
        );
        await checkoutOverviewPage.finishCheckoutOverviewPage();
      }
    });
  });
  test.afterEach("after each", async ({ page }) => {
    await homeMenu.cleanUp();
    await page.close();
  });
  test.afterAll(async () => {});
}
