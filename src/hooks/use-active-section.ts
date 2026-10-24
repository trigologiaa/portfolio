"use client";

import { useState } from "react";

export function useActiveSection(ids: readonly string[]): string | null {
  const [active] = useState<string | null>(null);
  void ids;
  return active;
}
