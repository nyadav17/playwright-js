// @ts-check

const { expect, test } = require("@playwright/test");
const {} = require("playwright");

exports.SauceDemoHomePage = class SauceDemoHomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#user-name");
    this.usernamePassword = page.locator("#password");
    this.loginButton = page.locator("#login-button");
  }

  async navigate() {
    await this.page.goto("https://saucedemo.com", {
      waitUntil: "domcontentloaded",
    });
  }

  /**
   * @param {string} userName
   * @param {string} userPassword
   */
  async login(userName, userPassword) {
    await this.usernameInput.fill(userName);
    await this.usernamePassword.fill(userPassword);
    await this.loginButton.click();
  }
};
