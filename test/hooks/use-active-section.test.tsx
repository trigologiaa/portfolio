// @vitest-environment jsdom

import { type RenderResult, render, screen } from "@testing-library/react";
import type { JSX } from "react/jsx-runtime";
import { describe, expect, it } from "vitest";
import { useActiveSection } from "@/hooks/use-active-section";

function Probe(): JSX.Element {
  const active = useActiveSection(["about", "stack"]);
  return <p>active: {active ?? "none"}</p>;
}

function renderWithSections(): RenderResult {
  document.body.innerHTML = `<section id="about"></section><section id="stack"></section>`;
  return render(<Probe />);
}

describe("useActiveSection", (): void => {
  it("starts without an active section", (): void => {
    renderWithSections();
    expect(screen.getByText("active: none")).toBeInTheDocument();
  });
});
