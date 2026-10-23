import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return (): void => {};
}

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    (): boolean => true,
    (): boolean => false,
  );
}
