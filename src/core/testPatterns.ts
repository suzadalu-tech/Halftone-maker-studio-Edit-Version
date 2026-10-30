/**
 * Generates synthetic test canvases for instant algorithm testing & verification
 */

/**
 * Creates a synthetic problematic halftone pattern containing:
 * - Touching dots
 * - Merged clusters
 * - Distorted/irregular dots
 * - Tiny unwanted fragments
 * - Dirty vector shapes
 */
export function generateProblematicTestCanvas(width: number = 600, height: number = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';

  // 1. Grid of dots with deliberate artifacts
  const spacing = 28;
  for (let y = 30; y < height - 30; y += spacing) {
    for (let x = 30; x < width - 30; x += spacing) {
      const colIdx = Math.floor(x / spacing);
      const rowIdx = Math.floor(y / spacing);

      // Section A: Touching/Overlapping Dots (left-center)
      if (colIdx >= 3 && colIdx <= 6 && rowIdx >= 3 && rowIdx <= 6) {
        // Draw oversized overlapping ellipse
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      // Section B: Distorted / Irregular / Skewed Dots (center-top)
      if (colIdx >= 8 && colIdx <= 11 && rowIdx >= 2 && rowIdx <= 5) {
        ctx.beginPath();
        // Squashed / tilted egg shape
        ctx.ellipse(x + (Math.random() * 4 - 2), y, 14, 7, 0.6, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      // Section C: Merged Blob (cluster of multiple merged lobes)
      if (colIdx === 14 && rowIdx === 5) {
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.arc(x + 18, y + 4, 13, 0, Math.PI * 2);
        ctx.arc(x + 10, y + 16, 12, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }

      // Section D: Normal gradient dots
      const distFromCenter = Math.hypot(x - width / 2, y - height / 2);
      const radius = Math.max(3, 13 - (distFromCenter / (width / 2)) * 10);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Inject tiny dust fragments and specks (Problem 9: Unwanted tiny fragments)
  for (let i = 0; i < 45; i++) {
    const fx = Math.random() * width;
    const fy = Math.random() * height;
    ctx.fillRect(fx, fy, 1.5, 1.5);
  }

  return canvas;
}

/**
 * Creates a smooth radial continuous tone sphere for testing halftone gradients
 */
export function generateSphereGradientCanvas(width: number = 600, height: number = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark vignette gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#f0f0f0');
  bgGrad.addColorStop(1, '#a0a0a0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 3D Sphere with smooth highlight, midtone, and shadow
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.38;

  const sphereGrad = ctx.createRadialGradient(
    cx - radius * 0.35,
    cy - radius * 0.35,
    radius * 0.05,
    cx,
    cy,
    radius
  );
  sphereGrad.addColorStop(0, '#ffffff');
  sphereGrad.addColorStop(0.4, '#808080');
  sphereGrad.addColorStop(0.85, '#151515');
  sphereGrad.addColorStop(1, '#000000');

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Cast shadow
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 0.95, radius * 0.85, radius * 0.18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  return canvas;
}

/**
 * Creates high-contrast graphic emblem test
 */
export function generateGraphicEmblemCanvas(width: number = 600, height: number = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#101010';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HALFTONE MAKER', width / 2, height / 2 - 35);

  ctx.font = '600 40px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('STUDIO', width / 2, height / 2 + 40);

  // Geometric frame
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#222222';
  ctx.strokeRect(40, 30, width - 80, height - 60);

  // Concentric circle badge
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 110, 28, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/**
 * Creates an isolated pop-art sticker graphic with transparency.
 * Perfect for testing transparent background, vector sticker underlay, and accent stroke!
 */
export function generateIsolatedStickerSampleCanvas(width: number = 800, height: number = 800): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;

  // Outer bold starburst badge
  ctx.save();
  ctx.translate(cx, cy);

  const spikes = 16;
  const outerR = 260;
  const innerR = 210;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / spikes;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#111827';
  ctx.fill();

  // Smooth gradient core sphere inside
  const sphereGrad = ctx.createRadialGradient(-50, -50, 20, 0, 0, 160);
  sphereGrad.addColorStop(0, '#ffffff');
  sphereGrad.addColorStop(0.3, '#d1d5db');
  sphereGrad.addColorStop(0.7, '#4b5563');
  sphereGrad.addColorStop(1, '#000000');
  ctx.beginPath();
  ctx.arc(0, 0, 150, 0, Math.PI * 2);
  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Sharp graphic text banner
  ctx.fillStyle = '#111827';
  ctx.fillRect(-170, -25, 340, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VECTOR DOTS', 0, 0);

  ctx.restore();
  return canvas;
}

