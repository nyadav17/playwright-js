// @ts-check

const { test, expect } = require("@playwright/test");

const {
  SauceDemoHomePage,
} = require("../pages/sauce-demo/sauce-demo-home-page");

// 1. Verify session-username after login. Cookie session-username should have correct value (used username)
// 2. Override the selenium getValue() or getText() method.
// 3. Apply overrided method to Login button and login_logo (html class name) and put method call in any test.
// 4. Also please implement the mechanism of making screenshots and storing them.

[
  { name: "standard_user", password: "secret_sauce" },
  { name: "problem_user", password: "secret_sauce" },
  { name: "performance_glitch_user", password: "secret_sauce" },
  { name: "visual_user", password: "secret_sauce" },
].forEach(({ name, password }) => {
  test(`testing with ${name}`, async ({ page }) => {
    const sauceDemoHome = new SauceDemoHomePage(page);
    await page.goto("https:/saucedemo.com");
    await page.locator("#user-name").fill(name);
    await page.locator("#password").fill(password);
    await page.locator("#login-button").click();
    const sessionData = await page.context().storageState();
    expect(
      sessionData.cookies.at(0)?.value,
      "cookie has data for user: " + name
    ).toEqual(name);
    await page.getByText("Open Menu").click();
    await page.locator("#logout_sidebar_link").click();
  });
});
