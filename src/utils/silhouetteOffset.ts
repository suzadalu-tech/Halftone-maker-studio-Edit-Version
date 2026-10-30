/**
 * Halftone Maker Studio - Sticker Silhouette / Offset Path Generator
 * Computes exact Euclidean Distance Transform (EDT) morphological dilation (Offset Path)
 * with internal hole-filling (Pathfinder Unite) and smooth sub-pixel antialiasing.
 * Also generates clean, 100% closed SVG vector paths (<path d="..." />) for Adobe Illustrator export.
 */

export interface HalftoneElementRef {
  type: 'circle' | 'rect';
  x: number;
  y: number;
  r?: number;
  w?: number;
  h?: number;
  rotation?: number;
}

export interface StickerOptions {
  enabled: boolean;
  offset: number; // in pixels, e.g. 2 to 50
  color: string; // e.g. '#ffffff'
  fillHoles: boolean; // close internal holes (solid background)
  smoothness: number; // 0 to 5
}

/**
 * 1D squared distance transform along array f
 * Based on Felzenszwalb & Huttenlocher (2012)
 */
function edt1D(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;

  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }

  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) {
      k++;
    }
    const vk = v[k];
    const diff = q - vk;
    d[q] = diff * diff + f[vk];
  }
}

/**
 * 2D Euclidean Distance Transform
 * Returns Float64Array of exact Euclidean distances to nearest pixel with value 1
 */
function compute2DDistanceTransform(binaryGrid: Uint8Array, width: number, height: number): Float64Array {
  const INF = 1e12;
  const f = new Float64Array(Math.max(width, height));
  const d = new Float64Array(Math.max(width, height));
  const v = new Int32Array(Math.max(width, height));
  const z = new Float64Array(Math.max(width, height) + 1);

  // Intermediate grid for column pass
  const grid = new Float64Array(width * height);

  // Transform along columns
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      f[y] = binaryGrid[y * width + x] === 1 ? 0 : INF;
    }
    edt1D(f, height, d, v, z);
    for (let y = 0; y < height; y++) {
      grid[y * width + x] = d[y];
    }
  }

  // Transform along rows
  const distances = new Float64Array(width * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      f[x] = grid[rowOffset + x];
    }
    edt1D(f, width, d, v, z);
    for (let x = 0; x < width; x++) {
      distances[rowOffset + x] = Math.sqrt(d[x]);
    }
  }

  return distances;
}

/**
 * Build initial binary silhouette from source image alpha + halftone elements
 */
