"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner } from "../_components/shared";

const FEATURED = [
  { title: "The Last Signal — S2 now streaming", color: "from-purple-600 to-fuchsia-600" },
  { title: "Weekly Deep Dive — new episode", color: "from-sky-600 to-cyan-600" },
  { title: "Live: City Lights Documentary", color: "from-orange-600 to-red-600" },
];

const CONTENT = ["The Last Signal", "Weekly Deep Dive", "City Lights", "Late Night Loop"];

function FeaturedCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % FEATURED.length), 3000);
    return () => clearInterval(id);
  }, []);

  const slide = FEATURED[index];

  return (
    <div
      className={`relative flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-r px-6 text-center text-lg font-semibold text-white transition-colors duration-700 sm:h-56 ${slide.color}`}
    >
      {slide.title}
      <div className="absolute bottom-3 flex gap-1.5">
        {FEATURED.map((_, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

function TrendingChart() {
  const [rows, setRows] = useState<{ title: string; views: number }[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setRows(
        CONTENT.map((title) => ({ title, views: Math.floor(10000 + Math.random() * 90000) })).sort(
          (a, b) => b.views - a.views
        )
      );
    }, 0);
    return () => clearTimeout(id);
  }, []);

  if (!rows) {
    return <div className="h-32 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />;
  }

  const max = Math.max(...rows.map((r) => r.views));

  return (
    <ul className="space-y-2">
      {rows.map((r, i) => (
        <li key={r.title} className="flex items-center gap-2 text-sm">
          <span className="w-4 text-zinc-400">{i + 1}</span>
          <span className="w-28 shrink-0 truncate text-zinc-700 dark:text-zinc-300">{r.title}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
            <div className="h-full rounded-full bg-fuchsia-500" style={{ width: `${(r.views / max) * 100}%` }} />
          </div>
          <span className="w-14 shrink-0 text-right text-xs text-zinc-500 dark:text-zinc-400">
            {(r.views / 1000).toFixed(1)}k
          </span>
        </li>
      ))}
    </ul>
  );
}

function PlayerProgress() {
  const duration = 255;
  const [elapsed, setElapsed] = useState(32);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => (e + 1 >= duration ? 0 : e + 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full bg-fuchsia-600" style={{ width: `${(elapsed / duration) * 100}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        {fmt(elapsed)} / {fmt(duration)}
      </p>
    </div>
  );
}

function ContentThumb({ title }: { title: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 300 + Math.random() * 900);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-24 w-full items-center justify-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-900">
        {loaded ? "🎬" : <span className="h-full w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />}
      </div>
      <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">{title}</p>
    </div>
  );
}

function SubscriptionCountdown() {
  const [seconds, setSeconds] = useState(6 * 86400 + 1200);

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

export default function DigitalMediaPage() {
  const [newEpisodes, setNewEpisodes] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setNewEpisodes(Math.floor(Math.random() * 4) + 1), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="streaming" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🎬 Acme Media</span>
        <button
          type="button"
          data-testid="episodes-badge"
          className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          🔔
          {newEpisodes !== null && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {newEpisodes}
            </span>
          )}
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div data-testid="featured-carousel">
          <FeaturedCarousel />
        </div>
        <p className="text-xs text-zinc-400">
          <Challenge
            label="auto-rotating carousel"
            note="The hero slide advances on a 3s timer, so two screenshots taken seconds apart show different content on purpose. Eyes lets you check a stable frame instead of racing the animation."
          />
        </p>

        <section
          data-testid="player-progress"
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-2 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Now playing — The Last Signal</h2>
            <Challenge
              label="live playback progress"
              note="The scrubber and elapsed-time text advance every second, so no two loads render an identical frame. Eyes' AI tolerates this expected, continuous drift instead of failing on it."
            />
          </div>
          <PlayerProgress />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section data-testid="trending-chart" className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Trending now</h2>
              <Challenge
                label="randomized ranked chart"
                note="View counts (and therefore the ranking and bar widths) are randomized every load. There's no fixed pixel baseline for this list — Eyes validates the chart renders correctly, not one frozen ranking."
              />
            </div>
            <TrendingChart />
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Continue watching</h2>
              <Challenge
                label="lazy-loaded thumbnails"
                note="Each thumbnail resolves after a random delay, mirroring a real CDN fetch. Eyes' auto-wait avoids capturing half-loaded cards instead of racing the load."
              />
            </div>
            <div data-testid="content-grid" className="grid grid-cols-2 gap-3">
              {CONTENT.map((title) => (
                <ContentThumb key={title} title={title} />
              ))}
            </div>
          </section>
        </div>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-3 dark:border-fuchsia-900 dark:bg-fuchsia-950/40">
          <span className="text-sm font-medium text-fuchsia-800 dark:text-fuchsia-300">
            Subscription renews in <span data-testid="subscription-countdown"><SubscriptionCountdown /></span>
          </span>
          <Challenge
            label="live countdown"
            note="This text decrements every second in real time, so no two page loads render identical text. Eyes' AI matching tolerates this expected, ticking drift."
          />
        </section>
      </main>
    </div>
  );
}
