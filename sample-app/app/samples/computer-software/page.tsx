"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

const WORKSPACES = ["Acme SaaS — Production", "Acme SaaS — Staging"];

const CHECKLIST = ["Create account", "Connect data source", "Invite teammates", "Set up billing"];

function StatusLine() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span data-testid="status-ticker">
      <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />
      All systems operational · Last checked {time ?? "--:--:--"}
    </span>
  );
}

function OnboardingProgress() {
  const [width, setWidth] = useState(0);
  const done = 3;

  useEffect(() => {
    const id = setTimeout(() => setWidth((done / CHECKLIST.length) * 100), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <div data-testid="onboarding-progress">
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
        <div
          className="h-full rounded-full bg-violet-600 transition-[width] duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <ul className="mt-3 space-y-1.5 text-sm">
        {CHECKLIST.map((item, i) => (
          <li key={item} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                i < done ? "bg-violet-600 text-white" : "border border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {i < done ? "✓" : ""}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsageChart() {
  const [bars, setBars] = useState<number[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setBars(Array.from({ length: 14 }, () => 20 + Math.random() * 80));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!bars) {
    return <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <div className="flex h-32 items-end gap-1.5">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-violet-500" style={{ height: `${b}%` }} />
      ))}
    </div>
  );
}

function ActivityFeed() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 850);
    return () => clearTimeout(id);
  }, []);

  const events = [
    "Priya deployed build #482",
    "New API key generated",
    "Webhook delivery failed — retrying",
    "Billing invoice paid",
  ];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {events.map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 text-sm">
      {events.map((e) => (
        <li key={e} className="rounded-md border border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
          {e}
        </li>
      ))}
    </ul>
  );
}

export default function ComputerSoftwarePage() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [notifications, setNotifications] = useState<number | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setNotifications(Math.floor(Math.random() * 5) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="SaaS product" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative">
          <button
            type="button"
            onClick={() => setWorkspaceOpen((v) => !v)}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            💻 {workspace} ▾
          </button>
          {workspaceOpen && (
            <ul className="absolute left-0 z-10 mt-1 w-56 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              {WORKSPACES.map((w) => (
                <li key={w}>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspace(w);
                      setWorkspaceOpen(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {w}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="notification-badge"
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            🔔
            {notifications !== null && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {notifications}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            Invite teammate
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            <StatusLine />{" "}
            <Challenge
              label="live status ticker"
              note="The 'last checked' time ticks every second, so a byte-for-byte compare would never pass twice in a row. Eyes ignores non-semantic text churn instead of flagging it as a regression."
            />
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="API calls today" value="284,912" />
          <StatCard label="Active seats" value="18 / 25" />
          <StatCard label="Uptime (30d)" value="99.98%" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Finish setup</h2>
              <Challenge
                label="mid-animation progress bar"
                note="The bar animates to its target width on load. A screenshot taken mid-transition freezes it at an arbitrary width — Eyes waits for animations to settle before checking."
              />
            </div>
            <OnboardingProgress />
          </section>

          <section
            data-testid="usage-chart"
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">API usage — last 14 days</h2>
              <Challenge
                label="random bar chart"
                note="Bar heights are randomized every load to simulate live usage data. There's no fixed pixel baseline for the bars — Eyes validates the chart renders correctly, not one frozen shape."
              />
            </div>
            <UsageChart />
          </section>
        </div>

        <section
          data-testid="activity-feed"
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Recent activity</h2>
            <Challenge
              label="async skeleton loader"
              note="Events render as pulsing placeholders for ~850ms before the real feed lands. Screenshotting too early captures skeletons, not content — Eyes' auto-wait for a settled DOM avoids that race."
            />
          </div>
          <ActivityFeed />
        </section>
      </main>

      {inviteOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Invite teammate</h2>
            <label className="mt-4 block text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Email</span>
              <input
                type="email"
                placeholder="teammate@company.com"
                className="mt-1 w-full rounded-md border border-zinc-200 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setInviteOpen(false);
                  setToast(true);
                }}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700"
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ Invite sent
        </div>
      )}
    </div>
  );
}
