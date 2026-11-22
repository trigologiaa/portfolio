import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

type WithNextIntl = ReturnType<typeof createNextIntlPlugin>;

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    agentUpgrade: "security",
  },
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};
const withNextIntl: WithNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
