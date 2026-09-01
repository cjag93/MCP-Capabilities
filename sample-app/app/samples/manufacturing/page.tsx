"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

const LINES = ["Line A — Stamping", "Line B — Assembly", "Line C — Packaging"];

function LastUpdated() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time ?? "--:--:--"}</span>;
}

function ThroughputGauge() {
  const [pct, setPct] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setPct(55 + Math.random() * 40), 0);
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
          className="text-amber-600 transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {pct !== null ? `${Math.round(pct)}%` : "…"}
      </span>
    </div>
  );
}

function InventoryTable() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(id);
  }, []);

  const rows = [
    { sku: "SKU-2201", part: "Steel bracket", qty: 4820 },
    { sku: "SKU-2288", part: "M6 bolt (box)", qty: 1204 },
    { sku: "SKU-2340", part: "Gasket seal", qty: 312 },
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
    <table className="w-full text-sm">
      <tbody>
        {rows.map((r) => (
          <tr key={r.sku} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
            <td className="py-2 text-zinc-900 dark:text-zinc-50">{r.part}</td>
            <td className="py-2 text-zinc-500 dark:text-zinc-400">{r.sku}</td>
            <td className="py-2 text-right font-medium text-zinc-900 dark:text-zinc-50">{r.qty.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DefectChart() {
  const [bars, setBars] = useState<number[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setBars(Array.from({ length: 7 }, () => Math.random() * 6));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!bars) {
    return <div className="h-28 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <div className="flex h-28 items-end gap-2">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-rose-500" style={{ height: `${(b / 6) * 100}%` }} />
      ))}
    </div>
  );
}

function ShiftCountdown() {
  const [seconds, setSeconds] = useState(3 * 3600 + 940);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return (
    <span data-testid="shift-countdown" className="font-mono">
      {h}h {m}m
    </span>
  );
}

export default function ManufacturingPage() {
  const [lineOpen, setLineOpen] = useState(false);
  const [line, setLine] = useState(LINES[0]);
  const [alerts, setAlerts] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setAlerts(Math.floor(Math.random() * 4)), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="manufacturing" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🏭 Acme Manufacturing</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="alerts-badge"
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ⚠️
            {alerts !== null && alerts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {alerts}
              </span>
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setLineOpen((v) => !v)}
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {line} ▾
            </button>
            {lineOpen && (
              <ul className="absolute right-0 z-10 mt-1 w-48 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
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
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Production dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last updated <LastUpdated /></p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section data-testid="throughput-gauge" className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <ThroughputGauge />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{line} throughput</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Target: 1,200 units/hr</p>
              <Challenge
                label="live gauge chart"
                note="The ring fills to a randomized percentage each load, drawn with SVG stroke-dasharray. A pixel-exact baseline is impossible; Eyes validates the gauge renders correctly as a shape."
              />
            </div>
          </section>

          <section className="flex flex-col justify-center gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Next shift change</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              <ShiftCountdown />
            </p>
            <Challenge
              label="live countdown"
              note="This value decrements every second in real time, so no two page loads render identical text. Eyes' AI matching tolerates expected, continuous text drift like this."
            />
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section data-testid="inventory-table" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Inventory levels</h2>
              <Challenge
                label="async skeleton loader"
                note="Rows render as pulsing placeholders for ~800ms before real data lands. Eyes' auto-wait for a settled DOM avoids capturing that in-between state."
              />
            </div>
            <InventoryTable />
          </section>

          <section data-testid="defect-chart" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Defect rate — last 7 days</h2>
              <Challenge
                label="random bar chart"
                note="Bar heights are randomized every load to simulate live QC data. There's no static baseline for the bars' exact pixels — Eyes validates the chart renders correctly, not one frozen value."
              />
            </div>
            <DefectChart />
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Units today" value="8,412" />
          <StatCard label="Downtime" value="14 min" />
          <StatCard label="OEE" value="87%" />
        </div>
      </main>
    </div>
  );
}
