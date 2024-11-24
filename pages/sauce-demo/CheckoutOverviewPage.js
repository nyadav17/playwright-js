// @ts-check

import { expect } from "@playwright/test";

export class CheckoutOverviewPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.summaryInfoE = this.page.locator(".summary_info");
    this.itemTotalE = ".summary_subtotal_label";
    this.taxE = ".summary_tax_label";
    this.totalE = ".summary_total_label";
    this.finish = this.page.locator("#finish");
  }

  async validateCheckoutOverviewDetails(userName, sum) {
    let total = await this.summaryInfoE.locator(this.itemTotalE).textContent();
    if (total != null) {
      total = total.replace("Item total: $", "");
      if (userName.includes("problem")) {
        expect(Number(total), "total price does not match").not.toEqual(sum);
      } else {
        expect(Number(total), "total price does not match").toEqual(sum);
      }
    }
  }

  async finishCheckoutOverviewPage() {
    await this.finish.click();
  }
}
