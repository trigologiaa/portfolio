function hexToRgb(hex: string): [number, number, number] {
  const shorthandHexLength: number = 3;
  const value: string = hex.replace("#", "");
  const full: string =
    value.length === shorthandHexLength
      ? value
          .split("")
          .map((char: string) => char + char)
          .join("")
      : value;
  const colorInteger: number = parseInt(full, 16);
  return [
    (colorInteger >> 16) & 255,
    (colorInteger >> 8) & 255,
    colorInteger & 255,
  ];
}

function channel(value: number): number {
  const maxRgbValue: number = 255;
  const srgbThreshold: number = 0.03928;
  const linearDivisor: number = 12.92;
  const curveOffset: number = 0.055;
  const curveDenominator: number = 1.055;
  const gamma: number = 2.4;
  const normalizedChannel: number = value / maxRgbValue;
  return normalizedChannel <= srgbThreshold
    ? normalizedChannel / linearDivisor
    : ((normalizedChannel + curveOffset) / curveDenominator) ** gamma;
}

function relativeLuminance(hex: string): number {
  const redLuminanceCoefficient: number = 0.2126;
  const greenLuminanceCoefficient: number = 0.7152;
  const blueLuminanceCoefficient: number = 0.0722;
  const [red, green, blue]: [number, number, number] = hexToRgb(hex);
  return (
    redLuminanceCoefficient * channel(red) +
    greenLuminanceCoefficient * channel(green) +
    blueLuminanceCoefficient * channel(blue)
  );
}

export function contrastRatio(foreground: string, background: string): number {
  const luminanceOffset: number = 0.05;
  const foregroundLuminance: number = relativeLuminance(foreground);
  const backgroundLuminance: number = relativeLuminance(background);
  const lighter: number = Math.max(foregroundLuminance, backgroundLuminance);
  const darker: number = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + luminanceOffset) / (darker + luminanceOffset);
}
