import { act, type RenderResult, render, screen } from "@testing-library/react";
import type { JSX } from "react/jsx-runtime";
import { describe, expect, it } from "vitest";
import { useActiveSection } from "@/hooks/use-active-section";
import type { MockIntersectionObserver } from "../helpers/mock-intersection-observer";
import { getLatestObserver, getSection } from "../helpers/observer-dom";

function Probe(): JSX.Element {
  const active: string | null = useActiveSection(["about", "stack"]);
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

  it("marks the section that enters the viewport as active", (): void => {
    renderWithSections();
    const observer: MockIntersectionObserver = getLatestObserver();
    act((): void => observer.trigger(getSection("stack"), true));
    expect(screen.getByText("active: stack")).toBeInTheDocument();
  });

  it("clears the active section when it leaves the viewport", (): void => {
    renderWithSections();
    const observer: MockIntersectionObserver = getLatestObserver();
    const about: HTMLElement = getSection("about");
    act((): void => observer.trigger(about, true));
    act((): void => observer.trigger(about, false));
    expect(screen.getByText("active: none")).toBeInTheDocument();
  });

  it("ignores ids that are not in the document", (): void => {
    document.body.innerHTML = "";
    render(<Probe />);
    expect(screen.getByText("active: none")).toBeInTheDocument();
  });
});
