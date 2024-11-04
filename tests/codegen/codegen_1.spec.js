import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://www.demoblaze.com/");
  await page.getByRole("link", { name: "Log in" }).click();
  await page.locator("#loginusername").fill("admin");
  await page.locator("#loginpassword").fill("admin");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByRole("link", { name: "Laptops" }).click();
  await page.getByRole("link", { name: "Monitors" }).click();
  page.close();
});
