// @ts-check

import { expect } from "@playwright/test";

export class ProductPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.filter = this.page.locator(".product_sort_container");
    this.productNames = this.page.locator(".inventory_item_name");
    this.productName = this.page.locator(".inventory_details_name");
    this.addToCart = this.page.locator("//button[text()='Add to cart']");
    this.productPrice = this.page.locator(
      "//div[@class='inventory_details_price']"
    );
    this.backToProducts = this.page.locator(
      "//button[text()='Back to products']"
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
  async addAllProduct() {
    const productCount = await this.productNames.count();
    const productMapIO = new Map();
    if (productCount) {
      for (let i = 0; i < productCount; i++) {
        await this.productNames.nth(i).click();
        const name = await this.productName.textContent();
        const prize = await this.productPrice.textContent();
        await this.addToCart.click();
        await this.backToProducts.click();
        productMapIO.set(name, prize?.replace("$", ""));
      }
    }

    return productMapIO;
  }

  async moveToCart() {
    await this.cart.click();
  }
}
