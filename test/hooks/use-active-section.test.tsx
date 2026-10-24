// @vitest-environment jsdom

import { act, type RenderResult, render, screen } from "@testing-library/react";
import type { JSX } from "react/jsx-runtime";
import { describe, expect, it } from "vitest";
import { useActiveSection } from "@/hooks/use-active-section";
import { MockIntersectionObserver } from "../helpers/mock-intersection-observer";

function Probe(): JSX.Element {
  const active: string | null = useActiveSection(["about", "stack"]);
  return <p>active: {active ?? "none"}</p>;
}

function renderWithSections(): RenderResult {
  document.body.innerHTML = `<section id="about"></section><section id="stack"></section>`;
  return render(<Probe />);
}

function getSection(id: string): HTMLElement {
  const section: HTMLElement | null = document.getElementById(id);
  if (section === null) {
    throw new Error(`Missing section: ${id}`);
  }
  return section;
}

function getObserver(): MockIntersectionObserver {
  const observer: MockIntersectionObserver | undefined =
    MockIntersectionObserver.instances[0];
  if (observer === undefined) {
    throw new Error("No IntersectionObserver was created");
  }
  return observer;
}

describe("useActiveSection", (): void => {
  it("starts without an active section", (): void => {
    renderWithSections();
    expect(screen.getByText("active: none")).toBeInTheDocument();
  });

  it("marks the section that enters the viewport as active", (): void => {
    renderWithSections();
    const observer: MockIntersectionObserver = getObserver();
    act((): void => observer.trigger(getSection("stack"), true));
    expect(screen.getByText("active: stack")).toBeInTheDocument();
  });

  it("clears the active section when it leaves the viewport", (): void => {
    renderWithSections();
    const observer: MockIntersectionObserver = getObserver();
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
