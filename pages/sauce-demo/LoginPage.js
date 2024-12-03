// @ts-check

import { expect } from "@playwright/test";

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.usernameInput = this.page.locator("#user-name");
    this.usernamePassword = this.page.locator("#password");
    this.loginButton = this.page.locator("#login-button");
    this.lockedUserMessage = this.page.getByText(
      "Sorry, this user has been locked out."
    );
    this.errorUserMessage = this.page.getByText(
      "Username and password do not match any user in this service"
    );
  }

  async waitForPageLoad() {
    await this.usernameInput.waitFor();
    await this.usernamePassword.waitFor();
    await this.loginButton.waitFor();
  }

  async navigate(url) {
    const response = await this.page.goto(url, {
      timeout: 20000,
      waitUntil: "domcontentloaded",
    });
    expect(response).not.toBeNull;
    expect(response?.status()).toBe(200);
  }

  /**
   * @param {string} userName
   * @param {string} password
   */
  async login(userName, password) {
    await this.usernameInput?.fill(userName);
    await this.usernamePassword?.fill(password);
    await this.loginButton?.click();
  }

  async validateSessionStorage(userName) {
    const sessionData = await this.page.context().storageState();
    expect(
      sessionData.cookies.at(0)?.value,
      "session cookie does not has " + userName
    ).toEqual(userName);
  }

  async validateLockedUserMessage() {
    await expect(this.lockedUserMessage).toBeVisible();
  }
  async validateErrorUserMessage() {
    await expect(this.errorUserMessage).toBeVisible();
  }
}
