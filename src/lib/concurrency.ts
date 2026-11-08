export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array<R>(items.length);
  const queue: IterableIterator<[number, T]> = items.entries();
  async function worker(): Promise<void> {
    for (const [index, item] of queue) {
      results[index] = await task(item, index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}
