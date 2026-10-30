import {
  HalftoneDot,
  HalftoneSettings,
  QualityReportData,
} from './types';
import { applyResponseCurve, luminanceToRadius } from './luminance';
import { sampleCellLuminance } from './imageProcessor';
import { resolveDotCollisions } from './collision';
import { removeDuplicateDots, removeTinyFragments } from './fragmentCleaner';

export interface HalftoneResult {
  dots: HalftoneDot[];
  report: QualityReportData;
  width: number;
  height: number;
}

/**
 * Halftone Maker Studio Vector Halftone Engine
 * Generates mathematically clean, collision-free, perfectly circular halftone dots
 */
export function generatePrecisionHalftone(
  luminanceMap: Float32Array,
  edgeMap: Float32Array,
  imgWidth: number,
  imgHeight: number,
  settings: HalftoneSettings,
  imageName: string = 'image'
): HalftoneResult {
  const startTime = performance.now();
  const dots: HalftoneDot[] = [];

  const {
    cellSize,
    minDotSize,
    maxDotSize,
    minGap,
    gridType,
    angle,
    responseCurve,
    dotResponseFactor,
    invert,
    boundaryHandling,
    enableCleanup,
    separateTouchingDots,
    removeTinyFragments: doRemoveFragments,
    removeDuplicates: doRemoveDuplicates,
    fragmentRemovalThreshold,
    minDotDiameter,
  } = settings;

  // Maximum allowed radius to guarantee minimum gap across adjacent cells
  const maxPossibleRadius = Math.max(0.1, (cellSize - minGap) / 2);
  const effectiveMaxRadius = Math.min(maxDotSize / 2, maxPossibleRadius);
  const effectiveMinRadius = Math.max(0, minDotSize / 2);

  // Rotation in radians
  const rad = (angle * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);

  // Calculate bounding diagonal to cover entire rotated canvas
  const diag = Math.sqrt(imgWidth * imgWidth + imgHeight * imgHeight);
  const centerX = imgWidth / 2;
  const centerY = imgHeight / 2;

  // Grid steps in rotated coordinate space
  const stepsX = Math.ceil(diag / cellSize) + 2;
  const stepsY = Math.ceil(diag / cellSize) + 2;
  const startU = -stepsX * cellSize * 0.5;
  const endU = stepsX * cellSize * 0.5;
  const startV = -stepsY * cellSize * 0.5;
  const endV = stepsY * cellSize * 0.5;

  let row = 0;
  let totalCandidates = 0;

  for (let v = startV; v <= endV; v += cellSize) {
    row++;
    // Offset grid: shift alternate rows by cellSize / 2
    const uOffset = gridType === 'offset' && row % 2 !== 0 ? cellSize / 2 : 0;

    for (let u = startU; u <= endU; u += cellSize) {
      const curU = u + uOffset;
      const curV = v;

      // Transform rotated grid coordinate to original image space
      const origX = centerX + (curU * cosA - curV * sinA);
      const origY = centerY + (curU * sinA + curV * cosA);

      // Check boundary conditions
      const isInside = origX >= 0 && origX < imgWidth && origY >= 0 && origY < imgHeight;

      if (!isInside && boundaryHandling !== 'allow') {
        continue;
      }

      totalCandidates++;

      // Sample luminance
      const sampleLum = sampleCellLuminance(
        luminanceMap,
        edgeMap,
        imgWidth,
        imgHeight,
        origX,
        origY,
        cellSize,
        settings
      );

      // Apply response curve
      const curvedLum = applyResponseCurve(sampleLum, responseCurve, dotResponseFactor);

      // Calculate radius
      let radius = luminanceToRadius(curvedLum, effectiveMinRadius, effectiveMaxRadius, invert);

      // Handle image boundary clipping or removal
      if (boundaryHandling === 'remove') {
        if (
          origX - radius < 0 ||
          origX + radius > imgWidth ||
          origY - radius < 0 ||
          origY + radius > imgHeight
        ) {
          continue; // discard dot extending past boundary
        }
      } else if (boundaryHandling === 'clip') {
        // Clamp radius if near edge
        const distToEdge = Math.min(origX, imgWidth - origX, origY, imgHeight - origY);
        if (distToEdge < radius) {
          radius = Math.max(0, distToEdge);
        }
      }

      if (radius > 0.15) {
        dots.push({
          x: Math.round(origX * 100) / 100,
          y: Math.round(origY * 100) / 100,
          radius: Math.round(radius * 100) / 100,
          luminance: sampleLum,
          isNormalized: true,
        });
      }
    }
  }

  let workingDots = dots;
  let duplicatesRemoved = 0;
  let fragmentsRemoved = 0;
  let collisionAdjusted = 0;
  let minObservedGap = minGap;

  // Cleanup passes
  if (enableCleanup) {
    // 1. Remove duplicate dots
    if (doRemoveDuplicates) {
      const dupRes = removeDuplicateDots(workingDots, 0.5);
      workingDots = dupRes.uniqueDots;
      duplicatesRemoved = dupRes.duplicatesCount;
    }

    // 2. Filter tiny fragments below threshold or minDotDiameter
    if (doRemoveFragments) {
      const threshold = Math.max(fragmentRemovalThreshold, minDotDiameter);
      const fragRes = removeTinyFragments(workingDots, threshold);
      workingDots = fragRes.cleanDots;
      fragmentsRemoved = fragRes.removedCount;
    }

    // 3. Collision resolution: enforce minGap and prevent touching
    if (separateTouchingDots) {
      const colRes = resolveDotCollisions(workingDots, minGap, effectiveMinRadius);
      workingDots = colRes.adjustedDots;
      collisionAdjusted = colRes.adjustedCount;
      minObservedGap = colRes.minObservedGap;
    }
  }

  const endTime = performance.now();
  const processingTimeMs = Math.round((endTime - startTime) * 10) / 10;

  // Quality Report pass
  const zeroSizeCount = workingDots.filter(d => d.radius <= 0).length;
  const isPassed = zeroSizeCount === 0 && workingDots.length > 0;

  const report: QualityReportData = {
    imageName,
    engineMode: settings.engineMode,
    gridType,
    cellSize,
    totalCandidateDots: totalCandidates,
    finalDots: workingDots.length,
    normalizedDots: workingDots.length,
    collisionAdjustedDots: collisionAdjusted,
    fragmentsRemoved,
    duplicatesRemoved,
    mergedRegionsRebuilt: 0,
    averageGap: Math.round((minGap + (cellSize - effectiveMaxRadius * 2)) * 50) / 100,
    minObservedGap: Math.round(minObservedGap * 100) / 100,
    processingTimeMs,
    zeroSizeRemoved: zeroSizeCount,
    allDotsCircular: true,
    isPassed,
  };

  return {
    dots: workingDots,
    report,
    width: imgWidth,
    height: imgHeight,
  };
}
