const PlaywrightTestConfig = require("@playwright/test");
import * as os from "node:os";

const playwrightTestConfig = (PlaywrightTestConfig = {
  reporter: [
    ["line"],
    [
      "allure-playwright",
      {
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
});

export default playwrightTestConfig;
