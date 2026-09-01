"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

const ACCOUNTS = ["Checking •• 4821", "Savings •• 1190", "Credit Card •• 7734"];

function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span data-testid="live-clock">{time ?? "--:--:--"}</span>;
}

function SpendingChart() {
  const [points, setPoints] = useState<number[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setPoints(Array.from({ length: 12 }, () => 20 + Math.random() * 80));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!points) {
    return <div className="h-40 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  const w = 480;
  const h = 160;
  const max = Math.max(...points);
  const stepX = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${h - (p / max) * h}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full text-blue-600 dark:text-blue-400">
      <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={i * stepX} cy={h - (p / max) * h} r={3} fill="currentColor" />
      ))}
    </svg>
  );
}

function TransactionsTable() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(id);
  }, []);

  const rows = [
    { desc: "Whole Foods Market", amount: "-$84.12", date: "Aug 4" },
    { desc: "Payroll Deposit", amount: "+$3,120.00", date: "Aug 1" },
    { desc: "Netflix", amount: "-$15.49", date: "Jul 31" },
    { desc: "Transfer to Savings", amount: "-$500.00", date: "Jul 28" },
  ];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {rows.map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map((row) => (
          <tr key={row.desc} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
            <td className="py-2 text-zinc-900 dark:text-zinc-50">{row.desc}</td>
            <td className="py-2 text-zinc-500 dark:text-zinc-400">{row.date}</td>
            <td
              className={`py-2 text-right font-medium ${
                row.amount.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {row.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function FinancePage() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const [unread, setUnread] = useState<number | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setUnread(Math.floor(Math.random() * 6) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="banking" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🏦 Acme Bank</span>
          <nav className="hidden gap-4 text-sm text-zinc-600 sm:flex dark:text-zinc-400">
            <span>Dashboard</span>
            <span>Transfers</span>
            <span>Cards</span>
            <span>Support</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Challenge
            label="dynamic badge"
            note="Unread count is randomized on every load. Pixel-diff tools flag this constantly; Eyes' Visual AI treats small numeric/text deltas as content, not a layout break."
          />
          <button
            type="button"
            data-testid="unread-badge"
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            🔔
            {unread !== null && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {account} ▾
            </button>
            {accountOpen && (
              <ul className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                {ACCOUNTS.map((a) => (
                  <li key={a}>
                    <button
                      type="button"
                      onClick={() => {
                        setAccount(a);
                        setAccountOpen(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {a}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Welcome back, Jordan</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              As of <LiveClock />{" "}
              <Challenge
                label="live timestamp"
                note="This clock re-renders every second, so a byte-for-byte screenshot compare would never pass. Eyes ignores non-semantic text churn and focuses on layout/region integrity."
              />
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTransferOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Transfer
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Checking" value="$4,238.19" hint="•• 4821" />
          <StatCard label="Savings" value="$18,902.44" hint="•• 1190" />
          <StatCard label="Credit Card" value="-$612.80" hint="Due Aug 22" />
        </div>

        <section
          data-testid="spending-chart"
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Spending trend</h2>
            <Challenge
              label="random data + canvas-like SVG"
              note="The line chart is redrawn with fresh random values every load — DOM assertions can't validate a chart shape at all. Eyes' Visual AI diffs the rendered pixels directly."
            />
          </div>
          <SpendingChart />
        </section>

        <section
          data-testid="transactions-table"
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Recent transactions</h2>
            <Challenge
              label="async skeleton loader"
              note="Rows render as skeleton placeholders for ~900ms before real data lands. Naive screenshotting races the load; Eyes' auto-wait for a stable DOM avoids flaky captures."
            />
          </div>
          <TransactionsTable />
        </section>

        <p className="text-xs text-zinc-400">
          Layout reflows from a 3-column stat grid down to 1 column below the{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">sm</code> breakpoint —{" "}
          <Challenge
            label="responsive layout"
            note="One Eyes snapshot can be checked against many viewports/browsers via the Ultrafast Grid, instead of maintaining separate screenshots per breakpoint."
          />
        </p>
      </main>

      {transferOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">New Transfer</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">From</span>
                <select className="mt-1 w-full rounded-md border border-zinc-200 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-950">
                  {ACCOUNTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Amount</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="mt-1 w-full rounded-md border border-zinc-200 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-950"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTransferOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setTransferOpen(false);
                  setToast(true);
                }}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ Transfer submitted — auto-dismisses in 3s
        </div>
      )}
    </div>
  );
}
