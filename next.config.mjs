/**
 * Next.js configuration for MediMitra Care.
 *
 * What this does:
 *   - Enables the `standalone` output so the Docker image can run a minimal
 *     Node server without shipping the full node_modules tree.
 *   - Declares server-side env var names so judges can optionally bake a key
 *     into their deployment — but the app is designed to run in "demo mode"
 *     without any keys at all (see /settings).
 *
 * Why it matters for SDG 3:
 *   A lightweight, easily-deployable container means community health
 *   workers in low-bandwidth rural PHCs can spin up MediMitra on a cheap
 *   laptop or a Raspberry Pi in minutes — no paid cloud required.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['zustand'],
  },
};

export default nextConfig;
