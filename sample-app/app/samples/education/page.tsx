"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner } from "../_components/shared";

const COURSES = [
  { name: "Intro to Data Structures", progress: 72 },
  { name: "Modern Web Development", progress: 45 },
  { name: "Linear Algebra", progress: 90 },
];

const MODULES = [
  { title: "Week 1 — Arrays & Lists", body: "Big-O notation, array operations, linked lists." },
  { title: "Week 2 — Trees & Graphs", body: "Traversals, binary search trees, graph representations." },
  { title: "Week 3 — Sorting", body: "Merge sort, quicksort, and stability trade-offs." },
];

function ProgressBar({ value }: { value: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setWidth(value), 150);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
      <div
        className="h-full rounded-full bg-indigo-600 transition-[width] duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function GradeChart() {
  const [scores, setScores] = useState<number[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setScores(Array.from({ length: 6 }, () => 60 + Math.random() * 40));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!scores) {
    return <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <div className="flex h-32 items-end gap-2">
      {scores.map((s, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md bg-indigo-500 transition-all"
          style={{ height: `${s}%` }}
          title={`Assignment ${i + 1}: ${Math.round(s)}%`}
        />
      ))}
    </div>
  );
}

function DueCountdown() {
  const [seconds, setSeconds] = useState(2 * 24 * 3600 + 5400);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  return (
    <span className="font-mono">
      {d}d {h}h {m}m
    </span>
  );
}

function Catalog() {
  const [loaded, setLoaded] = useState(false);
  const [featured, setFeatured] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 700);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setFeatured((f) => (f + 1) % COURSES.length), 3500);
    return () => clearInterval(id);
  }, []);

  if (!loaded) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COURSES.map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {COURSES.map((c, i) => (
        <div
          key={c.name}
          className={`rounded-xl border p-4 transition-colors ${
            i === featured
              ? "border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/40"
              : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          }`}
        >
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{c.name}</p>
          <div className="mt-2">
            <ProgressBar value={c.progress} />
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{c.progress}% complete</p>
        </div>
      ))}
    </div>
  );
}

export default function EducationPage() {
  const [openModule, setOpenModule] = useState<string | null>(MODULES[0].title);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="learning" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🎓 Acme Learning</span>
        <nav className="hidden gap-4 text-sm text-zinc-600 sm:flex dark:text-zinc-400">
          <span>Courses</span>
          <span>Assignments</span>
          <span>Grades</span>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Your courses</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Progress bars animate to their target width on load —{" "}
            <Challenge
              label="mid-animation capture"
              note="A screenshot taken mid-transition freezes the bar at an arbitrary width. Eyes waits for animations to settle (or checks a specific frame deliberately) instead of guessing when 'done' is."
            />
          </p>
        </div>

        <section data-testid="course-catalog">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Featured courses</h2>
            <Challenge
              label="auto-rotating highlight + skeleton"
              note="The featured card cycles every 3.5s, and the grid shows skeletons for the first 700ms. Two runs seconds apart legitimately look different — Eyes checks a deliberately captured, stable state."
            />
          </div>
          <Catalog />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            data-testid="grade-chart"
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Grade breakdown</h2>
              <Challenge
                label="random bar chart"
                note="Bar heights are randomized per load to simulate live grade data. There's no static baseline for the bars' exact pixels — Eyes validates the chart renders correctly, not an exact frozen value."
              />
            </div>
            <GradeChart />
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Modules</h2>
              <Challenge
                label="expand/collapse accordion"
                note="Only one module's body is visible at a time and toggling changes page height. Eyes checks the specific expanded state you drive it to, rather than assuming a single static layout."
              />
            </div>
            <ul className="space-y-1">
              {MODULES.map((m) => (
                <li key={m.title} className="rounded-md border border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setOpenModule((v) => (v === m.title ? null : m.title))}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {m.title}
                    <span>{openModule === m.title ? "▾" : "▸"}</span>
                  </button>
                  {openModule === m.title && (
                    <p className="border-t border-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {m.body}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          data-testid="due-countdown"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/40"
        >
          <span className="text-sm text-amber-800 dark:text-amber-300">
            Assignment 4 due in <DueCountdown />
          </span>
          <button
            type="button"
            onClick={() => setToast(true)}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Submit Assignment
          </button>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ Submission received
        </div>
      )}
    </div>
  );
}
