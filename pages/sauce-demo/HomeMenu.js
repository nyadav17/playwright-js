// @ts-check

import { expect } from "@playwright/test";

export class HomeMenu {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.openMenu = this.page.getByRole("button", { name: "Open Menu" });
    this.allItems = this.page.getByText("All Items");
    this.about = this.page.getByText("About");
    this.reset = this.page.getByText("Reset App State");
    this.logout = this.page.getByText("Logout");
  }

  async cleanUp() {
    await this.openMenu.click();
    await this.reset.click();
    await this.logout.click();
  }
}
