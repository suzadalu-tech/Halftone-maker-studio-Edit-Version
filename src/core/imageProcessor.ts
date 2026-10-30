import { HalftoneSettings } from './types';
import { calculateLuminance } from './luminance';

export interface ProcessedImageData {
  width: number;
  height: number;
  luminanceMap: Float32Array; // values in [0, 1]
  edgeMap: Float32Array;      // edge magnitude in [0, 1]
  previewCanvas: HTMLCanvasElement;
}

/**
 * Applies brightness, contrast, gamma, invert, and threshold to an ImageData buffer
 */
export function applyImageAdjustments(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: HalftoneSettings
): ImageData {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const { brightness, contrast, gamma, invert, threshold, grayscale } = settings;

  // Pre-calculate contrast factor
  // contrast: -100 to 100 -> factor: 0 to ~3
  const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const invGamma = 1 / Math.max(0.01, gamma);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const a = data[i + 3];

    // Grayscale
    if (grayscale) {
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      r = gray;
      g = gray;
      b = gray;
    }

    // Brightness (-100 to +100)
    if (brightness !== 0) {
      r += (brightness * 255) / 100;
      g += (brightness * 255) / 100;
      b += (brightness * 255) / 100;
    }

    // Contrast
    if (contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;
    }

    // Clamp
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Gamma
    if (gamma !== 1.0) {
      r = 255 * Math.pow(r / 255, invGamma);
      g = 255 * Math.pow(g / 255, invGamma);
      b = 255 * Math.pow(b / 255, invGamma);
    }

    // Invert
    if (invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    // Threshold (0 = disabled, 1..100 = hard cutoff)
    if (threshold > 0) {
      const cut = (threshold * 255) / 100;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const val = lum >= cut ? 255 : 0;
      r = val;
      g = val;
      b = val;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }

  return imgData;
}

/**
 * Builds high-performance Luminance & Edge maps from an image source
 */
export function buildLuminanceAndEdgeMap(
  imgData: ImageData,
  width: number,
  height: number
): { luminanceMap: Float32Array; edgeMap: Float32Array } {
  const size = width * height;
  const luminanceMap = new Float32Array(size);
  const edgeMap = new Float32Array(size);
  const data = imgData.data;

  // 1. Fill luminance
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    // If alpha is transparent, treat as white (no dot)
    if (data[i + 3] < 10) {
      luminanceMap[p] = 1.0;
    } else {
      luminanceMap[p] = calculateLuminance(data[i], data[i + 1], data[i + 2]);
    }
  }

  // 2. Sobel edge detection for edge-aware sampling
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      // Sobel kernel X
      const gx =
        -luminanceMap[(y - 1) * width + (x - 1)] +
        luminanceMap[(y - 1) * width + (x + 1)] -
        2 * luminanceMap[y * width + (x - 1)] +
        2 * luminanceMap[y * width + (x + 1)] -
        luminanceMap[(y + 1) * width + (x - 1)] +
        luminanceMap[(y + 1) * width + (x + 1)];

      // Sobel kernel Y
      const gy =
        -luminanceMap[(y - 1) * width + (x - 1)] -
        2 * luminanceMap[(y - 1) * width + x] -
        luminanceMap[(y - 1) * width + (x + 1)] +
        luminanceMap[(y + 1) * width + (x - 1)] +
        2 * luminanceMap[(y + 1) * width + x] +
        luminanceMap[(y + 1) * width + (x + 1)];

      const mag = Math.sqrt(gx * gx + gy * gy);
      edgeMap[idx] = Math.min(1.0, mag);
    }
  }

  return { luminanceMap, edgeMap };
}

/**
 * Samples luminance for a grid cell using cell-based sampling:
 * - Average: calculates mean luminance over the cell window
 * - Center: samples exact center
 * - Weighted Average: Gaussian/center-weighted
 */
export function sampleCellLuminance(
  luminanceMap: Float32Array,
  edgeMap: Float32Array,
  imgWidth: number,
  imgHeight: number,
  cx: number,
  cy: number,
  cellSize: number,
  settings: HalftoneSettings
): number {
  const { samplingMode, edgePreservation } = settings;
  const half = cellSize / 2;
  const minX = Math.max(0, Math.floor(cx - half));
  const maxX = Math.min(imgWidth - 1, Math.floor(cx + half));
  const minY = Math.max(0, Math.floor(cy - half));
  const maxY = Math.min(imgHeight - 1, Math.floor(cy + half));

  if (samplingMode === 'center') {
    const px = Math.min(imgWidth - 1, Math.max(0, Math.round(cx)));
    const py = Math.min(imgHeight - 1, Math.max(0, Math.round(cy)));
    return luminanceMap[py * imgWidth + px];
  }

  let totalLum = 0;
  let totalWeight = 0;
  let maxEdge = 0;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = y * imgWidth + x;
      const lum = luminanceMap[idx];
      const edge = edgeMap[idx];
      if (edge > maxEdge) maxEdge = edge;

      let w = 1.0;
      if (samplingMode === 'weighted') {
        const dx = x - cx;
        const dy = y - cy;
        w = Math.max(0.1, 1 - Math.sqrt(dx * dx + dy * dy) / (half * 1.414));
      }

      totalLum += lum * w;
      totalWeight += w;
    }
  }

  const avgLum = totalWeight > 0 ? totalLum / totalWeight : 1.0;

  // Edge preservation logic: if strong edge exists inside cell, favor center or high-contrast sample
  if (edgePreservation !== 'off' && maxEdge > 0.3) {
    const centerIdx =
      Math.min(imgHeight - 1, Math.max(0, Math.round(cy))) * imgWidth +
      Math.min(imgWidth - 1, Math.max(0, Math.round(cx)));
    const centerLum = luminanceMap[centerIdx];

    const weightMap: Record<string, number> = {
      low: 0.25,
      medium: 0.5,
      high: 0.75,
    };
    const blend = weightMap[edgePreservation] || 0.5;
    return avgLum * (1 - blend) + centerLum * blend;
  }

  return avgLum;
}