export function buildSilhouetteGrid(
  sourceImg: HTMLImageElement | HTMLCanvasElement | null,
  elements: HalftoneElementRef[],
  width: number,
  height: number,
  fillHoles: boolean
): Uint8Array {
  const binaryGrid = new Uint8Array(width * height);

  // 1. Sample source image alpha transparency
  const hasValidSource = sourceImg && ((sourceImg as HTMLImageElement).naturalWidth > 0 || sourceImg.width > 0);
  if (hasValidSource) {
    try {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(sourceImg, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Check if image actually has transparency
        let hasAlpha = false;
        const step = Math.max(1, Math.floor((width * height) / 4000));
        for (let i = 3; i < data.length; i += step * 4) {
          if (data[i] < 240) {
            hasAlpha = true;
            break;
          }
        }

        if (hasAlpha) {
          for (let i = 0; i < width * height; i++) {
            if (data[i * 4 + 3] > 30) {
              binaryGrid[i] = 1;
            }
          }
        }
      }
    } catch {
      // Ignore cross-origin error if any
    }
  }

  // 2. Mark all pixels covered by halftone elements (dots, squares, etc.)
  // This guarantees that even if the image is a solid background or JPG without alpha,
  // the halftone dots themselves define the subject!
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (el.type === 'circle' && el.r && el.r > 0.4) {
      const minX = Math.max(0, Math.floor(el.x - el.r));
      const maxX = Math.min(width - 1, Math.ceil(el.x + el.r));
      const minY = Math.max(0, Math.floor(el.y - el.r));
      const maxY = Math.min(height - 1, Math.ceil(el.y + el.r));
      const r2 = el.r * el.r;

      for (let y = minY; y <= maxY; y++) {
        const dy2 = (y - el.y) * (y - el.y);
        const rowOffset = y * width;
        for (let x = minX; x <= maxX; x++) {
          const dx = x - el.x;
          if (dx * dx + dy2 <= r2) {
            binaryGrid[rowOffset + x] = 1;
          }
        }
      }
    } else if (el.type === 'rect' && el.w && el.h) {
      const minX = Math.max(0, Math.floor(el.x));
      const maxX = Math.min(width - 1, Math.ceil(el.x + el.w));
      const minY = Math.max(0, Math.floor(el.y));
      const maxY = Math.min(height - 1, Math.ceil(el.y + el.h));

      for (let y = minY; y <= maxY; y++) {
        const rowOffset = y * width;
        for (let x = minX; x <= maxX; x++) {
          binaryGrid[rowOffset + x] = 1;
        }
      }
    }
  }

  // 3. Fill inner holes (Pathfinder Unite)
  if (fillHoles) {
    const isExterior = new Uint8Array(width * height);
    // Queue for BFS flood fill
    const queueX = new Int32Array(width * height);
    const queueY = new Int32Array(width * height);
    let head = 0;
    let tail = 0;

    // Seed borders
    for (let x = 0; x < width; x++) {
      // Top row
      if (binaryGrid[x] === 0 && isExterior[x] === 0) {
        isExterior[x] = 1;
        queueX[tail] = x;
        queueY[tail] = 0;
        tail++;
      }
      // Bottom row
      const bIdx = (height - 1) * width + x;
      if (binaryGrid[bIdx] === 0 && isExterior[bIdx] === 0) {
        isExterior[bIdx] = 1;
        queueX[tail] = x;
        queueY[tail] = height - 1;
        tail++;
      }
    }

    for (let y = 0; y < height; y++) {
      // Left col
      const lIdx = y * width;
      if (binaryGrid[lIdx] === 0 && isExterior[lIdx] === 0) {
        isExterior[lIdx] = 1;
        queueX[tail] = 0;
        queueY[tail] = y;
        tail++;
      }
      // Right col
      const rIdx = y * width + (width - 1);
      if (binaryGrid[rIdx] === 0 && isExterior[rIdx] === 0) {
        isExterior[rIdx] = 1;
        queueX[tail] = width - 1;
        queueY[tail] = y;
        tail++;
      }
    }

    // BFS Flood Fill from outer boundaries
    while (head < tail) {
      const cx = queueX[head];
      const cy = queueY[head];
      head++;

      // Check 4-connected neighbors
      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1],
      ];

      for (let n = 0; n < 4; n++) {
        const nx = neighbors[n][0];
        const ny = neighbors[n][1];

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (binaryGrid[nIdx] === 0 && isExterior[nIdx] === 0) {
            isExterior[nIdx] = 1;
            queueX[tail] = nx;
            queueY[tail] = ny;
            tail++;
          }
        }
      }
    }

    // Any pixel not reachable from outside is either subject OR an internal hole => set to 1!
    for (let i = 0; i < width * height; i++) {
      if (isExterior[i] === 0) {
        binaryGrid[i] = 1;
      }
    }
  }

  return binaryGrid;
}

/**
 * Generate sub-pixel antialiased offset canvas for Canvas 2D and PNG rendering.
 * Supports fast preview downsampling (maxComputeSize = 1000) for blazing 60 FPS live sliders.
 */
