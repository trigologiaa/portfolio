const usScope = {
  rules: {
    "us-scope": ({ scope }) => [
      /^us-\d{2}$/.test(scope ?? ""),
      "scope must be the story number, e.g. us-01",
    ],
  },
};

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [usScope],
  rules: {
    "us-scope": [2, "always"],
    "scope-empty": [2, "never"],
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
