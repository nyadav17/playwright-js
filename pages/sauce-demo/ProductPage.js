// @ts-check

import { expect } from "@playwright/test";

export class ProductPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.filter = this.page.locator("css=.product_sort_container");
    // product name?
    this.addToCart = this.page.locator("xpath=//button[text()='Add to cart']");
    this.productPrice = this.page.locator(
      "xpath=//div[@class='inventory_details_price']"
    );
    this.backToProducts = this.page.locator(
      "xpath=//button[text()='Back to products']"
    );

    this.cart = this.page.locator(".shopping_cart_link");
  }

  async waitForPageLoad() {
    await this.filter.waitFor();
    await this.cart.waitFor();
  }

  async applyFilter(filter) {
    await this.filter.selectOption(filter);
  }

  async addProduct(productName) {
    await this.page
      .locator("xpath=//div[text()='" + productName + "']")
      .click();
    await this.addToCart.click();
    const productprice = await this.productPrice.textContent();
    await this.backToProducts.click();
    return productprice?.replace("$", "");
  }

  async moveToCart() {
    await this.cart.click();
  }
}
