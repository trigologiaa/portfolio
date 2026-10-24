import { createNavigation } from "next-intl/navigation";
import { type locales, routing } from "./routing";

type Navigation = ReturnType<typeof createNavigation<typeof locales>>;

export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
}: Navigation = createNavigation<typeof locales>(routing);
