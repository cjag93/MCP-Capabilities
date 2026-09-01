"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner, StatCard } from "../_components/shared";

function Greeting() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const hour = new Date().getHours();
      const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
      setText(`Good ${part}, Alex`);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return <span data-testid="greeting">{text ?? "Hello"}</span>;
}

function VitalsChart() {
  const [points, setPoints] = useState<number[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setPoints(Array.from({ length: 24 }, () => 60 + Math.random() * 40));
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!points) {
    return <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  const w = 480;
  const h = 128;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const stepX = w / (points.length - 1);
  const scaled = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${scaled(p)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full text-rose-500">
      <path d={path} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

function Calendar() {
  const [days, setDays] = useState<{ day: number; isToday: boolean }[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      setDays(
        Array.from({ length: daysInMonth }, (_, i) => ({
          day: i + 1,
          isToday: i + 1 === now.getDate(),
        }))
      );
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!days) {
    return <div className="h-40 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  return (
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {days.map(({ day, isToday }) => (
        <span
          key={day}
          className={`rounded-md py-1.5 ${
            isToday
              ? "bg-emerald-600 font-semibold text-white"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {day}
        </span>
      ))}
    </div>
  );
}

function RecordsList() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(id);
  }, []);

  const records = ["Annual Physical — Jul 12", "Lab Results: Lipid Panel — Jun 30", "Flu Vaccine — Jan 8"];

  if (!loaded) {
    return (
      <div className="space-y-2">
        {records.map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-2 text-sm">
      {records.map((r) => (
        <li key={r} className="rounded-md border border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
          {r}
        </li>
      ))}
    </ul>
  );
}

export default function HealthcarePage() {
  const [messages, setMessages] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMessages(Math.floor(Math.random() * 4) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="patient portal" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">➕ Acme Health</span>
        <button
          type="button"
          data-testid="message-badge"
          className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ✉️
          {messages !== null && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {messages}
            </span>
          )}
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            <Greeting />
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Here&apos;s your health summary.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Resting HR" value="68 bpm" />
          <StatCard label="Blood Pressure" value="118/76" />
          <StatCard label="Next Appointment" value="Aug 12" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section
            data-testid="vitals-chart"
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Heart rate — last 24h</h2>
              <Challenge
                label="random vitals chart"
                note="Each load generates a fresh random waveform, so there's no fixed pixel baseline for the line itself. Eyes validates chart structure and rendering fidelity, not an exact frozen shape."
              />
            </div>
            <VitalsChart />
          </section>

          <section
            data-testid="calendar"
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">This month</h2>
              <Challenge
                label="today's date highlight"
                note="The highlighted cell moves every single day, guaranteeing yesterday's screenshot never matches today's. Eyes' region-aware AI understands this is expected drift, not a regression."
              />
            </div>
            <Calendar />
          </section>
        </div>

        <section
          data-testid="records-list"
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Medical records</h2>
              <Challenge
                label="async skeleton loader"
                note="Records render as pulsing placeholders for ~800ms first. Screenshotting too early captures skeletons, not content — Eyes' auto-wait for a settled DOM sidesteps that race."
              />
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Book Appointment
            </button>
          </div>
          <RecordsList />
        </section>
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Confirm appointment</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Dr. Patel · General Checkup · Aug 12, 10:30 AM
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setToast(true);
                }}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ Appointment confirmed
        </div>
      )}
    </div>
  );
}
