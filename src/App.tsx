import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Crop,
  Layers,
  Undo2,
  Redo2,
  RotateCcw,
  Palette,
  Grid as GridIcon,
  Hexagon,
  SunMedium,
  Minus,
  Disc,
  Sparkle,
  Droplet,
  Waves,
  Sliders,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Copy,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Check,
  FileCode,
  Bot,
  Scissors,
  Split,
  Eye,
  Camera,
  Bookmark,
  Share2,
  Settings2,
  SlidersHorizontal,
  Wand2,
  Film,
  Sparkles,
  Circle,
  Square,
  Key,
  X,
  Trash2,
  AlertTriangle,
  Sparkles as MagicIcon,
  FileArchive,
  Eraser,
  Paintbrush,
  Hand,
  MousePointer,
} from 'lucide-react';
import JSZip from 'jszip';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LOGO_DATA_URI } from './assets/logoBase64';
import { generateStickerCanvas, generateStickerSvgPath, generateAccentStrokeCanvas } from './utils/silhouetteOffset';
import { ModularToolDock, ActiveCategory } from './components/ModularToolDock';
import { generateEpsFromElements } from './core/vectorExporter';
import { STANDALONE_CLEANER_JSX } from './core/standaloneScript';
import { JsxScriptModal } from './components/JsxScriptModal';
import { createBrushStamp, stampBrushLine, BrushConfig } from './utils/brushEngine';
import {
  generateSphereGradientCanvas,
  generateGraphicEmblemCanvas,
  generateIsolatedStickerSampleCanvas,
  generateProblematicTestCanvas,
} from './core/testPatterns';

export type PatternMode =
  | 'circle'
  | 'square'
  | 'hexagonal'
  | 'radial'
  | 'line'
  | 'ring'
  | 'stippling'
  | 'blob'
  | 'liquid';

export type UIMode = 'Basic' | 'Advanced' | 'Expert';
export type DotStyle = 'circle' | 'square' | 'diamond';
export type SamplingChannel =
  | 'inverse_luminance'
  | 'luminance'
  | 'red'
  | 'green'
  | 'blue'
  | 'alpha';
export type ColorMode = 'two_colors' | 'gradient' | 'source';
export type ViewMode = 'halftone' | 'original' | 'split';
export type FitMode = 'Fit to Short Edge' | 'Fit to Long Edge' | 'Cover' | 'Contain';
export type BlurType =
  | 'gaussian'
  | 'motion'
  | 'radial_spin'
  | 'radial_zoom'
  | 'box'
  | 'surface'
  | 'lens';

interface HalftoneElement {
  type: 'circle' | 'rect';
  x: number;
  y: number;
  r?: number;
  w?: number;
  h?: number;
  rotation?: number;
}

export interface LoadedImage {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  imgElement: HTMLImageElement;
}

export interface ImageEffectSettings {
  patternMode: PatternMode;
  gridSpacing: number;
  rotation: number;
  diameter: number;
  stretchAmount: number;
  skew: number;
  deformAxis: number;
  deformAxisFollowsGrid: boolean;
  regionMerging: boolean;
  samplingChannel: SamplingChannel;
  invert: boolean;
  levelMaskMin: number;
  levelMaskMax: number;
  discardTransparentAreas: boolean;
  dotStyle: DotStyle;
  outlineOnly: boolean;
  dotSize: number;
  minDotSize: number;
  maxDotSize: number;
  minDotMode: 'cutoff' | 'clamp';
  sizeResponse: number;
  sizeOffset: number;
  scaleFactor: number;
  deformWithGrid: boolean;
  densitySizing: boolean;
  blur: number;
  blurType?: BlurType;
  blurAngle?: number;
  blurThreshold?: number;
  gamma: number;
  contrast: number;
  clampMin: number;
  clampMax: number;
  normalizeLuminance: boolean;
  colorMode: ColorMode;
  foregroundColor: string;
  backgroundColor: string;
  gradation: number;
  transparentBg: boolean;
  stickerUnderlayEnabled: boolean;
  stickerOffset: number;
  stickerShiftX: number;
  stickerShiftY: number;
  stickerColor: string;
  stickerFillHoles: boolean;
  shadowEnabled: boolean;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowOpacity: number;
  shadowColor: string;
  accentStrokeEnabled: boolean;
  accentStrokeColor: string;
  accentStrokeWidth: number;
  accentStrokeOffset: number;
  accentStrokeShiftX: number;
  accentStrokeShiftY: number;
  accentStrokeOpacity: number;
  displacementAmount: number;
  displacementFrequency: number;
  samplingPosterize: number;
  noiseAmount: number;
  quantizeLevels: number;
  pixelSharpness: number;
  fitMode: FitMode;
  subjectTransform?: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
}

export interface SavedPreset {
  id: string;
  name: string;
  isCustom?: boolean;
  createdAt?: number;
  settings: {
    patternMode: PatternMode;
    gridSpacing: number;
    rotation: number;
    diameter: number;
    stretchAmount: number;
    skew: number;
    dotStyle: DotStyle;
    dotSize: number;
    minDotSize?: number;
    maxDotSize?: number;
    minDotMode?: 'cutoff' | 'clamp';
    sizeResponse: number;
    scaleFactor: number;
    contrast: number;
    gamma: number;
    blur: number;
    clampMin: number;
    clampMax: number;
    normalizeLuminance: boolean;
    samplingChannel: SamplingChannel;
    invert: boolean;
    foregroundColor: string;
    backgroundColor: string;
    transparentBg: boolean;
    stickerUnderlayEnabled?: boolean;
    stickerOffset?: number;
    stickerShiftX?: number;
    stickerShiftY?: number;
    stickerColor?: string;
    stickerFillHoles?: boolean;
    shadowEnabled?: boolean;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowBlur?: number;
    shadowOpacity?: number;
    shadowColor?: string;
    accentStrokeEnabled?: boolean;
    accentStrokeColor?: string;
    accentStrokeWidth?: number;
    accentStrokeOffset?: number;
    accentStrokeShiftX?: number;
    accentStrokeShiftY?: number;
    accentStrokeOpacity?: number;
    displacementAmount: number;
    displacementFrequency: number;
    samplingPosterize: number;
    noiseAmount: number;
    quantizeLevels: number;
  };
}

export const BUILTIN_EFFECT_PRESETS: SavedPreset[] = [
  {
    id: 'builtin_comic',
    name: '🎨 Comic Pop-Art (Default)',
    isCustom: false,
    settings: {
      patternMode: 'circle',
      gridSpacing: 27.5,
      rotation: -33,
      diameter: 1,
      stretchAmount: 1,
      skew: 0,
      dotStyle: 'circle',
      dotSize: 1,
      sizeResponse: 0,
      scaleFactor: 1,
      contrast: -0.8,
      gamma: 0.7,
      blur: 0,
      clampMin: 0,
      clampMax: 0.85,
      normalizeLuminance: true,
      samplingChannel: 'inverse_luminance',
      invert: false,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      transparentBg: true,
      displacementAmount: 0,
      displacementFrequency: 15,
      samplingPosterize: 0,
      noiseAmount: 0,
      quantizeLevels: 0,
    },
  },
  {
    id: 'builtin_fine',
    name: '🖨️ Fine Screen Print (High Density)',
    isCustom: false,
    settings: {
      patternMode: 'circle',
      gridSpacing: 14,
      rotation: 15,
      diameter: 1,
      stretchAmount: 1,
      skew: 0,
      dotStyle: 'circle',
      dotSize: 0.9,
      sizeResponse: 0.1,
      scaleFactor: 1,
      contrast: 0.2,
      gamma: 1.1,
      blur: 0,
      clampMin: 0.05,
      clampMax: 0.9,
      normalizeLuminance: true,
      samplingChannel: 'inverse_luminance',
      invert: false,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      transparentBg: true,
      displacementAmount: 0,
      displacementFrequency: 15,
      samplingPosterize: 0,
      noiseAmount: 0,
      quantizeLevels: 0,
    },
  },
  {
    id: 'builtin_hex',
    name: '⬡ Hexagonal Tech Grid',
    isCustom: false,
    settings: {
      patternMode: 'hexagonal',
      gridSpacing: 24,
      rotation: 0,
      diameter: 1,
      stretchAmount: 1,
      skew: 0,
      dotStyle: 'circle',
      dotSize: 1.05,
      sizeResponse: 0,
      scaleFactor: 1,
      contrast: -0.4,
      gamma: 0.85,
      blur: 0,
      clampMin: 0,
      clampMax: 0.85,
      normalizeLuminance: true,
      samplingChannel: 'inverse_luminance',
      invert: false,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      transparentBg: true,
      displacementAmount: 0,
      displacementFrequency: 15,
      samplingPosterize: 0,
      noiseAmount: 0,
      quantizeLevels: 0,
    },
  },
  {
    id: 'builtin_stipple',
    name: '✒️ Stipple Engraving (Vintage)',
    isCustom: false,
    settings: {
      patternMode: 'stippling',
      gridSpacing: 18,
      rotation: 0,
      diameter: 1,
      stretchAmount: 1,
      skew: 0,
      dotStyle: 'circle',
      dotSize: 0.85,
      sizeResponse: -0.1,
      scaleFactor: 1,
      contrast: 0.5,
      gamma: 1.2,
      blur: 0,
      clampMin: 0,
      clampMax: 0.9,
      normalizeLuminance: true,
      samplingChannel: 'inverse_luminance',
      invert: false,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      transparentBg: true,
      displacementAmount: 0,
      displacementFrequency: 15,
      samplingPosterize: 0,
      noiseAmount: 0,
      quantizeLevels: 0,
    },
  },
];

// Cache opaque content bounds to avoid redundant pixel scanning
const opaqueBoundsCache = new WeakMap<
  HTMLImageElement,
  { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number; cx: number; cy: number }
>();

/**
 * Accurately detects the visual bounding box of the non-transparent subject inside an image.
 * Ignores empty/transparent padding around logos and artwork.
 */
