import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Small pill shown next to UI elements on the sample apps that are
 * deliberately built to be awkward for pixel-diffing tools, but that
 * Applitools Eyes' Visual AI handles well. Hover for the "why".
 */
export function Challenge({ label, note }: { label: string; note: string }) {
  return (
    <span className="group relative inline-flex cursor-help items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
      🧪 {label}
      <span className="pointer-events-none absolute top-full left-1/2 z-20 mt-1 w-64 -translate-x-1/2 scale-95 rounded-md bg-zinc-900 p-2 text-xs leading-snug font-normal whitespace-normal text-zinc-50 opacity-0 shadow-lg transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
        {note}
      </span>
    </span>
  );
}

export function SampleBanner({ industry }: { industry: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-100 px-4 py-2 text-xs text-zinc-600 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      <span>
        Sample {industry} app — the target for generated Applitools Eyes snippets. Hover any{" "}
        <span className="font-medium text-amber-700 dark:text-amber-400">🧪 badge</span> to see the
        visual-testing challenge it demonstrates.
      </span>
      <Link href="/samples" className="font-medium underline shrink-0">
        All samples
      </Link>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
    </div>
  );
}
