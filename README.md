# Acme Media — Applitools Eyes starter (Playwright)

A minimal, runnable Applitools Eyes project pointed at the Digital Media
sample page (http://localhost:3000/samples/digital-media). This branch
(`Layout-GHA`) runs **Layout** match level only:

- `tests/digital-media.layout.spec.ts` — **Layout** match level

The test does one full-window `eyes.check` — no locators.

## 1. Install

```bash
npm install
npx playwright install chromium
```

## 2. Add keys

```bash
cp .env.example .env
```

| Variable | Where to get it | Used for |
| --- | --- | --- |
| `APPLITOOLS_API_KEY` | [Eyes dashboard](https://eyes.applitools.com) | Playwright test run |
| `APPLITOOLS_READ_KEY` | Applitools Admin → Teams → API Keys (read) | `eyes_inspect_*` |
| `APPLITOOLS_WRITE_KEY` | Applitools Admin → Teams → API Keys (write) | `eyes_resolve_*` |
| `CURSOR_API_KEY` | [Cursor → Integrations](https://cursor.com/dashboard/integrations) | CI agent that calls those MCP tools |

Leave `BETA_v0_5_16_2832=true` — that flag unlocks inspect / resolve.

## 3. Run

```bash
npm test                  # headed (default)
npm run test:headless     # headless
HEADLESS=1 npm test       # headless, one-off
```

That is everything — the sample app ships with this project.

## GitHub Actions — inspect + resolve

[`.github/workflows/layout-eyes-mcp.yml`](.github/workflows/layout-eyes-mcp.yml)
runs only when a PR is **merged into `main`** (or via **Run workflow**). It
does not run on PR opens or branch pushes. After merge it starts a **local
Cursor agent** (`npm run ci:agent`) with the Applitools MCP server attached.
Watch **Cursor agent — Eyes inspect + resolve** for inspect and resolve.

Add the same four names as **Actions secrets** (values from `.env`):

| Secret | Purpose |
| --- | --- |
| `APPLITOOLS_API_KEY` | Eyes test run |
| `APPLITOOLS_READ_KEY` | MCP inspect |
| `APPLITOOLS_WRITE_KEY` | MCP resolve + save |
| `CURSOR_API_KEY` | Launch the agent |

CI sets `EYES_RESOLVE_ACTION=accept` and `EYES_RESOLVE_SAVE=1`. To inspect
without writing the baseline, set `EYES_RESOLVE_SAVE=0` on the workflow `env`
block.

`npm run ci:mcp` is a no-agent fallback that calls the same MCP tools directly.

Do **not** run Playwright with `--reporter=list` (or any reporter override).
MCP inspect reads `playwright-report/index.html`.

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

Use headless in CI — a headed browser needs a display, so `npm test` will fail
on a bare CI runner.
