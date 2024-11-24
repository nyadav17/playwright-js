"use-strict";
// @ts-check

import { test } from "@playwright/test";
test.beforeAll("", async () => {
  console.log("before all");
});
test.afterAll("", async () => {
  console.log("after all");
});
