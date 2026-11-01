import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  StackIcon,
  stackIconColors,
  stackIcons,
} from "@/components/icons/stack-icons";
import { iconKeys } from "@/lib/content/icon-keys";

describe("stack icons", (): void => {
  it("registers an icon for every valid key", (): void => {
    expect(Object.keys(stackIcons).sort()).toEqual([...iconKeys].sort());
  });

  it("renders an svg that is hidden from assistive technology", (): void => {
    const { container } = render(<StackIcon name="react" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("paints brand icons with their color and leaves the rest to inherit", (): void => {
    const brand = render(<StackIcon name="react" />).container.querySelector(
      "svg",
    );
    expect(brand).toHaveAttribute("color", stackIconColors.react);
    const plain = render(<StackIcon name="github" />).container.querySelector(
      "svg",
    );
    expect(plain).not.toHaveAttribute("color", expect.stringMatching(/^#/));
  });
});
