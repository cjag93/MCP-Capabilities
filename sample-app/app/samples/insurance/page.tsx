"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

const POLICIES = ["Auto — Sedan (POL-4471)", "Homeowners (POL-2290)"];

function PremiumEstimate() {
  const [coverage, setCoverage] = useState(250000);
  const [premium, setPremium] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setPremium(Math.round(coverage * 0.00042 + Math.random() * 8)), 0);
    return () => clearTimeout(id);
  }, [coverage]);

  return (
    <div>
      <label className="block text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Coverage amount: ${coverage.toLocaleString()}</span>
        <input
          type="range"
          min={100000}
          max={500000}
          step={10000}
          value={coverage}
          onChange={(e) => setCoverage(Number(e.target.value))}
          className="mt-2 w-full"
        />
      </label>
      <p data-testid="premium-estimate" className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {premium !== null ? `$${premium}/mo` : "Calculating…"}
      </p>
    </div>
  );
}

function CoverageChart() {
  const [slices, setSlices] = useState<{ label: string; pct: number; color: string }[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const liability = 30 + Math.random() * 20;
      const collision = 20 + Math.random() * 20;
      const comprehensive = 100 - liability - collision;
      setSlices([
        { label: "Liability", pct: liability, color: "#4f46e5" },
        { label: "Collision", pct: collision, color: "#0891b2" },
        { label: "Comprehensive", pct: comprehensive, color: "#d97706" },
      ]);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!slices) {
    return <div className="h-32 w-32 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />;
  }

  const r = 50;
  const c = 2 * Math.PI * r;
  const arcs = slices.reduce<{ label: string; color: string; dash: number; offset: number }[]>(
    (acc, s) => {
      const dash = (s.pct / 100) * c;
      const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
      return [...acc, { label: s.label, color: s.color, dash, offset: prevOffset }];
    },
    []
  );

  return (
    <div className="flex items-center gap-4">
      <svg width={120} height={120} className="-rotate-90">
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx={60}
            cy={60}
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={16}
            strokeDasharray={`${a.dash} ${c}`}
            strokeDashoffset={-a.offset}
          />
        ))}
      </svg>
      <ul className="space-y-1 text-xs">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} — {Math.round(s.pct)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClaimsList() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(id);
  }, []);

  const claims = [
    { id: "CLM-9021", status: "Under review", date: "Jul 28" },
    { id: "CLM-8877", status: "Approved", date: "Jun 14" },
    { id: "CLM-8410", status: "Paid", date: "Apr 2" },
  ];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {claims.map((_, i) => (
          <div key={i} className="h-9 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 text-sm">
      {claims.map((c) => (
        <li key={c.id} className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2 dark:border-zinc-800">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{c.id}</span>
          <span className="text-zinc-500 dark:text-zinc-400">{c.status}</span>
          <span className="text-zinc-400">{c.date}</span>
        </li>
      ))}
    </ul>
  );
}

function RenewalCountdown() {
  const [seconds, setSeconds] = useState(21 * 86400 + 4000);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);

  return (
    <span data-testid="renewal-countdown" className="font-mono">
      {d}d {h}h
    </span>
  );
}

export default function InsurancePage() {
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policy, setPolicy] = useState(POLICIES[0]);
  const [claimsUnread, setClaimsUnread] = useState<number | null>(null);
  const [claimOpen, setClaimOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setClaimsUnread(Math.floor(Math.random() * 3) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="insurance" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🛡️ Acme Insurance</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="claims-badge"
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            📋
            {claimsUnread !== null && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {claimsUnread}
              </span>
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setPolicyOpen((v) => !v)}
              className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            >
              {policy} ▾
            </button>
            {policyOpen && (
              <ul className="absolute right-0 z-10 mt-1 w-56 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                {POLICIES.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => {
                        setPolicy(p);
                        setPolicyOpen(false);
                      }}
                      className="block w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {p}
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
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Get a quote</h1>
          <button
            type="button"
            onClick={() => setClaimOpen(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            File a Claim
          </button>
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Instant premium estimate</h2>
            <Challenge
              label="live recalculated value"
              note="Dragging the slider recomputes the premium immediately, and the base formula adds a small random adjustment each time. The number is never pixel-stable — Eyes tracks it as dynamic content."
            />
          </div>
          <PremiumEstimate />
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Current premium" value="$118/mo" />
          <StatCard label="Deductible" value="$500" />
          <StatCard label="Renews in" value={<RenewalCountdown />} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            data-testid="coverage-chart"
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Coverage breakdown</h2>
              <Challenge
                label="randomized donut chart"
                note="Slice sizes are recomputed with fresh random values every load. There's no fixed pixel baseline for the arcs — Eyes validates the chart renders as a correctly proportioned shape."
              />
            </div>
            <CoverageChart />
          </section>

          <section
            data-testid="claims-list"
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Recent claims</h2>
              <Challenge
                label="async skeleton loader"
                note="Rows render as pulsing placeholders for ~800ms before the real claims list lands. Eyes' auto-wait for a settled DOM avoids capturing that in-between state."
              />
            </div>
            <ClaimsList />
          </section>
        </div>
      </main>

      {claimOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">File a claim</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Policy: {policy}</p>
            <label className="mt-4 block text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">What happened?</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-zinc-200 px-2 py-1.5 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setClaimOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setClaimOpen(false);
                  setToast(true);
                }}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ Claim submitted
        </div>
      )}
    </div>
  );
}
