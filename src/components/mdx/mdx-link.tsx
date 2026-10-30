import type { ComponentProps, ReactElement } from "react";
import { Link } from "@/i18n/navigation";

const linkClass: string =
  "font-medium text-primary underline underline-offset-4 hover:no-underline";

export function MdxLink({
  href = "",
  children,
  ...props
}: ComponentProps<"a">): ReactElement {
  if (/^https?:\/\//.test(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        {...props}
      >
        {children}
      </a>
    );
  }
  if (href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={linkClass} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}
