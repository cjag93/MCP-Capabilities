import { test } from "@applitools/eyes-playwright/fixture";

// One checkpoint, one match level, no locators — just a full-window check of
// http://localhost:3000/samples/digital-media (the path resolves against baseURL in playwright.config).
test("Home — Layout match level", async ({ page, eyes }) => {
  await page.goto("/samples/digital-media");
  await eyes.check("Acme Media — Digital Media — Home", {
    fully: true,
    matchLevel: "Layout",
    layoutRegions: [
      "[data-testid=\"episodes-badge\"]",
      "[data-testid=\"player-progress\"]",
      "[data-testid=\"subscription-countdown\"]",
      "[data-testid=\"featured-carousel\"]",
      "[data-testid=\"trending-chart\"]",
      "[data-testid=\"content-grid\"]",
    ],
  });
});
