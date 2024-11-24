// @ts-check

import { test, expect } from "@playwright/test";

test.beforeEach("", async ({ page }) => {});
test.afterEach("", async ({ page }) => {
  page.close();
});

test.beforeAll("", async () => {
  console.log("before all");
});
test.afterAll("", async () => {
  console.log("after all");
});
test.describe("@All @JQueryDemoSmoke", () => {
  test("", async ({ page }) => {});
});
