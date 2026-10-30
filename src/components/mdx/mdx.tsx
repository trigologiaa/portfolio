import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import { mdxComponents } from "./mdx-components";

export function Mdx({ source }: { source: string }): ReactElement {
  return <MDXRemote source={source} components={mdxComponents} />;
}
