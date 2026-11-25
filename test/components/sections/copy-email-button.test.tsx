import { screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { renderWithProviders } from "../../render-with-providers";

describe("CopyEmailButton", (): void => {
  it("copies the email and announces it in a status region", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<CopyEmailButton email="ada@example.com" />);
    await user.click(screen.getByRole("button", { name: "Copy email" }));
    expect(await navigator.clipboard.readText()).toBe("ada@example.com");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });

  it("starts with an empty status region so that the first change is announced", (): void => {
    renderWithProviders(<CopyEmailButton email="ada@example.com" />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("explains how to copy by hand and selects the address when the clipboard is not available", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied"),
    );
    renderWithProviders(<CopyEmailButton email="ada@example.com" />);
    await user.click(screen.getByRole("button", { name: "Copy email" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Press Ctrl+C (⌘C on Mac) to copy it",
    );
    expect(window.getSelection()?.toString()).toBe("ada@example.com");
  });

  it("translates the texts", async (): Promise<void> => {
    const user: UserEvent = userEvent.setup();
    renderWithProviders(<CopyEmailButton email="ada@example.com" />, {
      locale: "es",
    });
    await user.click(screen.getByRole("button", { name: "Copiar email" }));
    expect(screen.getByRole("status")).toHaveTextContent("Copiado");
  });
});
