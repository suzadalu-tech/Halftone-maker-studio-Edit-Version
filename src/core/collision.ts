import { HalftoneDot } from './types';

/**
 * Spatial Grid for fast O(1) neighbor collision lookup
 */
class SpatialGrid {
  private cellSize: number;
  private grid: Map<string, number[]>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  private key(cellX: number, cellY: number): string {
    return `${cellX},${cellY}`;
  }

  insert(index: number, x: number, y: number) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const k = this.key(cx, cy);
    let list = this.grid.get(k);
    if (!list) {
      list = [];
      this.grid.set(k, list);
    }
    list.push(index);
  }

  getNeighbors(x: number, y: number): number[] {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const results: number[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const k = this.key(cx + dx, cy + dy);
        const list = this.grid.get(k);
        if (list) {
          for (let i = 0; i < list.length; i++) {
            results.push(list[i]);
          }
        }
      }
    }
    return results;
  }
}

/**
 * Enforces minimum gap and prevents touching or overlapping circles.
 * Keeps grid center positions completely fixed (never moves center points).
 * Adjusts radii proportionally or clamps them so that:
 * dist(c1, c2) >= r1 + r2 + minGap
 */
export function resolveDotCollisions(
  dots: HalftoneDot[],
  minGap: number,
  minAllowedRadius: number = 0
): { adjustedDots: HalftoneDot[]; adjustedCount: number; minObservedGap: number } {
  if (dots.length === 0) {
    return { adjustedDots: [], adjustedCount: 0, minObservedGap: 0 };
  }

  // Find max radius to configure spatial grid cell size
  let maxR = 1;
  for (let i = 0; i < dots.length; i++) {
    if (dots[i].radius > maxR) maxR = dots[i].radius;
  }
  const gridCellSize = Math.max(8, (maxR * 2 + minGap) * 1.2);
  const spatial = new SpatialGrid(gridCellSize);

  // Clone dots
  const workingDots: HalftoneDot[] = dots.map((d, idx) => ({
    ...d,
    id: idx,
    isAdjustedForCollision: false,
  }));

  for (let i = 0; i < workingDots.length; i++) {
    spatial.insert(i, workingDots[i].x, workingDots[i].y);
  }

  let adjustedCount = 0;
  let minObservedGap = Infinity;

  // Run up to 2 relaxation passes for optimal radius stabilization
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < workingDots.length; i++) {
      const dotA = workingDots[i];
      if (dotA.radius <= 0) continue;

      const neighborIndices = spatial.getNeighbors(dotA.x, dotA.y);

      for (let k = 0; k < neighborIndices.length; k++) {
        const j = neighborIndices[k];
        if (j <= i) continue; // Only process pairs once

        const dotB = workingDots[j];
        if (dotB.radius <= 0) continue;

        const dx = dotB.x - dotA.x;
        const dy = dotB.y - dotA.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist === 0) {
          // Exactly coincident duplicate dot! Remove one
          dotB.radius = 0;
          adjustedCount++;
          continue;
        }

        const currentGap = dist - (dotA.radius + dotB.radius);
        if (currentGap < minObservedGap) {
          minObservedGap = currentGap;
        }

        const requiredDist = dotA.radius + dotB.radius + minGap;

        if (dist < requiredDist) {
          // Dots touch or violate minimum gap
          const deficit = requiredDist - dist;

          // Available space between centers minus gap
          const availableSpace = Math.max(0, dist - minGap);

          // Proportionally scale radii to fit within available space
          const sumRadii = dotA.radius + dotB.radius;
          if (sumRadii > 0) {
            const scale = availableSpace / sumRadii;
            const newRadiusA = Math.max(minAllowedRadius, dotA.radius * scale);
            const newRadiusB = Math.max(minAllowedRadius, dotB.radius * scale);

            if (newRadiusA !== dotA.radius || newRadiusB !== dotB.radius) {
              dotA.radius = newRadiusA;
              dotB.radius = newRadiusB;
              dotA.isAdjustedForCollision = true;
              dotB.isAdjustedForCollision = true;
              adjustedCount++;
            }
          }
        }
      }
    }
  }

  // Filter out any dots shrunk to zero or less than minAllowedRadius
  const finalDots = workingDots.filter(d => d.radius >= minAllowedRadius && d.radius > 0.1);

  return {
    adjustedDots: finalDots,
    adjustedCount,
    minObservedGap: minObservedGap === Infinity ? minGap : Math.max(0, minObservedGap),
  };
}
