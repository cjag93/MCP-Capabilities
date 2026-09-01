# Acme Media — Applitools Eyes starter (Playwright)

A minimal, runnable Applitools Eyes project pointed at the Digital Media
sample page (http://localhost:3000/samples/digital-media). It runs the **same** page through three visual
checkpoints — one per match level — so you can see how each behaves:

- `tests/digital-media.strict.spec.ts` — **Strict** match level
- `tests/digital-media.exact.spec.ts` — **Exact** match level
- `tests/digital-media.layout.spec.ts` — **Layout** match level

Each test does one full-window `eyes.check` — no locators.

## 1. Install

```bash
npm install
npx playwright install chromium
```

## 2. Add your Applitools API key

```bash
cp .env.example .env
# then edit .env and paste your APPLITOOLS_API_KEY
```

Get a key from the [Applitools dashboard](https://eyes.applitools.com).

## 3. Run

```bash
npm test
```

That is everything — the sample app ships with this project.

## The bundled sample app

`sample-app/` is a self-contained Next.js copy of the industry sample pages,
including http://localhost:3000/samples/digital-media. Playwright's `webServer` runs `sample-app.js`, which
installs the app's dependencies on first run (so the first `npm test` takes a
minute), starts it, and waits for the page before the tests begin.

If you already have it running, Playwright reuses that server instead of
starting a second one. To test a different copy — a checkout of
`eyes-capabilities-generator`, or a deployed URL's local equivalent — set
`SAMPLE_APP_DIR` in `.env`.

You can browse the other industries' pages too; they are all included under
`sample-app/app/samples/`.

## Headed or headless

Tests run **headed** by default, so a browser window opens and you can watch the
Digital Media sample page render as the checkpoint is captured.

```bash
npm test                  # headed (default)
npm run test:headless     # headless
HEADLESS=1 npm test       # headless, one-off
npx playwright test --headed   # force headed regardless of HEADLESS
```

Use headless in CI — a headed browser needs a display, so `npm test` will fail
on a bare CI runner.
