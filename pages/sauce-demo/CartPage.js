// @ts-check

import { expect } from "@playwright/test";

export class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.productItems = this.page.locator("css=.cart_item");
    this.productQuantity = this.page.locator("css=.cart_quantity");
    this.productName = ".inventory_item_name";
    this.productPrice = ".inventory_item_price";
    this.checkOut = this.page.locator("#checkout");
  }

  async captureCheckoutProducts() {
    const productMapCO = new Map();
    const productCount = await this.productItems.count();
    if (productCount) {
      for (let i = 0; i < productCount; i++) {
        const productName = await this.productItems
          .nth(i)
          .locator(this.productName)
          .textContent();
        const productPrice = (
          await this.productItems
            .nth(i)
            .locator(this.productPrice)
            .textContent()
        )?.replace("$", "");

        productMapCO.set(productName, productPrice);
      }
    }
    return productMapCO;
  }

  async checkout() {
    await this.checkOut.click();
  }
}
