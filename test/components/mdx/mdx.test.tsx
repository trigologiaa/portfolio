// @vitest-environment node

import { compileMDX } from "next-mdx-remote/rsc";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { mdxComponents } from "@/components/mdx/mdx-components";

async function render(source: string): Promise<string> {
  const { content } = await compileMDX({ source, components: mdxComponents });
  return renderToStaticMarkup(content);
}

vi.mock(
  "@/i18n/navigation",
  async () => import("../../helpers/navigation-mock"),
);

describe("mdx content", (): void => {
  it("renders markdown with the registered components", async (): Promise<void> => {
    const html: string = await render(
      "Hello **world**, see [my site](https://example.com).",
    );
    expect(html).toContain('<strong class="font-semibold">world</strong>');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("fails loudly when the content uses a component that is not registered", async (): Promise<void> => {
    await expect(render("<Mystery />")).rejects.toThrow(/Mystery/);
  });
});
