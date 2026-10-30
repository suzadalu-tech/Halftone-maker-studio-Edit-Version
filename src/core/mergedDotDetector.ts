import { HalftoneDot, HalftoneSettings } from './types';
import { IrregularShape } from './circleNormalizer';

export interface MergedRegion {
  bounds: { x: number; y: number; width: number; height: number };
  estimatedDotCount: number;
  shape?: IrregularShape;
}

/**
 * Identifies regions where dots have clumped or merged into complex vector islands
 */
export function detectMergedRegions(
  shapes: IrregularShape[],
  expectedCellSize: number,
  expectedMaxRadius: number
): MergedRegion[] {
  const maxSingleDotArea = Math.PI * expectedMaxRadius * expectedMaxRadius;
  const mergedRegions: MergedRegion[] = [];

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];

    // Clues: Area noticeably bigger than 1.5x of max dot, or extreme aspect ratio with high area
    const isOverArea = shape.area > maxSingleDotArea * 1.4;
    const isWideOrTall = shape.width > expectedCellSize * 1.6 || shape.height > expectedCellSize * 1.6;
    const hasDistortedPerimeter = shape.circularity < 0.65 && shape.area > maxSingleDotArea * 0.8;

    if (isOverArea || (isWideOrTall && hasDistortedPerimeter)) {
      const estimatedDots = Math.max(2, Math.round(shape.area / (maxSingleDotArea * 0.75)));
      mergedRegions.push({
        bounds: {
          x: shape.cx - shape.width / 2,
          y: shape.cy - shape.height / 2,
          width: shape.width,
          height: shape.height,
        },
        estimatedDotCount: estimatedDots,
        shape,
      });
    }
  }

  return mergedRegions;
}

/**
 * Reconstructs a local sub-grid of dots for a merged region using local luminance/image sampling,
 * guaranteeing clean circular dots with collision prevention instead of jagged merged blobs.
 */
export function reconstructMergedRegionDots(
  region: MergedRegion,
  sampleLuminanceFn: (x: number, y: number) => number,
  settings: HalftoneSettings
): HalftoneDot[] {
  const reconstructed: HalftoneDot[] = [];
  const { cellSize, minDotSize, maxDotSize, minGap, invert } = settings;

  const startX = Math.floor(region.bounds.x / cellSize) * cellSize;
  const endX = region.bounds.x + region.bounds.width;
  const startY = Math.floor(region.bounds.y / cellSize) * cellSize;
  const endY = region.bounds.y + region.bounds.height;

  const minRadius = Math.max(0, minDotSize / 2);
  const maxRadius = Math.max(minRadius + 0.1, maxDotSize / 2);

  for (let y = startY; y <= endY; y += cellSize) {
    for (let x = startX; x <= endX; x += cellSize) {
      const lum = sampleLuminanceFn(x, y);
      const factor = invert ? lum : 1 - lum;
      let radius = minRadius + factor * (maxRadius - minRadius);

      // Clamp so radius + minGap respects cell boundaries
      const maxPossibleRadius = Math.max(0.1, (cellSize - minGap) / 2);
      radius = Math.min(radius, maxPossibleRadius);

      if (radius > 0.2) {
        reconstructed.push({
          x,
          y,
          radius,
          luminance: lum,
          isNormalized: true,
          originalShape: 'reconstructed_merged_region',
        });
      }
    }
  }

  return reconstructed;
}
