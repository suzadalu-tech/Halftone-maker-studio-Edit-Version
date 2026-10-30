import { NormalizationMode } from './types';

export interface IrregularShape {
  id?: string | number;
  cx: number;
  cy: number;
  width: number;
  height: number;
  area: number;
  perimeter: number;
  pathPointsCount?: number;
  circularity: number; // 4 * PI * Area / (Perimeter^2)
  isLikelyDot: boolean;
  isMergedCandidate?: boolean;
}

export interface NormalizedCircle {
  cx: number;
  cy: number;
  radius: number;
  originalShapeId?: string | number;
  circularityBefore: number;
}

/**
 * Calculates circularity metric = 4 * PI * Area / (Perimeter ^ 2)
 * A true circle = 1.0; squares ~ 0.785; irregular / jagged shapes < 0.7
 */
export function calculateCircularity(area: number, perimeter: number): number {
  if (perimeter <= 0 || area <= 0) return 0;
  return Math.min(1.0, (4 * Math.PI * area) / (perimeter * perimeter));
}

/**
 * Evaluates whether an arbitrary vector shape is a candidate for dot replacement
 */
export function evaluateShapeCandidate(
  shape: {
    cx: number;
    cy: number;
    width: number;
    height: number;
    area: number;
    perimeter: number;
    pathPointsCount?: number;
  },
  circularityThreshold: number = 0.85,
  minDiameter: number = 1.0,
  maxDiameter: number = 50.0
): IrregularShape {
  const circularity = calculateCircularity(shape.area, shape.perimeter);
  const avgDim = (shape.width + shape.height) / 2;
  const aspectRatio = shape.width > 0 && shape.height > 0 ? shape.width / shape.height : 1;

  // Check if dimensions are within dot bounds
  const withinSizeBounds = avgDim >= minDiameter && avgDim <= maxDiameter;
  // Aspect ratio not excessively skewed
  const reasonableAspect = aspectRatio >= 0.4 && aspectRatio <= 2.5;

  // Check for merged candidate indicators
  const isMergedCandidate =
    shape.area > Math.PI * Math.pow(maxDiameter / 2, 2) * 1.4 ||
    aspectRatio > 2.0 ||
    aspectRatio < 0.5 ||
    (shape.pathPointsCount !== undefined && shape.pathPointsCount > 24);

  const isLikelyDot = withinSizeBounds && reasonableAspect && !isMergedCandidate;

  return {
    ...shape,
    circularity,
    isLikelyDot,
    isMergedCandidate,
  };
}

/**
 * Normalizes an irregular or distorted shape into a mathematically perfect circle
 */
export function normalizeToPerfectCircle(
  shape: IrregularShape,
  mode: NormalizationMode = 'preserve_area'
): NormalizedCircle {
  let radius: number;

  if (mode === 'preserve_area') {
    // R = sqrt(Area / PI)
    radius = Math.sqrt(Math.max(0.1, shape.area) / Math.PI);
  } else {
    // Preserve average diameter: R = (W + H) / 4
    radius = (shape.width + shape.height) / 4;
  }

  // Width and height MUST be strictly 2 * R
  return {
    cx: shape.cx,
    cy: shape.cy,
    radius: Math.max(0.2, radius),
    originalShapeId: shape.id,
    circularityBefore: shape.circularity,
  };
}
