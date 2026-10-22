export interface Tokens {
  [key: string]: string;
}

export const flavors: [string, string, string, string] = [
  "latte",
  "frappe",
  "macchiato",
  "mocha",
] as const;

export type Flavor = (typeof flavors)[number];

interface Block {
  selectors: string[];
  declarations: Tokens;
}

const CSS_COMMENTS_REGEX: RegExp = /\/\*[\s\S]*?\*\//g;
const CSS_BLOCK_REGEX: RegExp = /([^{}]+)\{([^{}]*)\}/g;
const CSS_VARIABLE_REGEX: RegExp = /--([\w-]+):\s*([^;]+);/g;
const MULTIPLE_WHITESPACE_REGEX: RegExp = /\s+/g;
const CSS_VAR_REFERENCE_REGEX: RegExp = /^var\(--([\w-]+)\)$/;
const HEX_COLOR_REGEX: RegExp = /^#[0-9a-fA-F]{6}$/;
const MAX_RECURSION_DEPTH: number = 10;

function parseSelectors(rawSelectors: string): string[] {
  return rawSelectors
    .split(",")
    .map((selector: string) => selector.trim())
    .filter(Boolean);
}

function parseDeclarations(rawDeclarations: string): Tokens {
  const declarations: Tokens = {};
  const cssVariableMatches: RegExpStringIterator<RegExpExecArray> =
    rawDeclarations.matchAll(CSS_VARIABLE_REGEX);
  for (const declaration of cssVariableMatches) {
    const customProperty: string | undefined = declaration[1];
    const propertyValue: string | undefined = declaration[2];
    if (customProperty && propertyValue) {
      declarations[customProperty] = propertyValue
        .trim()
        .replace(MULTIPLE_WHITESPACE_REGEX, " ");
    }
  }
  return declarations;
}

function extractFlavorTokens(blocks: Block[], flavor: Flavor): Tokens {
  const declared: Tokens = {};
  for (const block of blocks) {
    if (appliesTo(block.selectors, flavor)) {
      Object.assign(declared, block.declarations);
    }
  }
  return declared;
}

function parseBlocks(css: string): Block[] {
  const source: string = css.replace(CSS_COMMENTS_REGEX, "");
  const blocks: Block[] = [];
  const cssBlockMatches: RegExpStringIterator<RegExpExecArray> =
    source.matchAll(CSS_BLOCK_REGEX);
  for (const match of cssBlockMatches) {
    const rawSelectors: string | undefined = match[1];
    const rawDeclarations: string | undefined = match[2];
    if (rawSelectors && rawDeclarations !== undefined) {
      const selectors: string[] = parseSelectors(rawSelectors);
      const declarations: Tokens = parseDeclarations(rawDeclarations);
      blocks.push({ selectors, declarations });
    }
  }
  return blocks;
}

function appliesTo(selectors: string[], flavor: Flavor): boolean {
  const validSelectors: string[] = [
    ":root",
    "[data-theme]",
    `[data-theme="${flavor}"]`,
  ];
  if (flavor === "latte") {
    validSelectors.push(":root:not([data-theme])");
  }
  return selectors.some((selector: string) =>
    validSelectors.includes(selector),
  );
}

function resolve(value: string, declared: Tokens, depth: number = 0): string {
  const referenceMatch: RegExpExecArray | null =
    CSS_VAR_REFERENCE_REGEX.exec(value);
  if (!referenceMatch || depth > MAX_RECURSION_DEPTH) {
    return value;
  }
  const customProperty: string | undefined = referenceMatch[1];
  if (!customProperty) {
    return value;
  }
  return resolve(declared[customProperty] ?? value, declared, depth + 1);
}

export function resolveFlavor(css: string, flavor: Flavor): Tokens {
  const blocks: Block[] = parseBlocks(css);
  const declared: Tokens = extractFlavorTokens(blocks, flavor);
  const resolved: Tokens = {};
  const entries: [string, string][] = Object.entries(declared);
  for (const [name, value] of entries) {
    const result: string = resolve(value, declared);
    if (HEX_COLOR_REGEX.test(result)) {
      resolved[name] = result;
    }
  }
  return resolved;
}
