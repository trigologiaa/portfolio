// biome-ignore-all lint: Playwright config file
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [2, "always", "kebab-case"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "revert",
      ],
    ],
    "header-max-length": [2, "always", 100],
  },
};