export const getImageOpaqueBounds = (img: HTMLImageElement | undefined | null) => {
  if (!img) return null;
  const natW = img.naturalWidth || img.width || 0;
  const natH = img.naturalHeight || img.height || 0;
  if (natW <= 0 || natH <= 0) return null;

  if (opaqueBoundsCache.has(img)) {
    return opaqueBoundsCache.get(img)!;
  }

  try {
    // Scan at full resolution (or capped at 1200px for speed while maintaining high fidelity)
    const scanScale = Math.min(1, 1200 / Math.max(natW, natH));
    const sw = Math.max(1, Math.round(natW * scanScale));
    const sh = Math.max(1, Math.round(natH * scanScale));

    const scanCanvas = document.createElement('canvas');
    scanCanvas.width = sw;
    scanCanvas.height = sh;
    const sctx = scanCanvas.getContext('2d', { willReadFrequently: true });
    if (!sctx) return null;

    sctx.drawImage(img, 0, 0, sw, sh);
    const imgData = sctx.getImageData(0, 0, sw, sh);
    const data = imgData.data;

    let minX = sw;
    let minY = sh;
    let maxX = -1;
    let maxY = -1;

    // Check if image contains alpha transparency (e.g. cutout / PNG)
    let hasTransparentPixels = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] <= 12) {
        hasTransparentPixels = true;
        break;
      }
    }

    if (hasTransparentPixels) {
      // Standard transparent PNG / cutout: scan for opaque content
      for (let y = 0; y < sh; y++) {
        const rowOffset = y * sw * 4;
        for (let x = 0; x < sw; x++) {
          const a = data[rowOffset + x * 4 + 3];
          if (a > 12) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    } else {
      // Solid image (e.g. JPEG on white background): scan for non-white subject pixels
      for (let y = 0; y < sh; y++) {
        const rowOffset = y * sw * 4;
        for (let x = 0; x < sw; x++) {
          const r = data[rowOffset + x * 4];
          const g = data[rowOffset + x * 4 + 1];
          const b = data[rowOffset + x * 4 + 2];
          if (r < 248 || g < 248 || b < 248) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    }

    // If completely transparent or solid image with no transparent padding
    if (maxX < minX || maxY < minY) {
      const fallback = {
        minX: 0,
        minY: 0,
        maxX: natW,
        maxY: natH,
        width: natW,
        height: natH,
        cx: natW / 2,
        cy: natH / 2,
      };
      opaqueBoundsCache.set(img, fallback);
      return fallback;
    }

    // Scale coordinates back to original image dimensions
    const origMinX = minX / scanScale;
    const origMinY = minY / scanScale;
    const origMaxX = Math.min(natW, (maxX + 1) / scanScale);
    const origMaxY = Math.min(natH, (maxY + 1) / scanScale);
    const contentW = Math.max(1, origMaxX - origMinX);
    const contentH = Math.max(1, origMaxY - origMinY);
    const contentCx = origMinX + contentW / 2;
    const contentCy = origMinY + contentH / 2;

    const result = {
      minX: origMinX,
      minY: origMinY,
      maxX: origMaxX,
      maxY: origMaxY,
      width: contentW,
      height: contentH,
      cx: contentCx,
      cy: contentCy,
    };
    opaqueBoundsCache.set(img, result);
    return result;
  } catch (err) {
    console.warn('Could not read image opaque bounds:', err);
    return null;
  }
};

export const calculateTransformForFitMode = (
  img: HTMLImageElement | undefined | null,
  mode: FitMode,
  currentRotation = 0
) => {
  const natW = img?.naturalWidth || img?.width || 1000;
  const natH = img?.naturalHeight || img?.height || 1000;

  // 1. Detect content bounding box of the opaque visual subject
  const bounds = getImageOpaqueBounds(img);
  const subjectW = bounds ? bounds.width : natW;
  const subjectH = bounds ? bounds.height : natH;
  const subjectCx = bounds ? bounds.cx : natW / 2;
  const subjectCy = bounds ? bounds.cy : natH / 2;

  let newScale = 1;
  if (mode === 'Fit to Short Edge') {
    const minDim = Math.min(subjectW, subjectH);
    newScale = minDim > 0 ? parseFloat((4000 / minDim).toFixed(3)) : 1;
  } else if (mode === 'Fit to Long Edge') {
    // 200px padding on each side: 4000px - (200px * 2) = 3600px target area
    const targetDimension = 4000 - 200 * 2; // 3600px
    const maxDim = Math.max(subjectW, subjectH);
    newScale = maxDim > 0 ? parseFloat((targetDimension / maxDim).toFixed(3)) : 1;
  } else if (mode === 'Contain') {
    const maxDim = Math.max(subjectW, subjectH);
    newScale = maxDim > 0 ? parseFloat((3000 / maxDim).toFixed(3)) : 1;
  } else if (mode === 'Cover') {
    const minDim = Math.min(subjectW, subjectH);
    newScale = minDim > 0 ? parseFloat((4200 / minDim).toFixed(3)) : 1;
  }

  // Calculate image center position (x, y) so that the subject's visible center lands perfectly at the artboard center (2000, 2000)
  const offsetX = (subjectCx - natW / 2) * newScale;
  const offsetY = (subjectCy - natH / 2) * newScale;
  const posX = Math.round(2000 - offsetX);
  const posY = Math.round(2000 - offsetY);

  return {
    x: posX,
    y: posY,
    scale: newScale,
    rotation: currentRotation,
  };
};

export function App() {
  // Multi-Image State & Filmstrip
  const [images, setImages] = useState<LoadedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const activeImageIdRef = useRef<string | null>(null);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const lastSelectedImageIdRef = useRef<string | null>(null);
  const isSwitchingImageRef = useRef<boolean>(false);
  const imageSettingsRef = useRef<Record<string, ImageEffectSettings>>({});
  const [isFilmstripCollapsed, setIsFilmstripCollapsed] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isExportingAll, setIsExportingAll] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Apply to All Live Progress & Status State
  const [isApplyingAll, setIsApplyingAll] = useState<boolean>(false);
  const [applyAllStatus, setApplyAllStatus] = useState<'idle' | 'applying' | 'complete'>('idle');
  const [applyProgress, setApplyProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Filmstrip Thumbnail Track Drag-to-Scroll Refs & State
  const filmstripTrackRef = useRef<HTMLDivElement>(null);
  const isDraggingThumbnailsRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const hasDraggedThumbnailsRef = useRef<boolean>(false);
  const [isTrackDragging, setIsTrackDragging] = useState<boolean>(false);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  // Filmstrip Tool Mode: 'pan' (drag to scroll) or 'select' (drag to select multiple items)
  const [filmstripToolMode, setFilmstripToolMode] = useState<'pan' | 'select'>('pan');
  const isMarqueeSelectingRef = useRef<boolean>(false);
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState<boolean>(false);
  const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [marqueeRect, setMarqueeRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  // Quick Range Selector State
  const [isRangeModalOpen, setIsRangeModalOpen] = useState<boolean>(false);
  const [rangeStartInput, setRangeStartInput] = useState<string>('1');
  const [rangeEndInput, setRangeEndInput] = useState<string>('20');

  // Current Active Image State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 4000,
    height: 4000,
  });

  // UI Mode: Basic, Advanced, Expert
  const [uiMode, setUiMode] = useState<UIMode>('Advanced');

  // View Mode: 'halftone' | 'original' | 'split'
  const [viewMode, setViewMode] = useState<ViewMode>('halftone');
  const [splitPosition, setSplitPosition] = useState<number>(0.5); // 0 to 1
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // Top Bar Pattern Modes
  const [patternMode, setPatternMode] = useState<PatternMode>('circle');

  // Crop / Mask State
  const [maskType, setMaskType] = useState<'none' | 'circle' | 'vignette'>('none');

  // Saved Custom Presets State (Persisted in localStorage)
  const [customPresets, setCustomPresets] = useState<SavedPreset[]>(() => {
    try {
      const saved = localStorage.getItem('halftone_custom_presets_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [presetNameInput, setPresetNameInput] = useState<string>('');
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState<boolean>(false);
  const [presetToDelete, setPresetToDelete] = useState<SavedPreset | null>(null);
  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const [isSavePresetModalOpen, setIsSavePresetModalOpen] = useState<boolean>(false);
  const [newPresetName, setNewPresetName] = useState<string>('');

  // Clear Image Confirmation Modal State
  const [isClearConfirmModalOpen, setIsClearConfirmModalOpen] = useState<boolean>(false);

  // AI Background Removal Modal
  const [isAiBgModalOpen, setIsAiBgModalOpen] = useState<boolean>(false);
  const [isRemovingBgAi, setIsRemovingBgAi] = useState<boolean>(false);

  // Modular Left Dock & Drawer State (Photoshop / Illustrator Style)
  const [activeCategory, setActiveCategory] = useState<ActiveCategory | null>('grid');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // 60 FPS Slider Dragging Performance States
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const slidingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onSliderStart = useCallback(() => {
    if (slidingTimerRef.current) clearTimeout(slidingTimerRef.current);
    setIsSliding(true);
    setApplyAllStatus('idle');
  }, []);

  const onSliderEnd = useCallback(() => {
    if (slidingTimerRef.current) clearTimeout(slidingTimerRef.current);
    slidingTimerRef.current = setTimeout(() => {
      setIsSliding(false);
    }, 120);
  }, []);

  // Modals State
  const [isJsxModalOpen, setIsJsxModalOpen] = useState<boolean>(false);
  const [isCreateArtboardModalOpen, setIsCreateArtboardModalOpen] = useState<boolean>(false);
  const [newArtboardWidth, setNewArtboardWidth] = useState<number>(2000);
  const [newArtboardHeight, setNewArtboardHeight] = useState<number>(2000);
  const [newArtboardBgColor, setNewArtboardBgColor] = useState<string>('#ffffff');

  // --- 1. Canvas & Adjustments ---
  const [fitMode, setFitMode] = useState<FitMode>('Fit to Short Edge');
  const [baseResolution, setBaseResolution] = useState<number>(4000); // Default 4000px
  const [blur, setBlur] = useState<number>(0); // 0 to 100 (%)
  const [blurType, setBlurType] = useState<BlurType>('gaussian');
  const [blurAngle, setBlurAngle] = useState<number>(0);
  const [blurThreshold, setBlurThreshold] = useState<number>(25);
  const [gamma, setGamma] = useState<number>(0.7); // 0.1 to 3.0
  const [contrast, setContrast] = useState<number>(-0.8); // -2.0 to 2.0
  const [clampMin, setClampMin] = useState<number>(0); // 0 to 1
  const [clampMax, setClampMax] = useState<number>(0.85); // 0 to 1
  const [normalizeLuminance, setNormalizeLuminance] = useState<boolean>(true);

  // --- 2. Grid ---
  const [gridSpacing, setGridSpacing] = useState<number>(27.5); // Spacing: 5 to 80
  const [rotation, setRotation] = useState<number>(-33); // Rotation: -180 to 180
  const [diameter, setDiameter] = useState<number>(1); // Diameter: 0.1 to 2.5
  const [stretchAmount, setStretchAmount] = useState<number>(1); // Stretch: 0.2 to 3.0
  const [skew, setSkew] = useState<number>(0); // Skew: -45 to 45
  const [deformAxis, setDeformAxis] = useState<number>(0); // Axis: 0 to 180
  const [deformAxisFollowsGrid, setDeformAxisFollowsGrid] = useState<boolean>(false);
  const [regionMerging, setRegionMerging] = useState<boolean>(false);

  // --- 3. Sampling ---
  const [samplingChannel, setSamplingChannel] = useState<SamplingChannel>('inverse_luminance');
  const [invert, setInvert] = useState<boolean>(false);
  const [levelMaskMin, setLevelMaskMin] = useState<number>(0);
  const [levelMaskMax, setLevelMaskMax] = useState<number>(1);
  const [discardTransparentAreas, setDiscardTransparentAreas] = useState<boolean>(true);

  // --- 4. Dots & Lines ---
  const [dotStyle, setDotStyle] = useState<DotStyle>('circle');
  const [outlineOnly, setOutlineOnly] = useState<boolean>(false);
  const [dotSize, setDotSize] = useState<number>(1); // Multiplier: 0.2 to 6.0
  const [minDotSize, setMinDotSize] = useState<number>(0); // Minimum size in px (0 to 60)
  const [maxDotSize, setMaxDotSize] = useState<number>(28); // Maximum size in px (20-30px standard for 4000x4000 artboard)
  const [minDotMode, setMinDotMode] = useState<'cutoff' | 'clamp'>('cutoff'); // Cutoff: clean drop below min; Clamp: minimum floor
  const [sizeResponse, setSizeResponse] = useState<number>(0); // -1 to 1
  const [sizeOffset, setSizeOffset] = useState<number>(0); // -1 to 1
  const [scaleFactor, setScaleFactor] = useState<number>(1); // 0.2 to 3.0
  const [deformWithGrid, setDeformWithGrid] = useState<boolean>(true);
  const [densitySizing, setDensitySizing] = useState<boolean>(false);

  // --- 5. Colors ---
  const [colorMode, setColorMode] = useState<ColorMode>('two_colors');
  const [foregroundColor, setForegroundColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [gradation, setGradation] = useState<number>(0);
  const [transparentBg, setTransparentBg] = useState<boolean>(true);

  // --- 5.1 Sticker / Silhouette Offset Shape ---
  const [stickerUnderlayEnabled, setStickerUnderlayEnabled] = useState<boolean>(false);
  const [stickerOffset, setStickerOffset] = useState<number>(8); // pixels (0 to 40)
  const [stickerShiftX, setStickerShiftX] = useState<number>(0); // -40 to 40
  const [stickerShiftY, setStickerShiftY] = useState<number>(0); // -40 to 40
  const [stickerColor, setStickerColor] = useState<string>('#FFFFFF');
  const [stickerFillHoles, setStickerFillHoles] = useState<boolean>(true);
  const [isStickerAccordionOpen, setIsStickerAccordionOpen] = useState<boolean>(true);

  // --- 5.1.1 Shadow ---
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(false);
  const [shadowOffsetX, setShadowOffsetX] = useState<number>(10);
  const [shadowOffsetY, setShadowOffsetY] = useState<number>(15);
  const [shadowBlur, setShadowBlur] = useState<number>(20);
  const [shadowOpacity, setShadowOpacity] = useState<number>(0.25);
  const [shadowColor, setShadowColor] = useState<string>('#000000');

  // --- 5.2 Subject Free Transform (Ctrl+T) on 4000x4000 Artboard ---
  const [subjectTransform, setSubjectTransform] = useState<{
    x: number;
    y: number;
    scale: number;
    rotation: number;
  }>({ x: 2000, y: 2000, scale: 1.0, rotation: 0 });
  const [isTransformMode, setIsTransformMode] = useState<boolean>(false);
  const [isEraserMode, setIsEraserMode] = useState<boolean>(false);
  const [eraserSize, setEraserSize] = useState<number>(60);
  const [isErasing, setIsErasing] = useState<boolean>(false);

  const [isBrushMode, setIsBrushMode] = useState<boolean>(false);
  const [brushColor, setBrushColor] = useState<string>('#000000');
  const handleBrushColorChange = useCallback((color: string) => {
    setBrushColor(color);
    setForegroundColor(color);
  }, []);
  const [brushSize, setBrushSize] = useState<number>(80);
  const [brushHardness, setBrushHardness] = useState<number>(0);
  const [brushRoundness, setBrushRoundness] = useState<number>(100);
  const [brushAngle, setBrushAngle] = useState<number>(0);
  const [brushOpacity, setBrushOpacity] = useState<number>(100);
  const [brushFlow, setBrushFlow] = useState<number>(80);
  const [brushSpacing, setBrushSpacing] = useState<number>(15);
  const [brushBlendMode, setBrushBlendMode] = useState<'draw' | 'erase'>('draw');
  const [brushStrokeCount, setBrushStrokeCount] = useState<number>(0);

  // Helper for Auto Fit Modes
  const handleFitModeChange = (mode: FitMode) => {
    setFitMode(mode);
    setApplyAllStatus('idle');
    if (!sourceImageRef.current) return;
    const newTransform = calculateTransformForFitMode(
      sourceImageRef.current,
      mode,
      subjectTransform.rotation ?? 0
    );
    setSubjectTransform(newTransform);
    if (activeImageId) {
      imageSettingsRef.current[activeImageId] = {
        ...getCurrentSettings(),
        fitMode: mode,
        subjectTransform: newTransform,
      };
    }
    showToast(`✓ Fit Mode: ${mode}`);
  };

  // --- 5.3 Accent Contour Stroke ---
  const [accentStrokeEnabled, setAccentStrokeEnabled] = useState<boolean>(false);
  const [accentStrokeColor, setAccentStrokeColor] = useState<string>('#ef4444'); // Vivid red matching user's image
  const [accentStrokeWidth, setAccentStrokeWidth] = useState<number>(3); // 1 to 15 px
  const [accentStrokeOffset, setAccentStrokeOffset] = useState<number>(1); // 0 to 20 px
  const [accentStrokeShiftX, setAccentStrokeShiftX] = useState<number>(3); // -30 to 30 px
  const [accentStrokeShiftY, setAccentStrokeShiftY] = useState<number>(1); // -30 to 30 px
  const [accentStrokeOpacity, setAccentStrokeOpacity] = useState<number>(1); // 0 to 1

  // --- 6. ADVANCED FEATURES (Fully Implemented & Interactive) ---
  const [displacementAmount, setDisplacementAmount] = useState<number>(0);
  const [displacementFrequency, setDisplacementFrequency] = useState<number>(15);
  const [samplingPosterize, setSamplingPosterize] = useState<number>(0);
  const [noiseAmount, setNoiseAmount] = useState<number>(0);
  const [quantizeLevels, setQuantizeLevels] = useState<number>(0);
  const [pixelSharpness, setPixelSharpness] = useState<number>(1);

  // Accordion Section States
  const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(true);
  const [isGridOpen, setIsGridOpen] = useState<boolean>(true);
  const [isSamplingOpen, setIsSamplingOpen] = useState<boolean>(true);
  const [isDotsOpen, setIsDotsOpen] = useState<boolean>(true);
  const [isColorsOpen, setIsColorsOpen] = useState<boolean>(true);
  const [isDisplacementOpen, setIsDisplacementOpen] = useState<boolean>(true);
  const [isSamplingEffectsOpen, setIsSamplingEffectsOpen] = useState<boolean>(false);
  const [isQuantizationOpen, setIsQuantizationOpen] = useState<boolean>(false);
  const [isPixelRendererOpen, setIsPixelRendererOpen] = useState<boolean>(false);

  // Viewport (Zoom & Pan) - Default 0.7 (70%) fits perfectly between header and filmstrip
  const [zoom, setZoom] = useState<number>(0.7);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringSplit, setIsHoveringSplit] = useState<boolean>(false);
  // Spacebar Hand Tool (Photoshop-style Artboard Pan in ANY mode)
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);
  const isSpacePressedRef = useRef<boolean>(false);

  // Processing & Elements
  const [elements, setElements] = useState<HalftoneElement[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Original unedited image backup for reset/crop
  const originalMasterImageRef = useRef<HTMLImageElement | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const artboardEraseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageEraseCanvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const imageEraseUndoStacksRef = useRef<Record<string, HTMLCanvasElement[]>>({});
  const lastErasePointRef = useRef<{ x: number; y: number } | null>(null);
  const eraseUndoStackRef = useRef<HTMLCanvasElement[]>([]);
  const eraserCursorRef = useRef<HTMLDivElement>(null);
  const eraseDebounceTimerRef = useRef<number | null>(null);

  // Photoshop Shading Brush Refs
  const artboardBrushCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageBrushCanvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const imageBrushUndoStacksRef = useRef<Record<string, HTMLCanvasElement[]>>({});
  const lastBrushPointRef = useRef<{ x: number; y: number } | null>(null);
  const brushUndoStackRef = useRef<HTMLCanvasElement[]>([]);
  const brushCursorRef = useRef<HTMLDivElement>(null);
  const isPaintingRef = useRef<boolean>(false);
  const cachedBrushStampRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Swap Colors
  const handleSwapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };

  // Reset to Defaults
  const handleReset = () => {
    if (originalMasterImageRef.current) {
      sourceImageRef.current = originalMasterImageRef.current;
      setImageSrc(originalMasterImageRef.current.src);
      setImageDimensions({
        width: 4000,
        height: 4000,
      });
      const natW = originalMasterImageRef.current.naturalWidth || 1000;
      const natH = originalMasterImageRef.current.naturalHeight || 1000;
      const maxDim = Math.max(natW, natH);
      const initScale = maxDim > 0 ? parseFloat((2800 / maxDim).toFixed(3)) : 1;
      setSubjectTransform({ x: 2000, y: 2000, scale: initScale, rotation: 0 });
    }
    setIsTransformMode(false);
    setIsEraserMode(false);
    setIsBrushMode(false);
    artboardEraseCanvasRef.current = null;
    eraseUndoStackRef.current = [];
    artboardBrushCanvasRef.current = null;
    brushUndoStackRef.current = [];
    setBrushStrokeCount(0);
    setPatternMode('circle');
    setDotStyle('circle');
    setFitMode('Fit to Short Edge');
    setBaseResolution(4000);
    setBlur(0);
    setGamma(0.7);
    setContrast(-0.8);
    setClampMin(0);
    setClampMax(0.85);
    setNormalizeLuminance(true);
    setGridSpacing(27.5);
    setRotation(-33);
    setDiameter(1);
    setStretchAmount(1);
    setSkew(0);
    setDeformAxis(0);
    setDeformAxisFollowsGrid(false);
    setRegionMerging(false);
    setSamplingChannel('inverse_luminance');
    setInvert(false);
    setLevelMaskMin(0);
    setLevelMaskMax(1);
    setDiscardTransparentAreas(true);
    setDotStyle('circle');
    setOutlineOnly(false);
    setDotSize(1);
    setMinDotSize(0);
    setMinDotMode('cutoff');
    setSizeResponse(0);
    setSizeOffset(0);
    setScaleFactor(1);
    setColorMode('two_colors');
    setForegroundColor('#000000');
    setBackgroundColor('#FFFFFF');
    setTransparentBg(true);
    setDisplacementAmount(0);
    setDisplacementFrequency(15);
    setSamplingPosterize(0);
    setNoiseAmount(0);
    setQuantizeLevels(0);
    setPixelSharpness(1);
    setZoom(0.7);
    setPan({ x: 0, y: 0 });
    setMaskType('none');
    setViewMode('halftone');
    setSplitPosition(0.5);
    setStickerUnderlayEnabled(false);
    setAccentStrokeEnabled(false);
    showToast('All settings reset to default values!');
  };

  // Clear Image & Empty Dashboard
  const handleClearDashboard = () => {
    setImages([]);
    setActiveImageId(null);
    activeImageIdRef.current = null;
    setSelectedImageIds([]);
    lastSelectedImageIdRef.current = null;
    imageSettingsRef.current = {};
    setImageSrc(null);
    setImageName('');
    setImageDimensions({ width: 4000, height: 4000 });
    setElements([]);
    sourceImageRef.current = null;
    originalMasterImageRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPan({ x: 0, y: 0 });
    setZoom(0.7);
    setMaskType('none');
    setIsTransformMode(false);
    setIsEraserMode(false);
    setIsBrushMode(false);
    artboardEraseCanvasRef.current = null;
    imageEraseCanvasesRef.current = {};
    imageEraseUndoStacksRef.current = {};
    eraseUndoStackRef.current = [];
    artboardBrushCanvasRef.current = null;
    imageBrushCanvasesRef.current = {};
    imageBrushUndoStacksRef.current = {};
    brushUndoStackRef.current = [];
    setBrushStrokeCount(0);
    setSubjectTransform({ x: 2000, y: 2000, scale: 1.0, rotation: 0 });
    setIsClearConfirmModalOpen(false);
    showToast('✓ Dashboard cleared and reset successfully!');
  };

  // Apply a Saved Preset to all active controls
  const applyPreset = useCallback(
    (preset: SavedPreset) => {
      const s = preset.settings;
      if (s.patternMode) setPatternMode(s.patternMode);
      if (s.gridSpacing !== undefined) setGridSpacing(s.gridSpacing);
      if (s.rotation !== undefined) setRotation(s.rotation);
      if (s.diameter !== undefined) setDiameter(s.diameter);
      if (s.stretchAmount !== undefined) setStretchAmount(s.stretchAmount);
      if (s.skew !== undefined) setSkew(s.skew);
      if (s.dotStyle) setDotStyle(s.dotStyle);
      if (s.dotSize !== undefined) setDotSize(s.dotSize);
      if (s.minDotSize !== undefined) setMinDotSize(s.minDotSize);
      if (s.maxDotSize !== undefined) setMaxDotSize(s.maxDotSize);
      if (s.minDotMode) setMinDotMode(s.minDotMode);
      if (s.sizeResponse !== undefined) setSizeResponse(s.sizeResponse);
      if (s.scaleFactor !== undefined) setScaleFactor(s.scaleFactor);
      if (s.contrast !== undefined) setContrast(s.contrast);
      if (s.gamma !== undefined) setGamma(s.gamma);
      if (s.blur !== undefined) setBlur(s.blur);
      if (s.clampMin !== undefined) setClampMin(s.clampMin);
      if (s.clampMax !== undefined) setClampMax(s.clampMax);
      if (s.normalizeLuminance !== undefined) setNormalizeLuminance(s.normalizeLuminance);
      if (s.samplingChannel) setSamplingChannel(s.samplingChannel);
      if (s.invert !== undefined) setInvert(s.invert);
      if (s.foregroundColor) setForegroundColor(s.foregroundColor);
      if (s.backgroundColor) setBackgroundColor(s.backgroundColor);
      if (s.transparentBg !== undefined) setTransparentBg(s.transparentBg);
      if (s.stickerUnderlayEnabled !== undefined) setStickerUnderlayEnabled(s.stickerUnderlayEnabled);
      if (s.stickerOffset !== undefined) setStickerOffset(s.stickerOffset);
      if (s.stickerShiftX !== undefined) setStickerShiftX(s.stickerShiftX);
      if (s.stickerShiftY !== undefined) setStickerShiftY(s.stickerShiftY);
      if (s.stickerColor !== undefined) setStickerColor(s.stickerColor);
      if (s.stickerFillHoles !== undefined) setStickerFillHoles(s.stickerFillHoles);
      if (s.accentStrokeEnabled !== undefined) setAccentStrokeEnabled(s.accentStrokeEnabled);
      if (s.accentStrokeColor !== undefined) setAccentStrokeColor(s.accentStrokeColor);
      if (s.accentStrokeWidth !== undefined) setAccentStrokeWidth(s.accentStrokeWidth);
      if (s.accentStrokeOffset !== undefined) setAccentStrokeOffset(s.accentStrokeOffset);
      if (s.accentStrokeShiftX !== undefined) setAccentStrokeShiftX(s.accentStrokeShiftX);
      if (s.accentStrokeShiftY !== undefined) setAccentStrokeShiftY(s.accentStrokeShiftY);
      if (s.accentStrokeOpacity !== undefined) setAccentStrokeOpacity(s.accentStrokeOpacity);
      if (s.displacementAmount !== undefined) setDisplacementAmount(s.displacementAmount);
      if (s.displacementFrequency !== undefined) setDisplacementFrequency(s.displacementFrequency);
      if (s.samplingPosterize !== undefined) setSamplingPosterize(s.samplingPosterize);
      if (s.noiseAmount !== undefined) setNoiseAmount(s.noiseAmount);
      if (s.quantizeLevels !== undefined) setQuantizeLevels(s.quantizeLevels);
      setActivePresetId(preset.id);
      setPresetNameInput(preset.name.replace(/^[⭐🎨🖨️⬡✒️]\s*/, ''));
      showToast(`✓ "${preset.name}" preset applied!`);
    },
    []
  );

  // Save current setup as a new preset into localStorage (from bar input or modal)
  const handleSaveCurrentPreset = (customName?: string) => {
    const raw = customName !== undefined ? customName : (presetNameInput || newPresetName);
    const trimmed = raw.trim();
    const finalName = trimmed || `Preset ${customPresets.length + 1}`;
    const newPreset: SavedPreset = {
      id: `custom_${Date.now()}`,
      name: finalName,
      isCustom: true,
      createdAt: Date.now(),
      settings: {
        patternMode,
        gridSpacing,
        rotation,
        diameter,
        stretchAmount,
        skew,
        dotStyle,
        dotSize,
        minDotSize,
        maxDotSize,
        minDotMode,
        sizeResponse,
        scaleFactor,
        contrast,
        gamma,
        blur,
        clampMin,
        clampMax,
        normalizeLuminance,
        samplingChannel,
        invert,
        foregroundColor,
        backgroundColor,
        transparentBg,
        stickerUnderlayEnabled,
        stickerOffset,
        stickerShiftX,
        stickerShiftY,
        stickerColor,
        stickerFillHoles,
        accentStrokeEnabled,
        accentStrokeColor,
        accentStrokeWidth,
        accentStrokeOffset,
        accentStrokeShiftX,
        accentStrokeShiftY,
        accentStrokeOpacity,
        displacementAmount,
        displacementFrequency,
        samplingPosterize,
        noiseAmount,
        quantizeLevels,
      },
    };
    const updated = [newPreset, ...customPresets];
    setCustomPresets(updated);
    try {
      localStorage.setItem('halftone_custom_presets_v1', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setActivePresetId(newPreset.id);
    setPresetNameInput(finalName);
    setIsSavePresetModalOpen(false);
    setNewPresetName('');
    showToast(`✓ "${finalName}" preset saved successfully!`);
  };

  // Delete a custom preset
  const handleDeleteCustomPreset = (presetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const filtered = customPresets.filter((p) => p.id !== presetId);
    setCustomPresets(filtered);
    try {
      localStorage.setItem('halftone_custom_presets_v1', JSON.stringify(filtered));
    } catch (err) {
      console.error(err);
    }
    if (activePresetId === presetId) {
      setActivePresetId(null);
      setPresetNameInput('');
    }
    showToast('Preset deleted');
  };

  // Close preset dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        presetDropdownRef.current &&
        !presetDropdownRef.current.contains(e.target as Node)
      ) {
        setIsPresetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * AI-Powered Background Removal using Gemini Vision
   * Detects foreground subject silhouette and generates high-precision alpha mask
   */
  const handleExecuteAiBackgroundRemoval = async () => {
    if (!sourceImageRef.current || imageDimensions.width === 0) {
      showToast('Please upload an image first!');
      return;
    }

    setIsRemovingBgAi(true);
    showToast('🤖 AI Background Remover processing...');

    try {
      const { width, height } = imageDimensions;
      // Downsample for fast AI segmentation
      const maxDim = 800;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      const sw = Math.round(width * scale);
      const sh = Math.round(height * scale);

      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = sw;
      thumbCanvas.height = sh;
      const tctx = thumbCanvas.getContext('2d')!;
      tctx.drawImage(sourceImageRef.current, 0, 0, sw, sh);
      const base64Data = thumbCanvas.toDataURL('image/jpeg', 0.85);

      const res = await fetch('/api/ai-remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: 'image/jpeg',
          width,
          height,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const resData = await res.json();
      const parsed = resData.segmentation || {};

      // Execute precision cutout on full-res canvas using AI RGB & Box guidance
      const cvs = document.createElement('canvas');
      cvs.width = width;
      cvs.height = height;
      const ctx = cvs.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(sourceImageRef.current, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const d = imgData.data;

      const [bgR, bgG, bgB] = parsed.estimatedBgRgb || [250, 250, 250];
      const tolerance = parsed.colorTolerance || 45;

      let [ymin, xmin, ymax, xmax] = parsed.cropBox || [0, 0, 1000, 1000];
      const boxLeft = Math.round((xmin / 1000) * width);
      const boxRight = Math.round((xmax / 1000) * width);
      const boxTop = Math.round((ymin / 1000) * height);
      const boxBottom = Math.round((ymax / 1000) * height);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = d[idx];
          const g = d[idx + 1];
          const b = d[idx + 2];

          // Outside bounding box is definitely background
          if (x < boxLeft - 5 || x > boxRight + 5 || y < boxTop - 5 || y > boxBottom + 5) {
            d[idx + 3] = 0;
            continue;
          }

          const dist = Math.sqrt(
            (r - bgR) * (r - bgR) + (g - bgG) * (g - bgG) + (b - bgB) * (b - bgB)
          );

          if (dist < tolerance) {
            const alphaFactor = Math.max(0, (dist - (tolerance - 15)) / 15);
            d[idx + 3] = Math.round(d[idx + 3] * alphaFactor);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const newUrl = cvs.toDataURL('image/png');
      const newImg = new Image();
      newImg.onload = () => {
        sourceImageRef.current = newImg;
        setImageSrc(newUrl);
        setIsRemovingBgAi(false);
        setIsAiBgModalOpen(false);
        showToast('✓ AI Background Removal completed successfully!');
      };
      newImg.src = newUrl;
    } catch (err: any) {
      setIsRemovingBgAi(false);
      showToast(`AI processing error: ${err?.message || 'Failed'}`);
    }
  };

  // Local fallback background remover
  const handleLocalBackgroundRemover = () => {
    if (!sourceImageRef.current || imageDimensions.width === 0) {
      showToast('Please upload an image first!');
      return;
    }
    setIsProcessing(true);

    const { width, height } = imageDimensions;
    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d', { willReadFrequently: true })!;
    ctx.drawImage(sourceImageRef.current, 0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;

    const c1 = [d[0], d[1], d[2]];
    const c2 = [d[(width - 1) * 4], d[(width - 1) * 4 + 1], d[(width - 1) * 4 + 2]];
    const c3 = [d[(height - 1) * width * 4], d[(height - 1) * width * 4 + 1], d[(height - 1) * width * 4 + 2]];
    const c4 = [
      d[(height * width - 1) * 4],
      d[(height * width - 1) * 4 + 1],
      d[(height * width - 1) * 4 + 2],
    ];

    const bgR = (c1[0] + c2[0] + c3[0] + c4[0]) / 4;
    const bgG = (c1[1] + c2[1] + c3[1] + c4[1]) / 4;
    const bgB = (c1[2] + c2[2] + c3[2] + c4[2]) / 4;

    const threshold = 48;

    for (let i = 0; i < d.length; i += 4) {
      const diffR = Math.abs(d[i] - bgR);
      const diffG = Math.abs(d[i + 1] - bgG);
      const diffB = Math.abs(d[i + 2] - bgB);
      const dist = Math.sqrt(diffR * diffR + diffG * diffG + diffB * diffB);

      if (dist < threshold) {
        const alphaFactor = Math.max(0, (dist - (threshold - 15)) / 15);
        d[i + 3] = Math.round(d[i + 3] * alphaFactor);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const newUrl = cvs.toDataURL('image/png');
    const newImg = new Image();
    newImg.onload = () => {
      sourceImageRef.current = newImg;
      setImageSrc(newUrl);
      setIsProcessing(false);
      showToast('✓ Fast local background removal complete!');
    };
    newImg.src = newUrl;
  };

  /**
   * 100% Reliable Crop Handler
   */
  const handleApplyCrop = () => {
    if (!sourceImageRef.current || imageDimensions.width === 0) {
      showToast('Please upload an image first!');
      return;
    }
    const { width, height } = imageDimensions;
    const cropX = Math.round(width * 0.1);
    const cropY = Math.round(height * 0.1);
    const newW = width - cropX * 2;
    const newH = height - cropY * 2;

    if (newW < 50 || newH < 50) {
      showToast('Image cannot be cropped further!');
      return;
    }

    const cvs = document.createElement('canvas');
    cvs.width = newW;
    cvs.height = newH;
    const ctx = cvs.getContext('2d')!;
    ctx.drawImage(sourceImageRef.current, cropX, cropY, newW, newH, 0, 0, newW, newH);

    const newUrl = cvs.toDataURL('image/png');
    const newImg = new Image();
    newImg.onload = () => {
      sourceImageRef.current = newImg;
      setImageSrc(newUrl);
      setImageDimensions({ width: 4000, height: 4000 });
      setPan({ x: 0, y: 0 });
      setZoom((prev) => (prev > 0.1 && prev <= 4 ? prev : 0.7));
      showToast('✓ Image cropped successfully!');
    };
    newImg.src = newUrl;
  };

  // Mask Handler (Circle / Vignette / None)
  const handleToggleMask = () => {
    if (maskType === 'none') {
      setMaskType('circle');
      showToast('✓ Circular mask active!');
    } else if (maskType === 'circle') {
      setMaskType('vignette');
      showToast('✓ Vignette mask active!');
    } else {
      setMaskType('none');
      showToast('✓ Mask disabled!');
    }
  };

  /**
   * Photoshop Blur Engine
   * Implements high-performance Gaussian, Motion, Radial Spin, Radial Zoom, Box, Surface, and Lens blurs.
   */
  const applyPhotoshopBlur = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    blurType: BlurType = 'gaussian',
    blurRadius: number = 0,
    blurAngle: number = 0,
    blurThreshold: number = 25
  ) => {
    if (blurRadius <= 0) return;

    // For Gaussian, Box, and Lens blurs, use multi-scale pyramid blur:
    // Large blur radii (> 30px on 4000px canvas) exceed browser Skia GPU kernel limits and drop draw calls.
    // Downsampling ensures instantaneous 60fps performance and guaranteed, silky smooth shadow falloff.
    if (blurType === 'gaussian' || blurType === 'box' || blurType === 'lens') {
      const downsampleFactor = blurRadius > 60 ? 8 : blurRadius > 25 ? 4 : blurRadius > 10 ? 2 : 1;
      const downW = Math.max(16, Math.round(width / downsampleFactor));
      const downH = Math.max(16, Math.round(height / downsampleFactor));
      const downRadius = Math.max(0.5, blurRadius / downsampleFactor);

      const smallCanvas = document.createElement('canvas');
      smallCanvas.width = downW;
      smallCanvas.height = downH;
      const sCtx = smallCanvas.getContext('2d');
      if (!sCtx) return;

      // 1. Draw into small canvas with blur applied
      sCtx.imageSmoothingEnabled = true;
      sCtx.imageSmoothingQuality = 'high';
      const filterStr = blurType === 'lens'
        ? `blur(${downRadius}px) contrast(105%)`
        : `blur(${downRadius}px)`;
      sCtx.filter = filterStr;
      sCtx.drawImage(ctx.canvas, 0, 0, downW, downH);
      sCtx.filter = 'none';

      // 2. Draw back to original ctx with bilinear interpolation
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(smallCanvas, 0, 0, width, height);
      ctx.restore();
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tctx = tempCanvas.getContext('2d');
    if (!tctx) return;
    tctx.drawImage(ctx.canvas, 0, 0);

    if (blurType === 'motion') {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const rad = (blurAngle * Math.PI) / 180;
      const steps = Math.min(22, Math.max(6, Math.round(blurRadius * 0.25)));
      const maxDist = blurRadius * 1.5;
      ctx.globalAlpha = 1 / steps;
      for (let i = 0; i < steps; i++) {
        const t = (i / (steps - 1) - 0.5) * 2;
        const ox = Math.cos(rad) * maxDist * t;
        const oy = Math.sin(rad) * maxDist * t;
        ctx.drawImage(tempCanvas, ox, oy);
      }
      ctx.restore();
    } else if (blurType === 'radial_zoom') {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const steps = Math.min(20, Math.max(6, Math.round(blurRadius * 0.2)));
      ctx.globalAlpha = 1 / steps;
      const maxScaleOffset = Math.min(0.45, (blurRadius / 250) * 0.4);
      for (let i = 0; i < steps; i++) {
        const factor = 1 + (i / (steps - 1) - 0.5) * maxScaleOffset * 2;
        const dw = width * factor;
        const dh = height * factor;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(tempCanvas, dx, dy, dw, dh);
      }
      ctx.restore();
    } else if (blurType === 'radial_spin') {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const steps = Math.min(20, Math.max(6, Math.round(blurRadius * 0.2)));
      ctx.globalAlpha = 1 / steps;
      const maxAngleRad = ((blurRadius / 250) * 25 * Math.PI) / 180;
      ctx.translate(width / 2, height / 2);
      for (let i = 0; i < steps; i++) {
        ctx.save();
        const rot = (i / (steps - 1) - 0.5) * maxAngleRad * 2;
        ctx.rotate(rot);
        ctx.drawImage(tempCanvas, -width / 2, -height / 2);
        ctx.restore();
      }
      ctx.restore();
    } else if (blurType === 'surface') {
      const blurCanvas = document.createElement('canvas');
      blurCanvas.width = width;
      blurCanvas.height = height;
      const bctx = blurCanvas.getContext('2d');
      if (!bctx) return;
      bctx.filter = `blur(${Math.max(0.5, blurRadius * 0.8)}px)`;
      bctx.drawImage(tempCanvas, 0, 0);

      const origImgData = tctx.getImageData(0, 0, width, height);
      const blurImgData = bctx.getImageData(0, 0, width, height);
      const oD = origImgData.data;
      const bD = blurImgData.data;
      const thresh = blurThreshold * 2.55;

      for (let i = 0; i < oD.length; i += 4) {
        const diff = (Math.abs(oD[i] - bD[i]) + Math.abs(oD[i + 1] - bD[i + 1]) + Math.abs(oD[i + 2] - bD[i + 2])) / 3;
        if (diff <= thresh) {
          oD[i] = bD[i];
          oD[i + 1] = bD[i + 1];
          oD[i + 2] = bD[i + 2];
        }
      }
      ctx.putImageData(origImgData, 0, 0);
    } else if (blurType === 'lens') {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.filter = `blur(${Math.max(0.5, blurRadius)}px) contrast(105%)`;
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.filter = 'none';
      ctx.restore();
    }
  };

  /**
   * Complete, Master Halftone Engine
   * baseResolution dynamically rescales sampling density without changing original image aspect
   */
  const generateHalftoneForImage = useCallback(
    (
      img: HTMLImageElement,
      origWidth: number,
      origHeight: number,
      isFastPreview: boolean = false,
      overrideSettings?: ImageEffectSettings,
      overrideEraseCanvas?: HTMLCanvasElement | null,
      overrideBrushCanvas?: HTMLCanvasElement | null
    ): HalftoneElement[] => {
      if (!img || origWidth === 0 || origHeight === 0) return [];

      const effPatternMode = overrideSettings?.patternMode ?? patternMode;
      const effGridSpacing = overrideSettings?.gridSpacing ?? gridSpacing;
      const effRotation = overrideSettings?.rotation ?? rotation;
      const effDiameter = overrideSettings?.diameter ?? diameter;
      const effStretchAmount = overrideSettings?.stretchAmount ?? stretchAmount;
      const effSkew = overrideSettings?.skew ?? skew;
      const effSamplingChannel = overrideSettings?.samplingChannel ?? samplingChannel;
      const effInvert = overrideSettings?.invert !== undefined ? overrideSettings.invert : invert;
      const effLevelMaskMin = overrideSettings?.levelMaskMin !== undefined ? overrideSettings.levelMaskMin : levelMaskMin;
      const effLevelMaskMax = overrideSettings?.levelMaskMax !== undefined ? overrideSettings.levelMaskMax : levelMaskMax;
      const effDiscardTransparentAreas = overrideSettings?.discardTransparentAreas !== undefined ? overrideSettings.discardTransparentAreas : discardTransparentAreas;
      const effDotStyle = overrideSettings?.dotStyle ?? dotStyle;
      const effDotSize = overrideSettings?.dotSize !== undefined ? overrideSettings.dotSize : dotSize;
      const effMinDotSize = overrideSettings?.minDotSize !== undefined ? overrideSettings.minDotSize : minDotSize;
      const effMaxDotSize = overrideSettings?.maxDotSize !== undefined ? overrideSettings.maxDotSize : maxDotSize;
      const effMinDotMode = overrideSettings?.minDotMode ?? minDotMode;
      const effSizeResponse = overrideSettings?.sizeResponse !== undefined ? overrideSettings.sizeResponse : sizeResponse;
      const effSizeOffset = overrideSettings?.sizeOffset !== undefined ? overrideSettings.sizeOffset : sizeOffset;
      const effScaleFactor = overrideSettings?.scaleFactor !== undefined ? overrideSettings.scaleFactor : scaleFactor;
      const useBlur = overrideSettings?.blur !== undefined ? overrideSettings.blur : blur;
      const useBlurType = overrideSettings?.blurType || blurType;
      const useBlurAngle = overrideSettings?.blurAngle !== undefined ? overrideSettings.blurAngle : blurAngle;
      const useBlurThreshold = overrideSettings?.blurThreshold !== undefined ? overrideSettings.blurThreshold : blurThreshold;
      const effGamma = overrideSettings?.gamma !== undefined ? overrideSettings.gamma : gamma;
      const effContrast = overrideSettings?.contrast !== undefined ? overrideSettings.contrast : contrast;
      const effClampMin = overrideSettings?.clampMin !== undefined ? overrideSettings.clampMin : clampMin;
      const effClampMax = overrideSettings?.clampMax !== undefined ? overrideSettings.clampMax : clampMax;
      const effTransparentBg = overrideSettings?.transparentBg !== undefined ? overrideSettings.transparentBg : transparentBg;
      const effBackgroundColor = overrideSettings?.backgroundColor || backgroundColor;
      const effDisplacementAmount = overrideSettings?.displacementAmount !== undefined ? overrideSettings.displacementAmount : displacementAmount;
      const effDisplacementFrequency = overrideSettings?.displacementFrequency !== undefined ? overrideSettings.displacementFrequency : displacementFrequency;
      const effSamplingPosterize = overrideSettings?.samplingPosterize !== undefined ? overrideSettings.samplingPosterize : samplingPosterize;
      const effNoiseAmount = overrideSettings?.noiseAmount !== undefined ? overrideSettings.noiseAmount : noiseAmount;
      const effQuantizeLevels = overrideSettings?.quantizeLevels !== undefined ? overrideSettings.quantizeLevels : quantizeLevels;
      const useTransform = overrideSettings?.subjectTransform || subjectTransform;

      // 60 FPS Super-Fast Preview Downsampling during interactive slider dragging
      const maxDim = Math.max(origWidth, origHeight);
      const isDownsample = isFastPreview && maxDim > 1000;
      const targetScale = isDownsample ? 1000 / maxDim : 1;
      const width = Math.round(origWidth * targetScale);
      const height = Math.round(origHeight * targetScale);
      const upscale = isDownsample ? 1 / targetScale : 1;

      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = width;
      sampleCanvas.height = height;
      const ctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return [];

      // Fill canvas background if not transparent, preventing blur from bleeding into transparent black void
      if (!effTransparentBg && effBackgroundColor) {
        ctx.fillStyle = effBackgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw transformed subject on the sample canvas
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;
      const drawW = natW * useTransform.scale * targetScale;
      const drawH = natH * useTransform.scale * targetScale;
      const drawX = (useTransform.x * targetScale) - drawW / 2;
      const drawY = (useTransform.y * targetScale) - drawH / 2;

      ctx.save();
      if (useTransform.rotation) {
        ctx.translate(useTransform.x * targetScale, useTransform.y * targetScale);
        ctx.rotate((useTransform.rotation * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
      ctx.restore();

      // Artboard Erase Mask applied directly to sampling
      const effectiveEraseCanvas = overrideEraseCanvas !== undefined ? overrideEraseCanvas : artboardEraseCanvasRef.current;
      if (effectiveEraseCanvas) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(effectiveEraseCanvas, 0, 0, width, height);
        ctx.restore();
      }

      // Artboard Brush Shading Layer applied directly to sampling BEFORE blur
      // Ensures brush strokes and subject image blend into a unified soft shadow
      const effectiveBrushCanvas = overrideBrushCanvas !== undefined ? overrideBrushCanvas : artboardBrushCanvasRef.current;
      if (effectiveBrushCanvas) {
        ctx.save();
        ctx.drawImage(effectiveBrushCanvas, 0, 0, width, height);
        ctx.restore();
      }

      // Apply Photoshop Blur Suite if blur > 0
      // Scaled so 100% creates a deep 250px Gaussian shadow falloff across the 4000px artboard
      if (useBlur > 0) {
        const fullArtboardBlurPx = (useBlur / 100) * 250;
        const scaledBlurRadius = fullArtboardBlurPx * targetScale;
        applyPhotoshopBlur(ctx, width, height, useBlurType, scaledBlurRadius, useBlurAngle, useBlurThreshold);
      }

      // Masking applied directly to sampling
      if (maskType === 'circle') {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const mctx = maskCanvas.getContext('2d')!;
        mctx.fillStyle = '#000000';
        mctx.fillRect(0, 0, width, height);
        mctx.globalCompositeOperation = 'destination-out';
        mctx.beginPath();
        mctx.arc(width / 2, height / 2, Math.min(width, height) * 0.45, 0, Math.PI * 2);
        mctx.fill();

        ctx.drawImage(maskCanvas, 0, 0);
      } else if (maskType === 'vignette') {
        const radGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.25,
          width / 2,
          height / 2,
          Math.min(width, height) * 0.55
        );
        radGrad.addColorStop(0, 'rgba(0,0,0,0)');
        radGrad.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      }

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const sampledMap = new Float32Array(width * height);
      const invGamma = 1 / Math.max(0.05, effGamma);
      const contrastMultiplier = Math.tan(((effContrast + 2) / 4) * (Math.PI / 2));

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3] / 255;

        if (effDiscardTransparentAreas && a <= 0.002) {
          sampledMap[i / 4] = 0;
          continue;
        }

        let val = 0;
        switch (effSamplingChannel) {
          case 'luminance':
            val = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
            break;
          case 'red':
            val = r / 255;
            break;
          case 'green':
            val = g / 255;
            break;
          case 'blue':
            val = b / 255;
            break;
          case 'alpha':
            val = a;
            break;
          case 'inverse_luminance':
          default:
            val = (1 - (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (effDiscardTransparentAreas ? a : 1);
            break;
        }

        // If raw val has virtually zero ink/tone (empty white canvas in inverse luminance or empty black in luminance)
        // do not let contrast lift pure empty space into fake ghost dots!
        if (val <= 0.002) {
          if (effInvert) {
            val = 1;
            sampledMap[i / 4] = Math.max(0, Math.min(1, val * a));
          } else {
            sampledMap[i / 4] = 0;
          }
          continue;
        }

        // Apply Contrast only when tone is actually present
        if (effContrast !== 0) {
          val = (val - 0.5) * contrastMultiplier + 0.5;
          val = Math.max(0, Math.min(1, val));
        }

        // Apply Gamma
        val = Math.pow(val, invGamma);

        // Apply Clamp Range
        const cMin = Math.min(effClampMin, effClampMax - 0.05);
        const cMax = Math.max(effClampMax, effClampMin + 0.05);
        val = Math.max(cMin, Math.min(cMax, val));
        val = (val - cMin) / (cMax - cMin);

        // Apply Level Mask
        const lMin = Math.min(effLevelMaskMin, effLevelMaskMax - 0.05);
        const lMax = Math.max(effLevelMaskMax, effLevelMaskMin + 0.05);
        val = Math.max(lMin, Math.min(lMax, val));
        val = (val - lMin) / (lMax - lMin);

        // Advanced: Sampling Posterization
        if (effSamplingPosterize > 1) {
          val = Math.round(val * (effSamplingPosterize - 1)) / (effSamplingPosterize - 1);
        }

        // Advanced: Noise Effect
        if (effNoiseAmount > 0) {
          const noise = (Math.random() - 0.5) * (effNoiseAmount / 100);
          val = Math.max(0, Math.min(1, val + noise));
        }

        if (effInvert) {
          val = 1 - val;
        }

        sampledMap[i / 4] = Math.max(0, Math.min(1, val * a));
      }

      const generatedElements: HalftoneElement[] = [];
      const centerX = width / 2;
      const centerY = height / 2;

      const rad = (effRotation * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);
      const diag = Math.sqrt(width * width + height * height);

      // Base Resolution Factor (Scale grid cells relative to standard 4000px artboard)
      const resFactor = (width > 0 ? width : 4000) / Math.max(1000, baseResolution * targetScale);
      const cell = Math.max(3, effGridSpacing * targetScale * resFactor);
      const sizeScale = resFactor * effDiameter * effDotSize * effScaleFactor * targetScale;
      const effectiveMinD = effMinDotSize * sizeScale;
      const effectiveMaxD = Math.max(effectiveMinD, (effMaxDotSize || 28) * sizeScale);
      const effectiveMaxR = effectiveMaxD * 0.5;

      // CIRCLE, SQUARE & HEXAGONAL GRID
      if (effPatternMode === 'circle' || effPatternMode === 'square' || effPatternMode === 'hexagonal') {
        const rowStep = effPatternMode === 'hexagonal' ? cell * 0.8660254 : cell;
        const stepsY = Math.ceil(diag / rowStep) + 2;
        const stepsX = Math.ceil(diag / cell) + 2;

        let rowIndex = 0;
        for (let v = -stepsY * rowStep * 0.5; v <= stepsY * rowStep * 0.5; v += rowStep) {
          rowIndex++;
          const uOffset = effPatternMode === 'hexagonal' && rowIndex % 2 !== 0 ? cell * 0.5 : 0;

          for (let u = -stepsX * cell * 0.5; u <= stepsX * cell * 0.5; u += cell) {
            const skewedU = (u + uOffset) + v * Math.tan((effSkew * Math.PI) / 180);
            const stretchedV = v * effStretchAmount;

            let px = Math.round(centerX + (skewedU * cosA - stretchedV * sinA));
            let py = Math.round(centerY + (skewedU * sinA + stretchedV * cosA));

            if (effDisplacementAmount > 0) {
              const freq = effDisplacementFrequency / 100;
              px += Math.round(Math.sin(py * freq) * effDisplacementAmount);
              py += Math.round(Math.cos(px * freq) * (effDisplacementAmount * 0.6));
            }

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            let density = sampledMap[py * width + px];
            if (density <= 0.005) continue;

            if (effQuantizeLevels > 1) {
              density = Math.round(density * effQuantizeLevels) / effQuantizeLevels;
            }

            let responsiveDensity = density + effSizeOffset * 0.25;
            if (effSizeResponse !== 0) {
              const p = Math.exp(-effSizeResponse * 2);
              responsiveDensity = Math.pow(Math.max(0, responsiveDensity), p);
            }
            responsiveDensity = Math.max(0, Math.min(1, responsiveDensity));

            const naturalDiameter = responsiveDensity * effectiveMaxD;

            // Handle Minimum Size
            if (effectiveMinD > 0) {
              if (naturalDiameter < effectiveMinD) {
                if (effMinDotMode === 'cutoff') {
                  // Cutoff mode: Discard dots smaller than minimum size to prevent background speckles
                  continue;
                } else {
                  // Clamp mode: only clamp if visible tone exists
                  if (responsiveDensity <= 0.03) continue;
                }
              }
            }

            const dotDiameter =
              effMinDotMode === 'clamp' && effectiveMinD > 0
                ? Math.max(effectiveMinD, naturalDiameter)
                : naturalDiameter;

            const r = dotDiameter * 0.5;
            if (r < 0.2) continue;

            // Respect user's selected dotStyle (circle, square, diamond)
            const effectiveShape = effDotStyle || 'circle';

            if (effectiveShape === 'circle') {
              generatedElements.push({ type: 'circle', x: px, y: py, r });
            } else if (effectiveShape === 'square') {
              generatedElements.push({
                type: 'rect',
                x: px - r,
                y: py - r,
                w: r * 2,
                h: r * 2,
                rotation: effRotation || 0,
              });
            } else if (effectiveShape === 'diamond') {
              generatedElements.push({
                type: 'rect',
                x: px - r,
                y: py - r,
                w: r * 2,
                h: r * 2,
                rotation: (effRotation || 0) + 45,
              });
            }
          }
        }
      } else if (effPatternMode === 'radial') {
        const maxDist = diag / 2;
        const ringStep = cell;

        for (let dist = ringStep; dist <= maxDist; dist += ringStep) {
          const circumference = 2 * Math.PI * dist;
          const dotsInRing = Math.max(6, Math.floor(circumference / cell));
          const angleStep = (2 * Math.PI) / dotsInRing;

          for (let a = 0; a < 2 * Math.PI; a += angleStep) {
            let px = Math.round(centerX + dist * Math.cos(a + rad));
            let py = Math.round(centerY + dist * Math.sin(a + rad));

            if (effDisplacementAmount > 0) {
              px += Math.round(Math.sin(py * 0.15) * effDisplacementAmount);
              py += Math.round(Math.cos(px * 0.15) * (effDisplacementAmount * 0.5));
            }

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            const density = sampledMap[py * width + px];
            if (density <= 0.01) continue;

            const naturalDiameter = density * effectiveMaxD;
            if (effectiveMinD > 0) {
              if (naturalDiameter < effectiveMinD) {
                if (effMinDotMode === 'cutoff') continue;
                if (density <= 0.03) continue;
              }
            }
            const dotDiameter =
              effMinDotMode === 'clamp' && effectiveMinD > 0
                ? Math.max(effectiveMinD, naturalDiameter)
                : naturalDiameter;
            const r = dotDiameter * 0.5;
            if (r >= 0.2) {
              if (effDotStyle === 'square') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: (a * 180) / Math.PI,
                });
              } else if (effDotStyle === 'diamond') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: (a * 180) / Math.PI + 45,
                });
              } else {
                generatedElements.push({ type: 'circle', x: px, y: py, r });
              }
            }
          }
        }
      } else if (effPatternMode === 'line') {
        // LINE (Woodcut / Banknote Engraving continuous variable-thickness lines)
        const lineSpacing = cell;
        const numLines = Math.ceil(diag / lineSpacing) + 2;
        const segmentLength = Math.max(3, cell * 0.5);
        const stepsX = Math.ceil(diag / segmentLength) + 2;

        for (let l = -numLines * 0.5; l <= numLines * 0.5; l++) {
          const v = l * lineSpacing;
          for (let u = -stepsX * segmentLength * 0.5; u <= stepsX * segmentLength * 0.5; u += segmentLength) {
            let px = Math.round(centerX + (u * cosA - v * sinA));
            let py = Math.round(centerY + (u * sinA + v * cosA));

            if (effDisplacementAmount > 0) {
              const freq = effDisplacementFrequency / 100;
              px += Math.round(Math.sin(py * freq) * effDisplacementAmount);
              py += Math.round(Math.cos(px * freq) * (effDisplacementAmount * 0.6));
            }

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            const density = sampledMap[py * width + px];
            if (density <= 0.01) continue;

            const naturalThickness = Math.max(0.4, density * lineSpacing * effDiameter * effDotSize * effScaleFactor * 0.95);
            const minThick = effectiveMinD * 0.4;
            if (minThick > 0 && naturalThickness < minThick) {
              if (effMinDotMode === 'cutoff') continue;
              if (density <= 0.03) continue;
            }
            const thickness =
              effMinDotMode === 'clamp' && minThick > 0
                ? Math.max(minThick, naturalThickness)
                : naturalThickness;

            generatedElements.push({
              type: 'rect',
              x: px - segmentLength * 0.5,
              y: py - thickness * 0.5,
              w: segmentLength + 0.5,
              h: thickness,
              rotation: effRotation,
            });
          }
        }
      } else if (effPatternMode === 'ring') {
        // RING (Concentric circular grooves / vinyl record engraving style)
        const ringStep = Math.max(4, cell * 0.8);
        const maxDist = diag * 0.55;

        for (let dist = ringStep; dist <= maxDist; dist += ringStep) {
          const circumference = 2 * Math.PI * dist;
          const numSegs = Math.max(16, Math.floor(circumference / (cell * 0.5)));
          const angleStep = (2 * Math.PI) / numSegs;
          const arcLength = (circumference / numSegs) + 1;

          for (let a = 0; a < 2 * Math.PI; a += angleStep) {
            let px = Math.round(centerX + dist * Math.cos(a + rad));
            let py = Math.round(centerY + dist * Math.sin(a + rad));

            if (effDisplacementAmount > 0) {
              px += Math.round(Math.sin(py * 0.15) * effDisplacementAmount);
            }

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            const density = sampledMap[py * width + px];
            if (density <= 0.01) continue;

            const naturalThickness = Math.max(0.4, density * ringStep * effDiameter * effDotSize * effScaleFactor * 0.9);
            const minThick = effectiveMinD * 0.4;
            if (minThick > 0 && naturalThickness < minThick) {
              if (effMinDotMode === 'cutoff') continue;
              if (density <= 0.03) continue;
            }
            const thickness =
              effMinDotMode === 'clamp' && minThick > 0
                ? Math.max(minThick, naturalThickness)
                : naturalThickness;

            const tangentAngle = ((a + rad) * 180) / Math.PI + 90;

            generatedElements.push({
              type: 'rect',
              x: px - arcLength * 0.5,
              y: py - thickness * 0.5,
              w: arcLength,
              h: thickness,
              rotation: tangentAngle,
            });
          }
        }
      } else if (effPatternMode === 'stippling') {
        // STIPPLING (Hand-stippled organic stochastic dot distribution)
        const densityMultiplier = 1.6;
        const totalPoints = Math.floor((width * height) / (cell * cell) * densityMultiplier);

        // Deterministic pseudo-random sequence for stability across renders
        let seed = 1234567;
        const pseudoRand = () => {
          seed = (seed * 16807 + 0) % 2147483647;
          return seed / 2147483647;
        };

        for (let i = 0; i < totalPoints; i++) {
          const rx = pseudoRand() * width;
          const ry = pseudoRand() * height;
          let px = Math.floor(rx);
          let py = Math.floor(ry);

          if (px < 0 || px >= width || py < 0 || py >= height) continue;

          const density = sampledMap[py * width + px];
          // Stochastic probability check: darker areas have vastly higher chance of having dots
          if (pseudoRand() > density * 1.25) continue;

          const naturalR = (Math.pow(density, 0.7) * effectiveMaxD) * 0.5;
          if (effectiveMinD > 0 && naturalR * 2 < effectiveMinD) {
            if (effMinDotMode === 'cutoff') continue;
            if (density <= 0.03) continue;
          }
          const r = Math.max(
            0.3,
            effMinDotMode === 'clamp' && effectiveMinD > 0
              ? Math.max(effectiveMinD * 0.5, naturalR)
              : naturalR
          );

          if (effDotStyle === 'square') {
            generatedElements.push({
              type: 'rect',
              x: px - r,
              y: py - r,
              w: r * 2,
              h: r * 2,
              rotation: effRotation || 0,
            });
          } else if (effDotStyle === 'diamond') {
            generatedElements.push({
              type: 'rect',
              x: px - r,
              y: py - r,
              w: r * 2,
              h: r * 2,
              rotation: (effRotation || 0) + 45,
            });
          } else {
            generatedElements.push({ type: 'circle', x: px, y: py, r });
          }
        }
      } else if (effPatternMode === 'blob') {
        // BLOB (Metaball-like organic clusters with heavy overlap & fluid forms)
        const blobStep = cell * 0.92;
        const stepsY = Math.ceil(diag / blobStep) + 2;
        const stepsX = Math.ceil(diag / blobStep) + 2;

        let rowIndex = 0;
        for (let v = -stepsY * blobStep * 0.5; v <= stepsY * blobStep * 0.5; v += blobStep) {
          rowIndex++;
          const uOffset = rowIndex % 2 !== 0 ? blobStep * 0.5 : 0;

          for (let u = -stepsX * blobStep * 0.5; u <= stepsX * blobStep * 0.5; u += blobStep) {
            // Add subtle organic distortion to grid positions
            const organicWobbleX = Math.sin(v * 0.08) * (cell * 0.22);
            const organicWobbleY = Math.cos(u * 0.08) * (cell * 0.22);

            let px = Math.round(centerX + ((u + uOffset + organicWobbleX) * cosA - (v + organicWobbleY) * sinA));
            let py = Math.round(centerY + ((u + uOffset + organicWobbleX) * sinA + (v + organicWobbleY) * cosA));

            if (effDisplacementAmount > 0) {
              const freq = effDisplacementFrequency / 100;
              px += Math.round(Math.sin(py * freq) * effDisplacementAmount);
              py += Math.round(Math.cos(px * freq) * effDisplacementAmount);
            }

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            const density = sampledMap[py * width + px];
            if (density <= 0.008) continue;

            const naturalR = (Math.pow(density, 0.85) * effectiveMaxD) * 0.65;
            if (effectiveMinD > 0 && naturalR * 2 < effectiveMinD) {
              if (effMinDotMode === 'cutoff') continue;
              if (density <= 0.03) continue;
            }
            const r = Math.max(
              0.3,
              effMinDotMode === 'clamp' && effectiveMinD > 0
                ? Math.max(effectiveMinD * 0.5, naturalR)
                : naturalR
            );

            if (r >= 0.2) {
              if (effDotStyle === 'square') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: effRotation || 0,
                });
              } else if (effDotStyle === 'diamond') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: (effRotation || 0) + 45,
                });
              } else {
                generatedElements.push({ type: 'circle', x: px, y: py, r });
              }
            }
          }
        }
      } else if (effPatternMode === 'liquid') {
        // LIQUID (Harmonic fluid wave contours following brightness gradients)
        const waveStep = cell * 0.85;
        const stepsY = Math.ceil(diag / waveStep) + 2;
        const stepsX = Math.ceil(diag / (waveStep * 0.45)) + 2;
        const subStep = waveStep * 0.45;

        for (let v = -stepsY * waveStep * 0.5; v <= stepsY * waveStep * 0.5; v += waveStep) {
          for (let u = -stepsX * subStep * 0.5; u <= stepsX * subStep * 0.5; u += subStep) {
            // Fluid wave modulation along the stream
            const waveOffset = Math.sin(u * 0.06 + v * 0.04) * (cell * 0.35);
            let px = Math.round(centerX + (u * cosA - (v + waveOffset) * sinA));
            let py = Math.round(centerY + (u * sinA + (v + waveOffset) * cosA));

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            const density = sampledMap[py * width + px];
            if (density <= 0.01) continue;

            const naturalThickness = Math.max(0.4, Math.pow(density, 0.8) * effectiveMaxD);
            const minThick = effectiveMinD;
            if (minThick > 0 && naturalThickness < minThick) {
              if (effMinDotMode === 'cutoff') continue;
              if (density <= 0.03) continue;
            }
            const thickness =
              effMinDotMode === 'clamp' && minThick > 0
                ? Math.max(minThick, naturalThickness)
                : naturalThickness;
            const r = thickness * 0.5;
            if (r >= 0.2) {
              if (effDotStyle === 'square') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: effRotation || 0,
                });
              } else if (effDotStyle === 'diamond') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: (effRotation || 0) + 45,
                });
              } else {
                generatedElements.push({ type: 'circle', x: px, y: py, r });
              }
            }
          }
        }
      } else {
        const step = cell;
        const stepsY = Math.ceil(diag / step) + 2;
        const stepsX = Math.ceil(diag / step) + 2;

        for (let v = -stepsY * step * 0.5; v <= stepsY * step * 0.5; v += step) {
          for (let u = -stepsX * step * 0.5; u <= stepsX * step * 0.5; u += step) {
            const px = Math.round(centerX + (u * cosA - v * sinA));
            const py = Math.round(centerY + (u * sinA + v * cosA));

            if (px < 0 || px >= width || py < 0 || py >= height) continue;

            const density = sampledMap[py * width + px];
            if (density <= 0.01) continue;

            const naturalDiameter = density * effectiveMaxD;
            if (effectiveMinD > 0) {
              if (naturalDiameter < effectiveMinD) {
                if (effMinDotMode === 'cutoff') continue;
                if (density <= 0.03) continue;
              }
            }
            const dotDiameter =
              effMinDotMode === 'clamp' && effectiveMinD > 0
                ? Math.max(effectiveMinD, naturalDiameter)
                : naturalDiameter;
            const r = dotDiameter * 0.5;
            if (r >= 0.2) {
              if (effDotStyle === 'square') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: effRotation || 0,
                });
              } else if (effDotStyle === 'diamond') {
                generatedElements.push({
                  type: 'rect',
                  x: px - r,
                  y: py - r,
                  w: r * 2,
                  h: r * 2,
                  rotation: (effRotation || 0) + 45,
                });
              } else {
                generatedElements.push({ type: 'circle', x: px, y: py, r });
              }
            }
          }
        }
      }

      if (isDownsample && upscale !== 1) {
        for (let i = 0; i < generatedElements.length; i++) {
          const el = generatedElements[i];
          el.x *= upscale;
          el.y *= upscale;
          if (el.r !== undefined) el.r *= upscale;
          if (el.w !== undefined) el.w *= upscale;
          if (el.h !== undefined) el.h *= upscale;
        }
      }

      return generatedElements;
    },
    [
      baseResolution,
      patternMode,
      blur,
      gamma,
      contrast,
      clampMin,
      clampMax,
      normalizeLuminance,
      gridSpacing,
      rotation,
      diameter,
      stretchAmount,
      skew,
      samplingChannel,
      invert,
      levelMaskMin,
      levelMaskMax,
      discardTransparentAreas,
      dotStyle,
      dotSize,
      minDotSize,
      maxDotSize,
      minDotMode,
      sizeResponse,
      sizeOffset,
      scaleFactor,
      displacementAmount,
      displacementFrequency,
      samplingPosterize,
      noiseAmount,
      quantizeLevels,
      maskType,
      subjectTransform,
    ]
  );

  // Compute halftone on active image and update canvas elements
  const computeHalftone = useCallback(
    (
      img: HTMLImageElement,
      width: number,
      height: number,
      isFastPreview: boolean = false,
      overrideSettings?: ImageEffectSettings
    ) => {
      if (!img || width === 0 || height === 0) return;
      setIsProcessing(true);
      const generated = generateHalftoneForImage(img, width, height, isFastPreview, overrideSettings);
      setElements(generated);
      setIsProcessing(false);
    },
    [generateHalftoneForImage]
  );

  // Extract full effect settings snapshot for individual image isolation
  const getCurrentSettings = useCallback((): ImageEffectSettings => {
    return {
      patternMode,
      gridSpacing,
      rotation,
      diameter,
      stretchAmount,
      skew,
      deformAxis,
      deformAxisFollowsGrid,
      regionMerging,
      samplingChannel,
      invert,
      levelMaskMin,
      levelMaskMax,
      discardTransparentAreas,
      dotStyle,
      outlineOnly,
      dotSize,
      minDotSize,
      maxDotSize,
      minDotMode,
      sizeResponse,
      sizeOffset,
      scaleFactor,
      deformWithGrid,
      densitySizing,
      blur,
      blurType,
      blurAngle,
      blurThreshold,
      gamma,
      contrast,
      clampMin,
      clampMax,
      normalizeLuminance,
      colorMode,
      foregroundColor,
      backgroundColor,
      gradation,
      transparentBg,
      stickerUnderlayEnabled,
      stickerOffset,
      stickerShiftX,
      stickerShiftY,
      stickerColor,
      stickerFillHoles,
      shadowEnabled,
      shadowOffsetX,
      shadowOffsetY,
      shadowBlur,
      shadowOpacity,
      shadowColor,
      accentStrokeEnabled,
      accentStrokeColor,
      accentStrokeWidth,
      accentStrokeOffset,
      accentStrokeShiftX,
      accentStrokeShiftY,
      accentStrokeOpacity,
      displacementAmount,
      displacementFrequency,
      samplingPosterize,
      noiseAmount,
      quantizeLevels,
      pixelSharpness,
      fitMode,
      subjectTransform,
    };
  }, [
    patternMode,
    gridSpacing,
    rotation,
    diameter,
    stretchAmount,
    skew,
    deformAxis,
    deformAxisFollowsGrid,
    regionMerging,
    samplingChannel,
    invert,
    levelMaskMin,
    levelMaskMax,
    discardTransparentAreas,
    dotStyle,
    outlineOnly,
    dotSize,
    minDotSize,
    maxDotSize,
    minDotMode,
    sizeResponse,
    sizeOffset,
    scaleFactor,
    deformWithGrid,
    densitySizing,
    blur,
    blurType,
    blurAngle,
    blurThreshold,
    gamma,
    contrast,
    clampMin,
    clampMax,
    normalizeLuminance,
    colorMode,
    foregroundColor,
    backgroundColor,
    gradation,
    transparentBg,
    stickerUnderlayEnabled,
    stickerOffset,
    stickerShiftX,
    stickerShiftY,
    stickerColor,
    stickerFillHoles,
    shadowEnabled,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowOpacity,
    shadowColor,
    accentStrokeEnabled,
    accentStrokeColor,
    accentStrokeWidth,
    accentStrokeOffset,
    accentStrokeShiftX,
    accentStrokeShiftY,
    accentStrokeOpacity,
    displacementAmount,
    displacementFrequency,
    samplingPosterize,
    noiseAmount,
    quantizeLevels,
    pixelSharpness,
    fitMode,
    subjectTransform,
  ]);

  // Apply a settings profile into active React state
  const applySettingsToState = useCallback((s: Partial<ImageEffectSettings>) => {
    if (s.patternMode !== undefined) setPatternMode(s.patternMode);
    if (s.gridSpacing !== undefined) setGridSpacing(s.gridSpacing);
    if (s.rotation !== undefined) setRotation(s.rotation);
    if (s.diameter !== undefined) setDiameter(s.diameter);
    if (s.stretchAmount !== undefined) setStretchAmount(s.stretchAmount);
    if (s.skew !== undefined) setSkew(s.skew);
    if (s.deformAxis !== undefined) setDeformAxis(s.deformAxis);
    if (s.deformAxisFollowsGrid !== undefined) setDeformAxisFollowsGrid(s.deformAxisFollowsGrid);
    if (s.regionMerging !== undefined) setRegionMerging(s.regionMerging);
    if (s.samplingChannel !== undefined) setSamplingChannel(s.samplingChannel);
    if (s.invert !== undefined) setInvert(s.invert);
    if (s.levelMaskMin !== undefined) setLevelMaskMin(s.levelMaskMin);
    if (s.levelMaskMax !== undefined) setLevelMaskMax(s.levelMaskMax);
    if (s.discardTransparentAreas !== undefined) setDiscardTransparentAreas(s.discardTransparentAreas);
    if (s.dotStyle !== undefined) setDotStyle(s.dotStyle);
    if (s.outlineOnly !== undefined) setOutlineOnly(s.outlineOnly);
    if (s.dotSize !== undefined) setDotSize(s.dotSize);
    if (s.minDotSize !== undefined) setMinDotSize(s.minDotSize);
    if (s.maxDotSize !== undefined) setMaxDotSize(s.maxDotSize);
    if (s.minDotMode !== undefined) setMinDotMode(s.minDotMode);
    if (s.sizeResponse !== undefined) setSizeResponse(s.sizeResponse);
    if (s.sizeOffset !== undefined) setSizeOffset(s.sizeOffset);
    if (s.scaleFactor !== undefined) setScaleFactor(s.scaleFactor);
    if (s.deformWithGrid !== undefined) setDeformWithGrid(s.deformWithGrid);
    if (s.densitySizing !== undefined) setDensitySizing(s.densitySizing);
    if (s.blur !== undefined) setBlur(s.blur);
    if (s.blurType !== undefined) setBlurType(s.blurType);
    if (s.blurAngle !== undefined) setBlurAngle(s.blurAngle);
    if (s.blurThreshold !== undefined) setBlurThreshold(s.blurThreshold);
    if (s.gamma !== undefined) setGamma(s.gamma);
    if (s.contrast !== undefined) setContrast(s.contrast);
    if (s.clampMin !== undefined) setClampMin(s.clampMin);
    if (s.clampMax !== undefined) setClampMax(s.clampMax);
    if (s.normalizeLuminance !== undefined) setNormalizeLuminance(s.normalizeLuminance);
    if (s.colorMode !== undefined) setColorMode(s.colorMode);
    if (s.foregroundColor !== undefined) setForegroundColor(s.foregroundColor);
    if (s.backgroundColor !== undefined) setBackgroundColor(s.backgroundColor);
    if (s.gradation !== undefined) setGradation(s.gradation);
    if (s.transparentBg !== undefined) setTransparentBg(s.transparentBg);
    if (s.stickerUnderlayEnabled !== undefined) setStickerUnderlayEnabled(s.stickerUnderlayEnabled);
    if (s.stickerOffset !== undefined) setStickerOffset(s.stickerOffset);
    if (s.stickerShiftX !== undefined) setStickerShiftX(s.stickerShiftX);
    if (s.stickerShiftY !== undefined) setStickerShiftY(s.stickerShiftY);
    if (s.stickerColor !== undefined) setStickerColor(s.stickerColor);
    if (s.stickerFillHoles !== undefined) setStickerFillHoles(s.stickerFillHoles);
    if (s.shadowEnabled !== undefined) setShadowEnabled(s.shadowEnabled);
    if (s.shadowOffsetX !== undefined) setShadowOffsetX(s.shadowOffsetX);
    if (s.shadowOffsetY !== undefined) setShadowOffsetY(s.shadowOffsetY);
    if (s.shadowBlur !== undefined) setShadowBlur(s.shadowBlur);
    if (s.shadowOpacity !== undefined) setShadowOpacity(s.shadowOpacity);
    if (s.shadowColor !== undefined) setShadowColor(s.shadowColor);
    if (s.accentStrokeEnabled !== undefined) setAccentStrokeEnabled(s.accentStrokeEnabled);
    if (s.accentStrokeColor !== undefined) setAccentStrokeColor(s.accentStrokeColor);
    if (s.accentStrokeWidth !== undefined) setAccentStrokeWidth(s.accentStrokeWidth);
    if (s.accentStrokeOffset !== undefined) setAccentStrokeOffset(s.accentStrokeOffset);
    if (s.accentStrokeShiftX !== undefined) setAccentStrokeShiftX(s.accentStrokeShiftX);
    if (s.accentStrokeShiftY !== undefined) setAccentStrokeShiftY(s.accentStrokeShiftY);
    if (s.accentStrokeOpacity !== undefined) setAccentStrokeOpacity(s.accentStrokeOpacity);
    if (s.displacementAmount !== undefined) setDisplacementAmount(s.displacementAmount);
    if (s.displacementFrequency !== undefined) setDisplacementFrequency(s.displacementFrequency);
    if (s.samplingPosterize !== undefined) setSamplingPosterize(s.samplingPosterize);
    if (s.noiseAmount !== undefined) setNoiseAmount(s.noiseAmount);
    if (s.quantizeLevels !== undefined) setQuantizeLevels(s.quantizeLevels);
    if (s.pixelSharpness !== undefined) setPixelSharpness(s.pixelSharpness);
    if (s.fitMode !== undefined) setFitMode(s.fitMode);
    if (s.subjectTransform !== undefined) setSubjectTransform(s.subjectTransform);
  }, []);

  // Synchronize active image settings whenever any slider/control modifies state
  useEffect(() => {
    if (activeImageId && !isSwitchingImageRef.current) {
      imageSettingsRef.current[activeImageId] = {
        ...getCurrentSettings(),
        subjectTransform: subjectTransform ? { ...subjectTransform } : undefined,
      };
    }
  }, [activeImageId, getCurrentSettings, subjectTransform]);

  // Reset Apply All status to 'idle' whenever user tweaks settings on active image
  useEffect(() => {
    if (!isSwitchingImageRef.current && applyAllStatus === 'complete') {
      setApplyAllStatus('idle');
    }
  }, [getCurrentSettings, applyAllStatus]);

  // "Apply to All" - Broadcasts current image's settings with precision to all loaded images
  const handleApplyToAll = useCallback(async () => {
    if (images.length <= 1) {
      showToast('"Apply to All" requires multiple loaded images');
      return;
    }

    setIsApplyingAll(true);
    setApplyAllStatus('applying');
    setApplyProgress({ current: 0, total: images.length });

    const current = getCurrentSettings();

    // Iterate through all images with live async updates so user sees live counter
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const transformForImg = calculateTransformForFitMode(
        img.imgElement,
        current.fitMode,
        current.subjectTransform?.rotation ?? 0
      );

      // Deep clone so each image has completely isolated and independent settings
      imageSettingsRef.current[img.id] = {
        ...current,
        subjectTransform: { ...transformForImg },
      };

      setApplyProgress({ current: i + 1, total: images.length });

      // Yield slightly so browser repaints live progress
      if (images.length > 5 && i % 3 === 0) {
        await new Promise((r) => setTimeout(r, 6));
      }
    }

    // Update active image's subjectTransform and recompute preview
    if (sourceImageRef.current) {
      const activeTransform = calculateTransformForFitMode(
        sourceImageRef.current,
        current.fitMode,
        current.subjectTransform?.rotation ?? 0
      );
      setSubjectTransform(activeTransform);
      if (activeImageId) {
        imageSettingsRef.current[activeImageId] = {
          ...current,
          subjectTransform: { ...activeTransform },
        };
      }
      computeHalftone(sourceImageRef.current, 4000, 4000, false, imageSettingsRef.current[activeImageId || '']);
    }

    setIsApplyingAll(false);
    setApplyAllStatus('complete');
    showToast(`✓ Apply Completed! Applied to all ${images.length} images.`);
  }, [images, getCurrentSettings, computeHalftone, sourceImageRef, activeImageId]);

  // "Apply to Selected" - Broadcasts current settings ONLY to cherry-picked / selected images
  const handleApplyToSelected = useCallback(async () => {
    const targetIds = selectedImageIds.length > 0 ? selectedImageIds : (activeImageId ? [activeImageId] : []);
    if (targetIds.length === 0) {
      showToast('Please select at least one image first');
      return;
    }

    setIsApplyingAll(true);
    setApplyAllStatus('applying');
    setApplyProgress({ current: 0, total: targetIds.length });

    const current = getCurrentSettings();

    for (let i = 0; i < targetIds.length; i++) {
      const id = targetIds[i];
      const img = images.find((x) => x.id === id);
      if (!img) continue;

      const transformForImg = calculateTransformForFitMode(
        img.imgElement,
        current.fitMode,
        current.subjectTransform?.rotation ?? 0
      );

      // Deep clone so each image has completely isolated and independent settings
      imageSettingsRef.current[id] = {
        ...current,
        subjectTransform: { ...transformForImg },
      };

      setApplyProgress({ current: i + 1, total: targetIds.length });

      if (targetIds.length > 5 && i % 3 === 0) {
        await new Promise((r) => setTimeout(r, 6));
      }
    }

    // Recompute preview if active image is among the selected images
    if (sourceImageRef.current && activeImageId && targetIds.includes(activeImageId)) {
      computeHalftone(sourceImageRef.current, 4000, 4000, false, imageSettingsRef.current[activeImageId]);
    }

    setIsApplyingAll(false);
    setApplyAllStatus('complete');
    showToast(`✓ Applied effect to ${targetIds.length} selected image(s)!`);
  }, [selectedImageIds, activeImageId, images, getCurrentSettings, computeHalftone, sourceImageRef]);

  // Toggle individual image selection (cherry-picking)
  const handleToggleSelectImage = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedImageIds((prev) => {
      const isSelected = prev.includes(id);
      return isSelected ? prev.filter((x) => x !== id) : [...prev, id];
    });
    lastSelectedImageIdRef.current = id;
  }, []);

  // Select a continuous range of images (Shift + Click)
  const handleSelectRange = useCallback((targetId: string) => {
    const anchorId = lastSelectedImageIdRef.current || activeImageId;
    if (!anchorId) {
      handleToggleSelectImage(targetId);
      return;
    }
    const idx1 = images.findIndex((img) => img.id === anchorId);
    const idx2 = images.findIndex((img) => img.id === targetId);
    if (idx1 === -1 || idx2 === -1) {
      handleToggleSelectImage(targetId);
      return;
    }
    const start = Math.min(idx1, idx2);
    const end = Math.max(idx1, idx2);
    const rangeIds = images.slice(start, end + 1).map((img) => img.id);
    setSelectedImageIds((prev) => Array.from(new Set([...prev, ...rangeIds])));
    lastSelectedImageIdRef.current = targetId;
    showToast(`✓ Selected ${rangeIds.length} images in range`);
  }, [images, activeImageId, handleToggleSelectImage, showToast]);

  // Select all images
  const handleSelectAllImages = useCallback(() => {
    setSelectedImageIds(images.map((img) => img.id));
    showToast(`✓ Selected all ${images.length} images`);
  }, [images, showToast]);

  // Deselect all images
  const handleDeselectAllImages = useCallback(() => {
    setSelectedImageIds([]);
    showToast('Deselected all images');
  }, [showToast]);

  // Invert current selection
  const handleInvertSelection = useCallback(() => {
    setSelectedImageIds((prev) =>
      images.filter((img) => !prev.includes(img.id)).map((img) => img.id)
    );
  }, [images]);

  // Fast Range Selector (e.g. Select images from #1 to #20 in a 100-image collection)
  const handleApplyRangeSelection = useCallback((startStr: string, endStr: string) => {
    const s = parseInt(startStr, 10);
    const e = parseInt(endStr, 10);
    if (isNaN(s) || isNaN(e) || s < 1 || e < 1) {
      showToast('Please enter valid positive image numbers');
      return;
    }
    const minIdx = Math.max(0, Math.min(s, e) - 1);
    const maxIdx = Math.min(images.length - 1, Math.max(s, e) - 1);
    if (minIdx > maxIdx || minIdx >= images.length) {
      showToast('Selected range exceeds available images');
      return;
    }
    const sliceIds = images.slice(minIdx, maxIdx + 1).map((img) => img.id);
    setSelectedImageIds(sliceIds);
    showToast(`✓ Selected ${sliceIds.length} images (#${minIdx + 1} to #${maxIdx + 1})`);
    setIsRangeModalOpen(false);
  }, [images, showToast]);

  // Select active image from filmstrip & load its unique independent settings
  const selectActiveImage = useCallback(
    (item: LoadedImage) => {
      // 1. Only save outgoing image settings if we were NOT in the middle of a switch
      const prevId = activeImageIdRef.current;
      if (prevId && prevId !== item.id && !isSwitchingImageRef.current) {
        imageSettingsRef.current[prevId] = {
          ...getCurrentSettings(),
          subjectTransform: subjectTransform ? { ...subjectTransform } : undefined,
        };
        if (artboardEraseCanvasRef.current) {
          imageEraseCanvasesRef.current[prevId] = artboardEraseCanvasRef.current;
        } else {
          delete imageEraseCanvasesRef.current[prevId];
        }
        imageEraseUndoStacksRef.current[prevId] = eraseUndoStackRef.current;

        if (artboardBrushCanvasRef.current) {
          imageBrushCanvasesRef.current[prevId] = artboardBrushCanvasRef.current;
        } else {
          delete imageBrushCanvasesRef.current[prevId];
        }
        imageBrushUndoStacksRef.current[prevId] = brushUndoStackRef.current;
      }

      isSwitchingImageRef.current = true;

      activeImageIdRef.current = item.id;
      setActiveImageId(item.id);
      setImageSrc(item.src);
      setImageName(item.name);
      setImageDimensions({ width: 4000, height: 4000 });
      sourceImageRef.current = item.imgElement;
      originalMasterImageRef.current = item.imgElement;
      artboardEraseCanvasRef.current = imageEraseCanvasesRef.current[item.id] || null;
      eraseUndoStackRef.current = imageEraseUndoStacksRef.current[item.id] || [];
      artboardBrushCanvasRef.current = imageBrushCanvasesRef.current[item.id] || null;
      brushUndoStackRef.current = imageBrushUndoStacksRef.current[item.id] || [];
      setBrushStrokeCount(brushUndoStackRef.current.length);
      setPan({ x: 0, y: 0 });
      setZoom((prev) => (prev > 0.1 && prev <= 4 ? prev : 0.7));

      // Deep clone saved settings so each image's properties are completely isolated
      let targetSettings: ImageEffectSettings;
      const saved = imageSettingsRef.current[item.id];
      if (saved) {
        targetSettings = {
          ...saved,
          subjectTransform: saved.subjectTransform ? { ...saved.subjectTransform } : undefined,
        };
      } else {
        const initialTransform = calculateTransformForFitMode(item.imgElement, fitMode, 0);
        targetSettings = {
          ...getCurrentSettings(),
          fitMode,
          subjectTransform: initialTransform,
        };
        imageSettingsRef.current[item.id] = {
          ...targetSettings,
          subjectTransform: { ...initialTransform },
        };
      }

      // Synchronously push isolated settings to UI controls
      applySettingsToState(targetSettings);
      if (targetSettings.subjectTransform) {
        setSubjectTransform({ ...targetSettings.subjectTransform });
      }

      // Immediately render halftone with this image's isolated settings
      computeHalftone(item.imgElement, 4000, 4000, false, targetSettings);

      setTimeout(() => {
        isSwitchingImageRef.current = false;
      }, 60);
    },
    [getCurrentSettings, applySettingsToState, computeHalftone, fitMode, subjectTransform]
  );

  // Delete image from filmstrip list
  const handleDeleteImage = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      delete imageSettingsRef.current[id];
      delete imageEraseCanvasesRef.current[id];
      delete imageEraseUndoStacksRef.current[id];
      delete imageBrushCanvasesRef.current[id];
      delete imageBrushUndoStacksRef.current[id];
      setSelectedImageIds((prev) => prev.filter((imgId) => imgId !== id));
      setImages((prev) => {
        const remaining = prev.filter((img) => img.id !== id);
        if (remaining.length === 0) {
          handleClearDashboard();
        } else if (activeImageId === id) {
          selectActiveImage(remaining[0]);
        }
        return remaining;
      });
      showToast('Image removed from list');
    },
    [activeImageId, selectActiveImage]
  );

  // Quick Previous / Next Image Navigation for Filmstrip
  const handlePrevImage = useCallback(() => {
    if (images.length <= 1) return;
    const currentIndex = images.findIndex((img) => img.id === activeImageId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    selectActiveImage(images[prevIndex]);
  }, [images, activeImageId, selectActiveImage]);

  const handleNextImage = useCallback(() => {
    if (images.length <= 1) return;
    const currentIndex = images.findIndex((img) => img.id === activeImageId);
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    selectActiveImage(images[nextIndex]);
  }, [images, activeImageId, selectActiveImage]);

  // Horizontal Filmstrip Scroll & Mouse Drag Handler
  const checkFilmstripScrollability = useCallback(() => {
    const el = filmstripTrackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  const scrollFilmstrip = useCallback((direction: 'left' | 'right') => {
    const el = filmstripTrackRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -260 : 260;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }, []);

  const handleThumbnailTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.button !== 0) return; // Only main left click
    const target = e.target as HTMLElement;
    if (target.closest('button[data-no-track-drag="true"]')) return;

    const isSelectDrag = filmstripToolMode === 'select' || e.shiftKey || e.altKey;

    if (isSelectDrag && filmstripTrackRef.current) {
      isMarqueeSelectingRef.current = true;
      setIsMarqueeSelecting(true);
      hasDraggedThumbnailsRef.current = false;
      const trackRect = filmstripTrackRef.current.getBoundingClientRect();
      const startX = e.clientX - trackRect.left + filmstripTrackRef.current.scrollLeft;
      const startY = e.clientY - trackRect.top;
      marqueeStartRef.current = { x: startX, y: startY };
      setMarqueeRect({ left: startX, top: startY, width: 0, height: 0 });
      return;
    }

    isDraggingThumbnailsRef.current = true;
    hasDraggedThumbnailsRef.current = false;
    startXRef.current = e.pageX - (filmstripTrackRef.current?.getBoundingClientRect().left || 0);
    scrollLeftRef.current = filmstripTrackRef.current?.scrollLeft || 0;
    setIsTrackDragging(true);
  };

  const handleThumbnailTrackMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!filmstripTrackRef.current) return;

    // Handle Marquee Drag Selection
    if (isMarqueeSelectingRef.current && marqueeStartRef.current) {
      const trackRect = filmstripTrackRef.current.getBoundingClientRect();
      const currentX = e.clientX - trackRect.left + filmstripTrackRef.current.scrollLeft;
      const currentY = e.clientY - trackRect.top;

      if (Math.abs(currentX - marqueeStartRef.current.x) > 4) {
        hasDraggedThumbnailsRef.current = true;
      }

      // Auto-scroll when dragging near edges
      const clientXInside = e.clientX - trackRect.left;
      if (clientXInside > trackRect.width - 40) {
        filmstripTrackRef.current.scrollLeft += 14;
      } else if (clientXInside < 40) {
        filmstripTrackRef.current.scrollLeft -= 14;
      }

      const left = Math.min(marqueeStartRef.current.x, currentX);
      const top = Math.min(marqueeStartRef.current.y, currentY);
      const width = Math.max(1, Math.abs(currentX - marqueeStartRef.current.x));
      const height = Math.max(1, Math.abs(currentY - marqueeStartRef.current.y));

      setMarqueeRect({ left, top, width, height });

      // Hit-test all thumbnail cards inside the track
      const cards = filmstripTrackRef.current.querySelectorAll('[data-image-id]');
      const sweptIds: string[] = [];
      cards.forEach((card) => {
        const cardEl = card as HTMLElement;
        const cardLeft = cardEl.offsetLeft;
        const cardRight = cardLeft + cardEl.offsetWidth;
        if (left <= cardRight && (left + width) >= cardLeft) {
          const id = cardEl.getAttribute('data-image-id');
          if (id) sweptIds.push(id);
        }
      });

      if (sweptIds.length > 0) {
        setSelectedImageIds(sweptIds);
      }
      return;
    }

    // Handle Pan Scroll
    if (isDraggingThumbnailsRef.current) {
      const currentX = e.pageX - filmstripTrackRef.current.getBoundingClientRect().left;
      const walk = currentX - startXRef.current;
      if (Math.abs(walk) > 4) {
        hasDraggedThumbnailsRef.current = true;
      }
      filmstripTrackRef.current.scrollLeft = scrollLeftRef.current - walk;
      checkFilmstripScrollability();
    }
  };

  const handleThumbnailTrackMouseUp = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) e.stopPropagation();
    if (isMarqueeSelectingRef.current) {
      isMarqueeSelectingRef.current = false;
      setIsMarqueeSelecting(false);
      setMarqueeRect(null);
      marqueeStartRef.current = null;
      setTimeout(() => {
        hasDraggedThumbnailsRef.current = false;
      }, 60);
      return;
    }
    if (isDraggingThumbnailsRef.current) {
      isDraggingThumbnailsRef.current = false;
      setIsTrackDragging(false);
      setTimeout(() => {
        hasDraggedThumbnailsRef.current = false;
      }, 50);
    }
  };

  const handleThumbnailTrackMouseLeave = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) e.stopPropagation();
  };

  // Window-level mouseup release to safely finish drags outside track bounds
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMarqueeSelectingRef.current) {
        isMarqueeSelectingRef.current = false;
        setIsMarqueeSelecting(false);
        setMarqueeRect(null);
        marqueeStartRef.current = null;
        setTimeout(() => {
          hasDraggedThumbnailsRef.current = false;
        }, 60);
      }
      if (isDraggingThumbnailsRef.current) {
        isDraggingThumbnailsRef.current = false;
        setIsTrackDragging(false);
        setTimeout(() => {
          hasDraggedThumbnailsRef.current = false;
        }, 50);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Mouse wheel horizontal scroll listener & track resize observer
  useEffect(() => {
    const track = filmstripTrackRef.current;
    if (!track) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 || e.deltaX !== 0) {
        e.preventDefault();
        track.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
        checkFilmstripScrollability();
      }
    };

    track.addEventListener('wheel', handleWheel, { passive: false });
    checkFilmstripScrollability();

    const resizeObserver = new ResizeObserver(() => {
      checkFilmstripScrollability();
    });
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener('wheel', handleWheel);
      resizeObserver.disconnect();
    };
  }, [images.length, isFilmstripCollapsed, checkFilmstripScrollability]);

  const hexToRgbValues = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    return `${r}, ${g}, ${b}`;
  };

  // Helper to create a transformed 4000x4000 canvas for source image
  const getTransformedCanvas = useCallback(
    (
      img: HTMLImageElement | HTMLCanvasElement | null,
      width = 4000,
      height = 4000,
      customTransform?: { x: number; y: number; scale: number; rotation: number }
    ) => {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const ctx = c.getContext('2d');
      if (!ctx || !img) return c;

      const t = customTransform || subjectTransform;
      const natW = (img as HTMLImageElement).naturalWidth || img.width;
      const natH = (img as HTMLImageElement).naturalHeight || img.height;
      const drawW = natW * t.scale;
      const drawH = natH * t.scale;
      const drawX = t.x - drawW / 2;
      const drawY = t.y - drawH / 2;

      ctx.save();
      if (t.rotation) {
        ctx.translate(t.x, t.y);
        ctx.rotate((t.rotation * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
      ctx.restore();

      if (artboardEraseCanvasRef.current) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(artboardEraseCanvasRef.current, 0, 0, width, height);
        ctx.restore();
      }

      if (artboardBrushCanvasRef.current) {
        ctx.save();
        ctx.drawImage(artboardBrushCanvasRef.current, 0, 0, width, height);
        ctx.restore();
      }

      return c;
    },
    [subjectTransform]
  );

  // Render to Canvas with Perfect Split Mode
  const renderCanvas = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const width = 4000;
    const height = 4000;
    canvas.width = 4000;
    canvas.height = 4000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Helper to draw transformed source image
    const drawTransformedSource = (tCtx: CanvasRenderingContext2D) => {
      const img = sourceImageRef.current;
      if (!img) return;
      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;
      const drawW = natW * subjectTransform.scale;
      const drawH = natH * subjectTransform.scale;
      const drawX = subjectTransform.x - drawW / 2;
      const drawY = subjectTransform.y - drawH / 2;

      tCtx.save();
      if (subjectTransform.rotation) {
        tCtx.translate(subjectTransform.x, subjectTransform.y);
        tCtx.rotate((subjectTransform.rotation * Math.PI) / 180);
        tCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        tCtx.drawImage(img, drawX, drawY, drawW, drawH);
      }
      tCtx.restore();

      if (artboardEraseCanvasRef.current) {
        tCtx.save();
        tCtx.globalCompositeOperation = 'destination-out';
        tCtx.drawImage(artboardEraseCanvasRef.current, 0, 0, 4000, 4000);
        tCtx.restore();
      }

      if (artboardBrushCanvasRef.current) {
        tCtx.save();
        tCtx.drawImage(artboardBrushCanvasRef.current, 0, 0, 4000, 4000);
        tCtx.restore();
      }

      if (blur > 0) {
        applyPhotoshopBlur(tCtx, 4000, 4000, blurType, (blur / 100) * 250);
      }
    };

    // 1. ORIGINAL MODE
    if (viewMode === 'original' && sourceImageRef.current) {
      drawTransformedSource(ctx);
      return;
    }

    // 2. SPLIT MODE (Full Side-by-Side Comparison)
    if (viewMode === 'split' && sourceImageRef.current) {
      const splitX = Math.round(width * splitPosition);

      // LEFT: Original Image
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      drawTransformedSource(ctx);
      ctx.restore();

      // RIGHT: Halftone Output
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, width - splitX, height);
      ctx.clip();

      if (!transparentBg) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(splitX, 0, width - splitX, height);
      }

      // Sticker / Offset Silhouette Underlay (100% Pure Vector - No Raster Shadow)
      if (stickerUnderlayEnabled) {
        const transformedSrc = getTransformedCanvas(sourceImageRef.current, width, height);
        const stickerCvs = generateStickerCanvas(
          transformedSrc,
          elements,
          width,
          height,
          {
            enabled: stickerUnderlayEnabled,
            offset: stickerOffset,
            color: stickerColor,
            fillHoles: stickerFillHoles,
            smoothness: 2,
          }
        );
        if (stickerCvs) {
          ctx.drawImage(stickerCvs, stickerShiftX, stickerShiftY);
        }

        // Accent Outline / Contour Stroke
        if (accentStrokeEnabled && accentStrokeWidth > 0 && accentStrokeOpacity > 0) {
          const strokeCvs = generateAccentStrokeCanvas(
            transformedSrc,
            elements,
            width,
            height,
            {
              enabled: accentStrokeEnabled,
              offset: accentStrokeOffset,
              width: accentStrokeWidth,
              color: accentStrokeColor,
              opacity: accentStrokeOpacity,
              fillHoles: stickerFillHoles,
            }
          );
          if (strokeCvs) {
            ctx.drawImage(strokeCvs, stickerShiftX + accentStrokeShiftX, stickerShiftY + accentStrokeShiftY);
          }
        }
      }

      ctx.fillStyle = foregroundColor;
      ctx.strokeStyle = foregroundColor;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el.x + (el.r || el.w || 0) < splitX) continue;

        if (el.type === 'circle' && el.r) {
          ctx.beginPath();
          ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2);
          if (outlineOnly) {
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            ctx.fill();
          }
        } else if (el.type === 'rect' && el.w && el.h) {
          if (el.rotation) {
            ctx.save();
            ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
            ctx.rotate((el.rotation * Math.PI) / 180);
            if (outlineOnly) {
              ctx.lineWidth = 1;
              ctx.strokeRect(-el.w / 2, -el.h / 2, el.w, el.h);
            } else {
              ctx.fillRect(-el.w / 2, -el.h / 2, el.w, el.h);
            }
            ctx.restore();
          } else {
            if (outlineOnly) {
              ctx.lineWidth = 1;
              ctx.strokeRect(el.x, el.y, el.w, el.h);
            } else {
              ctx.fillRect(el.x, el.y, el.w, el.h);
            }
          }
        }
      }
      ctx.restore();

      // Split Divider Line
      ctx.strokeStyle = '#db2777';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();

      // Split Knob / Handle
      ctx.fillStyle = '#db2777';
      ctx.beginPath();
      ctx.arc(splitX, height / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⬌', splitX, height / 2);
      return;
    }

    // 3. HALFTONE MODE (Default)
    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Sticker / Offset Silhouette Underlay (100% Pure Vector - No Raster Shadow)
    if (stickerUnderlayEnabled) {
      const transformedSrc = getTransformedCanvas(sourceImageRef.current, width, height);
      const stickerCvs = generateStickerCanvas(
        transformedSrc,
        elements,
        width,
        height,
        {
          enabled: stickerUnderlayEnabled,
          offset: stickerOffset,
          color: stickerColor,
          fillHoles: stickerFillHoles,
          smoothness: 2,
        }
      );
      if (stickerCvs) {
        ctx.drawImage(stickerCvs, stickerShiftX, stickerShiftY);
      }

      // Accent Outline / Contour Stroke
      if (accentStrokeEnabled && accentStrokeWidth > 0 && accentStrokeOpacity > 0) {
        const strokeCvs = generateAccentStrokeCanvas(
          transformedSrc,
          elements,
          width,
          height,
          {
            enabled: accentStrokeEnabled,
            offset: accentStrokeOffset,
            width: accentStrokeWidth,
            color: accentStrokeColor,
            opacity: accentStrokeOpacity,
            fillHoles: stickerFillHoles,
          }
        );
        if (strokeCvs) {
          ctx.drawImage(strokeCvs, stickerShiftX + accentStrokeShiftX, stickerShiftY + accentStrokeShiftY);
        }
      }
    }

    ctx.fillStyle = foregroundColor;
    ctx.strokeStyle = foregroundColor;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.type === 'circle' && el.r) {
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2);
        if (outlineOnly) {
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fill();
        }
      } else if (el.type === 'rect' && el.w && el.h) {
        if (el.rotation) {
          ctx.save();
          ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
          ctx.rotate((el.rotation * Math.PI) / 180);
          if (outlineOnly) {
            ctx.lineWidth = 1;
            ctx.strokeRect(-el.w / 2, -el.h / 2, el.w, el.h);
          } else {
            ctx.fillRect(-el.w / 2, -el.h / 2, el.w, el.h);
          }
          ctx.restore();
        } else {
          if (outlineOnly) {
            ctx.lineWidth = 1;
            ctx.strokeRect(el.x, el.y, el.w, el.h);
          } else {
            ctx.fillRect(el.x, el.y, el.w, el.h);
          }
        }
      }
    }

    if (elements.length === 0 && artboardBrushCanvasRef.current) {
      ctx.save();
      ctx.drawImage(artboardBrushCanvasRef.current, 0, 0, width, height);
      if (blur > 0) {
        applyPhotoshopBlur(ctx, width, height, blurType, (blur / 100) * 250);
      }
      ctx.restore();
    }

    if (artboardEraseCanvasRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(artboardEraseCanvasRef.current, 0, 0, width, height);
      ctx.restore();
    }
  }, [
    elements,
    imageDimensions,
    viewMode,
    splitPosition,
    transparentBg,
    backgroundColor,
    foregroundColor,
    outlineOnly,
    stickerUnderlayEnabled,
    stickerOffset,
    stickerShiftX,
    stickerShiftY,
    stickerColor,
    stickerFillHoles,
    accentStrokeEnabled,
    accentStrokeColor,
    accentStrokeWidth,
    accentStrokeOffset,
    accentStrokeShiftX,
    accentStrokeShiftY,
    accentStrokeOpacity,
    subjectTransform,
    getTransformedCanvas,
    blur,
    blurType,
    brushStrokeCount,
  ]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Recompute when settings change or subject transforms
  useEffect(() => {
    if (sourceImageRef.current && !isSwitchingImageRef.current) {
      computeHalftone(sourceImageRef.current, 4000, 4000, isSliding);
    }
  }, [computeHalftone, imageDimensions, subjectTransform, isSliding, brushStrokeCount]);

  // Process Single or Multiple Uploaded Files
  const processFileList = useCallback(
    (fileList: File[]) => {
      if (fileList.length === 0) return;
      showToast(`⏳ Loading ${fileList.length} image(s)...`);

      const newItems: LoadedImage[] = [];
      let loadedCount = 0;

      const checkDone = () => {
        loadedCount++;
        if (loadedCount === fileList.length) {
          const currentDefaults = getCurrentSettings();
          newItems.forEach((item) => {
            if (!imageSettingsRef.current[item.id]) {
              const initialTransform = calculateTransformForFitMode(item.imgElement, currentDefaults.fitMode, 0);
              imageSettingsRef.current[item.id] = {
                ...currentDefaults,
                subjectTransform: initialTransform,
              };
            }
          });
          setImages((prev) => {
            const combined = [...prev, ...newItems];
            if ((!activeImageId || prev.length === 0) && combined.length > 0) {
              selectActiveImage(combined[0]);
            }
            return combined;
          });
          setSelectedImageIds((prev) => Array.from(new Set([...prev, ...newItems.map((item) => item.id)])));
          showToast(`✓ Successfully loaded ${fileList.length} image(s)!`);
        }
      };

      fileList.forEach((file) => {
        const isEps = file.name.toLowerCase().endsWith('.eps') || file.type.includes('postscript');

        if (isEps) {
          const textReader = new FileReader();
          textReader.onload = () => {
            const img = new Image();
            img.onload = () => {
              newItems.push({
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: file.name,
                src: img.src,
                width: 4000,
                height: 4000,
                imgElement: img,
              });
              checkDone();
            };
            img.onerror = () => {
              const tempCanvas = document.createElement('canvas');
              tempCanvas.width = 4000;
              tempCanvas.height = 4000;
              const tctx = tempCanvas.getContext('2d')!;
              tctx.fillStyle = '#ffffff';
              tctx.fillRect(0, 0, 4000, 4000);
              tctx.fillStyle = '#000000';
              tctx.font = 'bold 36px sans-serif';
              tctx.textAlign = 'center';
              tctx.fillText(file.name, 2000, 2000);
              const fallbackUrl = tempCanvas.toDataURL('image/png');
              const fallbackImg = new Image();
              fallbackImg.onload = () => {
                newItems.push({
                  id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  name: file.name,
                  src: fallbackUrl,
                  width: 4000,
                  height: 4000,
                  imgElement: fallbackImg,
                });
                checkDone();
              };
              fallbackImg.src = fallbackUrl;
            };
            img.src = URL.createObjectURL(file);
          };
          textReader.readAsText(file);
        } else {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const url = evt.target?.result as string;
            const img = new Image();
            img.onload = () => {
              newItems.push({
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                name: file.name,
                src: url,
                width: 4000,
                height: 4000,
                imgElement: img,
              });
              checkDone();
            };
            img.src = url;
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [activeImageId, selectActiveImage]
  );

  // File Input Change
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // Drag & Drop Handler
  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(Array.from(e.dataTransfer.files));
    }
  };

  // Instant Sample Pattern Generator Handler
  const handleLoadSamplePattern = useCallback(
    (type: 'sphere' | 'emblem' | 'sticker' | 'defects') => {
      let canvas: HTMLCanvasElement;
      let filename = '';
      if (type === 'sphere') {
        canvas = generateSphereGradientCanvas();
        filename = '3D_Sphere_Sample.png';
      } else if (type === 'sticker') {
        canvas = generateIsolatedStickerSampleCanvas();
        filename = 'Sticker_Badge_Sample.png';
      } else if (type === 'emblem') {
        canvas = generateGraphicEmblemCanvas();
        filename = 'Logo_Emblem_Sample.png';
      } else {
        canvas = generateProblematicTestCanvas();
        filename = 'Problem_Defects_Test.png';
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], filename, { type: 'image/png' });
        processFileList([file]);
        showToast(`✓ Sample loaded: ${filename}`);
      });
    },
    [processFileList]
  );

  // Create Custom Blank Artboard & Automatically Activate Brush
  const handleCreateBlankArtboard = useCallback(
    (width: number, height: number, bgColor: string = '#ffffff') => {
      const finalW = Math.max(200, Math.min(8000, width || 2000));
      const finalH = Math.max(200, Math.min(8000, height || 2000));
      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (bgColor && bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, finalW, finalH);
        } else {
          ctx.clearRect(0, 0, finalW, finalH);
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      const img = new Image();
      img.onload = () => {
        const id = `artboard-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newItem: LoadedImage = {
          id,
          name: `Artboard ${finalW}×${finalH}px`,
          src: dataUrl,
          width: finalW,
          height: finalH,
          imgElement: img,
        };

        const isBgTransparent = bgColor === 'transparent' || !bgColor;
        const targetBgColor = isBgTransparent ? '#FFFFFF' : bgColor;
        const currentDefaults = getCurrentSettings();
        const initialScale = Math.min(4000 / finalW, 4000 / finalH);
        const artboardSettings: ImageEffectSettings = {
          ...currentDefaults,
          transparentBg: isBgTransparent,
          backgroundColor: targetBgColor,
          subjectTransform: { x: 2000, y: 2000, scale: initialScale, rotation: 0 },
        };
        imageSettingsRef.current[id] = artboardSettings;
        setTransparentBg(isBgTransparent);
        setBackgroundColor(targetBgColor);

        // Reset brush canvas for the new blank artboard so it starts completely pristine
        const brushCvs = document.createElement('canvas');
        brushCvs.width = 4000;
        brushCvs.height = 4000;
        imageBrushCanvasesRef.current[id] = brushCvs;
        artboardBrushCanvasRef.current = brushCvs;
        imageBrushUndoStacksRef.current[id] = [];
        brushUndoStackRef.current = [];
        setBrushStrokeCount(0);

        setImages((prev) => [...prev, newItem]);
        selectActiveImage(newItem);

        // Immediately activate Photoshop Halftone Brush tool for freehand shading
        setIsBrushMode(true);
        setIsTransformMode(false);
        setIsEraserMode(false);
        setActiveCategory('brush');
        setIsDrawerOpen(true);

        setIsCreateArtboardModalOpen(false);
        showToast(`✓ Blank Artboard (${finalW}×${finalH}px) created! Brush tool activated.`);
      };
      img.src = dataUrl;
    },
    [getCurrentSettings, selectActiveImage]
  );

  // Helper to generate SVG string from dots
  const generateSvgString = useCallback(
    (dots: HalftoneElement[], width: number, height: number, sourceImg?: HTMLImageElement | null, overrideSettings?: ImageEffectSettings) => {
      const effTransparentBg = overrideSettings ? overrideSettings.transparentBg : transparentBg;
      const effBackgroundColor = overrideSettings ? overrideSettings.backgroundColor : backgroundColor;
      const effForegroundColor = overrideSettings ? overrideSettings.foregroundColor : foregroundColor;
      const effOutlineOnly = overrideSettings ? overrideSettings.outlineOnly : outlineOnly;
      const effStickerUnderlayEnabled = overrideSettings ? overrideSettings.stickerUnderlayEnabled : stickerUnderlayEnabled;
      const effStickerOffset = overrideSettings ? overrideSettings.stickerOffset : stickerOffset;
      const effStickerColor = overrideSettings ? overrideSettings.stickerColor : stickerColor;
      const effStickerFillHoles = overrideSettings ? overrideSettings.stickerFillHoles : stickerFillHoles;
      const effStickerShiftX = overrideSettings ? overrideSettings.stickerShiftX : stickerShiftX;
      const effStickerShiftY = overrideSettings ? overrideSettings.stickerShiftY : stickerShiftY;
      const effAccentStrokeEnabled = overrideSettings ? overrideSettings.accentStrokeEnabled : accentStrokeEnabled;
      const effAccentStrokeColor = overrideSettings ? overrideSettings.accentStrokeColor : accentStrokeColor;
      const effAccentStrokeWidth = overrideSettings ? overrideSettings.accentStrokeWidth : accentStrokeWidth;
      const effAccentStrokeOffset = overrideSettings ? overrideSettings.accentStrokeOffset : accentStrokeOffset;
      const effAccentStrokeShiftX = overrideSettings ? overrideSettings.accentStrokeShiftX : accentStrokeShiftX;
      const effAccentStrokeShiftY = overrideSettings ? overrideSettings.accentStrokeShiftY : accentStrokeShiftY;
      const effAccentStrokeOpacity = overrideSettings ? overrideSettings.accentStrokeOpacity : accentStrokeOpacity;

      let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
      if (!effTransparentBg) {
        svg += `  <rect width="${width}" height="${height}" fill="${effBackgroundColor}" />\n`;
      }

      // SEPARATE LAYER 1: White Backing Shape (100% Pure Vector - Microstock Safe)
      if (effStickerUnderlayEnabled) {
        const transformedSrc = getTransformedCanvas(sourceImg || sourceImageRef.current, width, height, overrideSettings?.subjectTransform);
        const pathData = generateStickerSvgPath(
          transformedSrc,
          dots,
          width,
          height,
          {
            enabled: effStickerUnderlayEnabled,
            offset: effStickerOffset,
            color: effStickerColor,
            fillHoles: effStickerFillHoles,
            smoothness: 2,
          }
        );
        if (pathData) {
          const transformAttr =
            effStickerShiftX !== 0 || effStickerShiftY !== 0
              ? ` transform="translate(${effStickerShiftX}, ${effStickerShiftY})"`
              : '';

          svg += `  <!-- LAYER 1 (Bottom): Independent Backing Shape (100% Pure Vector - No Raster) -->\n`;
          svg += `  <g id="layer_backing_shape"${transformAttr}>\n`;
          svg += `    <path d="${pathData}" fill="${effStickerColor}" />\n`;
          svg += `  </g>\n`;
        }
      }

      // SEPARATE LAYER: Accent Contour Stroke (100% Pure Vector)
      if (effStickerUnderlayEnabled && effAccentStrokeEnabled && effAccentStrokeWidth > 0 && effAccentStrokeOpacity > 0) {
        const transformedSrc = getTransformedCanvas(sourceImg || sourceImageRef.current, width, height, overrideSettings?.subjectTransform);
        const strokePathData = generateStickerSvgPath(
          transformedSrc,
          dots,
          width,
          height,
          {
            enabled: true,
            offset: effAccentStrokeOffset,
            color: effAccentStrokeColor,
            fillHoles: effStickerFillHoles,
            smoothness: 2,
          }
        );
        if (strokePathData) {
          const shiftX = effStickerShiftX + effAccentStrokeShiftX;
          const shiftY = effStickerShiftY + effAccentStrokeShiftY;
          const transformAttr = shiftX !== 0 || shiftY !== 0 ? ` transform="translate(${shiftX}, ${shiftY})"` : '';
          const opacityAttr = effAccentStrokeOpacity < 1 ? ` opacity="${effAccentStrokeOpacity.toFixed(2)}"` : '';
          svg += `  <!-- LAYER (Middle): Accent Contour Stroke (100% Pure Vector) -->\n`;
          svg += `  <g id="layer_accent_stroke"${transformAttr}${opacityAttr}>\n`;
          svg += `    <path d="${strokePathData}" fill="none" stroke="${effAccentStrokeColor}" stroke-width="${effAccentStrokeWidth}" stroke-linejoin="round" stroke-linecap="round" />\n`;
          svg += `  </g>\n`;
        }
      }

      // SEPARATE LAYER 2: Halftone Artwork
      svg += `  <!-- LAYER 2 (Top): Independent Halftone Artwork -->\n`;
      svg += `  <g id="layer_halftone_dots" fill="${effForegroundColor}">\n`;
      for (let i = 0; i < dots.length; i++) {
        const el = dots[i];
        if (el.type === 'circle' && el.r) {
          if (effOutlineOnly) {
            svg += `    <circle cx="${el.x}" cy="${el.y}" r="${el.r}" fill="none" stroke="${effForegroundColor}" stroke-width="1" />\n`;
          } else {
            svg += `    <circle cx="${el.x}" cy="${el.y}" r="${el.r}" />\n`;
          }
        } else if (el.type === 'rect' && el.w && el.h) {
          const transformAttr = el.rotation ? ` transform="rotate(${el.rotation} ${el.x + el.w / 2} ${el.y + el.h / 2})"` : '';
          if (effOutlineOnly) {
            svg += `    <rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}"${transformAttr} fill="none" stroke="${effForegroundColor}" stroke-width="1" />\n`;
          } else {
            svg += `    <rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}"${transformAttr} />\n`;
          }
        }
      }
      svg += `  </g>\n</svg>`;
      return svg;
    },
    [
      transparentBg,
      backgroundColor,
      foregroundColor,
      outlineOnly,
      stickerUnderlayEnabled,
      stickerOffset,
      stickerShiftX,
      stickerShiftY,
      stickerColor,
      stickerFillHoles,
      accentStrokeEnabled,
      accentStrokeColor,
      accentStrokeWidth,
      accentStrokeOffset,
      accentStrokeShiftX,
      accentStrokeShiftY,
      accentStrokeOpacity,
      getTransformedCanvas,
    ]
  );

  // Helper to render dots to PNG Blob
  const renderDotsToBlob = useCallback(
    (dots: HalftoneElement[], width: number, height: number, sourceImg?: HTMLImageElement | null, overrideSettings?: ImageEffectSettings): Promise<Blob | null> => {
      const effTransparentBg = overrideSettings ? overrideSettings.transparentBg : transparentBg;
      const effBackgroundColor = overrideSettings ? overrideSettings.backgroundColor : backgroundColor;
      const effForegroundColor = overrideSettings ? overrideSettings.foregroundColor : foregroundColor;
      const effOutlineOnly = overrideSettings ? overrideSettings.outlineOnly : outlineOnly;
      const effStickerUnderlayEnabled = overrideSettings ? overrideSettings.stickerUnderlayEnabled : stickerUnderlayEnabled;
      const effStickerOffset = overrideSettings ? overrideSettings.stickerOffset : stickerOffset;
      const effStickerColor = overrideSettings ? overrideSettings.stickerColor : stickerColor;
      const effStickerFillHoles = overrideSettings ? overrideSettings.stickerFillHoles : stickerFillHoles;
      const effStickerShiftX = overrideSettings ? overrideSettings.stickerShiftX : stickerShiftX;
      const effStickerShiftY = overrideSettings ? overrideSettings.stickerShiftY : stickerShiftY;
      const effAccentStrokeEnabled = overrideSettings ? overrideSettings.accentStrokeEnabled : accentStrokeEnabled;
      const effAccentStrokeColor = overrideSettings ? overrideSettings.accentStrokeColor : accentStrokeColor;
      const effAccentStrokeWidth = overrideSettings ? overrideSettings.accentStrokeWidth : accentStrokeWidth;
      const effAccentStrokeOffset = overrideSettings ? overrideSettings.accentStrokeOffset : accentStrokeOffset;
      const effAccentStrokeShiftX = overrideSettings ? overrideSettings.accentStrokeShiftX : accentStrokeShiftX;
      const effAccentStrokeShiftY = overrideSettings ? overrideSettings.accentStrokeShiftY : accentStrokeShiftY;
      const effAccentStrokeOpacity = overrideSettings ? overrideSettings.accentStrokeOpacity : accentStrokeOpacity;

      return new Promise((resolve) => {
        const cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;
        const ctx = cvs.getContext('2d');
        if (!ctx) return resolve(null);

        if (!effTransparentBg) {
          ctx.fillStyle = effBackgroundColor;
          ctx.fillRect(0, 0, width, height);
        }

        // White Sticker / Silhouette Offset Underlay (100% Pure Vector - No Raster Shadow)
        if (effStickerUnderlayEnabled) {
          const transformedSrc = getTransformedCanvas(sourceImg || sourceImageRef.current, width, height, overrideSettings?.subjectTransform);
          const stickerCvs = generateStickerCanvas(
            transformedSrc,
            dots,
            width,
            height,
            {
              enabled: effStickerUnderlayEnabled,
              offset: effStickerOffset,
              color: effStickerColor,
              fillHoles: effStickerFillHoles,
              smoothness: 2,
            }
          );
          if (stickerCvs) {
            ctx.drawImage(stickerCvs, effStickerShiftX, effStickerShiftY);
          }

          // Accent Outline / Contour Stroke
          if (effAccentStrokeEnabled && effAccentStrokeWidth > 0 && effAccentStrokeOpacity > 0) {
            const strokeCvs = generateAccentStrokeCanvas(
              transformedSrc,
              dots,
              width,
              height,
              {
                enabled: effAccentStrokeEnabled,
                offset: effAccentStrokeOffset,
                width: effAccentStrokeWidth,
                color: effAccentStrokeColor,
                opacity: effAccentStrokeOpacity,
                fillHoles: effStickerFillHoles,
              }
            );
            if (strokeCvs) {
              ctx.drawImage(strokeCvs, effStickerShiftX + effAccentStrokeShiftX, effStickerShiftY + effAccentStrokeShiftY);
            }
          }
        }

        ctx.fillStyle = effForegroundColor;
        ctx.strokeStyle = effForegroundColor;

        for (let i = 0; i < dots.length; i++) {
          const el = dots[i];
          if (el.type === 'circle' && el.r) {
            ctx.beginPath();
            ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2);
            if (effOutlineOnly) {
              ctx.lineWidth = 1;
              ctx.stroke();
            } else {
              ctx.fill();
            }
          } else if (el.type === 'rect' && el.w && el.h) {
            if (el.rotation) {
              ctx.save();
              ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
              ctx.rotate((el.rotation * Math.PI) / 180);
              if (effOutlineOnly) {
                ctx.lineWidth = 1;
                ctx.strokeRect(-el.w / 2, -el.h / 2, el.w, el.h);
              } else {
                ctx.fillRect(-el.w / 2, -el.h / 2, el.w, el.h);
              }
              ctx.restore();
            } else {
              if (effOutlineOnly) {
                ctx.lineWidth = 1;
                ctx.strokeRect(el.x, el.y, el.w, el.h);
              } else {
                ctx.fillRect(el.x, el.y, el.w, el.h);
              }
            }
          }
        }
        cvs.toBlob((blob) => resolve(blob), 'image/png');
      });
    },
    [
      transparentBg,
      backgroundColor,
      foregroundColor,
      outlineOnly,
      stickerUnderlayEnabled,
      stickerOffset,
      stickerShiftX,
      stickerShiftY,
      stickerColor,
      stickerFillHoles,
      accentStrokeEnabled,
      accentStrokeColor,
      accentStrokeWidth,
      accentStrokeOffset,
      accentStrokeShiftX,
      accentStrokeShiftY,
      accentStrokeOpacity,
      getTransformedCanvas,
    ]
  );

  // Export Pure Vector SVG for Current Image
  const handleExportSvg = () => {
    if (elements.length === 0) {
      showToast('Please upload an image first!');
      return;
    }

    const width = 4000;
    const height = 4000;
    const svg = generateSvgString(elements, width, height, sourceImageRef.current);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const cleanName = (imageName || 'HalftoneMaker').replace(/\.[^/.]+$/, '');
    a.download = `${cleanName}_halftone.svg`;
    a.click();
    showToast(`✓ Pure vector SVG downloaded: ${cleanName}_halftone.svg`);
  };

  // Export Pure Vector EPS for Current Image (Encapsulated PostScript 3.0)
  const handleExportEps = useCallback(() => {
    if (elements.length === 0) {
      showToast('Please upload an image first!');
      return;
    }
    const width = 4000;
    const height = 4000;
    const cleanName = (imageName || 'HalftoneMaker').replace(/\.[^/.]+$/, '');
    const eps = generateEpsFromElements(elements, width, height, {
      transparentBg,
      backgroundColor,
      dotColor: foregroundColor,
      outlineOnly,
      title: `${cleanName} Vector Halftone`,
    });
    const blob = new Blob([eps], { type: 'application/postscript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${cleanName}_halftone.eps`;
    a.click();
    showToast(`✓ Pure vector EPS downloaded: ${cleanName}_halftone.eps`);
  }, [elements, imageName, transparentBg, backgroundColor, foregroundColor, outlineOnly]);

  // Download Adobe Illustrator ExtendScript JSX Script
  const handleDownloadJsxScript = useCallback(() => {
    const blob = new Blob([STANDALONE_CLEANER_JSX], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Halftone_Maker_Cleaner.jsx';
    a.click();
    showToast('✓ Halftone_Maker_Cleaner.jsx downloaded!');
  }, []);

  // Export PNG for Current Image (With White Shape & Accent Stroke)
  const handleExportPng = async () => {
    if (elements.length === 0) {
      showToast('Please upload an image first!');
      return;
    }
    const cleanName = (imageName || 'HalftoneMaker').replace(/\.[^/.]+$/, '');
    showToast('⏳ Rendering high-resolution PNG...');
    const blob = await renderDotsToBlob(
      elements,
      4000,
      4000,
      sourceImageRef.current
    );
    if (!blob) {
      showToast('Failed to render PNG!');
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanName}_halftone.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showToast(`✓ High-resolution PNG downloaded: ${cleanName}_halftone.png`);
  };

  // One-Click Batch Export All Loaded Images as ZIP
  const handleExportAllZip = async () => {
    if (images.length === 0) {
      showToast('Please upload images first!');
      return;
    }

    setIsExportingAll(true);
    showToast(`📦 Generating vector & PNG for ${images.length} images...`);

    try {
      const zip = new JSZip();
      const svgFolder = zip.folder('svg_vectors');
      const pngFolder = zip.folder('png_images');

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setExportProgress({ current: i + 1, total: images.length });

        const itemSettings = imageSettingsRef.current[item.id] || getCurrentSettings();
        const dots = generateHalftoneForImage(
          item.imgElement,
          4000,
          4000,
          false,
          itemSettings,
          imageEraseCanvasesRef.current[item.id],
          imageBrushCanvasesRef.current[item.id]
        );
        const baseName = item.name.replace(/\.[^/.]+$/, '');

        // 1. Generate SVG
        const svgContent = generateSvgString(dots, 4000, 4000, item.imgElement, itemSettings);
        svgFolder?.file(`${baseName}_halftone.svg`, svgContent);

        // 2. Generate PNG
        const pngBlob = await renderDotsToBlob(dots, 4000, 4000, item.imgElement, itemSettings);
        if (pngBlob) {
          pngFolder?.file(`${baseName}_halftone.png`, pngBlob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = `Halftone_Maker_Batch_${Date.now()}.zip`;
      a.click();

      showToast(`✓ Successfully downloaded ZIP for ${images.length} images!`);
    } catch (err: any) {
      console.error(err);
      showToast(`Export error: ${err.message || 'Error occurred'}`);
    } finally {
      setIsExportingAll(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  // Export only selected images as ZIP
  const handleExportSelectedZip = async () => {
    const targetItems = images.filter((img) => selectedImageIds.includes(img.id));
    if (targetItems.length === 0) {
      showToast('No images selected. Please select images to export.');
      return;
    }

    setIsExportingAll(true);
    setExportProgress({ current: 0, total: targetItems.length });
    showToast(`📦 Generating vector & PNG for ${targetItems.length} selected images...`);

    try {
      const zip = new JSZip();
      const svgFolder = zip.folder('svg_vectors');
      const pngFolder = zip.folder('png_images');

      for (let i = 0; i < targetItems.length; i++) {
        const item = targetItems[i];
        setExportProgress({ current: i + 1, total: targetItems.length });

        const itemSettings = imageSettingsRef.current[item.id] || getCurrentSettings();
        const dots = generateHalftoneForImage(
          item.imgElement,
          4000,
          4000,
          false,
          itemSettings,
          imageEraseCanvasesRef.current[item.id],
          imageBrushCanvasesRef.current[item.id]
        );
        const baseName = item.name.replace(/\.[^/.]+$/, '');

        // 1. Generate SVG
        const svgContent = generateSvgString(dots, 4000, 4000, item.imgElement, itemSettings);
        svgFolder?.file(`${baseName}_halftone.svg`, svgContent);

        // 2. Generate PNG
        const pngBlob = await renderDotsToBlob(dots, 4000, 4000, item.imgElement, itemSettings);
        if (pngBlob) {
          pngFolder?.file(`${baseName}_halftone.png`, pngBlob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = `Halftone_Selected_${targetItems.length}_Images_${Date.now()}.zip`;
      a.click();

      showToast(`✓ Successfully downloaded ZIP for ${targetItems.length} selected images!`);
    } catch (err: any) {
      console.error(err);
      showToast(`Export error: ${err.message || 'Error occurred'}`);
    } finally {
      setIsExportingAll(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  // Copy PNG to Clipboard
  const handleCopyPng = async () => {
    if (elements.length === 0) {
      showToast('Please upload an image first!');
      return;
    }
    try {
      showToast('⏳ Copying to clipboard...');
      const blob = await renderDotsToBlob(
        elements,
        4000,
        4000,
        sourceImageRef.current
      );
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('✓ Full artwork (with vector shape) copied to clipboard as PNG!');
      }
    } catch (e) {
      showToast('Clipboard copy failed. Please use download button.');
    }
  };

  // Free Transform Drag & Scale Handler (Photoshop-like Ctrl+T)
  const handleTransformMouseDown = (
    e: React.MouseEvent,
    action: 'move' | 'nw' | 'ne' | 'se' | 'sw'
  ) => {
    // If Spacebar Hand Tool is held, allow artboard pan instead of transform
    if (isSpacePressedRef.current || isSpacePressed) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startPosX = subjectTransform.x;
    const startPosY = subjectTransform.y;
    const startScale = subjectTransform.scale;

    const displaySize = 800;
    const artboardRatio = 4000 / (displaySize * zoom);

    // Switch to fast preview downsampling (60fps) during interactive transform drag
    setIsSliding(true);

    const bounds = getImageOpaqueBounds(sourceImageRef.current);
    const natW = sourceImageRef.current?.naturalWidth || 1000;
    const natH = sourceImageRef.current?.naturalHeight || 1000;
    const bW = bounds ? bounds.width : natW;
    const bH = bounds ? bounds.height : natH;
    const startBoxW = Math.max(20, bW * startScale);
    const startBoxH = Math.max(20, bH * startScale);
    const startDiag = Math.hypot(startBoxW, startBoxH);

    // Direction vector from center to handle
    let vx = 1;
    let vy = 1;
    if (action === 'se') {
      vx = startBoxW / startDiag;
      vy = startBoxH / startDiag;
    } else if (action === 'nw') {
      vx = -startBoxW / startDiag;
      vy = -startBoxH / startDiag;
    } else if (action === 'ne') {
      vx = startBoxW / startDiag;
      vy = -startBoxH / startDiag;
    } else if (action === 'sw') {
      vx = -startBoxW / startDiag;
      vy = startBoxH / startDiag;
    }

    let latestT = { ...subjectTransform };

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const dx = (moveEvent.clientX - startClientX) * artboardRatio;
      const dy = (moveEvent.clientY - startClientY) * artboardRatio;

      if (action === 'move') {
        const next = {
          ...latestT,
          x: Math.round(startPosX + dx),
          y: Math.round(startPosY + dy),
        };
        latestT = next;
        setSubjectTransform(next);
      } else {
        const proj = dx * vx + dy * vy;
        const newDiag = Math.max(20, startDiag + 2 * proj);
        const newScale = Math.max(0.02, Math.min(25.0, startScale * (newDiag / startDiag)));
        const next = {
          ...latestT,
          scale: parseFloat(newScale.toFixed(3)),
        };
        latestT = next;
        setSubjectTransform(next);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsSliding(false);

      const curId = activeImageIdRef.current;
      if (curId && imageSettingsRef.current[curId]) {
        imageSettingsRef.current[curId].subjectTransform = { ...latestT };
      }
      if (sourceImageRef.current) {
        computeHalftone(sourceImageRef.current, 4000, 4000, false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Photoshop-Style Artboard Eraser Tool
  const ensureEraseCanvas = useCallback(() => {
    if (!artboardEraseCanvasRef.current) {
      const curId = activeImageIdRef.current;
      if (curId && imageEraseCanvasesRef.current[curId]) {
        artboardEraseCanvasRef.current = imageEraseCanvasesRef.current[curId];
      } else {
        const cvs = document.createElement('canvas');
        cvs.width = 4000;
        cvs.height = 4000;
        artboardEraseCanvasRef.current = cvs;
        if (curId) {
          imageEraseCanvasesRef.current[curId] = cvs;
        }
      }
    }
    return artboardEraseCanvasRef.current;
  }, []);

  const handleStartErase = useCallback(
    (clientX: number, clientY: number) => {
      if (!previewCanvasRef.current || !sourceImageRef.current) return;
      const cvs = ensureEraseCanvas();
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      // Ultra-fast snapshot via offscreen canvas GPU blit (<1ms instead of 64MB getImageData)
      try {
        const snapCvs = document.createElement('canvas');
        snapCvs.width = 4000;
        snapCvs.height = 4000;
        const sCtx = snapCvs.getContext('2d');
        if (sCtx) sCtx.drawImage(cvs, 0, 0);
        eraseUndoStackRef.current.push(snapCvs);
        if (eraseUndoStackRef.current.length > 10) eraseUndoStackRef.current.shift();
      } catch (err) {
        console.warn('Undo snapshot error:', err);
      }

      const rect = previewCanvasRef.current.getBoundingClientRect();
      const canvasX = ((clientX - rect.left) / rect.width) * 4000;
      const canvasY = ((clientY - rect.top) / rect.height) * 4000;

      lastErasePointRef.current = { x: canvasX, y: canvasY };

      // 1. Record on 4000x4000 artboard erase mask
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, eraserSize / 2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Punch hole directly on preview canvas (instant real-time visual feedback, 0ms lag!)
      const pCtx = previewCanvasRef.current.getContext('2d');
      if (pCtx) {
        pCtx.save();
        pCtx.globalCompositeOperation = 'destination-out';
        pCtx.fillStyle = '#000000';
        pCtx.beginPath();
        pCtx.arc(canvasX, canvasY, eraserSize / 2, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      }
    },
    [ensureEraseCanvas, eraserSize]
  );

  const handleContinueErase = useCallback(
    (clientX: number, clientY: number) => {
      if (!previewCanvasRef.current || !artboardEraseCanvasRef.current) return;
      const cvs = artboardEraseCanvasRef.current;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      const rect = previewCanvasRef.current.getBoundingClientRect();
      const canvasX = ((clientX - rect.left) / rect.width) * 4000;
      const canvasY = ((clientY - rect.top) / rect.height) * 4000;

      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = eraserSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const pCtx = previewCanvasRef.current.getContext('2d');
      if (pCtx) {
        pCtx.save();
        pCtx.globalCompositeOperation = 'destination-out';
        pCtx.fillStyle = '#000000';
        pCtx.strokeStyle = '#000000';
        pCtx.lineWidth = eraserSize;
        pCtx.lineCap = 'round';
        pCtx.lineJoin = 'round';
      }

      if (lastErasePointRef.current) {
        ctx.beginPath();
        ctx.moveTo(lastErasePointRef.current.x, lastErasePointRef.current.y);
        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();

        if (pCtx) {
          pCtx.beginPath();
          pCtx.moveTo(lastErasePointRef.current.x, lastErasePointRef.current.y);
          pCtx.lineTo(canvasX, canvasY);
          pCtx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, eraserSize / 2, 0, Math.PI * 2);
      ctx.fill();

      if (pCtx) {
        pCtx.beginPath();
        pCtx.arc(canvasX, canvasY, eraserSize / 2, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
      }

      lastErasePointRef.current = { x: canvasX, y: canvasY };
    },
    [eraserSize]
  );

  const handleFinishErase = useCallback(() => {
    lastErasePointRef.current = null;
    const curId = activeImageIdRef.current;
    if (curId && artboardEraseCanvasRef.current) {
      imageEraseCanvasesRef.current[curId] = artboardEraseCanvasRef.current;
      imageEraseUndoStacksRef.current[curId] = eraseUndoStackRef.current;
    }
    // Prevent UI hang at stroke end: debounce heavy 4000x4000 halftone recalculation
    if (eraseDebounceTimerRef.current) {
      window.clearTimeout(eraseDebounceTimerRef.current);
    }
    eraseDebounceTimerRef.current = window.setTimeout(() => {
      if (sourceImageRef.current) {
        computeHalftone(sourceImageRef.current, 4000, 4000, true);
      }
    }, 350);
  }, [computeHalftone]);

  const handleUndoErase = useCallback(() => {
    if (!artboardEraseCanvasRef.current || eraseUndoStackRef.current.length === 0) {
      showToast('No more erase steps to undo');
      return;
    }
    const prevSnapshotCvs = eraseUndoStackRef.current.pop();
    if (!prevSnapshotCvs) return;
    const ctx = artboardEraseCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 4000, 4000);
    ctx.drawImage(prevSnapshotCvs, 0, 0);
    const curId = activeImageIdRef.current;
    if (curId && artboardEraseCanvasRef.current) {
      imageEraseCanvasesRef.current[curId] = artboardEraseCanvasRef.current;
      imageEraseUndoStacksRef.current[curId] = eraseUndoStackRef.current;
    }
    renderCanvas();
    if (sourceImageRef.current) {
      computeHalftone(sourceImageRef.current, 4000, 4000);
    }
    showToast('✓ Erase undone');
  }, [computeHalftone, renderCanvas]);

  const handleResetErasedImage = useCallback(() => {
    if (eraseDebounceTimerRef.current) {
      window.clearTimeout(eraseDebounceTimerRef.current);
    }
    const curId = activeImageIdRef.current;
    if (curId) {
      delete imageEraseCanvasesRef.current[curId];
      delete imageEraseUndoStacksRef.current[curId];
    }
    if (artboardEraseCanvasRef.current) {
      const ctx = artboardEraseCanvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, 4000, 4000);
    }
    artboardEraseCanvasRef.current = null;
    eraseUndoStackRef.current = [];
    renderCanvas();
    if (sourceImageRef.current) {
      computeHalftone(sourceImageRef.current, 4000, 4000);
    }
    showToast('✓ All erased areas restored');
  }, [computeHalftone, renderCanvas]);

  // Permanently save erased subject changes
  const handleSaveErasedImage = useCallback(() => {
    if (eraseDebounceTimerRef.current) {
      window.clearTimeout(eraseDebounceTimerRef.current);
    }
    const curId = activeImageIdRef.current;
    if (!curId || !sourceImageRef.current) {
      showToast('No active image to save');
      return;
    }
    if (!artboardEraseCanvasRef.current) {
      showToast('No erased areas to save');
      return;
    }

    const c = document.createElement('canvas');
    c.width = 4000;
    c.height = 4000;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const img = sourceImageRef.current;
    const natW = img.naturalWidth || img.width;
    const natH = img.naturalHeight || img.height;
    const drawW = natW * subjectTransform.scale;
    const drawH = natH * subjectTransform.scale;
    const drawX = subjectTransform.x - drawW / 2;
    const drawY = subjectTransform.y - drawH / 2;

    ctx.save();
    if (subjectTransform.rotation) {
      ctx.translate(subjectTransform.x, subjectTransform.y);
      ctx.rotate((subjectTransform.rotation * Math.PI) / 180);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(artboardEraseCanvasRef.current, 0, 0, 4000, 4000);
    ctx.restore();

    const bakedDataUrl = c.toDataURL('image/png');
    const bakedImg = new Image();
    bakedImg.onload = () => {
      sourceImageRef.current = bakedImg;
      originalMasterImageRef.current = bakedImg;
      const newTransform = { x: 2000, y: 2000, scale: 1.0, rotation: 0 };
      setSubjectTransform(newTransform);
      if (imageSettingsRef.current[curId]) {
        imageSettingsRef.current[curId].subjectTransform = newTransform;
      }
      if (artboardEraseCanvasRef.current) {
        const eCtx = artboardEraseCanvasRef.current.getContext('2d');
        if (eCtx) eCtx.clearRect(0, 0, 4000, 4000);
      }
      artboardEraseCanvasRef.current = null;
      delete imageEraseCanvasesRef.current[curId];
      eraseUndoStackRef.current = [];
      delete imageEraseUndoStacksRef.current[curId];

      setImages((prev) =>
        prev.map((item) =>
          item.id === curId
            ? { ...item, src: bakedDataUrl, imgElement: bakedImg }
            : item
        )
      );
      setImageSrc(bakedDataUrl);

      computeHalftone(bakedImg, 4000, 4000);
      renderCanvas();
      showToast('✓ Erased subject saved successfully!');
    };
    bakedImg.src = bakedDataUrl;
  }, [computeHalftone, renderCanvas, subjectTransform]);

  // --- 5.4 Photoshop-Style Halftone Shading Brush Handlers ---
  const ensureBrushCanvas = useCallback(() => {
    if (!artboardBrushCanvasRef.current) {
      const curId = activeImageIdRef.current;
      if (curId && imageBrushCanvasesRef.current[curId]) {
        artboardBrushCanvasRef.current = imageBrushCanvasesRef.current[curId];
      } else {
        const cvs = document.createElement('canvas');
        cvs.width = 4000;
        cvs.height = 4000;
        artboardBrushCanvasRef.current = cvs;
        if (curId) {
          imageBrushCanvasesRef.current[curId] = cvs;
        }
      }
    }
    return artboardBrushCanvasRef.current;
  }, []);

  // Update pre-rendered stamp when brush properties change
  useEffect(() => {
    cachedBrushStampRef.current = createBrushStamp({
      size: brushSize,
      hardness: brushHardness,
      roundness: brushRoundness,
      angle: brushAngle,
      opacity: brushOpacity,
      flow: brushFlow,
      spacing: brushSpacing,
      blendMode: brushBlendMode,
      color: brushColor,
    });
  }, [brushSize, brushHardness, brushRoundness, brushAngle, brushOpacity, brushFlow, brushSpacing, brushBlendMode, brushColor]);

  const handleStartPaint = useCallback(
    (clientX: number, clientY: number) => {
      if (!previewCanvasRef.current) return;
      const cvs = ensureBrushCanvas();
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      // GPU Snapshot for Undo
      try {
        const snapCvs = document.createElement('canvas');
        snapCvs.width = 4000;
        snapCvs.height = 4000;
        const sCtx = snapCvs.getContext('2d');
        if (sCtx) sCtx.drawImage(cvs, 0, 0);
        brushUndoStackRef.current.push(snapCvs);
        if (brushUndoStackRef.current.length > 10) brushUndoStackRef.current.shift();
      } catch (err) {
        console.warn('Brush undo snapshot error:', err);
      }

      const rect = previewCanvasRef.current.getBoundingClientRect();
      const canvasX = ((clientX - rect.left) / rect.width) * 4000;
      const canvasY = ((clientY - rect.top) / rect.height) * 4000;

      lastBrushPointRef.current = { x: canvasX, y: canvasY };
      isPaintingRef.current = true;

      const stamp = cachedBrushStampRef.current || createBrushStamp({
        size: brushSize,
        hardness: brushHardness,
        roundness: brushRoundness,
        angle: brushAngle,
        opacity: brushOpacity,
        flow: brushFlow,
        spacing: brushSpacing,
        blendMode: brushBlendMode,
        color: brushColor,
      });

      stampBrushLine(ctx, stamp, canvasX, canvasY, canvasX, canvasY, {
        size: brushSize,
        hardness: brushHardness,
        roundness: brushRoundness,
        angle: brushAngle,
        opacity: brushOpacity,
        flow: brushFlow,
        spacing: brushSpacing,
        blendMode: brushBlendMode,
        color: brushColor,
      });

      // 60fps immediate live blit on preview canvas for silky smooth feel
      const pCtx = previewCanvasRef.current.getContext('2d');
      if (pCtx) {
        pCtx.save();
        if (brushBlendMode === 'erase') {
          pCtx.globalCompositeOperation = 'destination-out';
        } else {
          pCtx.globalCompositeOperation = 'source-over';
        }
        pCtx.drawImage(
          stamp,
          canvasX - stamp.width / 2,
          canvasY - stamp.height / 2
        );
        pCtx.restore();
      }
    },
    [ensureBrushCanvas, brushSize, brushHardness, brushRoundness, brushAngle, brushOpacity, brushFlow, brushSpacing, brushBlendMode, brushColor]
  );

  const handleContinuePaint = useCallback(
    (clientX: number, clientY: number) => {
      if (!previewCanvasRef.current || !artboardBrushCanvasRef.current || !isPaintingRef.current) return;
      const cvs = artboardBrushCanvasRef.current;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      const rect = previewCanvasRef.current.getBoundingClientRect();
      const canvasX = ((clientX - rect.left) / rect.width) * 4000;
      const canvasY = ((clientY - rect.top) / rect.height) * 4000;

      const stamp = cachedBrushStampRef.current || createBrushStamp({
        size: brushSize,
        hardness: brushHardness,
        roundness: brushRoundness,
        angle: brushAngle,
        opacity: brushOpacity,
        flow: brushFlow,
        spacing: brushSpacing,
        blendMode: brushBlendMode,
        color: brushColor,
      });

      if (lastBrushPointRef.current) {
        stampBrushLine(ctx, stamp, lastBrushPointRef.current.x, lastBrushPointRef.current.y, canvasX, canvasY, {
          size: brushSize,
          hardness: brushHardness,
          roundness: brushRoundness,
          angle: brushAngle,
          opacity: brushOpacity,
          flow: brushFlow,
          spacing: brushSpacing,
          blendMode: brushBlendMode,
          color: brushColor,
        });

        // 60fps live blit onto previewCanvas
        const pCtx = previewCanvasRef.current.getContext('2d');
        if (pCtx) {
          pCtx.save();
          stampBrushLine(pCtx, stamp, lastBrushPointRef.current.x, lastBrushPointRef.current.y, canvasX, canvasY, {
            size: brushSize,
            hardness: brushHardness,
            roundness: brushRoundness,
            angle: brushAngle,
            opacity: brushOpacity,
            flow: brushFlow,
            spacing: brushSpacing,
            blendMode: brushBlendMode,
            color: brushColor,
          });
          pCtx.restore();
        }
      }

      lastBrushPointRef.current = { x: canvasX, y: canvasY };
    },
    [brushSize, brushHardness, brushRoundness, brushAngle, brushOpacity, brushFlow, brushSpacing, brushBlendMode, brushColor]
  );

  const handleFinishPaint = useCallback(() => {
    if (!isPaintingRef.current) return;
    isPaintingRef.current = false;
    lastBrushPointRef.current = null;
    setBrushStrokeCount((c) => c + 1);

    const curId = activeImageIdRef.current;
    if (curId && artboardBrushCanvasRef.current) {
      imageBrushCanvasesRef.current[curId] = artboardBrushCanvasRef.current;
      imageBrushUndoStacksRef.current[curId] = brushUndoStackRef.current;
    }

    renderCanvas();
    if (sourceImageRef.current) {
      computeHalftone(sourceImageRef.current, 4000, 4000);
    }
  }, [computeHalftone, renderCanvas]);

  const handleUndoBrushStroke = useCallback(() => {
    if (!artboardBrushCanvasRef.current || brushUndoStackRef.current.length === 0) {
      showToast('No more brush strokes to undo');
      return;
    }
    const prevSnapshotCvs = brushUndoStackRef.current.pop();
    if (!prevSnapshotCvs) return;
    const ctx = artboardBrushCanvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 4000, 4000);
    ctx.drawImage(prevSnapshotCvs, 0, 0);
    const curId = activeImageIdRef.current;
    if (curId && artboardBrushCanvasRef.current) {
      imageBrushCanvasesRef.current[curId] = artboardBrushCanvasRef.current;
      imageBrushUndoStacksRef.current[curId] = brushUndoStackRef.current;
    }
    setBrushStrokeCount((c) => Math.max(0, c - 1));
    renderCanvas();
    if (sourceImageRef.current) {
      computeHalftone(sourceImageRef.current, 4000, 4000);
    }
    showToast('✓ Brush stroke undone');
  }, [computeHalftone, renderCanvas]);

  const handleClearBrushStrokes = useCallback(() => {
    if (artboardBrushCanvasRef.current) {
      const ctx = artboardBrushCanvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, 4000, 4000);
    }
    brushUndoStackRef.current = [];
    setBrushStrokeCount(0);
    const curId = activeImageIdRef.current;
    if (curId) {
      delete imageBrushCanvasesRef.current[curId];
      delete imageBrushUndoStacksRef.current[curId];
    }
    renderCanvas();
    if (sourceImageRef.current) {
      computeHalftone(sourceImageRef.current, 4000, 4000);
    }
    showToast('✓ All brush shading strokes cleared');
  }, [computeHalftone, renderCanvas]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 0. Spacebar Hand Tool (Photoshop-like: activates Hand Tool in ANY mode/function to pan artboard)
      if (e.code === 'Space' || e.key === ' ') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.closest?.('[contenteditable="true"]'))) {
          return;
        }
        e.preventDefault();
        if (!isSpacePressedRef.current) {
          isSpacePressedRef.current = true;
          setIsSpacePressed(true);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setIsTransformMode((prev) => {
          const next = !prev;
          if (next) {
            setIsEraserMode(false);
            setIsBrushMode(false);
          }
          return next;
        });
        showToast(
          !isTransformMode
            ? '✓ Free Transform active'
            : '✓ Free Transform mode disabled'
        );
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'b' || e.key === 'B')) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        setIsBrushMode((prev) => {
          const next = !prev;
          if (next) {
            setIsEraserMode(false);
            setIsTransformMode(false);
            setActiveCategory('brush');
            setIsDrawerOpen(true);
          }
          showToast(
            next
              ? '✓ Halftone Shading Brush Active (B)'
              : '✓ Brush mode disabled'
          );
          return next;
        });
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'e' || e.key === 'E')) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        setIsEraserMode((prev) => {
          const next = !prev;
          if (next) {
            setIsTransformMode(false);
            setIsBrushMode(false);
          }
          showToast(
            next
              ? '✓ Eraser Active'
              : '✓ Eraser tool disabled'
          );
          return next;
        });
      } else if (e.key === 'x' || e.key === 'X') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        if (isBrushMode) {
          e.preventDefault();
          setBrushBlendMode((m) => {
            const next = m === 'draw' ? 'erase' : 'draw';
            showToast(next === 'draw' ? '🖌️ Paint Shading Mode' : '🧹 Erase Shading Mode');
            return next;
          });
        }
      } else if (e.key === '[') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        if (isBrushMode) {
          if (e.shiftKey) {
            setBrushHardness((h) => {
              const next = Math.max(0, h - 10);
              showToast(`Brush Hardness: ${next}%`);
              return next;
            });
          } else {
            setBrushSize((sz) => {
              const step = sz > 500 ? 100 : sz > 100 ? 20 : sz > 10 ? 5 : sz > 1 ? 1 : 0.25;
              const next = Math.max(0.25, Number((sz - step).toFixed(2)));
              showToast(`Brush Size: ${next}px`);
              return next;
            });
          }
        } else {
          setEraserSize((sz) => {
            const step = sz > 100 ? 20 : 10;
            const next = Math.max(10, sz - step);
            showToast(`Eraser Size: ${next}px`);
            return next;
          });
        }
      } else if (e.key === ']') {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        if (isBrushMode) {
          if (e.shiftKey) {
            setBrushHardness((h) => {
              const next = Math.min(100, h + 10);
              showToast(`Brush Hardness: ${next}%`);
              return next;
            });
          } else {
            setBrushSize((sz) => {
              const step = sz >= 500 ? 100 : sz >= 100 ? 20 : sz >= 10 ? 5 : sz >= 1 ? 1 : 0.25;
              const next = Math.min(5000, Number((sz + step).toFixed(2)));
              showToast(`Brush Size: ${next}px`);
              return next;
            });
          }
        } else {
          setEraserSize((sz) => {
            const step = sz >= 100 ? 20 : 10;
            const next = Math.min(600, sz + step);
            showToast(`Eraser Size: ${next}px`);
            return next;
          });
        }
      } else if (e.key === 'Escape') {
        if (isBrushMode) setIsBrushMode(false);
        if (isEraserMode) setIsEraserMode(false);
        if (isTransformMode) setIsTransformMode(false);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        if (isBrushMode) {
          e.preventDefault();
          handleUndoBrushStroke();
        } else if (isEraserMode) {
          e.preventDefault();
          handleUndoErase();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (isSpacePressedRef.current) {
          isSpacePressedRef.current = false;
          setIsSpacePressed(false);
        }
      }
    };

    const handleWindowBlur = () => {
      if (isSpacePressedRef.current) {
        isSpacePressedRef.current = false;
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isTransformMode, isEraserMode, isBrushMode, handleUndoErase, handleUndoBrushStroke]);

  // Zoom & Pan Wheel
  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-filmstrip-bar]') || target.closest('[data-no-canvas-pan]')) {
      return;
    }
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.max(0.1, Math.min(10, parseFloat((z + delta).toFixed(2)))));
  };

  // Mouse Down for Pan, Eraser, and Interactive Split Slider
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // CRITICAL: Artboard MUST NOT move when interacting with the filmstrip bar or controls!
    if (
      isDraggingThumbnailsRef.current ||
      target.closest('[data-filmstrip-bar]') ||
      target.closest('[data-no-canvas-pan]')
    ) {
      return;
    }

    if (e.button === 0) {
      // 0. Spacebar Hand Tool (Photoshop-style Artboard Pan override in ANY mode / function)
      if (isSpacePressedRef.current || isSpacePressed) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        return;
      }

      // 0a. In Transform Mode, clicking/dragging on the artboard moves ONLY the subject!
      // The artboard stays stationary in the viewport (Photoshop-like Free Transform).
      if (isTransformMode && sourceImageRef.current) {
        handleTransformMouseDown(e, 'move');
        return;
      }

      // 0b. If in Brush Mode, start painting (seamlessly reaches every edge & corner pixel)
      if (isBrushMode && previewCanvasRef.current) {
        if (!sourceImageRef.current) {
          const blankCvs = document.createElement('canvas');
          blankCvs.width = 4000;
          blankCvs.height = 4000;
          const bCtx = blankCvs.getContext('2d');
          if (bCtx) {
            bCtx.fillStyle = backgroundColor || '#ffffff';
            bCtx.fillRect(0, 0, 4000, 4000);
          }
          const bImg = new Image();
          bImg.src = blankCvs.toDataURL();
          sourceImageRef.current = bImg;
        }
        handleStartPaint(e.clientX, e.clientY);
        return;
      }

      // 0c. If in Eraser Mode, perform erase on canvas
      if (isEraserMode && previewCanvasRef.current && sourceImageRef.current) {
        setIsErasing(true);
        handleStartErase(e.clientX, e.clientY);
        return;
      }

      // 1. In Split mode, if clicking close to split divider line (within 24px), drag the divider
      if (viewMode === 'split' && previewCanvasRef.current) {
        const rect = previewCanvasRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const currentSplitPixelX = rect.left + rect.width * splitPosition;
          if (Math.abs(e.clientX - currentSplitPixelX) <= 24) {
            setIsDraggingSplit(true);
            return;
          }
        }
      }

      // In all other cases (including zoomed-in state), dragging moves the viewport
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // If filmstrip track is currently dragging, do not pan artboard
    if (isDraggingThumbnailsRef.current) {
      return;
    }

    // Spacebar Hand Tool: Smooth Artboard Pan in ANY mode / function
    if (isSpacePressedRef.current || isSpacePressed) {
      if (brushCursorRef.current) brushCursorRef.current.style.display = 'none';
      if (eraserCursorRef.current) eraserCursorRef.current.style.display = 'none';
      if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
      return;
    }

    // 0a. Brush cursor tracking (local [0, 800] container coords) and active stroke
    if (isBrushMode && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      const localX = ((e.clientX - rect.left) / rect.width) * 800;
      const localY = ((e.clientY - rect.top) / rect.height) * 800;
      if (brushCursorRef.current) {
        brushCursorRef.current.style.display = 'block';
        brushCursorRef.current.style.left = `${localX}px`;
        brushCursorRef.current.style.top = `${localY}px`;
      }

      if (isPaintingRef.current) {
        handleContinuePaint(e.clientX, e.clientY);
        return;
      }
    }

    // 0b. Eraser cursor tracking (local [0, 800] container coords) and active stroke
    if (isEraserMode && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      const localX = ((e.clientX - rect.left) / rect.width) * 800;
      const localY = ((e.clientY - rect.top) / rect.height) * 800;
      if (eraserCursorRef.current) {
        eraserCursorRef.current.style.display = 'block';
        eraserCursorRef.current.style.left = `${localX}px`;
        eraserCursorRef.current.style.top = `${localY}px`;
      }

      if (isErasing) {
        handleContinueErase(e.clientX, e.clientY);
        return;
      }
    }

    // 1. If actively dragging split divider
    if (isDraggingSplit && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;
      setSplitPosition(Math.max(0, Math.min(1, relativeX)));
      return;
    }

    // 2. If actively panning canvas
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      return;
    }

    // 3. Hover detection for split line: dynamically change cursor to ew-resize (⬌)
    if (viewMode === 'split' && previewCanvasRef.current) {
      const rect = previewCanvasRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const currentSplitPixelX = rect.left + rect.width * splitPosition;
        if (Math.abs(e.clientX - currentSplitPixelX) <= 20) {
          if (!isHoveringSplit) setIsHoveringSplit(true);
          return;
        }
      }
    }

    if (isHoveringSplit) {
      setIsHoveringSplit(false);
    }
  };

  const handleMouseUp = () => {
    if (isPaintingRef.current) {
      handleFinishPaint();
    }
    if (isErasing) {
      setIsErasing(false);
      handleFinishErase();
    }
    setIsDragging(false);
    setIsDraggingSplit(false);
  };

  const handleMouseLeave = () => {
    if (brushCursorRef.current) {
      brushCursorRef.current.style.display = 'none';
    }
    if (isPaintingRef.current) {
      handleFinishPaint();
    }
    if (eraserCursorRef.current) {
      eraserCursorRef.current.style.display = 'none';
    }
    if (isErasing) {
      setIsErasing(false);
      handleFinishErase();
    }
    setIsDragging(false);
    setIsDraggingSplit(false);
    setIsHoveringSplit(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#ffffff] text-[#1e1e1e] font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER TOOLBAR */}
      {/* ------------------------------------------------------------- */}
      <header className="h-16 bg-[#ffffff] border-b border-[#e5e5e5] px-4 flex items-center justify-between z-30 shadow-xs">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 mr-3 select-none">
          <img
            src={LOGO_DATA_URI}
            alt="Halftone Maker Studio Logo"
            className="w-8 h-8 rounded-md object-contain shadow-xs border border-gray-100"
          />
          <span className="font-extrabold text-base tracking-tight text-black font-sans">
            Halftone Maker Studio
          </span>
        </div>

        {/* Toolbar Center: Main Tools & Pattern Modes */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.eps,.svg,.ai"
            multiple
            onChange={handleFilesUpload}
            className="hidden"
          />

          {/* Reset Settings */}
          <button
            onClick={handleReset}
            className="flex flex-col items-center justify-center px-2 py-1 text-xs text-[#4b5563] hover:text-black hover:bg-[#f3f4f6] rounded-md transition-colors"
            title="Reset Settings"
          >
            <RotateCcw className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Reset</span>
          </button>

          {/* Subject Free Transform (Ctrl+T) */}
          {imageSrc && (
            <button
              onClick={() => {
                setIsTransformMode((prev) => {
                  const next = !prev;
                  if (next) {
                    setIsEraserMode(false);
                    setIsBrushMode(false);
                  }
                  showToast(
                    next
                      ? '✓ Free Transform active: Drag to move, corners to resize'
                      : '✓ Free Transform mode disabled'
                  );
                  return next;
                });
              }}
              className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-all ${
                isTransformMode
                  ? 'text-white bg-[#2563eb] shadow-xs font-bold'
                  : 'text-[#2563eb] hover:bg-blue-50 font-medium'
              }`}
              title="Transform: Move & Resize Subject (Shortcut: Ctrl+T)"
            >
              <Maximize2 className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] whitespace-nowrap">Transform</span>
            </button>
          )}

          {/* Halftone Shading Brush (B) */}
          {imageSrc && (
            <button
              onClick={() => {
                setIsBrushMode((prev) => {
                  const next = !prev;
                  if (next) {
                    setIsTransformMode(false);
                    setIsEraserMode(false);
                    setActiveCategory('brush');
                    setIsDrawerOpen(true);
                  }
                  showToast(
                    next
                      ? '✓ Halftone Shading Brush Active (B): Paint soft shading that dissolves into halftone dots.'
                      : '✓ Brush mode disabled'
                  );
                  return next;
                });
              }}
              className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-all ${
                isBrushMode
                  ? 'text-white bg-[#0ea5e9] shadow-xs font-bold'
                  : 'text-[#0ea5e9] hover:bg-sky-50 font-medium'
              }`}
              title="Photoshop Halftone Shading Brush (Shortcut: B) - Paint soft tonal shading that converts to halftone dots"
            >
              <Paintbrush className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] whitespace-nowrap">Brush</span>
            </button>
          )}

          {/* Eraser Tool (E) */}
          {imageSrc && (
            <button
              onClick={() => {
                setIsEraserMode((prev) => {
                  const next = !prev;
                  if (next) {
                    setIsTransformMode(false);
                    setIsBrushMode(false);
                  }
                  showToast(
                    next
                      ? '✓ Eraser Active (E): Drag on canvas to erase. Adjust size with slider.'
                      : '✓ Eraser tool disabled'
                  );
                  return next;
                });
              }}
              className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-all ${
                isEraserMode
                  ? 'text-white bg-[#db2777] shadow-xs font-bold'
                  : 'text-[#db2777] hover:bg-pink-50 font-medium'
              }`}
              title="Eraser Tool (Shortcut: E) - Erase unwanted parts or background with adjustable size slider"
            >
              <Eraser className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] whitespace-nowrap">Eraser</span>
            </button>
          )}

          {/* Clear Dashboard / Image */}
          {imageSrc && (
            <button
              onClick={() => setIsClearConfirmModalOpen(true)}
              className="flex flex-col items-center justify-center px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              title="Clear Image & Reset Dashboard"
            >
              <Trash2 className="w-4 h-4 mb-0.5 text-red-500" />
              <span className="text-[10px] whitespace-nowrap">Clear</span>
            </button>
          )}

          <div className="h-6 w-[1px] bg-[#e5e7eb] mx-1" />

          {/* Pattern Modes */}
          <button
            onClick={() => {
              setPatternMode('circle');
              setDotStyle('circle');
            }}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'circle'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Circle Halftone"
          >
            <Circle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Circle</span>
          </button>

          <button
            onClick={() => {
              setPatternMode('square');
              setDotStyle('square');
            }}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'square'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Square Halftone"
          >
            <Square className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Square</span>
          </button>

          <button
            onClick={() => setPatternMode('hexagonal')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'hexagonal'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Hexagonal Halftone"
          >
            <Hexagon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Hexagonal</span>
          </button>

          <button
            onClick={() => setPatternMode('radial')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'radial'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Radial Halftone"
          >
            <SunMedium className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Radial</span>
          </button>

          <button
            onClick={() => setPatternMode('line')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'line'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Line Engraving Halftone"
          >
            <Minus className="w-4 h-4 mb-0.5 rotate-45" />
            <span className="text-[10px]">Line</span>
          </button>

          <button
            onClick={() => setPatternMode('ring')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'ring'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Ring Halftone"
          >
            <Disc className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Ring</span>
          </button>

          <button
            onClick={() => setPatternMode('stippling')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'stippling'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Stipple Halftone"
          >
            <Sparkle className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Stipple</span>
          </button>

          <button
            onClick={() => setPatternMode('blob')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'blob'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Blob Halftone"
          >
            <Droplet className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Blob</span>
          </button>

          <button
            onClick={() => setPatternMode('liquid')}
            className={`flex flex-col items-center justify-center px-2.5 py-1 text-xs rounded-md transition-colors ${
              patternMode === 'liquid'
                ? 'text-[#db2777] bg-[#fdf2f8] font-bold'
                : 'text-[#4b5563] hover:text-black hover:bg-[#f3f4f6]'
            }`}
            title="Liquid Halftone"
          >
            <Waves className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] flex items-center gap-0.5">
              Liquid <span className="text-[8px] text-[#db2777] font-bold">New</span>
            </span>
          </button>

          <div className="h-6 w-[1px] bg-[#e5e7eb] mx-1" />

          {/* View Modes (Halftone / Split / Original) */}
          <div className="flex items-center bg-[#f3f4f6] p-0.5 rounded-lg border border-[#e5e7eb]">
            <button
              onClick={() => setViewMode('halftone')}
              className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                viewMode === 'halftone'
                  ? 'bg-white text-[#db2777] shadow-xs'
                  : 'text-[#6b7280] hover:text-black'
              }`}
            >
              Halftone
            </button>
            <button
              onClick={() => {
                setViewMode('split');
                showToast('✓ Split mode active! Drag the divider to compare 0% to 100%.');
              }}
              className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-white text-[#db2777] shadow-xs'
                  : 'text-[#6b7280] hover:text-black'
              }`}
            >
              <Split className="w-3 h-3" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-colors ${
                viewMode === 'original'
                  ? 'bg-white text-[#db2777] shadow-xs'
                  : 'text-[#6b7280] hover:text-black'
              }`}
            >
              Original
            </button>
          </div>
        </div>

        {/* Right Header */}
        <div className="flex items-center gap-2">
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Modular Tool Dock & Drawer (Adobe Photoshop / Illustrator Style) */}
        <ModularToolDock
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setIsDrawerOpen(true);
            if (cat === 'brush') {
              setIsBrushMode(true);
              setIsTransformMode(false);
              setIsEraserMode(false);
            } else if (cat === 'transform') {
              setIsTransformMode(true);
              setIsBrushMode(false);
              setIsEraserMode(false);
            }
          }}
          onOpenCreateArtboardModal={() => setIsCreateArtboardModalOpen(true)}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
          onSliderStart={onSliderStart}
          onSliderEnd={onSliderEnd}
          isSliding={isSliding}
          imageLoaded={Boolean(imageSrc)}
          imageDimensions={imageDimensions}
          subjectTransform={subjectTransform}
          setSubjectTransform={setSubjectTransform}
          isTransformMode={isTransformMode}
          setIsTransformMode={setIsTransformMode}
          isEraserMode={isEraserMode}
          setIsEraserMode={setIsEraserMode}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
          onResetErasedImage={handleResetErasedImage}
          onSaveErasedImage={handleSaveErasedImage}
          isBrushMode={isBrushMode}
          setIsBrushMode={setIsBrushMode}
          brushColor={brushColor}
          setBrushColor={handleBrushColorChange}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushHardness={brushHardness}
          setBrushHardness={setBrushHardness}
          brushRoundness={brushRoundness}
          setBrushRoundness={setBrushRoundness}
          brushAngle={brushAngle}
          setBrushAngle={setBrushAngle}
          brushOpacity={brushOpacity}
          setBrushOpacity={setBrushOpacity}
          brushFlow={brushFlow}
          setBrushFlow={setBrushFlow}
          brushSpacing={brushSpacing}
          setBrushSpacing={setBrushSpacing}
          brushBlendMode={brushBlendMode}
          setBrushBlendMode={setBrushBlendMode}
          brushStrokeCount={brushStrokeCount}
          onUndoBrushStroke={handleUndoBrushStroke}
          onClearBrushStrokes={handleClearBrushStrokes}
          fitMode={fitMode}
          handleFitModeChange={handleFitModeChange}
          discardTransparentAreas={discardTransparentAreas}
          setDiscardTransparentAreas={setDiscardTransparentAreas}
          maskType={maskType}
          setMaskType={setMaskType}
          patternMode={patternMode}
          setPatternMode={setPatternMode}
          dotStyle={dotStyle}
          setDotStyle={setDotStyle}
          outlineOnly={outlineOnly}
          setOutlineOnly={setOutlineOnly}
          gridSpacing={gridSpacing}
          setGridSpacing={setGridSpacing}
          rotation={rotation}
          setRotation={setRotation}
          diameter={diameter}
          setDiameter={setDiameter}
          dotSize={dotSize}
          setDotSize={setDotSize}
          minDotSize={minDotSize}
          setMinDotSize={setMinDotSize}
          maxDotSize={maxDotSize}
          setMaxDotSize={setMaxDotSize}
          minDotMode={minDotMode}
          setMinDotMode={setMinDotMode}
          sizeResponse={sizeResponse}
          setSizeResponse={setSizeResponse}
          scaleFactor={scaleFactor}
          setScaleFactor={setScaleFactor}
          stretchAmount={stretchAmount}
          setStretchAmount={setStretchAmount}
          skew={skew}
          setSkew={setSkew}
          samplingChannel={samplingChannel}
          setSamplingChannel={setSamplingChannel}
          contrast={contrast}
          setContrast={setContrast}
          gamma={gamma}
          setGamma={setGamma}
          invert={invert}
          setInvert={setInvert}
          normalizeLuminance={normalizeLuminance}
          setNormalizeLuminance={setNormalizeLuminance}
          blur={blur}
          setBlur={setBlur}
          blurType={blurType}
          setBlurType={setBlurType}
          blurAngle={blurAngle}
          setBlurAngle={setBlurAngle}
          blurThreshold={blurThreshold}
          setBlurThreshold={setBlurThreshold}
          clampMin={clampMin}
          setClampMin={setClampMin}
          clampMax={clampMax}
          setClampMax={setClampMax}
          levelMaskMin={levelMaskMin}
          setLevelMaskMin={setLevelMaskMin}
          levelMaskMax={levelMaskMax}
          setLevelMaskMax={setLevelMaskMax}
          stickerUnderlayEnabled={stickerUnderlayEnabled}
          setStickerUnderlayEnabled={setStickerUnderlayEnabled}
          stickerOffset={stickerOffset}
          setStickerOffset={setStickerOffset}
          stickerShiftX={stickerShiftX}
          setStickerShiftX={setStickerShiftX}
          stickerShiftY={stickerShiftY}
          setStickerShiftY={setStickerShiftY}
          stickerColor={stickerColor}
          setStickerColor={setStickerColor}
          stickerFillHoles={stickerFillHoles}
          setStickerFillHoles={setStickerFillHoles}
          accentStrokeEnabled={accentStrokeEnabled}
          setAccentStrokeEnabled={setAccentStrokeEnabled}
          accentStrokeColor={accentStrokeColor}
          setAccentStrokeColor={setAccentStrokeColor}
          accentStrokeWidth={accentStrokeWidth}
          setAccentStrokeWidth={setAccentStrokeWidth}
          accentStrokeOffset={accentStrokeOffset}
          setAccentStrokeOffset={setAccentStrokeOffset}
          accentStrokeShiftX={accentStrokeShiftX}
          setAccentStrokeShiftX={setAccentStrokeShiftX}
          accentStrokeShiftY={accentStrokeShiftY}
          setAccentStrokeShiftY={setAccentStrokeShiftY}
          accentStrokeOpacity={accentStrokeOpacity}
          setAccentStrokeOpacity={setAccentStrokeOpacity}
          foregroundColor={foregroundColor}
          setForegroundColor={setForegroundColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          transparentBg={transparentBg}
          setTransparentBg={setTransparentBg}
          displacementAmount={displacementAmount}
          setDisplacementAmount={setDisplacementAmount}
          displacementFrequency={displacementFrequency}
          setDisplacementFrequency={setDisplacementFrequency}
          samplingPosterize={samplingPosterize}
          setSamplingPosterize={setSamplingPosterize}
          noiseAmount={noiseAmount}
          setNoiseAmount={setNoiseAmount}
          quantizeLevels={quantizeLevels}
          setQuantizeLevels={setQuantizeLevels}
          onExportSvg={handleExportSvg}
          onExportEps={handleExportEps}
          onExportJsx={() => setIsJsxModalOpen(true)}
          onExportPng={handleExportPng}
          onExportAllZip={handleExportAllZip}
          isExportingAll={isExportingAll}
          exportProgress={exportProgress}
          loadedImagesCount={images.length}
          presets={[...BUILTIN_EFFECT_PRESETS, ...customPresets]}
          activePresetId={activePresetId}
          onApplyPreset={(id) => {
            const found = [...BUILTIN_EFFECT_PRESETS, ...customPresets].find((p) => p.id === id);
            if (found) applyPreset(found);
          }}
          onSaveCurrentPreset={() => handleSaveCurrentPreset()}
          onDeletePreset={(id) => handleDeleteCustomPreset(id)}
          showToast={showToast}
          sourceImageNatural={{
            width: sourceImageRef.current?.naturalWidth || 1000,
            height: sourceImageRef.current?.naturalHeight || 1000,
          }}
          onLoadSamplePattern={handleLoadSamplePattern}
          onApplyToAll={handleApplyToAll}
          onApplyToSelected={handleApplyToSelected}
          selectedImagesCount={selectedImageIds.length}
          isApplyingAll={isApplyingAll}
          applyAllStatus={applyAllStatus}
          applyProgress={applyProgress}
          onEffectTouched={() => setApplyAllStatus('idle')}
        />

        {/* Center Canvas Viewport & Filmstrip Container */}
        <main className="flex-1 flex flex-col overflow-hidden relative select-none">
          {/* Canvas Viewport: Exactly bounded between top bar and bottom filmstrip */}
          <div
            ref={containerRef}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
            }}
            onDrop={handleDropFiles}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={`flex-1 w-full overflow-hidden relative flex items-center justify-center select-none ${
              isSpacePressed
                ? isDragging
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
                : isEraserMode || isBrushMode
                ? 'cursor-none'
                : isDraggingSplit || isHoveringSplit
                ? 'cursor-ew-resize'
                : isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
            } ${
              isDragOver ? 'bg-pink-50/40 ring-4 ring-inset ring-[#db2777]/30' : ''
            }`}
            style={{
              backgroundImage:
                'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Spacebar Hand Tool HUD Floating Badge */}
            {isSpacePressed && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/85 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl backdrop-blur-xs flex items-center gap-2 pointer-events-none animate-in fade-in zoom-in-95 duration-100 border border-white/20">
                <span className="text-sm">✋</span>
                <span>Hand Tool Active (Spacebar) — Drag to Pan Artboard</span>
              </div>
            )}

          {/* Interactive Split Mode Floating Guide */}
          {imageSrc && viewMode === 'split' && (
            <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg animate-pulse">
              <Split className="w-3.5 h-3.5 text-[#db2777]" />
              <span>Drag canvas to reposition, or slide divider to compare split view</span>
            </div>
          )}

          {/* Clean Photoshop-style Halftone Shading Brush Status Pill */}
          {imageSrc && isBrushMode && (
            <div className="absolute top-4 left-4 z-20 bg-neutral-900/90 backdrop-blur text-white px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2.5 shadow-xl border border-sky-500/30">
              <Paintbrush className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-sky-300">Shading Brush</span>
              <span className="text-neutral-500">|</span>
              <span className="text-white font-mono font-bold">{brushSize}px</span>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-300 text-[11px]">{brushHardness}% Hard</span>
              <span className="text-neutral-500">|</span>
              <button
                type="button"
                onClick={() => setBrushBlendMode((m) => (m === 'draw' ? 'erase' : 'draw'))}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  brushBlendMode === 'draw'
                    ? 'bg-sky-500/30 text-sky-200 hover:bg-sky-500/50'
                    : 'bg-rose-500/30 text-rose-200 hover:bg-rose-500/50'
                }`}
                title="Toggle Draw / Erase Mode (Key: X)"
              >
                {brushBlendMode === 'draw' ? '🖌️ Paint' : '🧹 Erase'}
              </button>
              <span className="text-neutral-500">|</span>
              <button
                type="button"
                onClick={handleUndoBrushStroke}
                disabled={brushStrokeCount === 0}
                className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                title="Undo last stroke (Ctrl+Z)"
              >
                ↩ Undo
              </button>
              <button
                type="button"
                onClick={() => setIsBrushMode(false)}
                className="px-2 py-0.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                title="Exit brush mode (Esc or B)"
              >
                ✓ Done
              </button>
            </div>
          )}

          {/* Clean Photoshop-style Eraser Status Pill */}
          {imageSrc && isEraserMode && (
            <div className="absolute top-4 left-4 z-20 bg-neutral-900/85 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg border border-white/10">
              <Eraser className="w-3.5 h-3.5 text-[#db2777]" />
              <span className="font-semibold">Eraser</span>
              <span className="text-neutral-500">|</span>
              <span className="text-pink-300 font-mono font-bold">{eraserSize}px</span>
              <span className="text-neutral-500">|</span>
              <button
                type="button"
                onClick={handleSaveErasedImage}
                className="px-2 py-0.5 bg-[#db2777] hover:bg-[#be185d] text-white rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                title="Save erased subject changes permanently"
              >
                💾 Save
              </button>
            </div>
          )}

          {/* Empty Upload State */}
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed ${
                isDragOver
                  ? 'border-[#db2777] bg-pink-50/50 scale-102'
                  : 'border-[#d1d5db] hover:border-[#db2777] bg-white'
              } rounded-3xl text-center cursor-pointer transition-all max-w-sm w-full shadow-lg space-y-4`}
            >
              <div className="w-16 h-16 rounded-full bg-[#fdf2f8] text-[#db2777] flex items-center justify-center mx-auto shadow-inner">
                <Upload className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <span className="px-5 py-2.5 bg-[#db2777] hover:bg-[#be185d] text-white font-semibold rounded-full text-xs shadow-md inline-flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Choose Files (Single or Multiple)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreateArtboardModalOpen(true);
                  }}
                  className="px-5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-semibold rounded-full text-xs shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>➕</span> Create Blank Artboard
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging || isDraggingSplit ? 'none' : 'transform 0.05s ease-out',
                backgroundImage: transparentBg
                  ? 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)'
                  : 'none',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                backgroundColor: transparentBg ? '#ffffff' : backgroundColor,
                width: '800px',
                height: '800px',
                aspectRatio: '1 / 1',
              }}
              className="rounded-none border-2 border-neutral-400 shadow-[0_12px_40px_rgba(0,0,0,0.22)] relative group overflow-visible shrink-0"
            >
              <canvas
                ref={previewCanvasRef}
                width={4000}
                height={4000}
                style={{
                  width: '800px',
                  height: '800px',
                  display: 'block',
                  aspectRatio: '1 / 1',
                }}
              />

              {/* Photoshop-style Halftone Shading Brush Dynamic Circle Cursor */}
              {isBrushMode && (
                <div
                  ref={brushCursorRef}
                  style={{
                    display: 'none',
                    left: 0,
                    top: 0,
                    width: `${Math.max(4, (brushSize / 4000) * 800)}px`,
                    height: `${Math.max(4, (brushSize / 4000) * 800 * (brushRoundness / 100))}px`,
                    transform: `translate(-50%, -50%) rotate(${brushAngle}deg)`,
                    borderColor: brushColor.toLowerCase() === '#ffffff' ? '#475569' : brushColor,
                    backgroundColor: `${brushColor}33`,
                  }}
                  className="absolute rounded-full border pointer-events-none z-50 shadow-[0_0_0_1px_rgba(255,255,255,0.85)]"
                >
                  {brushHardness > 0 && (
                    <div
                      style={{
                        width: `${brushHardness}%`,
                        height: `${brushHardness}%`,
                      }}
                      className="absolute inset-0 m-auto rounded-full border border-sky-300/60 pointer-events-none"
                    />
                  )}
                </div>
              )}

              {/* Photoshop-style Eraser Brush Circle Cursor */}
              {isEraserMode && (
                <div
                  ref={eraserCursorRef}
                  style={{
                    display: 'none',
                    left: 0,
                    top: 0,
                    width: `${Math.max(4, (eraserSize / 4000) * 800)}px`,
                    height: `${Math.max(4, (eraserSize / 4000) * 800)}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute rounded-full border border-neutral-900 bg-white/20 pointer-events-none z-50 shadow-[0_0_0_1px_rgba(255,255,255,0.85)]"
                />
              )}

              {/* Photoshop-style Free Transform Bounding Box (Ctrl+T) */}
              {isTransformMode && sourceImageRef.current && (
                (() => {
                  const img = sourceImageRef.current;
                  const natW = img.naturalWidth || 1000;
                  const natH = img.naturalHeight || 1000;
                  const bounds = getImageOpaqueBounds(img);

                  // Full transformed image position on the 4000x4000 artboard
                  const drawW = natW * subjectTransform.scale;
                  const drawH = natH * subjectTransform.scale;
                  const drawX = subjectTransform.x - drawW / 2;
                  const drawY = subjectTransform.y - drawH / 2;

                  // Tightly wrap the subject/object itself, not the empty artboard canvas
                  const bMinX = bounds ? bounds.minX : 0;
                  const bMinY = bounds ? bounds.minY : 0;
                  const bW = bounds ? bounds.width : natW;
                  const bH = bounds ? bounds.height : natH;

                  const boxLeft = drawX + bMinX * subjectTransform.scale;
                  const boxTop = drawY + bMinY * subjectTransform.scale;
                  const boxW = bW * subjectTransform.scale;
                  const boxH = bH * subjectTransform.scale;

                  const leftPct = (boxLeft / 4000) * 100;
                  const topPct = (boxTop / 4000) * 100;
                  const widthPct = (boxW / 4000) * 100;
                  const heightPct = (boxH / 4000) * 100;

                  return (
                    <div
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                      }}
                      className={`absolute border-2 border-[#2563eb] bg-blue-500/10 ${
                        isSpacePressed ? 'pointer-events-none' : 'cursor-move'
                      } z-40 select-none shadow-[0_0_0_1px_rgba(255,255,255,0.7)]`}
                      onMouseDown={(e) => handleTransformMouseDown(e, 'move')}
                    >
                      {/* Floating Dimension Tooltip */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2563eb] text-white px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap shadow-md pointer-events-none">
                        {Math.round(boxW)} × {Math.round(boxH)} px ({Math.round(subjectTransform.scale * 100)}%)
                      </div>

                      {/* 4 Corner Scale Handles */}
                      <div
                        onMouseDown={(e) => handleTransformMouseDown(e, 'nw')}
                        className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-xs shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                      />
                      <div
                        onMouseDown={(e) => handleTransformMouseDown(e, 'ne')}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-xs shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                      />
                      <div
                        onMouseDown={(e) => handleTransformMouseDown(e, 'se')}
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-xs shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                      />
                      <div
                        onMouseDown={(e) => handleTransformMouseDown(e, 'sw')}
                        className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#2563eb] rounded-xs shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                      />
                    </div>
                  );
                })()
              )}

              {/* Dedicated High-Precision Split Divider Drag Handle Overlay */}
              {viewMode === 'split' && (
                <div
                  onMouseDown={(e) => {
                    if (isSpacePressedRef.current || isSpacePressed) return;
                    e.stopPropagation();
                    setIsDraggingSplit(true);
                  }}
                  onMouseEnter={() => {
                    if (!isSpacePressedRef.current && !isSpacePressed) setIsHoveringSplit(true);
                  }}
                  onMouseLeave={() => {
                    if (!isDraggingSplit) setIsHoveringSplit(false);
                  }}
                  style={{
                    left: `${splitPosition * 100}%`,
                  }}
                  className={`absolute top-0 bottom-0 w-6 -ml-3 z-30 ${
                    isSpacePressed ? 'pointer-events-none' : 'cursor-ew-resize'
                  } flex items-center justify-center select-none`}
                  title="Drag left or right to move split divider"
                >
                  {/* Glowing Split Line Indicator - Slimmer & Clean */}
                  <div className="w-[1.5px] h-full bg-[#db2777] shadow-[0_0_4px_rgba(219,39,119,0.5)] pointer-events-none" />

                  {/* Compact, Slim Interactive Knob */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#db2777] border-[1.5px] border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold cursor-ew-resize hover:scale-110 active:scale-115 transition-transform pointer-events-none">
                    ⬌
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* BOTTOM FILMSTRIP (IMAGE THUMBNAIL BAR WITH MINIMIZE / MAXIMIZE) */}
          {/* ------------------------------------------------------------- */}
          {images.length > 0 && (
            isFilmstripCollapsed ? (
              /* Minimized Compact Bar (Unobstructed Canvas View) */
              <div
                data-filmstrip-bar="true"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                onClick={() => setIsFilmstripCollapsed(false)}
                className="shrink-0 w-full z-30 bg-white/95 backdrop-blur-md border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-3 py-1.5 flex items-center justify-between transition-all duration-200 cursor-pointer hover:bg-gray-50 group"
                title="Click to maximize filmstrip and manage images"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Active Image Thumbnail preview */}
                  {images.find((img) => img.id === activeImageId) && (
                    <div className="w-6 h-6 rounded overflow-hidden bg-gray-100 border border-[#db2777]/50 shrink-0 shadow-2xs">
                      <img
                        src={images.find((img) => img.id === activeImageId)!.src}
                        alt="Active thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-800 truncate">
                    <Layers className="w-3.5 h-3.5 text-[#db2777] shrink-0" />
                    <span className="font-bold text-gray-900 hidden sm:inline">Active:</span>
                    <span className="text-[11px] font-semibold text-gray-800 truncate max-w-[140px] sm:max-w-[200px]">
                      {images.find((img) => img.id === activeImageId)?.name || 'Image'}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#fdf2f8] text-[#db2777] rounded text-[10px] font-bold border border-[#fbcfe8] shrink-0">
                      {images.findIndex((img) => img.id === activeImageId) + 1}/{images.length}
                    </span>
                  </div>

                  {/* Quick Prev / Next navigation buttons right from minimized bar */}
                  {images.length > 1 && (
                    <div
                      className="flex items-center gap-0.5 border-l border-gray-300 pl-1.5 ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={handlePrevImage}
                        className="p-1 hover:bg-gray-200 text-gray-600 hover:text-black rounded transition-colors cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="p-1 hover:bg-gray-200 text-gray-600 hover:text-black rounded transition-colors cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-500 hidden md:inline group-hover:text-gray-700">
                    (Canvas Full View • Click to Maximize)
                  </span>

                  {/* Maximize Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilmstripCollapsed(false);
                    }}
                    className="px-2.5 py-1 bg-gradient-to-r from-[#db2777] to-[#be185d] hover:from-[#be185d] hover:to-[#9d174d] text-white rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Maximize Filmstrip"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Maximize Filmstrip</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Maximized Full Filmstrip Bar */
              <div
                data-filmstrip-bar="true"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                className="shrink-0 w-full z-30 bg-white/95 backdrop-blur-md border-t border-gray-300 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2 transition-all"
              >
                {/* Top Row: Counter & Action Buttons */}
                <div className="flex items-center justify-between mb-1.5 px-0.5 gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                      <Layers className="w-3.5 h-3.5 text-[#db2777]" />
                      <span className="px-2 py-0.5 bg-[#fdf2f8] text-[#db2777] rounded-full text-[10px] font-bold border border-[#fbcfe8]">
                        {images.length} {images.length === 1 ? 'Image' : 'Images'}
                      </span>
                    </div>

                    {/* Filmstrip Tool Mode: Pan Track vs Drag Select */}
                    {images.length > 1 && (
                      <div className="flex items-center bg-gray-200/90 rounded-md p-0.5 border border-gray-300">
                        <button
                          type="button"
                          onClick={() => setFilmstripToolMode('pan')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            filmstripToolMode === 'pan'
                              ? 'bg-white text-gray-900 shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Pan Mode: Click and drag track to scroll left/right"
                        >
                          <Hand className="w-3 h-3" />
                          <span>Pan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFilmstripToolMode('select')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            filmstripToolMode === 'select'
                              ? 'bg-gradient-to-r from-purple-600 to-[#db2777] text-white shadow-2xs'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Drag Select Mode: Drag mouse over thumbnails to select multiple images"
                        >
                          <MousePointer className="w-3 h-3" />
                          <span>Drag Select</span>
                        </button>
                      </div>
                    )}

                    {/* Multi-Selection Counter & Quick Selection Controls */}
                    {images.length > 1 && (
                      <div className="relative flex items-center gap-1.5 bg-gray-100/90 rounded-md px-2 py-0.5 border border-gray-300/80 shadow-2xs">
                        <span className="text-[10.5px] font-bold text-gray-700 flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#db2777]" />
                          <span>Selected: <strong className="text-[#db2777]">{selectedImageIds.length}</strong>/{images.length}</span>
                        </span>
                        <div className="flex items-center gap-1 border-l border-gray-300 pl-1.5">
                          <button
                            type="button"
                            onClick={handleSelectAllImages}
                            className="px-1.5 py-0.5 bg-white hover:bg-gray-200 text-gray-800 rounded text-[9.5px] font-semibold border border-gray-300 transition-colors cursor-pointer"
                            title="Select all images in filmstrip"
                          >
                            All
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAllImages}
                            className="px-1.5 py-0.5 bg-white hover:bg-gray-200 text-gray-800 rounded text-[9.5px] font-semibold border border-gray-300 transition-colors cursor-pointer"
                            title="Deselect all images"
                          >
                            None
                          </button>
                          <button
                            type="button"
                            onClick={handleInvertSelection}
                            className="px-1.5 py-0.5 bg-white hover:bg-gray-200 text-gray-800 rounded text-[9.5px] font-semibold border border-gray-300 transition-colors cursor-pointer"
                            title="Invert current selection"
                          >
                            Invert
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsRangeModalOpen((prev) => !prev)}
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold border transition-colors cursor-pointer ${
                              isRangeModalOpen
                                ? 'bg-purple-100 text-purple-900 border-purple-400 font-bold'
                                : 'bg-white hover:bg-gray-200 text-gray-800 border-gray-300'
                            }`}
                            title="Quickly select a custom range of images by number (e.g. 1 to 20)"
                          >
                            Range...
                          </button>
                        </div>

                        {/* Fast Range Selector Popover */}
                        {isRangeModalOpen && (
                          <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-2.5 flex items-center gap-2 text-xs backdrop-blur-md">
                            <span className="font-bold text-gray-800 text-[11px] whitespace-nowrap">Select:</span>
                            <span className="text-gray-500 font-mono text-[11px]">#</span>
                            <input
                              type="number"
                              min={1}
                              max={images.length}
                              value={rangeStartInput}
                              onChange={(e) => setRangeStartInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleApplyRangeSelection(rangeStartInput, rangeEndInput);
                              }}
                              className="w-14 px-1 py-0.5 border border-gray-300 rounded text-center text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                              placeholder="1"
                            />
                            <span className="text-gray-500 text-[11px]">to</span>
                            <span className="text-gray-500 font-mono text-[11px]">#</span>
                            <input
                              type="number"
                              min={1}
                              max={images.length}
                              value={rangeEndInput}
                              onChange={(e) => setRangeEndInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleApplyRangeSelection(rangeStartInput, rangeEndInput);
                              }}
                              className="w-14 px-1 py-0.5 border border-gray-300 rounded text-center text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                              placeholder="20"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyRangeSelection(rangeStartInput, rangeEndInput)}
                              className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-[#db2777] text-white rounded text-[11px] font-bold shadow-2xs hover:opacity-90 cursor-pointer whitespace-nowrap"
                            >
                              Select Range
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsRangeModalOpen(false)}
                              className="p-1 text-gray-400 hover:text-gray-700 rounded cursor-pointer"
                              title="Close"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* Apply to Selected Button */}
                    {images.length > 1 && selectedImageIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleApplyToSelected}
                        disabled={isApplyingAll}
                        className="px-2.5 py-1 bg-gradient-to-r from-[#db2777] to-purple-600 hover:from-[#be185d] hover:to-purple-700 text-white rounded-md text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title={`Apply active halftone effect to ${selectedImageIds.length} selected images`}
                      >
                        <Sparkles className="w-3 h-3 text-pink-200" />
                        <span>Apply Selected ({selectedImageIds.length})</span>
                      </button>
                    )}

                    {/* Apply to All Button */}
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={handleApplyToAll}
                        disabled={isApplyingAll}
                        className={`px-2 py-1 text-white rounded-md text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer ${
                          selectedImageIds.length > 0
                            ? 'bg-gray-700 hover:bg-gray-800'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        }`}
                        title="Apply active effect to all loaded images"
                      >
                        <span>Apply to All ({images.length})</span>
                      </button>
                    )}

                    {/* RED MARKED AREA: Single Unified Preset Input & Dropdown Controller */}
                    <div className="flex items-center gap-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-md px-2 py-0.5 shadow-2xs">
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 text-[#db2777]" />
                        <span className="text-[11px] font-bold text-gray-700 hidden md:inline">Effect:</span>

                        {/* Single Unified Editable Input with Integrated Dropdown */}
                        <div ref={presetDropdownRef} className="relative">
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={presetNameInput}
                              onChange={(e) => {
                                setPresetNameInput(e.target.value);
                                if (!isPresetDropdownOpen) setIsPresetDropdownOpen(true);
                              }}
                              onFocus={() => setIsPresetDropdownOpen(true)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveCurrentPreset();
                                  setIsPresetDropdownOpen(false);
                                }
                              }}
                              placeholder="Effect name..."
                              className="bg-white border border-gray-300 focus:border-[#db2777] rounded px-2 pr-6 py-0.5 text-[11px] text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#db2777] w-32 sm:w-40 shadow-2xs"
                              title="Type a name to save preset or click arrow to select saved presets"
                            />
                            <button
                              type="button"
                              onClick={() => setIsPresetDropdownOpen((prev) => !prev)}
                              className="absolute right-1 text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
                              title="Saved presets list"
                            >
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isPresetDropdownOpen ? 'rotate-180 text-[#db2777]' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* Dropdown Menu directly attached to the effect input */}
                          {isPresetDropdownOpen && (
                            <div className="absolute left-0 bottom-full mb-1 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 max-h-56 overflow-y-auto text-xs">
                              {customPresets.length > 0 ? (
                                <div>
                                  <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 flex items-center justify-between">
                                    <span>⭐ Saved Presets ({customPresets.length})</span>
                                  </div>
                                  {customPresets.map((p) => (
                                    <div
                                      key={p.id}
                                      onClick={() => {
                                        applyPreset(p);
                                        setIsPresetDropdownOpen(false);
                                      }}
                                      className={`flex items-center justify-between px-2.5 py-1.5 hover:bg-[#fdf2f8] cursor-pointer transition-colors ${
                                        activePresetId === p.id
                                          ? 'bg-[#fdf2f8] text-[#db2777] font-bold'
                                          : 'text-gray-800'
                                      }`}
                                    >
                                      <span className="truncate flex items-center gap-1.5">
                                        <span className="text-[#db2777]">⭐</span>
                                        <span className="truncate">{p.name}</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPresetToDelete(p);
                                          setIsPresetDropdownOpen(false);
                                        }}
                                        className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                        title="Delete this preset"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="px-3 py-3 text-center text-gray-500 text-[11px]">
                                  No saved presets.<br />
                                  <span className="text-[10px] text-gray-400">Type a name and click 'Save Preset'.</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Save Current Preset Button */}
                      <button
                        type="button"
                        onClick={() => {
                          handleSaveCurrentPreset();
                          setIsPresetDropdownOpen(false);
                        }}
                        className="px-2 py-0.5 bg-[#db2777] hover:bg-[#be185d] text-white rounded text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer shrink-0"
                        title="Save current settings as a new preset"
                      >
                        <Bookmark className="w-3 h-3 fill-white" />
                        <span>Save Preset</span>
                      </button>
                    </div>

                    {/* Export Actions Group */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleExportSvg}
                        className="px-2.5 py-1 bg-[#db2777] hover:bg-[#be185d] text-white rounded-md text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Download SVG vector"
                      >
                        <Download className="w-3 h-3" />
                        <span>SVG</span>
                      </button>

                      <button
                        onClick={handleExportPng}
                        className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Download PNG image"
                      >
                        <Download className="w-3 h-3 text-gray-400" />
                        <span>PNG</span>
                      </button>
                    </div>

                    {/* Export Selected ZIP if subset selected */}
                    {images.length > 1 && selectedImageIds.length > 0 && selectedImageIds.length < images.length && (
                      <button
                        onClick={handleExportSelectedZip}
                        disabled={isExportingAll}
                        className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 rounded-md text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title={`Download only ${selectedImageIds.length} selected images as ZIP`}
                      >
                        <FileArchive className="w-3 h-3 text-purple-600" />
                        <span>ZIP Selected ({selectedImageIds.length})</span>
                      </button>
                    )}

                    {images.length > 1 && (
                      <button
                        onClick={handleExportAllZip}
                        disabled={isExportingAll}
                        className="px-2.5 py-1 bg-gradient-to-r from-[#be185d] to-[#db2777] hover:from-[#9d174d] hover:to-[#be185d] text-white rounded-md text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        title="Download all images as ZIP"
                      >
                        {isExportingAll ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Exporting ({exportProgress.current}/{exportProgress.total})...</span>
                          </>
                        ) : (
                          <>
                            <FileArchive className="w-3.5 h-3.5 text-pink-100" />
                            <span>Export All ({images.length}) ZIP</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-gray-800 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors border border-gray-300 cursor-pointer"
                      title="Add images (Ctrl/Shift to select multiple files)"
                    >
                      <Upload className="w-3 h-3 text-[#db2777]" />
                      <span>+ Add Images</span>
                    </button>

                    <button
                      onClick={() => setIsCreateArtboardModalOpen(true)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors border border-blue-300 cursor-pointer"
                      title="Create custom blank artboard for freehand halftone brush shading"
                    >
                      <span>➕</span>
                      <span>Blank Artboard</span>
                    </button>

                    <button
                      onClick={() => setIsClearConfirmModalOpen(true)}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Clear all images"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Minimize Button */}
                    <button
                      onClick={() => setIsFilmstripCollapsed(true)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#db2777] rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-all border border-gray-300 shadow-2xs cursor-pointer ml-1"
                      title="Minimize filmstrip to see full canvas"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Minimize Canvas</span>
                      <span className="sm:hidden">Minimize</span>
                    </button>
                  </div>
                </div>

                {/* Horizontal Scrollable Thumbnails Track with Mouse Drag & Wheel */}
                <div className="relative group/track flex items-center w-full">
                  {canScrollLeft && (
                    <button
                      type="button"
                      data-no-track-drag="true"
                      onClick={() => scrollFilmstrip('left')}
                      className="absolute left-0 z-20 h-16 w-6 bg-white/95 hover:bg-white border border-gray-300 shadow-md rounded-r-md flex items-center justify-center text-gray-700 hover:text-[#db2777] transition-all cursor-pointer backdrop-blur-xs"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  <div
                    ref={filmstripTrackRef}
                    onMouseDown={handleThumbnailTrackMouseDown}
                    onMouseMove={handleThumbnailTrackMouseMove}
                    onMouseUp={handleThumbnailTrackMouseUp}
                    onMouseLeave={handleThumbnailTrackMouseLeave}
                    onScroll={checkFilmstripScrollability}
                    className={`flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-thin px-1 w-full select-none relative ${
                      isMarqueeSelecting
                        ? 'cursor-crosshair select-none'
                        : filmstripToolMode === 'select'
                        ? 'cursor-crosshair'
                        : isTrackDragging
                        ? 'cursor-grabbing select-none !scroll-auto'
                        : 'cursor-grab'
                    }`}
                    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                  >
                    {/* Visual Drag Selection Marquee Box */}
                    {isMarqueeSelecting && marqueeRect && (
                      <div
                        className="absolute pointer-events-none border-2 border-purple-500 bg-purple-500/20 rounded z-30 shadow-xs"
                        style={{
                          left: `${marqueeRect.left}px`,
                          top: `${marqueeRect.top}px`,
                          width: `${marqueeRect.width}px`,
                          height: `${marqueeRect.height}px`,
                        }}
                      />
                    )}

                    {images.map((item, idx) => {
                      const isActive = item.id === activeImageId;
                      const isSelected = selectedImageIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          data-image-id={item.id}
                          onClick={(e) => {
                            if (hasDraggedThumbnailsRef.current) {
                              e.preventDefault();
                              e.stopPropagation();
                              return;
                            }
                            if (filmstripToolMode === 'select') {
                              handleToggleSelectImage(item.id, e);
                              return;
                            }
                            if (e.shiftKey) {
                              handleSelectRange(item.id);
                            } else if (e.ctrlKey || e.metaKey) {
                              handleToggleSelectImage(item.id, e);
                            } else {
                              selectActiveImage(item);
                              lastSelectedImageIdRef.current = item.id;
                            }
                          }}
                          className={`group relative shrink-0 rounded-lg transition-all duration-150 flex flex-col items-center p-1 select-none ${
                            filmstripToolMode === 'select'
                              ? 'cursor-pointer'
                              : isTrackDragging
                              ? 'cursor-grabbing'
                              : 'cursor-pointer'
                          } ${
                            isActive
                              ? 'ring-2 ring-[#db2777] ring-offset-2 bg-white shadow-md scale-102'
                              : isSelected
                              ? 'ring-2 ring-purple-500 bg-purple-50/70 border border-purple-300 shadow-xs'
                              : 'border border-gray-200 hover:border-gray-400 bg-gray-50/80 hover:bg-white opacity-85 hover:opacity-100'
                          }`}
                        >
                          {/* Image Thumbnail Box */}
                          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center relative select-none">
                            <img
                              src={item.src}
                              alt={item.name}
                              draggable={false}
                              className="w-full h-full object-cover pointer-events-none select-none"
                            />

                            {/* Multi-Selection Checkbox (Top Left) */}
                            <button
                              type="button"
                              data-no-track-drag="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectImage(item.id, e);
                              }}
                              className={`absolute top-1 left-1 z-20 w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                                isSelected
                                  ? 'bg-[#db2777] text-white ring-1 ring-white scale-105'
                                  : 'bg-black/50 hover:bg-black/80 text-white/50 hover:text-white border border-white/60'
                              }`}
                              title={isSelected ? 'Deselect this image' : 'Select for batch apply (or Ctrl/Shift click)'}
                            >
                              <Check className={`w-2.5 h-2.5 ${isSelected ? 'stroke-[3.5]' : 'opacity-0 hover:opacity-100'}`} />
                            </button>

                            {/* Number Badge (Bottom Left) */}
                            <span className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] px-1 rounded font-mono font-bold leading-tight select-none pointer-events-none">
                              #{idx + 1}
                            </span>

                            {/* Active Indicator Badge (Bottom Right) */}
                            {isActive && (
                              <span className="absolute bottom-1 right-1 bg-[#db2777] text-white text-[8px] font-bold px-1 rounded pointer-events-none shadow-2xs">
                                Active
                              </span>
                            )}

                            {/* Delete Button on Hover */}
                            <button
                              type="button"
                              data-no-track-drag="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(item.id, e);
                              }}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer z-20"
                              title="Remove this image"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          {/* Truncated File Name */}
                          <span
                            className={`text-[9.5px] max-w-[70px] truncate px-0.5 pt-1 text-center font-medium select-none pointer-events-none ${
                              isActive
                                ? 'text-[#db2777] font-bold'
                                : isSelected
                                ? 'text-purple-700 font-semibold'
                                : 'text-gray-600'
                            }`}
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        </div>
                      );
                    })}

                    {/* Quick Add Card at the end */}
                    <button
                      type="button"
                      data-no-track-drag="true"
                      onClick={(e) => {
                        if (hasDraggedThumbnailsRef.current) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        fileInputRef.current?.click();
                      }}
                      className="shrink-0 w-16 h-20 sm:w-18 sm:h-22 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#db2777] hover:bg-pink-50/40 flex flex-col items-center justify-center text-gray-400 hover:text-[#db2777] transition-all p-1 cursor-pointer select-none"
                      title="Add more images"
                    >
                      <Upload className="w-4 h-4 mb-1 pointer-events-none" />
                      <span className="text-[9px] font-bold text-center leading-tight pointer-events-none">Add More</span>
                    </button>
                  </div>

                  {canScrollRight && (
                    <button
                      type="button"
                      data-no-track-drag="true"
                      onClick={() => scrollFilmstrip('right')}
                      className="absolute right-0 z-20 h-16 w-6 bg-white/95 hover:bg-white border border-gray-300 shadow-md rounded-l-md flex items-center justify-center text-gray-700 hover:text-[#db2777] transition-all cursor-pointer backdrop-blur-xs"
                      title="Scroll Right"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* AI Background Remover Modal with API Key Setup */}
      {isAiBgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                <div className="w-8 h-8 rounded-full bg-[#fdf2f8] text-[#db2777] flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <span>AI Background Remover Setup</span>
              </div>
              <button
                onClick={() => setIsAiBgModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Server-side Google Gemini Vision AI engine automatically cuts out complex backgrounds and studio shadows with high precision.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleExecuteAiBackgroundRemoval}
                disabled={isRemovingBgAi}
                className="flex-1 py-2.5 px-4 bg-[#db2777] hover:bg-[#be185d] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isRemovingBgAi ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AI Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Background Removal</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleLocalBackgroundRemover();
                  setIsAiBgModalOpen(false);
                }}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                title="Fast local color remover"
              >
                Fast Local Cut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1f2937] text-white px-4 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#db2777]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Vision Modal */}
      {isAiModalOpen && (
        <AiAssistantModal
          currentSettings={{
            engineMode: 'precision',
            grayscale: true,
            brightness: 0,
            contrast: 15,
            gamma,
            invert,
            threshold: 0,
            blur: 0,
            sharpen: 0,
            dotShape: 'circle',
            gridType: patternMode === 'hexagonal' ? 'offset' : 'square',
            angle: rotation,
            cellSize: gridSpacing,
            minDotSize: 0.6,
            maxDotSize: gridSpacing - 1.2,
            minGap: 1.2,
            responseCurve: 'smoothstep',
            dotResponseFactor: 1.0,
            samplingMode: 'average',
            edgePreservation: 'medium',
            boundaryHandling: 'clip',
            enableCleanup: true,
            separateTouchingDots: true,
            removeTinyFragments: true,
            removeDuplicates: true,
            normalizeIrregularDots: true,
            forcePerfectCircles: true,
            circularityThreshold: 0.88,
            normalizationMode: 'preserve_area',
            minDotDiameter: 0.8,
            maxDotDiameter: 40,
            fragmentRemovalThreshold: 1.5,
            rebuildProblematicDots: true,
            createEditableVector: true,
            groupDots: true,
            putArtworkInNewLayer: true,
            layerName: 'Halftone',
            keepOriginalImage: 'keep',
            createBackground: !transparentBg,
            backgroundColor,
            dotColor: foregroundColor,
            outputScale: 1,
            outputDpi: 300,
            printMode: false,
            printUnits: 'mm',
            minPhysicalDotMm: 0.4,
            minPhysicalGapMm: 0.3,
            fitArtboardToArtwork: true,
            createNewDocument: false,
          }}
          imageThumbnailUrl={imageSrc}
          imageWidth={4000}
          imageHeight={4000}
          onApplySettings={(recommended) => {
            if (recommended.cellSize) setGridSpacing(recommended.cellSize);
            if (recommended.gamma !== undefined) setGamma(recommended.gamma);
            if (recommended.angle !== undefined) setRotation(recommended.angle);
            if (recommended.gridType) {
              setPatternMode(recommended.gridType === 'offset' ? 'hexagonal' : 'square');
            }
            showToast('✓ AI Visual Settings applied to canvas successfully!');
          }}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {/* Illustrator JSX Script Modal */}
      {isJsxModalOpen && (
        <JsxScriptModal
          scriptCode={STANDALONE_CLEANER_JSX}
          onClose={() => setIsJsxModalOpen(false)}
          onDownloadScript={handleDownloadJsxScript}
        />
      )}

      {/* Clear Dashboard Confirmation Modal */}
      {isClearConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Clear Dashboard & Image?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Clear Image & Empty Dashboard
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
              Are you sure you want to remove the current image and reset the dashboard? This will clear the canvas so you can load new images.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsClearConfirmModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleClearDashboard}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Preset Modal */}
      {isSavePresetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                <div className="w-8 h-8 rounded-full bg-[#fdf2f8] text-[#db2777] flex items-center justify-center">
                  <Bookmark className="w-4 h-4 fill-[#db2777]" />
                </div>
                <span>Save Preset</span>
              </div>
              <button
                onClick={() => setIsSavePresetModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Save your current halftone settings (pattern, grid spacing, rotation, dot size, contrast, etc.) as a reusable preset.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Effect Name</label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="e.g., My Special Print, Vintage Dots..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#db2777] font-medium"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCurrentPreset();
                }}
              />
            </div>

            {/* Current Settings Summary Card */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] space-y-1 text-gray-700">
              <div className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#db2777]" />
                <span>Current Settings Summary:</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-gray-600">
                <span>• Pattern: <b className="text-gray-900">{patternMode}</b></span>
                <span>• Grid Spacing: <b className="text-gray-900">{gridSpacing}px</b></span>
                <span>• Rotation: <b className="text-gray-900">{rotation}°</b></span>
                <span>• Dot Size: <b className="text-gray-900">{dotSize}x</b></span>
                <span>• Contrast: <b className="text-gray-900">{contrast}</b></span>
                <span>• Gamma: <b className="text-gray-900">{gamma}</b></span>
              </div>
            </div>

            {/* Previously Saved Custom Presets List */}
            {customPresets.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-gray-600">Saved Presets ({customPresets.length}):</div>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                  {customPresets.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-[11px] bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200"
                    >
                      <span className="font-medium text-gray-800">⭐ {p.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPresetToDelete(p);
                        }}
                        className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsSavePresetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCurrentPreset()}
                className="px-4 py-2 text-xs font-bold text-white bg-[#db2777] hover:bg-[#be185d] rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <span>Save Preset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Preset Confirmation Modal */}
      {presetToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-3.5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">
                  Delete Preset?
                </h3>
                <p className="text-[11px] text-gray-500">
                  Delete Saved Preset
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
              Are you sure you want to delete <b className="text-gray-900">"{presetToDelete.name}"</b> from your presets? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPresetToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDeleteCustomPreset(presetToDelete.id);
                  setPresetToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 8. Create Blank Artboard Modal */}
      {isCreateArtboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    Create Blank Artboard (ব্ল্যাংক আর্টবোর্ড)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    মন মতো আর্টবোর্ড তৈরি করুন এবং সরাসরি ব্রাশ দিয়ে ড্রয়িং/শেডিং করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateArtboardModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-800 block">
                  Artboard Presets (প্রিসেট সাইজ):
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: '2000 × 2000 (1:1 Standard)', w: 2000, h: 2000 },
                    { label: '4000 × 4000 (Pro High-Res)', w: 4000, h: 4000 },
                    { label: '1920 × 1080 (16:9 Landscape)', w: 1920, h: 1080 },
                    { label: '1080 × 1920 (9:16 Portrait)', w: 1080, h: 1920 },
                    { label: '2400 × 1800 (4:3 Standard)', w: 2400, h: 1800 },
                    { label: '2480 × 3508 (A4 300 DPI)', w: 2480, h: 3508 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setNewArtboardWidth(preset.w);
                        setNewArtboardHeight(preset.h);
                      }}
                      className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                        newArtboardWidth === preset.w && newArtboardHeight === preset.h
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-[11px] font-semibold truncate">{preset.label.split('(')[0]}</div>
                      <div className="text-[9.5px] text-gray-500 font-mono">
                        {preset.label.includes('(') ? `(${preset.label.split('(')[1]}` : `${preset.w}×${preset.h}px`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">Width (px)</label>
                  <input
                    type="number"
                    min="200"
                    max="8000"
                    step="50"
                    value={newArtboardWidth}
                    onChange={(e) => setNewArtboardWidth(Math.max(100, parseInt(e.target.value, 10) || 2000))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">Height (px)</label>
                  <input
                    type="number"
                    min="200"
                    max="8000"
                    step="50"
                    value={newArtboardHeight}
                    onChange={(e) => setNewArtboardHeight(Math.max(100, parseInt(e.target.value, 10) || 2000))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Background Color Choice */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-800 block">
                  Canvas Background (ব্যাকগ্রাউন্ড কালার):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '#ffffff', label: 'Pure White (সাদা)' },
                    { id: 'transparent', label: 'Transparent (স্বচ্ছ)' },
                    { id: '#000000', label: 'Pitch Black (কালো)' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setNewArtboardBgColor(bg.id)}
                      className={`p-2 rounded-lg text-center border transition-all cursor-pointer flex flex-col items-center ${
                        newArtboardBgColor === bg.id
                          ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500 shadow-xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 mb-1 shadow-2xs"
                        style={{
                          backgroundColor: bg.id === 'transparent' ? '#ffffff' : bg.id,
                          backgroundImage: bg.id === 'transparent' ? 'repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, transparent 0, transparent 4px)' : 'none'
                        }}
                      />
                      <span className="text-[10px] font-bold">{bg.label.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateArtboardModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateBlankArtboard(newArtboardWidth, newArtboardHeight, newArtboardBgColor)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🖌️</span>
                  <span>Create & Start Brushing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
