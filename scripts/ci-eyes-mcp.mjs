#!/usr/bin/env node
/**
 * CI client for the Applitools MCP inspect + resolve tools.
 *
 * 1. eyes_verify_api_key
 * 2. eyes_fetch_visual_results  (from playwright-report/index.html)
 * 3. eyes_inspect_sessions / eyes_inspect_steps / eyes_inspect_changed_areas
 * 4. eyes_resolve_checkpoint on unresolved/new steps
 * 5. eyes_resolve_save when EYES_RESOLVE_SAVE=1
 *
 * Requires APPLITOOLS_API_KEY and BETA_v0_5_16_2832=true (inspect/resolve beta).
 */
import { existsSync, mkdirSync } from "node:fs";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import "dotenv/config";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = path.join(workspaceRoot, "playwright-report", "index.html");
const resolveAction = (process.env.EYES_RESOLVE_ACTION || "accept").toLowerCase();
const shouldSave =
  process.env.EYES_RESOLVE_SAVE === "1" || process.env.EYES_RESOLVE_SAVE === "true";
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

const sectionLog = [];

function log(line = "") {
  console.log(line);
  sectionLog.push(line);
}

function heading(title) {
  const bar = "=".repeat(72);
  log("");
  log(bar);
  log(title);
  log(bar);
}

function pretty(value) {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function unwrap(result) {
  if (result?.structuredContent != null) return result.structuredContent;
  const texts = (result?.content || [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text);
  const joined = texts.join("\n").trim();
  if (!joined) return result;
  try {
    return JSON.parse(joined);
  } catch {
    return joined;
  }
}

function collectByKey(value, keys, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectByKey(item, keys, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (keys.includes(key) && typeof child === "string" && child) found.push(child);
      collectByKey(child, keys, found);
    }
  }
  return found;
}

function collectEyesUrls(value, found = []) {
  if (typeof value === "string" && /\/app\/test-results\//.test(value)) {
    found.push(value);
    return found;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectEyesUrls(item, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) collectEyesUrls(child, found);
  }
  return found;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function asBatchUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/app\/test-results\/([^/]+)/);
    if (!match) return url;
    parsed.pathname = `/app/test-results/${match[1]}/`;
    return parsed.toString();
  } catch {
    return url;
  }
}

function collectSteps(value) {
  if (Array.isArray(value)) {
    const looksLikeSteps = value.some(
      (item) =>
        item &&
        typeof item === "object" &&
        ("isMatching" in item || "stepIndex" in item || "resolution" in item),
    );
    if (looksLikeSteps) return value;
    return value.flatMap((item) => collectSteps(item));
  }
  if (value && typeof value === "object") {
    if (Array.isArray(value.steps)) return collectSteps(value.steps);
    return Object.values(value).flatMap((child) => collectSteps(child));
  }
  return [];
}

function stepNeedsResolve(step, index) {
  if (!step || typeof step !== "object") return false;
  if (step.isMatching === false) return true;
  if (step.isUnsaved === true) return true;
  const status = String(step.status || step.resolution || "").toLowerCase();
  if (["unresolved", "new", "failed", "mismatch"].includes(status)) return true;
  if (step.baseline == null && step.checkpoint != null) return true;
  return index === 0 && step.isMatching == null && status === "";
}

async function appendSummary() {
  if (!summaryPath) return;
  const body = ["## Eyes MCP inspect + resolve", "", "```", ...sectionLog, "```", ""].join("\n");
  await appendFile(summaryPath, body);
}

