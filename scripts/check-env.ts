import { loadEnvConfig } from "@next/env";
import {
  type GithubConfigResult,
  readGithubConfig,
} from "@/features/projects/github/config";

loadEnvConfig(process.cwd());

const result: GithubConfigResult = readGithubConfig(process.env);

if (!result.ok) {
  console.error(`Missing environment variables: ${result.missing.join(", ")}`);
  console.error(
    "Copy .env.example to .env.local and fill them in (or set GH_DATA_SOURCE=fixture)",
  );
  process.exit(1);
}

console.log("Environment OK");
