const { expect } = require("@playwright/test");

/**
 * @param {import('@playwright/test').Page} page
 */
class SauceDemoHomePage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.usernameInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
  }

  async navigate() {
    await this.page.goto("https:/saucedemo.com");
  }
}

module.exports = { SauceDemoHomePage };
