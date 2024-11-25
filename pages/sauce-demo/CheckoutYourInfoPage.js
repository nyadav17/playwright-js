// @ts-check

import { expect } from "@playwright/test";

export class CheckoutYourInfoPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.firstName = this.page.locator("#first-name");
    this.lastName = this.page.locator("#last-name");
    this.postalCode = this.page.locator("#postal-code");
    this.continue = this.page.locator("#continue");
  }

  async fillInfo(firstName, lastName, postalCode) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continueCheckoutYourInfo() {
    await this.continue.click();
  }
}
