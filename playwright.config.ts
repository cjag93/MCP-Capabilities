import "dotenv/config";
import { defineConfig } from "@playwright/test";
import type { EyesFixture } from "@applitools/eyes-playwright/fixture";

// Headed by default, so you can watch the sample app render while the
// checkpoint is captured. Set HEADLESS=1 (or run `npm run test:headless`) for a
// headless run — that is what you want in CI.
const headless = process.env.HEADLESS === "1" || process.env.HEADLESS === "true";

export default defineConfig<EyesFixture>({
  testDir: "./tests",
  // Eyes reporter writes visual results into the Playwright HTML report.
  // Do not override this with --reporter=list (or similar) — MCP inspect
  // reads playwright-report/index.html and would then see a stale report.
  reporter: [["@applitools/eyes-playwright/reporter", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    headless,
    eyesConfig: {
      appName: "Acme Media",
      batch: { name: process.env.APPLITOOLS_BATCH_NAME || "Digital Media Visual Regression" },
      // Ultrafast Grid — re-renders each checkpoint across these browsers.
      type: "ufg",
      browsersInfo: [
        { name: "chrome", width: 1440, height: 900 },
        { name: "firefox", width: 1440, height: 900 },
        { name: "safari", width: 1440, height: 900 },
      ],
    },
  },
  webServer: {
    command: "node sample-app.js",
    url: "http://localhost:3000/samples/digital-media",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
