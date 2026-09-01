"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

const STEPS = ["Personal Info", "Eligibility", "Documents", "Review"];

function SessionCountdown() {
  const [seconds, setSeconds] = useState(14 * 60 + 52);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <span data-testid="session-countdown" className="font-mono">
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

function ApplicationProgress() {
  const current = 2;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setWidth((current / (STEPS.length - 1)) * 100), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
        <div className="h-full rounded-full bg-blue-700 transition-[width] duration-1000 ease-out" style={{ width: `${width}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-xs">
        {STEPS.map((step, i) => (
          <span
            key={step}
            className={i <= current ? "font-medium text-blue-700 dark:text-blue-400" : "text-zinc-400"}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

function BenefitsChart() {
  const [slices, setSlices] = useState<{ label: string; pct: number; color: string }[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const approved = 40 + Math.random() * 30;
      const pending = 100 - approved - 10;
      setSlices([
        { label: "Approved", pct: approved, color: "#1d4ed8" },
        { label: "Pending review", pct: pending, color: "#d97706" },
        { label: "Denied", pct: 10, color: "#dc2626" },
      ]);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!slices) {
    return <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <div className="space-y-2">
      {slices.map((s) => (
        <div key={s.label} className="flex items-center gap-2 text-sm">
          <span className="w-28 shrink-0 text-zinc-600 dark:text-zinc-400">{s.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
          </div>
          <span className="w-10 shrink-0 text-right text-xs text-zinc-500 dark:text-zinc-400">
            {Math.round(s.pct)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function DocumentsList() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(id);
  }, []);

  const docs = ["Proof of income — verified", "Government ID — verified", "Proof of residency — pending review"];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {docs.map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-1.5 text-sm">
      {docs.map((d) => (
        <li key={d} className="rounded-md border border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
          {d}
        </li>
      ))}
    </ul>
  );
}

export default function FederalPage() {
  const [correspondence, setCorrespondence] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setCorrespondence(Math.floor(Math.random() * 3) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="government services" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🏛️ Acme Federal Services</span>
        <div className="flex items-center gap-4 text-sm">
          <button
            type="button"
            data-testid="correspondence-badge"
            className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            📨
            {correspondence !== null && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {correspondence}
              </span>
            )}
          </button>
          <span className="text-zinc-500 dark:text-zinc-400">
            Session expires in <SessionCountdown />
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Benefits application</h1>
          <Challenge
            label="live session countdown"
            note="A ticking session timer is standard on government portals for security compliance. It changes every second, so pixel-diff tools would fail this header on every run — Eyes tolerates the expected drift."
          />
        </div>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Application progress</h2>
            <Challenge
              label="mid-animation stepper"
              note="The progress bar animates to its target width on load. A screenshot taken mid-transition freezes it at an arbitrary width — Eyes waits for animations to settle before checking."
            />
          </div>
          <div data-testid="application-progress">
            <ApplicationProgress />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Case number" value="FED-88213" />
          <StatCard label="Filed" value="Jul 2, 2026" />
          <StatCard label="Est. decision" value="Aug 30, 2026" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section data-testid="benefits-chart" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Regional benefits status</h2>
              <Challenge
                label="randomized breakdown chart"
                note="Percentages are recomputed with fresh random values every load. There's no fixed pixel baseline for the bars — Eyes validates the chart renders correctly, not one frozen distribution."
              />
            </div>
            <BenefitsChart />
          </section>

          <section data-testid="documents-list" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Submitted documents</h2>
              <Challenge
                label="async skeleton loader"
                note="Rows render as pulsing placeholders for ~800ms before real data lands. Eyes' auto-wait for a settled DOM avoids capturing that in-between state."
              />
            </div>
            <DocumentsList />
          </section>
        </div>
      </main>
    </div>
  );
}
