/**
 * Photoshop-style Halftone Shading Brush Engine
 * Generates ultra-smooth 60fps radial feathered stamps with roundness, angle, hardness, opacity, and flow.
 */

export interface BrushConfig {
  size: number; // 0.25 to 5000 px
  hardness: number; // 0 to 100 % (0% = soft feathered falloff, 100% = crisp)
  roundness: number; // 10 to 100 % (100% = circular, <100% = elliptical / chisel)
  angle: number; // 0 to 360 degrees
  opacity: number; // 10 to 100 %
  flow: number; // 10 to 100 %
  spacing: number; // 5 to 50 %
  blendMode: 'draw' | 'erase';
  color?: string; // Hex or CSS color string (default: #000000)
}

/**
 * Creates a pre-rendered GPU-accelerated stamp canvas for instantaneous blitting.
 */
export function createBrushStamp(config: BrushConfig): HTMLCanvasElement {
  const size = Math.max(0.25, Math.min(5000, config.size));
  const radius = size / 2;
  const padding = size < 4 ? 2 : Math.min(8, Math.max(4, Math.round(size * 0.05)));
  const canvasSize = Math.max(2, Math.ceil(size + padding * 2));

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  const roundnessRatio = Math.max(0.1, Math.min(1.0, config.roundness / 100));
  const angleRad = (config.angle * Math.PI) / 180;
  const effectiveAlpha = (Math.max(0.05, config.opacity / 100) * Math.max(0.05, config.flow / 100));

  // Parse color (hex or rgb)
  let rgb = '0, 0, 0';
  if (config.color) {
    const c = config.color.trim();
    if (c.startsWith('#')) {
      const hex = c.replace('#', '');
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) rgb = `${r}, ${g}, ${b}`;
      } else if (hex.length >= 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) rgb = `${r}, ${g}, ${b}`;
      }
    } else if (c.startsWith('rgb')) {
      const match = c.match(/\d+/g);
      if (match && match.length >= 3) {
        rgb = `${match[0]}, ${match[1]}, ${match[2]}`;
      }
    }
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angleRad);
  ctx.scale(1, roundnessRatio);

  // Hardness controls the inner solid core vs outer feathered edge
  const hFraction = Math.max(0, Math.min(0.99, config.hardness / 100));
  const innerRadius = radius * hFraction;

  const grad = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, radius);
  // Multi-stop cosine falloff ensures outer feathered edge smoothly dissolves all the way to 0% opacity (no abrupt cutoff)
  const numStops = 16;
  for (let s = 0; s <= numStops; s++) {
    const t = s / numStops;
    // Cosine ease-in-out: zero slope at core and zero slope at boundary (asymptotically dissolves into 0)
    const factor = 0.5 * (1 + Math.cos(Math.PI * t));
    const alphaVal = effectiveAlpha * factor;
    grad.addColorStop(t, `rgba(${rgb}, ${alphaVal.toFixed(4)})`);
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // If hardness > 0, fill inner solid core
  if (innerRadius > 0.5) {
    ctx.fillStyle = `rgba(${rgb}, ${effectiveAlpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  return canvas;
}

/**
 * Stamps along a continuous line path with distance-based interpolation.
 * Prevents gaps or jagged lines during fast mouse movement.
 */
export function stampBrushLine(
  targetCtx: CanvasRenderingContext2D,
  stamp: HTMLCanvasElement,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  config: BrushConfig
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const distance = Math.hypot(dx, dy);

  targetCtx.save();
  if (config.blendMode === 'erase') {
    targetCtx.globalCompositeOperation = 'destination-out';
  } else {
    targetCtx.globalCompositeOperation = 'source-over';
  }

  const stampW = stamp.width;
  const stampH = stamp.height;
  const halfW = stampW / 2;
  const halfH = stampH / 2;

  const roundnessRatio = Math.max(0.1, config.roundness / 100);
  const effectiveDiameter = config.size * Math.min(1.0, roundnessRatio);
  const stepDist = Math.max(0.1, (effectiveDiameter * Math.max(0.05, config.spacing / 100)));

  if (distance === 0) {
    targetCtx.drawImage(stamp, x0 - halfW, y0 - halfH);
  } else {
    const steps = Math.max(1, Math.ceil(distance / stepDist));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + dx * t;
      const y = y0 + dy * t;
      targetCtx.drawImage(stamp, x - halfW, y - halfH);
    }
  }

  targetCtx.restore();
}
