// @ts-check

import { expect } from "@playwright/test";

export class HomeMenu {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.openMenu = this.page.getByRole("button", { name: "Open Menu" });
    this.allItems = this.page.getByText("#inventory_sidebar_link");
    this.about = this.page.getByText("#about_sidebar_link");
    this.reset = this.page.locator("#reset_sidebar_link");
    this.logout = this.page.locator("#logout_sidebar_link");
  }

  async cleanUp() {
    await this.openMenu.click();
    await this.reset.click();
    await this.logout.click();
  }
}
