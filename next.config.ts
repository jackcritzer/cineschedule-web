import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        ppr: false // fine for App Router perf; can remove if undesired
    }
};

export default nextConfig;