// @ts-check
const takeScreenshot = async () => {
  await page.screenshot({ path: "./screenshots/screenshot.png" });
};

const takeScreenshotPDF = async () => {
  await page.pdf({ path: "./screenshots/screenshot.pdf" });
};

module.exports = { takeScreenshot };
