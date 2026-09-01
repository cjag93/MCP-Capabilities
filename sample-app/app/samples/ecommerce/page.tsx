"use client";

import { useEffect, useState } from "react";
import { Challenge, SampleBanner } from "../_components/shared";

const SLIDES = [
  { title: "Back to School", color: "from-blue-500 to-indigo-600" },
  { title: "Flash Sale — Up to 40% Off", color: "from-rose-500 to-orange-500" },
  { title: "New Arrivals", color: "from-emerald-500 to-teal-600" },
];

const PRODUCTS = [
  { name: "Trail Runner Sneaker", price: "$89" },
  { name: "Insulated Bottle 24oz", price: "$28" },
  { name: "Weekender Duffel", price: "$64" },
  { name: "Merino Crew Socks (3pk)", price: "$22" },
];

function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 3000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <div
      className={`relative flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-r text-xl font-semibold text-white transition-colors duration-700 sm:h-56 ${slide.color}`}
    >
      {slide.title}
      <div className="absolute bottom-3 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Countdown() {
  const [seconds, setSeconds] = useState(3600 * 6 + 214);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <span className="font-mono">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

function ProductImage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 400 + Math.random() * 800);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex h-32 w-full items-center justify-center rounded-lg bg-zinc-100 text-3xl dark:bg-zinc-900">
      {loaded ? "🛍️" : <span className="h-full w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />}
    </div>
  );
}

function Stars() {
  const [reviews, setReviews] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setReviews(Math.floor(Math.random() * 400) + 8), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400">
      ★★★★☆ {reviews !== null ? `(${reviews})` : "(…)"}
    </p>
  );
}

export default function EcommercePage() {
  const [cartCount, setCartCount] = useState(0);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  function addToCart(name: string) {
    setCartCount((c) => c + 1);
    setToast(`Added "${name}" to cart`);
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SampleBanner industry="storefront" />

      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">🛒 Acme Store</span>
        <div className="flex items-center gap-3">
          <Challenge
            label="dynamic cart badge"
            note="The cart count mutates with every interaction. A brittle pixel-only compare would fail on the number alone; Eyes tracks the region as content and the badge layout as structure."
          />
          <button
            type="button"
            data-testid="cart-badge"
            className="relative rounded-md border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
        <div data-testid="promo-carousel" className="flex items-center gap-2">
          <Carousel />
        </div>
        <p className="text-xs text-zinc-400">
          <Challenge
            label="auto-rotating carousel"
            note="Slides advance on a 3s timer, so two screenshots taken seconds apart show different content on purpose. Eyes lets you check a stable frame instead of racing the animation."
          />
        </p>

        <div
          data-testid="flash-sale-countdown"
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900 dark:bg-rose-950/40"
        >
          <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
            🔥 Flash sale ends in <Countdown />
          </span>
          <Challenge
            label="live countdown"
            note="This text changes every second. Text-diff or pixel-diff tools would flag it on every single run; Eyes' AI recognizes it as dynamic, ticking content."
          />
        </div>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-medium text-zinc-900 dark:text-zinc-50">Featured products</h2>
            <Challenge
              label="lazy-loaded images + responsive grid"
              note="Each card resolves its 'image' after a random delay, and the grid reflows from 4 columns to 1. Eyes' auto-wait avoids capturing half-loaded cards, and the Ultrafast Grid covers every breakpoint from one snapshot."
            />
          </div>
          <div data-testid="product-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                onMouseEnter={() => setQuickView(p.name)}
                onMouseLeave={() => setQuickView((v) => (v === p.name ? null : v))}
                className="relative rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <ProductImage />
                <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">{p.name}</p>
                <Stars />
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{p.price}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(p.name)}
                    className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
                  >
                    Add
                  </button>
                </div>
                {quickView === p.name && (
                  <div className="absolute inset-x-3 -bottom-2 translate-y-full rounded-md border border-zinc-200 bg-white p-2 text-xs text-zinc-600 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    Quick view: ships in 2–3 days · free returns
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
          ✅ {toast}
        </div>
      )}
    </div>
  );
}
