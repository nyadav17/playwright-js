// @ts-check

import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("https://www.saucedemo.com");
  await page.locator("#user-name").fill("standard_user");
  await page.getByLabel("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("https://www.saucedemo.com");
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByText("All Items")).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
