import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't infer it from a stray
  // lock file higher up the filesystem (keeps CI/Vercel builds deterministic).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
