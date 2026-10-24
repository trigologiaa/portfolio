import type messages from "../../messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    messages: typeof messages;
  }
}
