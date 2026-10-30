import { ResponseCurve } from './types';

/**
 * Calculates standard ITU-R BT.709 perceived luminance
 * @param r Red component [0, 255]
 * @param g Green component [0, 255]
 * @param b Blue component [0, 255]
 * @returns Luminance value in [0, 1] (0 = black, 1 = white)
 */
export function calculateLuminance(r: number, g: number, b: number): number {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/**
 * Applies response curve and tone mapping to normalized luminance [0, 1]
 */
export function applyResponseCurve(
  lum: number,
  curve: ResponseCurve,
  factor: number = 1.0
): number {
  let v = Math.max(0, Math.min(1, lum));

  switch (curve) {
    case 'gamma':
      // Power curve adjustment
      v = Math.pow(v, factor);
      break;

    case 'logarithmic':
      // Compresses highlights, expands shadows
      v = Math.log(1 + 9 * v) / Math.log(10);
      if (factor !== 1.0) {
        v = Math.pow(v, factor);
      }
      break;

    case 'smoothstep':
      // Hermite interpolation for smooth roll-off
      v = v * v * (3 - 2 * v);
      if (factor !== 1.0) {
        v = Math.pow(v, factor);
      }
      break;

    case 'linear':
    default:
      if (factor !== 1.0) {
        v = Math.pow(v, factor);
      }
      break;
  }

  return Math.max(0, Math.min(1, v));
}

/**
 * Maps luminance to dot radius:
 * By default: Dark pixels (L ~ 0) -> Large dots; Bright pixels (L ~ 1) -> Small dots.
 * Invert flips this behavior.
 */
export function luminanceToRadius(
  luminance: number,
  minRadius: number,
  maxRadius: number,
  invert: boolean = false
): number {
  const norm = invert ? luminance : 1 - luminance;
  return minRadius + norm * (maxRadius - minRadius);
}
