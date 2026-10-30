import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ReactElement } from "react";
import { MdxLink } from "./mdx-link";

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  p: (props: ComponentProps<"p">): ReactElement => (
    <p className="mb-4 leading-7 last:mb-0" {...props} />
  ),
  ul: (props: ComponentProps<"ul">): ReactElement => (
    <ul className="mb-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: ComponentProps<"ol">): ReactElement => (
    <ol className="mb-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  strong: (props: ComponentProps<"strong">): ReactElement => (
    <strong className="font-semibold" {...props} />
  ),
};
