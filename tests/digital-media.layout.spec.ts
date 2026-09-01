import { test } from "@applitools/eyes-playwright/fixture";

// One checkpoint, one match level — full-window Layout check, no coded regions.
// Test name is new so Eyes opens a fresh baseline (no layoutRegions).
test("Home — Layout match level (no regions)", async ({ page, eyes }) => {
  await page.goto("/samples/digital-media");
  await eyes.check("Acme Media — Digital Media — Home", {
    fully: true,
    matchLevel: "Layout",
  });
});
