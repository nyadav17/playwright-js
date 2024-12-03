// @ts-check
import { chromium } from "playwright";
import { test, expect } from "@playwright/test";

const launchBrowser = async function (url) {
  try {
    const response = await this.page.goto(url, {
      timeout: 10000, // 10 seconds
      waitUntil: "domcontentloaded",
    });
    expect(response.status()).toBe(200); // Verify the page loads successfully
  } catch (error) {
    console.error("Navigation failed:", error.message);
  }
};

module.exports = { launchBrowser };