async function main() {
  if (!process.env.APPLITOOLS_API_KEY) {
    console.error("APPLITOOLS_API_KEY is missing. Add it to .env locally and as a GitHub Actions secret.");
    process.exit(1);
  }
  if (!existsSync(reportPath)) {
    console.error(`No Eyes/Playwright report at ${reportPath}. Run npm test first, without --reporter overrides.`);
    process.exit(1);
  }

  process.env.BETA_v0_5_16_2832 = "true";
  mkdirSync(path.join(workspaceRoot, "test-results"), { recursive: true });

  const transport = new StdioClientTransport({
    command: process.env.APPLITOOLS_MCP_CMD || "npx",
    args: process.env.APPLITOOLS_MCP_ARGS
      ? process.env.APPLITOOLS_MCP_ARGS.split(" ")
      : ["--yes", "@applitools/mcp@latest"],
    cwd: workspaceRoot,
    env: {
      ...process.env,
      BETA_v0_5_16_2832: "true",
      APPLITOOLS_API_KEY: process.env.APPLITOOLS_API_KEY,
      APPLITOOLS_READ_KEY: process.env.APPLITOOLS_READ_KEY,
      APPLITOOLS_WRITE_KEY: process.env.APPLITOOLS_WRITE_KEY,
    },
    stderr: "inherit",
  });

  const client = new Client({ name: "mcp-capabilities-ci", version: "1.0.0" });
  await client.connect(transport);

  const call = async (name, args, timeoutMs = 180_000) => {
    heading(`MCP ${name}`);
    log(`arguments: ${pretty({ workspaceRoot, ...args })}`);
    const result = await client.callTool({ name, arguments: { workspaceRoot, ...args } }, undefined, {
      timeout: timeoutMs,
      maxTotalTimeout: timeoutMs,
    });
    if (result.isError) {
      log(`ERROR: ${pretty(unwrap(result))}`);
      throw new Error(`${name} returned isError`);
    }
    const data = unwrap(result);
    log(pretty(data));
    return data;
  };

  try {
    const tools = await client.listTools();
    const names = (tools.tools || []).map((tool) => tool.name).sort();
    heading("MCP tools available");
    log(names.join("\n"));
    for (const required of [
      "eyes_inspect_sessions",
      "eyes_inspect_steps",
      "eyes_resolve_checkpoint",
      "eyes_resolve_save",
    ]) {
      if (!names.includes(required)) {
        throw new Error(
          `MCP server is missing ${required}. Confirm BETA_v0_5_16_2832=true is set (Cursor mcp.json uses the same flag).`,
        );
      }
    }

    await call("eyes_verify_api_key", {
      apiKey: process.env.APPLITOOLS_API_KEY,
      ...(process.env.APPLITOOLS_SERVER_URL
        ? { serverUrl: process.env.APPLITOOLS_SERVER_URL }
        : {}),
    });

    const fetched = await call("eyes_fetch_visual_results", { reportPath });
    const batchUrl =
      collectByKey(fetched, ["batchUrl"])[0] || asBatchUrl(collectEyesUrls(fetched)[0]);
    const sessionUrls = unique([
      ...collectByKey(fetched, ["sessionUrl"]),
      ...collectEyesUrls(fetched).filter((url) => /\/app\/test-results\/[^/]+\/[^/?]+/.test(url)),
    ]);

    if (!batchUrl && sessionUrls.length === 0) {
      throw new Error("eyes_fetch_visual_results did not return a batch or session URL.");
    }

    heading("Resolved Eyes URLs");
    log(`batchUrl: ${batchUrl || "(derived from first session)"}`);
    for (const url of sessionUrls) log(`sessionUrl: ${url}`);

    const inspectBatchUrl = batchUrl || asBatchUrl(sessionUrls[0]);
    await call("eyes_inspect_sessions", { batchUrl: inspectBatchUrl, format: "full" });
    const unresolved = await call("eyes_inspect_sessions", {
      batchUrl: inspectBatchUrl,
      filter: "unresolved",
      format: "full",
    });

    const unresolvedUrls = unique([
      ...sessionUrls,
      ...collectByKey(unresolved, ["sessionUrl", "url"]),
      ...collectEyesUrls(unresolved),
    ]).filter((url) => /\/app\/test-results\/[^/]+\/[^/?]+/.test(url));

    const targets = unresolvedUrls.length > 0 ? unresolvedUrls : sessionUrls;
    let resolvedCount = 0;
    let saveUrl = targets[0] || sessionUrls[0];

    for (const sessionUrl of targets) {
      const stepsResult = await call("eyes_inspect_steps", { sessionUrl });
      const steps = collectSteps(stepsResult);
      if (steps.length === 0) {
        log("No step objects parsed; resolving stepIndex 0 if this session is unresolved/new.");
        await call("eyes_resolve_checkpoint", {
          sessionUrl,
          stepIndex: 0,
          action: resolveAction,
          propagate: "none",
        });
        resolvedCount += 1;
        saveUrl = sessionUrl;
        continue;
      }

      for (const [index, step] of steps.entries()) {
        const stepIndex = Number.isInteger(step.stepIndex) ? step.stepIndex : index;
        if (step.isMatching === false) {
          await call("eyes_inspect_changed_areas", { sessionUrl, stepIndex });
        }
        if (!stepNeedsResolve(step, stepIndex)) {
          log(`step ${stepIndex}: matching / already decided — skip resolve`);
          continue;
        }
        heading(`eyes_resolve_checkpoint — step ${stepIndex} — ${resolveAction}`);
        await call("eyes_resolve_checkpoint", {
          sessionUrl,
          stepIndex,
          action: resolveAction,
          propagate: "none",
        });
        resolvedCount += 1;
        saveUrl = sessionUrl;
      }
    }

    heading("Resolve summary");
    log(`action: ${resolveAction}`);
    log(`checkpoints resolved: ${resolvedCount}`);
    log(`save requested: ${shouldSave ? "yes" : "no (set EYES_RESOLVE_SAVE=1 to persist)"}`);

    if (shouldSave && resolvedCount > 0 && saveUrl) {
      await call("eyes_resolve_save", { sessionUrl: saveUrl });
      log("Pending accept/reject decisions were saved to the baseline.");
    } else if (resolvedCount > 0) {
      log("Decisions are pending only. Re-run with EYES_RESOLVE_SAVE=1 to write them to the baseline.");
    } else {
      log("Nothing to resolve — inspect completed on a clean (or already-decided) batch.");
    }
  } finally {
    await appendSummary();
    await client.close().catch(() => {});
  }
}

main().catch(async (error) => {
  console.error(error);
  if (summaryPath) {
    await appendFile(summaryPath, `\n## Eyes MCP failed\n\n\`\`\`\n${error.stack || error.message}\n\`\`\`\n`).catch(
      () => {},
    );
  }
  process.exit(1);
});
