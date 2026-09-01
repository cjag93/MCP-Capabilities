import Link from "next/link";

// Standalone index for the bundled sample app. The generator repo's own
// /samples page is not copied here because it imports the snippet engine.
const SAMPLES = [
  "computer-software",
  "digital-media",
  "ecommerce",
  "education",
  "federal",
  "finance",
  "healthcare",
  "insurance",
  "logistics",
  "manufacturing",
  "telecom",
];

export default function SamplesIndex() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Eyes sample apps</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Each page is a visual-testing target with deliberately unstable content
        (live clocks, randomized charts, counters).
      </p>
      <ul className="mt-8 grid gap-2">
        {SAMPLES.map((id) => (
          <li key={id}>
            <Link
              href={`/samples/${id}`}
              className="block rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium transition-colors hover:border-accent"
            >
              /samples/{id}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
