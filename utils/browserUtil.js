const { chromium } = require("playwright");

const launchBrowser = async (url) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  await browser.close();
};

module.exports = { launchBrowser };
