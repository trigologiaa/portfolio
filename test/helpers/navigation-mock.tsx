import type { ComponentProps, ReactElement } from "react";

export function Link({
  href,
  children,
  ...props
}: ComponentProps<"a"> & { href: string }): ReactElement {
  return (
    <a href="href" {...props}>
      {children}
    </a>
  );
}

export const usePathname = (): string => "/";
export const useRouter = (): { replace: () => void; push: () => void } => ({
  replace: (): void => {},
  push: (): void => {},
});
export const redirect = (): void => {};
export const getPathname = ({ href }: { href: string }): string => href;
