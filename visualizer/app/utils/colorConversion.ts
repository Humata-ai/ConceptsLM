export interface LABColor {
  l: number; // 0-100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * Converts L*A*B* color to RGB
 * Returns null if the color is out of sRGB gamut
 */
export function labToRgb(lab: LABColor): RGBColor | null {
  // Step 1: LAB to XYZ
  // Reference white point D65
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  let y = (lab.l + 16) / 116;
  let x = lab.a / 500 + y;
  let z = y - lab.b / 200;

  // Convert using inverse function
  const delta = 6 / 29;
  const deltaSquared = delta * delta;
  const deltaCubed = delta * delta * delta;

  x = x > delta ? x * x * x : 3 * deltaSquared * (x - 4 / 29);
  y = y > delta ? y * y * y : 3 * deltaSquared * (y - 4 / 29);
  z = z > delta ? z * z * z : 3 * deltaSquared * (z - 4 / 29);

  x *= refX;
  y *= refY;
  z *= refZ;

  // Step 2: XYZ to linear RGB (sRGB color space)
  // Using sRGB transformation matrix
  let rLinear = (x * 3.2406 + y * -1.5372 + z * -0.4986) / 100;
  let gLinear = (x * -0.9689 + y * 1.8758 + z * 0.0415) / 100;
  let bLinear = (x * 0.0557 + y * -0.2040 + z * 1.0570) / 100;

  // Check if out of gamut BEFORE gamma correction
  // Valid sRGB range is 0.0 to 1.0 (with small tolerance for floating point errors)
  const tolerance = 0.001;
  if (rLinear < -tolerance || rLinear > 1 + tolerance ||
      gLinear < -tolerance || gLinear > 1 + tolerance ||
      bLinear < -tolerance || bLinear > 1 + tolerance) {
    return null; // Out of gamut
  }

  // Step 3: Apply sRGB gamma correction
  const gammaCorrect = (c: number): number => {
    if (c <= 0.0031308) {
      return 12.92 * c;
    } else {
      return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
  };

  const r = gammaCorrect(rLinear);
  const g = gammaCorrect(gLinear);
  const b = gammaCorrect(bLinear);

  // Final check and convert to 0-255 range
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255)))
  };
}

/**
 * Checks if a L*A*B* color is within sRGB gamut
 */
export function isInGamut(lab: LABColor): boolean {
  return labToRgb(lab) !== null;
}

/**
 * Converts RGB to hex color string
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16).padStart(2, '0');
    return hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Maps 3D coordinates to L*A*B* color
 * Based on axis mapping: X=A*, Y=L*, Z=B*
 */
export function labFromCoordinates(x: number, y: number, z: number): LABColor {
  return {
    l: y, // Y axis = L* (lightness)
    a: x, // X axis = A* (green-red)
    b: z  // Z axis = B* (blue-yellow)
  };
}
