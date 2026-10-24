import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

interface MiddlewareConfig {
  matcher: string | readonly string[];
}

export default createMiddleware(routing);

export const config: MiddlewareConfig = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
