"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

function EtaCountdown() {
  const [seconds, setSeconds] = useState(2 * 3600 + 1140);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return (
    <span data-testid="eta-countdown" className="font-mono">
      {h}h {m}m
    </span>
  );
}

function FleetChart() {
  const [bars, setBars] = useState<number[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setBars(Array.from({ length: 10 }, () => 10 + Math.random() * 90));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!bars) {
    return <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <div className="flex h-32 items-end gap-1.5">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-teal-500" style={{ height: `${b}%` }} />
      ))}
    </div>
  );
}

function DispatchQueue() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(id);
  }, []);

  const rows = [
    { id: "SHP-77201", dest: "Denver, CO", status: "In transit" },
    { id: "SHP-77198", dest: "Reno, NV", status: "Loading" },
    { id: "SHP-77184", dest: "Austin, TX", status: "Delayed" },
  ];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {rows.map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 text-sm">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2 dark:border-zinc-800">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{r.id}</span>
          <span className="text-zinc-500 dark:text-zinc-400">{r.dest}</span>
          <span
            className={
              r.status === "Delayed"
                ? "text-rose-600 dark:text-rose-400"
                : "text-zinc-500 dark:text-zinc-400"
            }
          >
            {r.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WarehouseGauge() {
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setPct(40 + Math.random() * 55), 0);
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
          className="text-teal-600 transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {pct !== null ? `${Math.round(pct)}%` : "…"}
      </span>
    </div>
  );
}

export default function LogisticsPage() {
  const [alerts, setAlerts] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setAlerts(Math.floor(Math.random() * 3) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="supply chain" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🚚 Acme Logistics</span>
        <button
          type="button"
          data-testid="alerts-badge"
          className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ⚠️
          {alerts !== null && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {alerts}
            </span>
          )}
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Operations dashboard</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active shipments" value="342" />
          <StatCard label="On-time rate" value="94.2%" />
          <StatCard label="Next ETA" value={<EtaCountdown />} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section data-testid="fleet-chart" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Fleet utilization — last 10 hrs</h2>
              <Challenge
                label="random bar chart"
                note="Bar heights are randomized every load to simulate live fleet telemetry. There's no static baseline for the bars' exact pixels — Eyes validates the chart renders correctly, not one frozen value."
              />
            </div>
            <FleetChart />
          </section>

          <section data-testid="warehouse-gauge" className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <WarehouseGauge />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Warehouse capacity</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Zone 4 — West Distribution</p>
              <Challenge
                label="live gauge chart"
                note="The ring fills to a randomized percentage each load, drawn with SVG stroke-dasharray. A pixel-exact baseline is impossible; Eyes validates the gauge renders correctly as a shape."
              />
            </div>
          </section>
        </div>

        <section data-testid="dispatch-queue" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Dispatch queue</h2>
            <Challenge
              label="async skeleton loader"
              note="Rows render as pulsing placeholders for ~800ms before real data lands. Eyes' auto-wait for a settled DOM avoids capturing that in-between state."
            />
          </div>
          <DispatchQueue />
        </section>
      </main>
    </div>
  );
}
