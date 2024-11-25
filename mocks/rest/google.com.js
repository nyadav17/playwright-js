await page.route("**/api/*", (route) => {
  route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ mockData: "test" }),
  });
});
await page.goto("https://www.google.com");
