import { describe, expect, it } from "vitest";
import { mapWithConcurrency } from "@/lib/concurrency";

const SLOW_MS: number = 30;
const FAST_MS: number = 5;
const MEDIUM_MS: number = 15;
const DOUBLED_SLOW_MS: number = SLOW_MS * 2;
const DOUBLED_FAST_MS: number = FAST_MS * 2;
const DOUBLED_MEDIUM_MS: number = MEDIUM_MS * 2;
const TASK_DELAY_MS: number = 5;
const LIMIT: number = 3;
const TASK_COUNT: number = 8;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("mapWithConcurrency", (): void => {
  it("returns the results in the same order as the input", async (): Promise<void> => {
    const result: number[] = await mapWithConcurrency(
      [SLOW_MS, FAST_MS, MEDIUM_MS],
      2,
      async (ms: number) => {
        await sleep(ms);
        return ms * 2;
      },
    );
    expect(result).toEqual([
      DOUBLED_SLOW_MS,
      DOUBLED_FAST_MS,
      DOUBLED_MEDIUM_MS,
    ]);
  });

  it("never runs more tasks at the same time than the limit", async (): Promise<void> => {
    const items: number[] = Array.from(
      { length: TASK_COUNT },
      (_, index) => index,
    );
    let running: number = 0;
    let peak: number = 0;
    await mapWithConcurrency(items, LIMIT, async () => {
      running++;
      peak = Math.max(peak, running);
      await sleep(TASK_DELAY_MS);
      running--;
    });
    expect(peak).toBeLessThanOrEqual(LIMIT);
    expect(peak).toBeGreaterThan(1);
  });

  it("handles an empty list", async (): Promise<void> => {
    expect(await mapWithConcurrency([], LIMIT, async (x: number) => x)).toEqual(
      [],
    );
  });
});
