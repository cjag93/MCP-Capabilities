"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner } from "../_components/shared";

const LINES = ["Line 1 •• 0192", "Line 2 •• 0847"];

const PLANS = [
  { name: "Basic", data: "5GB", price: "$35/mo" },
  { name: "Plus", data: "20GB", price: "$55/mo" },
  { name: "Unlimited", data: "∞", price: "$75/mo" },
];

function DataUsageGauge() {
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setPct(30 + Math.random() * 60), 0);
    return () => clearTimeout(id);
  }, []);

  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = pct !== null ? (pct / 100) * c : 0;

  return (
    <div className="relative flex h-[120px] w-[120px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-zinc-100 dark:text-zinc-900" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${c}`}
          strokeLinecap="round"
          className="text-cyan-600 transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {pct !== null ? `${Math.round(pct)}%` : "…"}
      </span>
    </div>
  );
}

function BillCountdown() {
  const [seconds, setSeconds] = useState(9 * 86400 + 3200);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);

  return (
    <span className="font-mono">
      {d}d {h}h
    </span>
  );
}

function BillingHistory() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 850);
    return () => clearTimeout(id);
  }, []);

  const bills = [
    { month: "July", amount: "$55.00" },
    { month: "June", amount: "$55.00" },
    { month: "May", amount: "$62.40" },
  ];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {bills.map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1 text-sm">
      {bills.map((b) => (
        <li key={b.month} className="flex justify-between border-b border-zinc-100 py-1.5 last:border-0 dark:border-zinc-800">
          <span className="text-zinc-600 dark:text-zinc-400">{b.month}</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{b.amount}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TelecomPage() {
  const [lineOpen, setLineOpen] = useState(false);
  const [line, setLine] = useState(LINES[0]);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [chatUnread, setChatUnread] = useState<number | null>(null);
  const [toast, setToast] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setChatUnread(Math.floor(Math.random() * 3)), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="carrier account" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">📶 Acme Telecom</span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setLineOpen((v) => !v)}
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            {line} ▾
          </button>
          {lineOpen && (
            <ul className="absolute right-0 z-10 mt-1 w-44 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              {LINES.map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => {
                      setLine(l);
                      setLineOpen(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            data-testid="data-usage-gauge"
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <DataUsageGauge />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Data usage this cycle</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Resets in 12 days</p>
              <Challenge
                label="live gauge chart"
                note="The ring fills to a randomized percentage each load, drawn with SVG stroke-dasharray. A pixel-exact baseline is impossible; Eyes validates the gauge renders correctly as a shape, not one frozen fill level."
              />
            </div>
          </section>

          <section
            data-testid="bill-countdown"
            className="flex flex-col justify-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Next bill</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Due in <BillCountdown />
            </p>
            <Challenge
              label="live countdown"
              note="This value decrements every second in real time, so no two page loads render identical text. Eyes' AI matching tolerates expected, continuous text drift like this."
            />
          </section>
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Compare plans</h2>
            <Challenge
              label="hover-highlighted row + responsive table"
              note="Hovering a plan row changes its background, and the table collapses to stacked cards on narrow viewports. Eyes can check a specific hover state and validate every breakpoint via the Ultrafast Grid."
            />
          </div>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {PLANS.map((p) => (
                  <tr
                    key={p.name}
                    onMouseEnter={() => setHoveredPlan(p.name)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    className={`border-b border-zinc-100 last:border-0 dark:border-zinc-800 ${
                      hoveredPlan === p.name ? "bg-cyan-50 dark:bg-cyan-950/30" : ""
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-50">{p.name}</td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{p.data}</td>
                    <td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">{p.price}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setUpgradeOpen(true)}
                        className="rounded-md bg-cyan-600 px-2 py-1 text-xs font-medium text-white hover:bg-cyan-700"
                      >
                        Switch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          data-testid="billing-history"
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Billing history</h2>
            <Challenge
              label="async skeleton loader"
              note="Rows appear as pulsing placeholders for ~850ms before real data lands, mirroring a real API round-trip. Eyes' auto-wait for a settled DOM avoids capturing that in-between state."
            />
          </div>
          <BillingHistory />
        </section>
      </main>

      <button
        type="button"
        data-testid="chat-badge"
        onClick={() => setToast(true)}
        className="fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-xl text-white shadow-lg hover:bg-cyan-700"
      >
        💬
        {chatUnread !== null && chatUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {chatUnread}
          </span>
        )}
      </button>

      {upgradeOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Confirm plan change</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              This will take effect on your next billing cycle for {line}.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUpgradeOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setUpgradeOpen(false);
                  setToast(true);
                }}
                className="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ Request submitted
        </div>
      )}
    </div>
  );
}