export function generateStickerCanvas(
  sourceImg: HTMLImageElement | HTMLCanvasElement | null,
  elements: HalftoneElementRef[],
  width: number,
  height: number,
  options: StickerOptions,
  maxComputeSize: number = 1000
): HTMLCanvasElement | null {
  if (!options.enabled || width <= 0 || height <= 0) return null;

  const maxDim = Math.max(width, height);
  if (maxComputeSize > 0 && maxDim > maxComputeSize) {
    const scale = maxComputeSize / maxDim;
    const fastW = Math.max(10, Math.round(width * scale));
    const fastH = Math.max(10, Math.round(height * scale));

    const scaledElements: HalftoneElementRef[] = elements.map((el) => ({
      ...el,
      x: el.x * scale,
      y: el.y * scale,
      r: el.r !== undefined ? el.r * scale : undefined,
      w: el.w !== undefined ? el.w * scale : undefined,
      h: el.h !== undefined ? el.h * scale : undefined,
    }));

    const fastCanvas = generateStickerCanvas(
      sourceImg,
      scaledElements,
      fastW,
      fastH,
      {
        ...options,
        offset: options.offset * scale,
      },
      0
    );

    if (!fastCanvas) return null;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(fastCanvas, 0, 0, width, height);
    return canvas;
  }

  const binaryGrid = buildSilhouetteGrid(sourceImg, elements, width, height, options.fillHoles);

  // Compute exact Euclidean distances
  const distances = compute2DDistanceTransform(binaryGrid, width, height);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Parse color hex (e.g. #ffffff)
  let hex = options.color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const rCol = parseInt(hex.substring(0, 2), 16) || 255;
  const gCol = parseInt(hex.substring(2, 4), 16) || 255;
  const bCol = parseInt(hex.substring(4, 6), 16) || 255;

  const targetDist = Math.max(0, options.offset);

  for (let i = 0; i < width * height; i++) {
    const d = distances[i];
    // Sub-pixel antialiased edge
    const diff = targetDist - d;
    let alpha = 0;

    if (diff >= 0.5) {
      alpha = 255;
    } else if (diff > -0.5) {
      alpha = Math.round((diff + 0.5) * 255);
    }

    if (alpha > 0) {
      const idx = i * 4;
      data[idx] = rCol;
      data[idx + 1] = gCol;
      data[idx + 2] = bCol;
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export interface AccentStrokeOptions {
  enabled: boolean;
  offset: number; // in pixels, e.g. 0 to 30
  width: number; // stroke thickness in pixels, e.g. 1 to 20
  color: string; // e.g. '#ef4444'
  opacity: number; // 0 to 1
  fillHoles: boolean;
}

/**
 * Generate sub-pixel antialiased contour stroke canvas for Canvas 2D and PNG rendering.
 * Uses exact Euclidean distance field shell: |distance - offset| <= strokeWidth / 2.
 * 100% artifact-free with ZERO straight lines, zero chord jumps across branches.
 */
export function generateAccentStrokeCanvas(
  sourceImg: HTMLImageElement | HTMLCanvasElement | null,
  elements: HalftoneElementRef[],
  width: number,
  height: number,
  options: AccentStrokeOptions,
  maxComputeSize: number = 1000
): HTMLCanvasElement | null {
  if (!options.enabled || options.width <= 0 || options.opacity <= 0 || width <= 0 || height <= 0) return null;

  const maxDim = Math.max(width, height);
  if (maxComputeSize > 0 && maxDim > maxComputeSize) {
    const scale = maxComputeSize / maxDim;
    const fastW = Math.max(10, Math.round(width * scale));
    const fastH = Math.max(10, Math.round(height * scale));

    const scaledElements: HalftoneElementRef[] = elements.map((el) => ({
      ...el,
      x: el.x * scale,
      y: el.y * scale,
      r: el.r !== undefined ? el.r * scale : undefined,
      w: el.w !== undefined ? el.w * scale : undefined,
      h: el.h !== undefined ? el.h * scale : undefined,
    }));

    const fastCanvas = generateAccentStrokeCanvas(
      sourceImg,
      scaledElements,
      fastW,
      fastH,
      {
        ...options,
        offset: options.offset * scale,
        width: Math.max(1, options.width * scale),
      },
      0
    );

    if (!fastCanvas) return null;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(fastCanvas, 0, 0, width, height);
    return canvas;
  }

  const binaryGrid = buildSilhouetteGrid(sourceImg, elements, width, height, options.fillHoles);
  const distances = compute2DDistanceTransform(binaryGrid, width, height);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Parse color hex (e.g. #ef4444)
  let hex = options.color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const rCol = parseInt(hex.substring(0, 2), 16) || 239;
  const gCol = parseInt(hex.substring(2, 4), 16) || 68;
  const bCol = parseInt(hex.substring(4, 6), 16) || 68;

  const targetDist = Math.max(0, options.offset);
  const halfStroke = Math.max(0.5, options.width * 0.5);
  const maxOpacity = Math.max(0, Math.min(1, options.opacity));

  for (let i = 0; i < width * height; i++) {
    const d = distances[i];
    // Distance from the stroke center line (targetDist)
    const distFromCenter = Math.abs(d - targetDist);
    // Distance from the stroke boundary (halfStroke)
    const edgeDiff = halfStroke - distFromCenter;
    let alpha = 0;

    if (edgeDiff >= 0.5) {
      alpha = 255;
    } else if (edgeDiff > -0.5) {
      alpha = Math.round((edgeDiff + 0.5) * 255);
    }

    if (alpha > 0) {
      const finalAlpha = Math.round(alpha * maxOpacity);
      if (finalAlpha > 0) {
        const idx = i * 4;
        data[idx] = rCol;
        data[idx + 1] = gCol;
        data[idx + 2] = bCol;
        data[idx + 3] = finalAlpha;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Ramer-Douglas-Peucker (RDP) polygon simplification
 */
function simplifyRDP(points: [number, number][], epsilon: number): [number, number][] {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let index = 0;
  const p1 = points[0];
  const p2 = points[points.length - 1];

  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const lenSq = dx * dx + dy * dy;

  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    let dist = 0;
    if (lenSq === 0) {
      dist = Math.hypot(p[0] - p1[0], p[1] - p1[1]);
    } else {
      const t = Math.max(0, Math.min(1, ((p[0] - p1[0]) * dx + (p[1] - p1[1]) * dy) / lenSq));
      const projX = p1[0] + t * dx;
      const projY = p1[1] + t * dy;
      dist = Math.hypot(p[0] - projX, p[1] - projY);
    }

    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = simplifyRDP(points.slice(0, index + 1), epsilon);
    const right = simplifyRDP(points.slice(index), epsilon);
    return left.slice(0, left.length - 1).concat(right);
  } else {
    return [p1, p2];
  }
}

/**
 * Robust Unit-Edge Boundary Contour Tracer.
 * Traces exact pixel grid boundary edges between inside and outside cells.
 * Guaranteed:
 * - Every edge step connects adjacent grid points
 * - Closed loops for SVG <path d="..." />
 * - Accurate Euclidean distance offset contour with zero straight-line chord jumps
 */
export function generateStickerSvgPath(
  sourceImg: HTMLImageElement | HTMLCanvasElement | null,
  elements: HalftoneElementRef[],
  width: number,
  height: number,
  options: StickerOptions
): string {
  if (!options.enabled || width <= 0 || height <= 0) return '';

  const binaryGrid = buildSilhouetteGrid(sourceImg, elements, width, height, options.fillHoles);
  const distances = compute2DDistanceTransform(binaryGrid, width, height);
  const targetDist = Math.max(0, options.offset);

  // Dynamic step: 1px for smaller sizes, 2px for medium, up to 3px for 4K
  const step = Math.max(1, Math.min(3, Math.floor(Math.max(width, height) / 900)));
  const gridW = Math.ceil(width / step) + 1;
  const gridH = Math.ceil(height / step) + 1;

  const sampled = new Uint8Array(gridW * gridH);
  for (let gy = 0; gy < gridH; gy++) {
    const py = Math.min(height - 1, gy * step);
    const rowOffset = py * width;
    for (let gx = 0; gx < gridW; gx++) {
      const px = Math.min(width - 1, gx * step);
      if (distances[rowOffset + px] <= targetDist) {
        sampled[gy * gridW + gx] = 1;
      }
    }
  }

  // Edge map: key = y * (gridW + 2) + x
  const stride = gridW + 2;
  const edgeMap = new Map<number, { x2: number; y2: number; used: boolean }[]>();

  for (let gy = 0; gy < gridH; gy++) {
    const rowOffset = gy * gridW;
    for (let gx = 0; gx < gridW; gx++) {
      if (sampled[rowOffset + gx] === 1) {
        // Top edge: (gx, gy) -> (gx + 1, gy)
        if (gy === 0 || sampled[rowOffset - gridW + gx] === 0) {
          const k = gy * stride + gx;
          let list = edgeMap.get(k);
          if (!list) { list = []; edgeMap.set(k, list); }
          list.push({ x2: gx + 1, y2: gy, used: false });
        }
        // Right edge: (gx + 1, gy) -> (gx + 1, gy + 1)
        if (gx === gridW - 1 || sampled[rowOffset + gx + 1] === 0) {
          const k = gy * stride + (gx + 1);
          let list = edgeMap.get(k);
          if (!list) { list = []; edgeMap.set(k, list); }
          list.push({ x2: gx + 1, y2: gy + 1, used: false });
        }
        // Bottom edge: (gx + 1, gy + 1) -> (gx, gy + 1)
        if (gy === gridH - 1 || sampled[rowOffset + gridW + gx] === 0) {
          const k = (gy + 1) * stride + (gx + 1);
          let list = edgeMap.get(k);
          if (!list) { list = []; edgeMap.set(k, list); }
          list.push({ x2: gx, y2: gy + 1, used: false });
        }
        // Left edge: (gx, gy + 1) -> (gx, gy)
        if (gx === 0 || sampled[rowOffset + gx - 1] === 0) {
          const k = (gy + 1) * stride + gx;
          let list = edgeMap.get(k);
          if (!list) { list = []; edgeMap.set(k, list); }
          list.push({ x2: gx, y2: gy, used: false });
        }
      }
    }
  }

  let pathString = '';
  const maxSteps = gridW * gridH * 4;

  for (const [startKey, edges] of edgeMap.entries()) {
    for (const edge of edges) {
      if (edge.used) continue;
      edge.used = true;

      const startX = startKey % stride;
      const startY = Math.floor(startKey / stride);

      const loopPoints: [number, number][] = [
        [Math.min(width, Math.max(0, startX * step)), Math.min(height, Math.max(0, startY * step))]
      ];

      let curX = edge.x2;
      let curY = edge.y2;
      let steps = 0;

      while ((curX !== startX || curY !== startY) && steps < maxSteps) {
        loopPoints.push([
          Math.min(width, Math.max(0, curX * step)),
          Math.min(height, Math.max(0, curY * step))
        ]);
        steps++;

        const curKey = curY * stride + curX;
        const nextList = edgeMap.get(curKey);
        const nextEdge = nextList?.find((e) => !e.used);
        if (!nextEdge) break;
        nextEdge.used = true;
        curX = nextEdge.x2;
        curY = nextEdge.y2;
      }

      if (loopPoints.length >= 4) {
        // Epsilon 1.0 preserves sharp features while drastically reducing path size
        const simplified = simplifyRDP(loopPoints, 1.0);
        if (simplified.length >= 3) {
          let loopSvg = `M ${simplified[0][0].toFixed(1)} ${simplified[0][1].toFixed(1)}`;
          for (let k = 1; k < simplified.length; k++) {
            loopSvg += ` L ${simplified[k][0].toFixed(1)} ${simplified[k][1].toFixed(1)}`;
          }
          loopSvg += ' Z ';
          pathString += loopSvg;
        }
      }
    }
  }

  return pathString.trim();
}
