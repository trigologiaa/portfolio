type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

export class MockIntersectionObserver {
  private readonly callback: ObserverCallback;
  private readonly elements: Set<Element> = new Set<Element>();
  public static instances: MockIntersectionObserver[] = [];

  public constructor(callback: ObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  public observe(element: Element): void {
    this.elements.add(element);
  }

  public unobserve(element: Element): void {
    this.elements.delete(element);
  }

  public disconnect(): void {
    this.elements.clear();
  }

  public takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  public trigger(target: Element, isIntersecting: boolean): void {
    this.callback([{ target, isIntersecting }]);
  }

  public static clearInstances(): void {
    MockIntersectionObserver.instances = [];
  }
}
