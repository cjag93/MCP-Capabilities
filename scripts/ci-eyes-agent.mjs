#!/usr/bin/env node
/**
 * Launch a local Cursor agent in CI to drive Applitools MCP inspect + resolve.
 *
 * Secrets (also used locally via .env):
 *   CURSOR_API_KEY          — Cursor SDK / agent
 *   APPLITOOLS_API_KEY      — Playwright Eyes run
 *   APPLITOOLS_READ_KEY     — eyes_inspect_* (sessions, images, DOM, diffs)
 *   APPLITOOLS_WRITE_KEY    — eyes_resolve_* (accept/reject, regions, save)
 */
import { appendFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Agent, CursorAgentError } from "@cursor/sdk";
import "dotenv/config";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = path.join(workspaceRoot, "playwright-report", "index.html");
const shouldSave =
  process.env.EYES_RESOLVE_SAVE === "1" || process.env.EYES_RESOLVE_SAVE === "true";
const resolveAction = (process.env.EYES_RESOLVE_ACTION || "accept").toLowerCase();
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env locally and as a GitHub Actions secret.`);
    process.exit(1);
  }
  return value;
}

function mcpEnv() {
  return {
    BETA_v0_5_16_2832: "true",
    APPLITOOLS_API_KEY: process.env.APPLITOOLS_API_KEY ?? "",
    APPLITOOLS_READ_KEY: process.env.APPLITOOLS_READ_KEY ?? "",
    APPLITOOLS_WRITE_KEY: process.env.APPLITOOLS_WRITE_KEY ?? "",
    ...(process.env.APPLITOOLS_SERVER_URL
      ? { APPLITOOLS_SERVER_URL: process.env.APPLITOOLS_SERVER_URL }
      : {}),
  };
}

function prompt() {
  return `You are running unattended in GitHub Actions on the Layout-GHA branch.

Goal: verify the Applitools MCP inspect + resolve tools against the Layout visual test that just ran.

Credentials are already in the Applitools MCP server env:
- APPLITOOLS_READ_KEY — use for every eyes_inspect_* call
- APPLITOOLS_WRITE_KEY — use for every eyes_resolve_* call
- BETA_v0_5_16_2832=true — inspect/resolve tools are enabled

Do this, in order:

1. Call eyes_verify_api_key.
2. Call eyes_fetch_visual_results with reportPath "${reportPath}" and workspaceRoot "${workspaceRoot}". Do not move or copy that report.
3. Call eyes_inspect_sessions on the batch URL from step 2 (format: "full", then again with filter: "unresolved").
4. For each unresolved or mismatching session, call eyes_inspect_steps. For any step with isMatching=false, call eyes_inspect_changed_areas.
5. Resolve: for new or unresolved steps, call eyes_resolve_checkpoint with action "${resolveAction}". Prefer following eyes_review_progress with scope "batch" and mode "resolve" if that is the driven path the tools describe — always follow each response's "next" field.
6. ${
    shouldSave
      ? "Then call eyes_resolve_save so pending decisions are written to the baseline. State clearly what you are saving before that call."
      : "Do NOT call eyes_resolve_save. Leave decisions pending and say so."
  }

Rules:
- Do not edit, create, or delete source files.
- Do not strip trailing ~~ from Eyes URLs; they are part of the account token.
- Print the batch URL and a short table of test name / status / what you resolved.
- If everything already passed, still run inspect so the CI log shows the tool calls, then stop without resolving.

When finished, summarize: tools you called, sessions inspected, checkpoints resolved, whether save ran.`;
}

async function appendSummary(text) {
  if (!summaryPath) return;
  await appendFile(summaryPath, `\n## Cursor agent — Eyes inspect + resolve\n\n${text}\n`);
}

async function main() {
  const apiKey = requireEnv("CURSOR_API_KEY");
  requireEnv("APPLITOOLS_API_KEY");
  requireEnv("APPLITOOLS_READ_KEY");
  requireEnv("APPLITOOLS_WRITE_KEY");

  // Node 22 (GHA) does not support `await using`. Dispose explicitly.
  const agent = await Agent.create({
    apiKey,
    model: { id: "composer-2.5" },
    name: "layout-eyes-mcp-ci",
    local: { cwd: workspaceRoot, settingSources: [] },
    mcpServers: {
      "applitools-mcp": {
        type: "stdio",
        command: "npx",
        args: ["--yes", "@applitools/mcp@latest"],
        cwd: workspaceRoot,
        env: mcpEnv(),
      },
    },
  });

  try {
    const run = await agent.send(prompt());
    console.log(`agent=${agent.agentId} run=${run.id}`);

    for await (const event of run.stream()) {
      if (event.type === "assistant" && event.message?.content) {
        for (const block of event.message.content) {
          if (block.type === "text") process.stdout.write(block.text);
        }
      } else if (event.type === "tool_call") {
        const name = event.name || event.toolCall?.name || "tool";
        console.log(`\n[tool] ${name} ${event.status || ""}`.trim());
      }
    }

    const result = await run.wait();
    const summary = [
      `status: ${result.status}`,
      `agent: ${agent.agentId}`,
      `run: ${result.id}`,
      result.result ? `\n${result.result}` : "",
    ].join("\n");
    console.log(`\n${summary}`);
    await appendSummary(`\`\`\`\n${summary}\n\`\`\`\n`);

    if (result.status === "error") {
      process.exitCode = 2;
      return;
    }
    if (result.status !== "finished") {
      console.error(`Run ended as ${result.status}`);
      process.exitCode = 2;
    }
  } finally {
    if (typeof agent[Symbol.asyncDispose] === "function") {
      await agent[Symbol.asyncDispose]();
    } else if (typeof agent.close === "function") {
      await agent.close();
    }
  }
}

main().catch(async (error) => {
  if (error instanceof CursorAgentError) {
    console.error(`Agent startup failed: ${error.message} retryable=${error.isRetryable}`);
    await appendSummary(`Startup failed: ${error.message}`).catch(() => {});
    process.exit(1);
  }
  console.error(error);
  await appendSummary(String(error.stack || error.message)).catch(() => {});
  process.exit(1);
});
