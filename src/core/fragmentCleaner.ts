import { HalftoneDot } from './types';
import { IrregularShape } from './circleNormalizer';

/**
 * Filters out tiny fragments, specks, and stray anchor artifacts
 */
export function removeTinyFragments(
  dots: HalftoneDot[],
  minDiameterThreshold: number
): { cleanDots: HalftoneDot[]; removedCount: number } {
  const minRadius = Math.max(0.1, minDiameterThreshold / 2);
  const cleanDots: HalftoneDot[] = [];
  let removedCount = 0;

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    if (dot.radius < minRadius || isNaN(dot.radius) || !isFinite(dot.radius)) {
      removedCount++;
    } else {
      cleanDots.push(dot);
    }
  }

  return { cleanDots, removedCount };
}

/**
 * Filters vector shape candidates that fall below the minimum area/dimension threshold
 */
export function filterVectorFragments(
  shapes: IrregularShape[],
  minAreaThreshold: number
): { cleanShapes: IrregularShape[]; removedCount: number } {
  const cleanShapes: IrregularShape[] = [];
  let removedCount = 0;

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    if (shape.area < minAreaThreshold || (shape.width < 1.0 && shape.height < 1.0)) {
      removedCount++;
    } else {
      cleanShapes.push(shape);
    }
  }

  return { cleanShapes, removedCount };
}

/**
 * Eliminates duplicate dots situated at essentially identical coordinates
 */
export function removeDuplicateDots(
  dots: HalftoneDot[],
  tolerance: number = 0.5
): { uniqueDots: HalftoneDot[]; duplicatesCount: number } {
  const uniqueDots: HalftoneDot[] = [];
  const seenMap = new Map<string, boolean>();
  let duplicatesCount = 0;

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const key = `${Math.round(dot.x / tolerance)},${Math.round(dot.y / tolerance)}`;
    if (seenMap.has(key)) {
      duplicatesCount++;
    } else {
      seenMap.set(key, true);
      uniqueDots.push(dot);
    }
  }

  return { uniqueDots, duplicatesCount };
}
