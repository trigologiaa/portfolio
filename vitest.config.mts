import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const domTests: string[] = [
  "test/components/**/*.test.{ts,tsx}",
  "test/hooks/**/*.test.{ts,tsx}",
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    setupFiles: ["./test/setup.ts"],
    css: false,
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["test/**/*.test.{ts,tsx}"],
          exclude: domTests,
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: domTests,
        },
      },
    ],
  },
});
