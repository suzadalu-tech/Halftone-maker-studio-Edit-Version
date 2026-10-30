import React from 'react';
import {
  Maximize2,
  Circle,
  Square,
  Hexagon,
  SunMedium,
  Minus,
  Disc,
  Sparkle,
  Droplet,
  Waves,
  Grid as GridIcon,
  Sliders,
  Palette,
  Wand2,
  Download,
  FileCode,
  RotateCcw,
  Check,
  Trash2,
  Split,
  Eye,
  Scissors,
  X,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Box,
  Tag,
  FileArchive,
  Eraser,
} from 'lucide-react';
import { PatternMode, DotStyle, SamplingChannel, FitMode, SavedPreset, BlurType } from '../App';

export type ActiveCategory =
  | 'artboard'
  | 'patterns'
  | 'grid'
  | 'tone'
  | 'brush'
  | 'transform'
  | 'sticker'
  | 'colors'
  | 'fx'
  | 'export';

export interface ModularToolDockProps {
  activeCategory: ActiveCategory | null;
  onSelectCategory: (cat: ActiveCategory | null) => void;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  onOpenCreateArtboardModal?: () => void;

  // 60 FPS Interactive slider handlers
  onSliderStart: () => void;
  onSliderEnd: () => void;
  isSliding: boolean;

  // Image & Transform
  imageLoaded: boolean;
  imageDimensions: { width: number; height: number };
  subjectTransform: { x: number; y: number; scale: number; rotation: number };
  setSubjectTransform: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number; rotation: number }>>;
  isTransformMode: boolean;
  setIsTransformMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  isEraserMode?: boolean;
  setIsEraserMode?: (v: boolean | ((prev: boolean) => boolean)) => void;
  eraserSize?: number;
  setEraserSize?: (v: number) => void;
  onResetErasedImage?: () => void;
  onSaveErasedImage?: () => void;

  // Photoshop-Style Halftone Shading Brush
  isBrushMode?: boolean;
  setIsBrushMode?: (v: boolean | ((prev: boolean) => boolean)) => void;
  brushColor?: string;
  setBrushColor?: (v: string) => void;
  brushSize?: number;
  setBrushSize?: (v: number) => void;
  brushHardness?: number;
  setBrushHardness?: (v: number) => void;
  brushRoundness?: number;
  setBrushRoundness?: (v: number) => void;
  brushAngle?: number;
  setBrushAngle?: (v: number) => void;
  brushOpacity?: number;
  setBrushOpacity?: (v: number) => void;
  brushFlow?: number;
  setBrushFlow?: (v: number) => void;
  brushSpacing?: number;
  setBrushSpacing?: (v: number) => void;
  brushBlendMode?: 'draw' | 'erase';
  setBrushBlendMode?: (v: 'draw' | 'erase') => void;
  onClearBrushStrokes?: () => void;
  onUndoBrushStroke?: () => void;
  brushStrokeCount?: number;
  fitMode: FitMode;
  handleFitModeChange: (mode: FitMode) => void;
  discardTransparentAreas: boolean;
  setDiscardTransparentAreas: (v: boolean) => void;
  maskType: 'none' | 'circle' | 'vignette';
  setMaskType: (v: 'none' | 'circle' | 'vignette') => void;

  // Patterns & Styles
  patternMode: PatternMode;
  setPatternMode: (v: PatternMode) => void;
  dotStyle: DotStyle;
  setDotStyle: (v: DotStyle) => void;
  outlineOnly: boolean;
  setOutlineOnly: (v: boolean) => void;

  // Grid & Dot Sizing
  gridSpacing: number;
  setGridSpacing: (v: number) => void;
  rotation: number;
  setRotation: (v: number) => void;
  diameter: number;
  setDiameter: (v: number) => void;
  dotSize: number;
  setDotSize: (v: number) => void;
  minDotSize: number;
  setMinDotSize: (v: number) => void;
  maxDotSize: number;
  setMaxDotSize: (v: number) => void;
  minDotMode: 'cutoff' | 'clamp';
  setMinDotMode: (v: 'cutoff' | 'clamp') => void;
  sizeResponse: number;
  setSizeResponse: (v: number) => void;
  scaleFactor: number;
  setScaleFactor: (v: number) => void;
  stretchAmount: number;
  setStretchAmount: (v: number) => void;
  skew: number;
  setSkew: (v: number) => void;

  // Tone & Sampling
  samplingChannel: SamplingChannel;
  setSamplingChannel: (v: SamplingChannel) => void;
  contrast: number;
  setContrast: (v: number) => void;
  gamma: number;
  setGamma: (v: number) => void;
  invert: boolean;
  setInvert: (v: boolean) => void;
  normalizeLuminance: boolean;
  setNormalizeLuminance: (v: boolean) => void;
  blur: number;
  setBlur: (v: number) => void;
  blurType?: BlurType;
  setBlurType?: (v: BlurType) => void;
  blurAngle?: number;
  setBlurAngle?: (v: number) => void;
  blurThreshold?: number;
  setBlurThreshold?: (v: number) => void;
  clampMin: number;
  setClampMin: (v: number) => void;
  clampMax: number;
  setClampMax: (v: number) => void;
  levelMaskMin: number;
  setLevelMaskMin: (v: number) => void;
  levelMaskMax: number;
  setLevelMaskMax: (v: number) => void;

  // Vector Sticker
  stickerUnderlayEnabled: boolean;
  setStickerUnderlayEnabled: (v: boolean) => void;
  stickerOffset: number;
  setStickerOffset: (v: number) => void;
  stickerShiftX: number;
  setStickerShiftX: (v: number) => void;
  stickerShiftY: number;
  setStickerShiftY: (v: number) => void;
  stickerColor: string;
  setStickerColor: (v: string) => void;
  stickerFillHoles: boolean;
  setStickerFillHoles: (v: boolean) => void;
  // Accent Stroke
  accentStrokeEnabled: boolean;
  setAccentStrokeEnabled: (v: boolean) => void;
  accentStrokeColor: string;
  setAccentStrokeColor: (v: string) => void;
  accentStrokeWidth: number;
  setAccentStrokeWidth: (v: number) => void;
  accentStrokeOffset: number;
  setAccentStrokeOffset: (v: number) => void;
  accentStrokeShiftX: number;
  setAccentStrokeShiftX: (v: number) => void;
  accentStrokeShiftY: number;
  setAccentStrokeShiftY: (v: number) => void;
  accentStrokeOpacity: number;
  setAccentStrokeOpacity: (v: number) => void;

  // Colors & Background
  foregroundColor: string;
  setForegroundColor: (v: string) => void;
  backgroundColor: string;
  setBackgroundColor: (v: string) => void;
  transparentBg: boolean;
  setTransparentBg: (v: boolean) => void;

  // Advanced FX
  displacementAmount: number;
  setDisplacementAmount: (v: number) => void;
  displacementFrequency: number;
  setDisplacementFrequency: (v: number) => void;
  samplingPosterize: number;
  setSamplingPosterize: (v: number) => void;
  noiseAmount: number;
  setNoiseAmount: (v: number) => void;
  quantizeLevels: number;
  setQuantizeLevels: (v: number) => void;

  // Export Actions
  onExportSvg: () => void;
  onExportEps: () => void;
  onExportJsx: () => void;
  onExportPng: () => void;
  onExportAllZip: () => void;
  isExportingAll: boolean;
  exportProgress: { current: number; total: number };
  loadedImagesCount: number;

  // Presets
  presets: SavedPreset[];
  activePresetId: string | null;
  onApplyPreset: (id: string) => void;
  onSaveCurrentPreset: () => void;
  onDeletePreset: (id: string) => void;

  // UI Toast helper
  showToast: (msg: string) => void;
  sourceImageNatural: { width: number; height: number };
  onOpenFileUpload?: () => void;
  onLoadSamplePattern?: (type: 'sphere' | 'emblem' | 'sticker' | 'defects') => void;
  onApplyToAll?: () => void;
  onApplyToSelected?: () => void;
  selectedImagesCount?: number;
  isApplyingAll?: boolean;
  applyAllStatus?: 'idle' | 'applying' | 'complete';
  applyProgress?: { current: number; total: number };
  onEffectTouched?: () => void;
}

export const CATEGORIES: {
  id: ActiveCategory;
  nameBn: string;
  nameEn: string;
  icon: string;
  color: string;
}[] = [
  { id: 'artboard', nameBn: 'Artboard & Colors', nameEn: 'Artboard & Colors', icon: '📐', color: '#2563eb' },
  { id: 'patterns', nameBn: 'Dot Patterns & Styles', nameEn: 'Dot Patterns & Styles', icon: '🔘', color: '#db2777' },
  { id: 'grid', nameBn: 'Grid & Dot Sizing', nameEn: 'Grid & Dot Sizing', icon: '⚙️', color: '#eab308' },
  { id: 'tone', nameBn: 'Tone, Contrast & Sampling', nameEn: 'Tone, Contrast & Sampling', icon: '🎨', color: '#8b5cf6' },
  { id: 'brush', nameBn: 'Halftone Shading Brush', nameEn: 'Photoshop Shading Brush', icon: '🖌️', color: '#0ea5e9' },
  { id: 'transform', nameBn: 'Free Transform', nameEn: 'Free Transform', icon: '⛶', color: '#2563eb' },
  { id: 'sticker', nameBn: 'Pure Vector Sticker', nameEn: 'Pure Vector Sticker', icon: '🏷️', color: '#059669' },
  { id: 'fx', nameBn: 'Advanced FX', nameEn: 'Advanced FX', icon: '🪄', color: '#d946ef' },
  { id: 'export', nameBn: 'Export & Output', nameEn: 'Export & Output', icon: '💾', color: '#16a34a' },
];

export const ModularToolDock: React.FC<ModularToolDockProps> = ({
  activeCategory,
  onSelectCategory,
  isDrawerOpen,
  onToggleDrawer,
  onSliderStart,
  onSliderEnd,
  isSliding,
  onOpenFileUpload,
  onOpenCreateArtboardModal,
  onLoadSamplePattern,
  onApplyToAll,
  onApplyToSelected,
  selectedImagesCount = 0,
  isApplyingAll = false,
  applyAllStatus = 'idle',
  applyProgress = { current: 0, total: 0 },
  onEffectTouched,

  // Image & Transform
  imageLoaded,
  imageDimensions,
  subjectTransform,
  setSubjectTransform,
  isTransformMode,
  setIsTransformMode,
  isEraserMode = false,
  setIsEraserMode,
  eraserSize = 60,
  setEraserSize,
  onResetErasedImage,
  onSaveErasedImage,

  // Photoshop-Style Halftone Shading Brush
  isBrushMode = false,
  setIsBrushMode,
  brushColor = '#000000',
  setBrushColor,
  brushSize = 80,
  setBrushSize,
  brushHardness = 0,
  setBrushHardness,
  brushRoundness = 100,
  setBrushRoundness,
  brushAngle = 0,
  setBrushAngle,
  brushOpacity = 100,
  setBrushOpacity,
  brushFlow = 80,
  setBrushFlow,
  brushSpacing = 15,
  setBrushSpacing,
  brushBlendMode = 'draw',
  setBrushBlendMode,
  onClearBrushStrokes,
  onUndoBrushStroke,
  brushStrokeCount = 0,

  fitMode,
  handleFitModeChange,
  discardTransparentAreas,
  setDiscardTransparentAreas,
  maskType,
  setMaskType,

  // Patterns & Styles
  patternMode,
  setPatternMode,
  dotStyle,
  setDotStyle,
  outlineOnly,
  setOutlineOnly,

  // Grid & Sizing
  gridSpacing,
  setGridSpacing,
  rotation,
  setRotation,
  diameter,
  setDiameter,
  dotSize,
  setDotSize,
  minDotSize,
  setMinDotSize,
  maxDotSize,
  setMaxDotSize,
  minDotMode,
  setMinDotMode,
  sizeResponse,
  setSizeResponse,
  scaleFactor,
  setScaleFactor,
  stretchAmount,
  setStretchAmount,
  skew,
  setSkew,

  // Tone & Sampling
  samplingChannel,
  setSamplingChannel,
  contrast,
  setContrast,
  gamma,
  setGamma,
  invert,
  setInvert,
  normalizeLuminance,
  setNormalizeLuminance,
  blur,
  setBlur,
  blurType = 'gaussian',
  setBlurType,
  blurAngle = 0,
  setBlurAngle,
  blurThreshold = 25,
  setBlurThreshold,
  clampMin,
  setClampMin,
  clampMax,
  setClampMax,
  levelMaskMin,
  setLevelMaskMin,
  levelMaskMax,
  setLevelMaskMax,

  // Vector Sticker
  stickerUnderlayEnabled,
  setStickerUnderlayEnabled,
  stickerOffset,
  setStickerOffset,
  stickerShiftX,
  setStickerShiftX,
  stickerShiftY,
  setStickerShiftY,
  stickerColor,
  setStickerColor,
  stickerFillHoles,
  setStickerFillHoles,
  accentStrokeEnabled,
  setAccentStrokeEnabled,
  accentStrokeColor,
  setAccentStrokeColor,
  accentStrokeWidth,
  setAccentStrokeWidth,
  accentStrokeOffset,
  setAccentStrokeOffset,
  accentStrokeShiftX,
  setAccentStrokeShiftX,
  accentStrokeShiftY,
  setAccentStrokeShiftY,
  accentStrokeOpacity,
  setAccentStrokeOpacity,

  // Colors & Background
  foregroundColor,
  setForegroundColor,
  backgroundColor,
  setBackgroundColor,
  transparentBg,
  setTransparentBg,

  // Advanced FX
  displacementAmount,
  setDisplacementAmount,
  displacementFrequency,
  setDisplacementFrequency,
  samplingPosterize,
  setSamplingPosterize,
  noiseAmount,
  setNoiseAmount,
  quantizeLevels,
  setQuantizeLevels,

  // Export Actions
  onExportSvg,
  onExportEps,
  onExportJsx,
  onExportPng,
  onExportAllZip,
  isExportingAll,
  exportProgress,
  loadedImagesCount,

  // Presets
  presets,
  activePresetId,
  onApplyPreset,
  onSaveCurrentPreset,
  onDeletePreset,

  // UI Toast helper
  showToast,
  sourceImageNatural,
}) => {
  // Slider wrapper to ensure 60 FPS live preview during drag and high-res on release
  const handleSliderPointerDown = () => {
    onSliderStart();
  };

  const handleSliderPointerUp = () => {
    onSliderEnd();
  };

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="flex h-full select-none shrink-0 z-20">
      {/* ========================================================================= */}
      {/* 1. LEFT MAIN DOCK (Photoshop / Illustrator Left Palette Style)            */}
      {/* ========================================================================= */}
      <div
        className="w-[72px] border-r border-[#e6e6ba] flex flex-col items-center py-2 shrink-0 select-none shadow-xs z-30"
        style={{ backgroundColor: '#FFFFD7' }}
      >
        <div className="flex-1 w-full space-y-1.5 px-1.5 overflow-y-auto scrollbar-none py-1">
          {CATEGORIES.map((cat) => {
            const isActive = isDrawerOpen && activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (isActive) {
                    onToggleDrawer();
                  } else {
                    onSelectCategory(cat.id);
                  }
                }}
                className={`w-full group flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 cursor-pointer relative ${
                  isActive
                    ? 'bg-[#ececbd] text-black shadow-xs ring-1 ring-black/15 font-bold'
                    : 'text-black/80 hover:text-black hover:bg-black/5 font-semibold'
                }`}
                title={cat.nameEn}
              >
                {/* Active Indicator Bar on the left */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#db2777] rounded-r-md" />
                )}

                <span className="text-xl mb-1 transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span className="text-[9px] text-center leading-tight tracking-tight line-clamp-2 px-0.5 text-black font-semibold">
                  {cat.nameEn.split('&')[0].trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Drawer Toggle Indicator */}
        <div className="w-full px-2 pt-2 border-t border-[#e6e6ba] flex justify-center">
          <button
            type="button"
            onClick={onToggleDrawer}
            className="w-full py-1.5 bg-black/5 hover:bg-black/10 text-black rounded-lg flex items-center justify-center text-[10px] transition-colors"
            title={isDrawerOpen ? 'Collapse panel drawer' : 'Expand panel drawer'}
          >
            {isDrawerOpen ? <ChevronLeft className="w-3.5 h-3.5 text-black" /> : <ChevronRight className="w-3.5 h-3.5 text-black" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-PANEL DRAWER (Opens when category clicked)                         */}
      {/* ========================================================================= */}
      {isDrawerOpen && activeCategory && (
        <aside className="w-80 md:w-84 bg-white border-r border-gray-200 flex flex-col h-full z-20 shrink-0 shadow-xl overflow-hidden animate-in slide-in-from-left-2 duration-150">
          {/* Sub-Panel Header */}
          <div className="px-4 py-3 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeCategoryMeta?.icon}</span>
              <div>
                <h3 className="text-xs font-bold text-gray-900 leading-tight">
                  {activeCategoryMeta?.nameEn}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleDrawer}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Apply to All / Apply to Selected Quick Action Bar (when multiple images are loaded) */}
          {loadedImagesCount > 1 && (
            <div className="px-3.5 py-2 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border-b border-purple-100 flex flex-col gap-1.5 shrink-0 shadow-2xs">
              <div className="flex items-center justify-between text-[10px] font-semibold text-purple-900">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{loadedImagesCount} images loaded</span>
                </div>
                {selectedImagesCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-pink-100 text-[#db2777] rounded font-bold text-[9.5px] border border-pink-200">
                    {selectedImagesCount} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {selectedImagesCount > 0 && onApplyToSelected && (
                  <button
                    type="button"
                    onClick={onApplyToSelected}
                    disabled={isApplyingAll}
                    className="flex-1 px-2.5 py-1 text-white rounded-md text-[10px] font-bold shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer bg-gradient-to-r from-[#db2777] to-purple-600 hover:from-[#be185d] hover:to-purple-700 disabled:opacity-50"
                    title={`Apply current effect settings only to ${selectedImagesCount} selected images`}
                  >
                    <Check className="w-3 h-3 text-white" />
                    <span>Apply Selected ({selectedImagesCount})</span>
                  </button>
                )}
                {onApplyToAll && (
                  <button
                    type="button"
                    onClick={onApplyToAll}
                    disabled={isApplyingAll}
                    className={`px-2.5 py-1 text-white rounded-md text-[10px] font-bold shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      selectedImagesCount > 0
                        ? 'bg-gray-700 hover:bg-gray-800'
                        : 'flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
                    title="Apply current effect settings to all loaded images"
                  >
                    {isApplyingAll ? (
                      <>
                        <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Applying ({applyProgress.current}/{applyProgress.total})...</span>
                      </>
                    ) : applyAllStatus === 'complete' ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>Done</span>
                      </>
                    ) : (
                      <span>Apply to All ({loadedImagesCount})</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sub-Panel Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-gray-700"
            onPointerDown={() => {
              if (onEffectTouched) onEffectTouched();
            }}
          >
            {/* ================================================================= */}
            {/* CATEGORY 1: ARTBOARD & TRANSFORM                                  */}
            {/* ================================================================= */}
            {activeCategory === 'artboard' && (
              <div className="space-y-4">
                {/* Create Custom Blank Artboard Card */}
                {onOpenCreateArtboardModal && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 p-3 rounded-xl space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <span>📄</span> Blank Artboard (নতুন আর্টবোর্ড)
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-800 leading-tight">
                      কাস্টম সাইজের ব্ল্যাংক আর্টবোর্ড নিন এবং সরাসরি ব্রাশ দিয়ে ড্রয়িং ও শেডিং করুন।
                    </p>
                    <button
                      type="button"
                      onClick={onOpenCreateArtboardModal}
                      className="w-full py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>➕</span> Create Blank Artboard...
                    </button>
                  </div>
                )}

                {/* Artboard & Canvas Colors */}
                <div className="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-1.5">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span>🎨</span> Artboard & Canvas Colors
                    </span>
                  </div>

                  {/* Foreground Dot Color */}
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-800">
                        Foreground Color
                      </label>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{foregroundColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-9 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                        title="Foreground Color"
                      />
                      <input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase"
                        placeholder="#000000"
                      />
                    </div>
                    {/* Quick swatches */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {[
                        { color: '#000000', title: 'Black' },
                        { color: '#ffffff', title: 'White' },
                        { color: '#db2777', title: 'Pink' },
                        { color: '#2563eb', title: 'Blue' },
                        { color: '#eab308', title: 'Yellow' },
                        { color: '#10b981', title: 'Green' },
                      ].map((sw) => (
                        <button
                          key={sw.color}
                          type="button"
                          onClick={() => setForegroundColor(sw.color)}
                          title={sw.title}
                          className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                            foregroundColor.toLowerCase() === sw.color.toLowerCase()
                              ? 'border-blue-600 ring-2 ring-blue-500 scale-105'
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: sw.color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Background Canvas Color */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2.5">
                      <div>
                        <label className="text-xs font-bold text-gray-800 block">
                          Background Color
                        </label>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Canvas mode
                        </span>
                      </div>

                      {/* Solid Green Highlighted Transparent Button with larger width & height */}
                      <button
                        type="button"
                        onClick={() => {
                          setTransparentBg(!transparentBg);
                          if (onEffectTouched) onEffectTouched();
                        }}
                        className={`flex items-center justify-center gap-2.5 px-6 py-3 min-w-[150px] h-12 rounded-xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer select-none shadow-sm ${
                          transparentBg
                            ? 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md ring-2 ring-[#16a34a]/30'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                        title="Toggle Transparent Background"
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                            transparentBg
                              ? 'bg-white text-[#16a34a]'
                              : 'border-2 border-gray-400 bg-white'
                          }`}
                        >
                          {transparentBg && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-[13px] tracking-wide font-bold">Transparent</span>
                      </button>
                    </div>

                    {!transparentBg && (
                      <div className="space-y-2 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-9 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                            title="Background Color"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase"
                            placeholder="#FFFFFF"
                          />
                        </div>
                        {/* Quick bg swatches */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {[
                            { color: '#ffffff', title: 'White' },
                            { color: '#000000', title: 'Black' },
                            { color: '#0f172a', title: 'Navy' },
                            { color: '#fef3c7', title: 'Cream' },
                            { color: '#f3f4f6', title: 'Gray' },
                          ].map((sw) => (
                            <button
                              key={sw.color}
                              type="button"
                              onClick={() => setBackgroundColor(sw.color)}
                              title={sw.title}
                              className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                                backgroundColor.toLowerCase() === sw.color.toLowerCase()
                                  ? 'border-blue-600 ring-2 ring-blue-500 scale-105'
                                  : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: sw.color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Curated Pro Palettes */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-600 block">
                      Color Palette Presets:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { name: 'Classic Ink', fg: '#000000', bg: '#ffffff' },
                        { name: 'Pop Comic', fg: '#db2777', bg: '#fef08a' },
                        { name: 'Cyberpunk', fg: '#06b6d4', bg: '#18181b' },
                        { name: 'Warm Sunset', fg: '#f97316', bg: '#4c1d95' },
                        { name: 'Vintage Sepia', fg: '#78350f', bg: '#fef3c7' },
                        { name: 'Blueprint Navy', fg: '#ffffff', bg: '#1e3a8a' },
                      ].map((pal) => (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() => {
                            setForegroundColor(pal.fg);
                            setBackgroundColor(pal.bg);
                            setTransparentBg(false);
                            showToast(`✓ "${pal.name}" palette applied`);
                          }}
                          className="flex items-center gap-1.5 p-1.5 bg-white hover:bg-amber-100/50 border border-amber-200/60 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <div className="flex items-center">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 -mr-1 shadow-2xs"
                              style={{ backgroundColor: pal.fg }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
                              style={{ backgroundColor: pal.bg }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-800 truncate">{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Eraser Tool */}
                <div className="bg-pink-50/70 border border-pink-200 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                      <Eraser className="w-3.5 h-3.5 text-[#db2777]" />
                      Eraser Tool (E)
                    </span>
                    {setIsEraserMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEraserMode((prev) => {
                            const next = !prev;
                            if (next) setIsTransformMode(false);
                            return next;
                          });
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                          isEraserMode
                            ? 'bg-[#db2777] text-white ring-2 ring-pink-300'
                            : 'bg-white text-pink-800 border border-pink-300 hover:bg-pink-100'
                        }`}
                      >
                        <Eraser className="w-3 h-3" />
                        {isEraserMode ? 'Eraser Active' : 'Select Eraser'}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-pink-900 pt-1 border-t border-pink-100">
                    <span className="text-gray-600">Brush Size: <span className="font-mono font-bold text-[#db2777]">{eraserSize}px</span></span>
                  </div>
                  {onSaveErasedImage && (
                    <button
                      type="button"
                      onClick={onSaveErasedImage}
                      className="w-full py-1.5 bg-[#db2777] hover:bg-[#be185d] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                      title="Save erased subject changes permanently"
                    >
                      💾 Save Erase
                    </button>
                  )}
                  {onResetErasedImage && (
                    <button
                      type="button"
                      onClick={onResetErasedImage}
                      className="w-full text-center text-[10px] text-pink-700 hover:text-pink-900 underline font-semibold cursor-pointer pt-0.5"
                    >
                      Restore Erased Areas
                    </button>
                  )}
                </div>

                {/* Auto Fit Modes */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-800">Auto Fit Mode</label>
                    <span className="text-[9px] font-medium text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">
                      Smart Alpha Trim
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Fit to Short Edge', 'Fit to Long Edge', 'Cover', 'Contain'] as FitMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleFitModeChange(mode)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                          fitMode === mode
                            ? 'bg-[#db2777] text-white shadow-2xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9.5px] text-gray-500 leading-tight pt-0.5">
                    অটোমেটিক্যালি ট্রান্সপারেন্ট অংশ বাদ দিয়ে মূল সাবজেক্টকে ফিট করে (Fit to Long Edge-এ চারপাশে 200px মার্জিন/প্যাডিং যুক্ত থাকবে)।
                  </p>
                </div>


              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY 2: DOT PATTERNS & STYLES                                */}
            {/* ================================================================= */}
            {activeCategory === 'patterns' && (
              <div className="space-y-4">
                {/* Pattern Grid Type */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-800 block">
                    Halftone Pattern Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'circle', icon: Circle, label: 'Circle' },
                        { id: 'square', icon: Square, label: 'Square' },
                        { id: 'hexagonal', icon: Hexagon, label: 'Hexagon' },
                        { id: 'radial', icon: SunMedium, label: 'Radial' },
                        { id: 'line', icon: Minus, label: 'Line' },
                        { id: 'ring', icon: Disc, label: 'Ring' },
                        { id: 'stippling', icon: Sparkle, label: 'Stipple' },
                        { id: 'blob', icon: Droplet, label: 'Blob' },
                        { id: 'liquid', icon: Waves, label: 'Liquid' },
                      ] as const
                    ).map((item) => {
                      const IconComp = item.icon;
                      const isSelected = patternMode === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPatternMode(item.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#fdf2f8] border-2 border-[#db2777] text-[#db2777] font-bold shadow-2xs'
                              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <IconComp className="w-4 h-4 mb-1" />
                          <span className="text-[10px]">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dot Shape Style */}
                <div className="space-y-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <label className="text-[11px] font-bold text-gray-800 block">
                    Dot Shape Style
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'circle', label: 'Circle' },
                        { id: 'square', label: 'Square' },
                        { id: 'diamond', label: 'Diamond' },
                      ] as const
                    ).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setDotStyle(style.id)}
                        className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          dotStyle === style.id
                            ? 'bg-[#db2777] text-white shadow-2xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>


              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY 3: GRID & DOT SIZING                                    */}
            {/* ================================================================= */}
            {activeCategory === 'grid' && (
              <div className="space-y-4">
                {/* Grid Spacing / Cell Size */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Grid Spacing</span>
                    <span className="font-mono font-bold text-[#db2777] bg-pink-50 px-1.5 py-0.5 rounded">
                      {gridSpacing.toFixed(1)} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="200"
                    step="0.5"
                    value={gridSpacing}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setGridSpacing(parseFloat(e.target.value))}
                    className="w-full accent-[#db2777]"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>Dense (4px)</span>
                    <span>Medium (40px)</span>
                    <span>Jumbo (200px)</span>
                  </div>
                </div>

                {/* Dot Size Multiplier */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Dot Size</span>
                    <span className="font-mono text-gray-600">
                      {dotSize.toFixed(2)}x <span className="text-[#db2777] font-semibold">(~{(maxDotSize * dotSize).toFixed(1)}px)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="6.0"
                    step="0.05"
                    value={dotSize}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setDotSize(parseFloat(e.target.value))}
                    className="w-full accent-[#db2777]"
                  />
                </div>

                {/* Min / Max Dot Sizes */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Min Dot Size</span>
                      <span className="font-mono">{minDotSize.toFixed(1)}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="0.5"
                      value={minDotSize}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMinDotSize(val);
                        if (val > maxDotSize) setMaxDotSize(val);
                      }}
                      className="w-full accent-[#db2777]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Max Dot Size</span>
                      <span className="font-mono font-bold text-[#db2777]">{maxDotSize.toFixed(1)}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="160"
                      step="0.5"
                      value={maxDotSize}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMaxDotSize(val);
                        if (val < minDotSize) setMinDotSize(val);
                      }}
                      className="w-full accent-[#db2777]"
                    />
                    <div className="flex gap-1 pt-0.5">
                      {[15, 20, 25, 30, 45].map((presetSz) => (
                        <button
                          key={presetSz}
                          type="button"
                          onClick={() => setMaxDotSize(presetSz)}
                          className={`flex-1 py-0.5 rounded text-[9px] font-medium transition cursor-pointer ${
                            Math.round(maxDotSize) === presetSz
                              ? 'bg-[#db2777] text-white shadow-2xs font-bold'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {presetSz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Min Dot Mode: Cutoff vs Clamp */}
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <label className="text-[10px] font-bold text-gray-700 block">
                    Min Dot Filter
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMinDotMode('cutoff')}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center cursor-pointer ${
                        minDotMode === 'cutoff'
                          ? 'bg-[#db2777] text-white shadow-2xs'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      Cutoff
                    </button>
                    <button
                      type="button"
                      onClick={() => setMinDotMode('clamp')}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center cursor-pointer ${
                        minDotMode === 'clamp'
                          ? 'bg-[#db2777] text-white shadow-2xs'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      Clamp
                    </button>
                  </div>
                </div>

                {/* Grid Rotation */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Grid Rotation</span>
                    <span className="font-mono text-gray-600">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="1"
                    value={rotation}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                    className="w-full accent-[#db2777]"
                  />
                  <div className="flex gap-1.5 pt-1">
                    {[0, 15, 22.5, 45, -33, -45].map((ang) => (
                      <button
                        key={ang}
                        type="button"
                        onClick={() => setRotation(ang)}
                        className="flex-1 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-mono rounded text-center cursor-pointer"
                      >
                        {ang}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stretch & Skew */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Stretch</span>
                      <span className="font-mono">{stretchAmount.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={stretchAmount}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setStretchAmount(parseFloat(e.target.value))}
                      className="w-full accent-[#db2777]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Skew</span>
                      <span className="font-mono">{skew}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="1"
                      value={skew}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setSkew(parseInt(e.target.value, 10))}
                      className="w-full accent-[#db2777]"
                    />
                  </div>
                </div>

                {/* Scale Factor Slider */}
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-gray-700">Scale Factor</span>
                    <span className="font-mono">{scaleFactor.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.05"
                    value={scaleFactor}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setScaleFactor(parseFloat(e.target.value))}
                    className="w-full accent-[#db2777]"
                  />
                </div>

                {/* Dynamic Curve / Tone Response */}
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-gray-700">Tone Response Curve</span>
                    <span className="font-mono">{sizeResponse.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={sizeResponse}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setSizeResponse(parseFloat(e.target.value))}
                    className="w-full accent-[#db2777]"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400">
                    <span>Logarithmic (-1)</span>
                    <span>Linear (0)</span>
                    <span>Exponential (+1)</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY 4: TONE, CONTRAST & SAMPLING                             */}
            {/* ================================================================= */}
            {activeCategory === 'tone' && (
              <div className="space-y-4">
                {/* Sampling Channel */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-800 block">
                    Sampling Channel
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        { id: 'inverse_luminance', label: 'Inverse Luminance' },
                        { id: 'luminance', label: 'Luminance' },
                        { id: 'red', label: 'Red Channel' },
                        { id: 'green', label: 'Green Channel' },
                        { id: 'blue', label: 'Blue Channel' },
                        { id: 'alpha', label: 'Alpha' },
                      ] as const
                    ).map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSamplingChannel(ch.id)}
                        className={`p-2 rounded-lg text-[10px] font-bold text-left transition-all cursor-pointer ${
                          samplingChannel === ch.id
                            ? 'bg-[#fdf2f8] border-2 border-[#db2777] text-[#db2777]'
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Contrast</span>
                    <span className="font-mono text-gray-600">{contrast.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.02"
                    value={contrast}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setContrast(parseFloat(e.target.value))}
                    className="w-full accent-[#db2777]"
                  />
                </div>

                {/* Gamma */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Gamma Curve</span>
                    <span className="font-mono text-gray-600">{gamma.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.05"
                    value={gamma}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setGamma(parseFloat(e.target.value))}
                    className="w-full accent-[#db2777]"
                  />
                </div>

                {/* Invert Halftone Toggle */}
                <label className="flex items-center gap-2 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invert}
                    onChange={(e) => setInvert(e.target.checked)}
                    className="rounded text-[#db2777] focus:ring-[#db2777] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-gray-800 block">
                    Invert Halftone
                  </span>
                </label>

                {/* Photoshop Blur Suite (সকল প্রকার ফটোশপ ব্লার ফিল্টার) */}
                <div className="bg-purple-50/60 border border-purple-200/90 p-3 rounded-xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-purple-200/70 pb-1.5">
                    <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <span>💫</span> Photoshop Blur Filters (ফটোশপ ব্লার)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-purple-800 bg-white px-1.5 py-0.5 rounded border border-purple-200 shadow-2xs">
                      {blur === 0 ? 'Off' : `${blur}%`}
                    </span>
                  </div>

                  {/* Blur Types Grid */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-700 block">Blur Filter Mode:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'gaussian', label: 'Gaussian Blur', bn: 'গাউসিয়ান', icon: '🫧' },
                        { id: 'motion', label: 'Motion Blur', bn: 'মোশন ব্লার', icon: '💨' },
                        { id: 'radial_spin', label: 'Radial Spin', bn: 'স্পিন ব্লার', icon: '🌀' },
                        { id: 'radial_zoom', label: 'Radial Zoom', bn: 'জুম ব্লার', icon: '✨' },
                        { id: 'box', label: 'Box Blur', bn: 'বক্স ব্লার', icon: '⏹️' },
                        { id: 'surface', label: 'Surface Blur', bn: 'সারফেস ব্লার', icon: '🛡️' },
                        { id: 'lens', label: 'Lens Blur', bn: 'লেন্স ব্লার', icon: '📷' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setBlurType && setBlurType(b.id as BlurType)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            blurType === b.id
                              ? 'bg-[#8b5cf6] text-white border-[#7c3aed] shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-100/50 hover:text-purple-900'
                          }`}
                        >
                          <span className="text-xs">{b.icon}</span>
                          <span className="truncate">{b.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Radius / Amount Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-gray-800">
                        {blurType === 'motion' ? 'Distance / Amount' : 'Blur Intensity (সফট শ্যাডো / ব্লার)'}
                      </span>
                      <span className="font-mono text-purple-700 font-bold">{blur}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={blur}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                      className="w-full accent-[#8b5cf6]"
                    />
                  </div>

                  {/* Motion Blur Angle Slider */}
                  {blurType === 'motion' && (
                    <div className="space-y-1 bg-white p-2 rounded-lg border border-purple-200/80">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-700">Motion Angle (কোণ)</span>
                        <span className="font-mono text-purple-700 font-bold">{blurAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={blurAngle}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) => setBlurAngle && setBlurAngle(parseInt(e.target.value, 10))}
                        className="w-full accent-[#8b5cf6]"
                      />
                      <div className="flex items-center justify-between gap-1 pt-1">
                        {[-90, -45, 0, 45, 90].map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => setBlurAngle && setBlurAngle(deg)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                              blurAngle === deg
                                ? 'bg-purple-600 text-white border-purple-600 font-bold'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-purple-50'
                            }`}
                          >
                            {deg}°
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Surface Blur Edge Threshold */}
                  {blurType === 'surface' && (
                    <div className="space-y-1 bg-white p-2 rounded-lg border border-purple-200/80">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-700">Edge Threshold (Edge Preservation)</span>
                        <span className="font-mono text-purple-700 font-bold">{blurThreshold}</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        step="1"
                        value={blurThreshold}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) => setBlurThreshold && setBlurThreshold(parseInt(e.target.value, 10))}
                        className="w-full accent-[#8b5cf6]"
                      />
                      <p className="text-[9px] text-gray-500 leading-tight">
                        উচ্চ থ্রেশহোল্ড দিলে শক্ত রূপরেখা অক্ষত থাকবে এবং ভিতরের মসৃণ অংশ ব্লার হবে।
                      </p>
                    </div>
                  )}

                  {/* Quick Blur Intensity Presets */}
                  <div className="flex items-center gap-1 pt-0.5">
                    {[
                      { label: 'Off', val: 0 },
                      { label: 'Subtle', val: 15 },
                      { label: 'Medium', val: 40 },
                      { label: 'Strong', val: 70 },
                      { label: 'Full Shadow', val: 100 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setBlur(p.val)}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                          blur === p.val
                            ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clamp Min & Max */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Clamp Min</span>
                      <span className="font-mono">{clampMin.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={clampMin}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setClampMin(parseFloat(e.target.value))}
                      className="w-full accent-[#db2777]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Clamp Max</span>
                      <span className="font-mono">{clampMax.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={clampMax}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setClampMax(parseFloat(e.target.value))}
                      className="w-full accent-[#db2777]"
                    />
                  </div>
                </div>

                {/* Level Mask Min & Max */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Level Mask Min</span>
                      <span className="font-mono">{levelMaskMin.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={levelMaskMin}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setLevelMaskMin(parseFloat(e.target.value))}
                      className="w-full accent-[#db2777]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Level Mask Max</span>
                      <span className="font-mono">{levelMaskMax.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={levelMaskMax}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setLevelMaskMax(parseFloat(e.target.value))}
                      className="w-full accent-[#db2777]"
                    />
                  </div>
                </div>

                {/* Normalize Luminance Toggle */}
                <label className="flex items-center gap-2 p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={normalizeLuminance}
                    onChange={(e) => setNormalizeLuminance(e.target.checked)}
                    className="rounded text-[#db2777] focus:ring-[#db2777] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-bold text-gray-800 block">
                    Normalize Luminance
                  </span>
                </label>
              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY: HALFTONE SHADING BRUSH (PHOTOSHOP-STYLE)                */}
            {/* ================================================================= */}
            {activeCategory === 'brush' && (
              <div className="space-y-4">
                {/* Master Brush Toggle */}
                <div className="p-3 bg-sky-50/80 border border-sky-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-sky-950 block flex items-center gap-1.5">
                        <span>🖌️</span> Photoshop Shading Brush
                      </span>
                      <span className="text-[10px] text-sky-700">
                        Paints real-time dynamic halftone vector shading with edge dot falloff
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (setIsBrushMode) {
                        setIsBrushMode((prev) => {
                          const next = !prev;
                          if (next) {
                            setIsTransformMode?.(false);
                            setIsEraserMode?.(false);
                          }
                          return next;
                        });
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                      isBrushMode
                        ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200'
                        : 'bg-white hover:bg-sky-100 text-sky-700 border border-sky-300'
                    }`}
                  >
                    <span>{isBrushMode ? '✓ Paint Brush Active (B)' : 'Activate Brush Tool (B)'}</span>
                  </button>
                </div>

                {/* Draw vs Erase Mode */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-800 block">Brush Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBrushBlendMode && setBrushBlendMode('draw')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        brushBlendMode === 'draw'
                          ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>🖌️ Paint Shading</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrushBlendMode && setBrushBlendMode('erase')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        brushBlendMode === 'erase'
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>🧹 Erase Shading</span>
                    </button>
                  </div>
                </div>

                {/* Brush Color & Artboard Background Color Section */}
                <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-200/80 space-y-3">
                  {/* Brush Color Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs inline-block" style={{ backgroundColor: brushColor }} />
                        <span>Brush Color (ব্রাশ কালার)</span>
                      </label>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{brushColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor?.(e.target.value)}
                        className="w-9 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                        title="Pick Brush Color"
                      />
                      <input
                        type="text"
                        value={brushColor}
                        onChange={(e) => setBrushColor?.(e.target.value)}
                        className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase"
                        placeholder="#000000"
                      />
                    </div>
                    {/* Brush Color Swatches */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {[
                        { color: '#000000', title: 'Black (কালো)' },
                        { color: '#ffffff', title: 'White (সাদা)' },
                        { color: '#db2777', title: 'Pink' },
                        { color: '#2563eb', title: 'Blue' },
                        { color: '#dc2626', title: 'Red' },
                        { color: '#16a34a', title: 'Green' },
                        { color: '#d97706', title: 'Amber' },
                        { color: '#4b5563', title: 'Charcoal' },
                      ].map((sw) => (
                        <button
                          key={sw.color}
                          type="button"
                          onClick={() => setBrushColor?.(sw.color)}
                          title={sw.title}
                          className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                            brushColor.toLowerCase() === sw.color.toLowerCase()
                              ? 'border-sky-600 ring-2 ring-sky-500 scale-105'
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: sw.color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Artboard Color Control */}
                  <div className="space-y-1.5 pt-2.5 border-t border-sky-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs inline-block"
                          style={{
                            backgroundColor: transparentBg ? '#ffffff' : backgroundColor,
                            backgroundImage: transparentBg ? 'repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, transparent 0, transparent 4px)' : 'none'
                          }}
                        />
                        <span>Artboard Color (আর্টবোর্ড কালার)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setTransparentBg(!transparentBg);
                          if (onEffectTouched) onEffectTouched();
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                          transparentBg
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                        title="Toggle Transparent Artboard"
                      >
                        {transparentBg ? '✓ Transparent' : 'Make Transparent'}
                      </button>
                    </div>

                    {!transparentBg && (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => {
                              setBackgroundColor(e.target.value);
                              if (onEffectTouched) onEffectTouched();
                            }}
                            className="w-9 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                            title="Pick Artboard Background Color"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => {
                              setBackgroundColor(e.target.value);
                              if (onEffectTouched) onEffectTouched();
                            }}
                            className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-mono uppercase"
                            placeholder="#FFFFFF"
                          />
                        </div>
                        {/* Artboard Color Swatches */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {[
                            { color: '#ffffff', title: 'Pure White (সাদা)' },
                            { color: '#000000', title: 'Pitch Black (কালো)' },
                            { color: '#fef3c7', title: 'Warm Cream' },
                            { color: '#0f172a', title: 'Deep Navy' },
                            { color: '#f3f4f6', title: 'Soft Gray' },
                            { color: '#334155', title: 'Slate' },
                          ].map((sw) => (
                            <button
                              key={sw.color}
                              type="button"
                              onClick={() => {
                                setBackgroundColor(sw.color);
                                if (onEffectTouched) onEffectTouched();
                              }}
                              title={sw.title}
                              className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                                backgroundColor.toLowerCase() === sw.color.toLowerCase()
                                  ? 'border-sky-600 ring-2 ring-sky-500 scale-105'
                                  : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: sw.color }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-800 block">Photoshop Brush Presets</label>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setBrushSize?.(80);
                        setBrushHardness?.(0);
                        setBrushRoundness?.(100);
                        setBrushAngle?.(0);
                        setBrushOpacity?.(100);
                        setBrushFlow?.(80);
                      }}
                      className="p-2 bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-300 rounded-lg text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-gray-900">Soft Shading</div>
                      <div className="text-gray-500 text-[9px]">0% Hardness, dot falloff</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBrushSize?.(45);
                        setBrushHardness?.(30);
                        setBrushRoundness?.(100);
                        setBrushAngle?.(0);
                        setBrushOpacity?.(85);
                        setBrushFlow?.(65);
                      }}
                      className="p-2 bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-300 rounded-lg text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-gray-900">Stipple Texture</div>
                      <div className="text-gray-500 text-[9px]">Grain & light stippling</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBrushSize?.(70);
                        setBrushHardness?.(45);
                        setBrushRoundness?.(25);
                        setBrushAngle?.(45);
                        setBrushOpacity?.(100);
                        setBrushFlow?.(90);
                      }}
                      className="p-2 bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-300 rounded-lg text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-gray-900">Chisel / Calligraphy</div>
                      <div className="text-gray-500 text-[9px]">25% Round, 45° Chisel</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBrushSize?.(60);
                        setBrushHardness?.(85);
                        setBrushRoundness?.(100);
                        setBrushAngle?.(0);
                        setBrushOpacity?.(100);
                        setBrushFlow?.(100);
                      }}
                      className="p-2 bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-300 rounded-lg text-left transition-all cursor-pointer"
                    >
                      <div className="font-bold text-gray-900">Dense Shadow</div>
                      <div className="text-gray-500 text-[9px]">85% Hardness, solid core</div>
                    </button>
                  </div>
                </div>

                {/* Size Slider (with [ and ] shortcuts) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Brush Size (Keys: [ ])</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0.25"
                        max="5000"
                        step="0.25"
                        value={brushSize}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            setBrushSize?.(Math.max(0.25, Math.min(5000, val)));
                          }
                        }}
                        className="w-20 px-1.5 py-0.5 text-right font-mono text-xs font-bold text-sky-700 bg-white border border-gray-200 rounded focus:border-sky-500 focus:outline-none"
                      />
                      <span className="text-[11px] font-mono text-gray-500">px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.25"
                    max="5000"
                    step="0.25"
                    value={brushSize}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setBrushSize?.(val);
                    }}
                    className="w-full accent-sky-600"
                  />
                  {/* Quick Preset Buttons for 0.25 to 5000px scale */}
                  <div className="flex items-center gap-1 pt-0.5 overflow-x-auto text-[10px]">
                    {[0.25, 1, 5, 20, 80, 250, 1000, 5000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setBrushSize?.(preset)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors border ${
                          brushSize === preset
                            ? 'bg-sky-600 text-white border-sky-600 font-bold'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {preset}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hardness / Softness Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <div>
                      <span className="font-bold text-gray-800">Hardness / Softness</span>
                      <span className="text-[9.5px] text-gray-500 block">
                        {brushHardness === 0 ? '0% (Full soft edge - dots dissolve completely)' : `${brushHardness}% edge hardness`}
                      </span>
                    </div>
                    <span className="font-mono text-sky-700 font-bold">{brushHardness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={brushHardness}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setBrushHardness?.(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-600"
                  />
                </div>

                {/* Roundness & Angle Grid */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Roundness</span>
                      <span className="font-mono font-bold text-sky-700">{brushRoundness}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={brushRoundness}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setBrushRoundness?.(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Angle</span>
                      <span className="font-mono font-bold text-sky-700">{brushAngle}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={brushAngle}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setBrushAngle?.(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-600"
                    />
                  </div>
                </div>

                {/* Opacity & Flow Grid */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Opacity</span>
                      <span className="font-mono font-bold text-sky-700">{brushOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={brushOpacity}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setBrushOpacity?.(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-bold text-gray-700">Flow</span>
                      <span className="font-mono font-bold text-sky-700">{brushFlow}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={brushFlow}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) => setBrushFlow?.(parseInt(e.target.value, 10))}
                      className="w-full accent-sky-600"
                    />
                  </div>
                </div>

                {/* Spacing Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Spacing (Smoothness)</span>
                    <span className="font-mono text-sky-700 font-bold">{brushSpacing}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={brushSpacing}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setBrushSpacing?.(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-600"
                  />
                </div>

                {/* Undo & Clear Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onUndoBrushStroke}
                    disabled={brushStrokeCount === 0}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>↩️ Undo Stroke</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClearBrushStrokes}
                    disabled={brushStrokeCount === 0}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🗑️ Clear Strokes</span>
                  </button>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY: FREE TRANSFORM & POSITION (Above Pure Vector Sticker)   */}
            {/* ================================================================= */}
            {activeCategory === 'transform' && (
              <div className="space-y-4">
                {/* Free Transform Toggle & Canvas Handles Card */}
                <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <span>⛶</span> Subject Free Transform
                      </span>
                      <p className="text-[10px] text-blue-700 leading-tight mt-0.5">
                        সরাসরি ক্যানভাসে ড্র্যাগ করে মুভ ও স্কেল করুন
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTransformMode((prev) => {
                          const next = !prev;
                          if (next) {
                            if (setIsBrushMode) setIsBrushMode(false);
                            if (setIsEraserMode) setIsEraserMode(false);
                          }
                          return next;
                        });
                      }}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                        isTransformMode
                          ? 'bg-[#2563eb] text-white ring-2 ring-blue-300 shadow-md'
                          : 'bg-white text-blue-800 border border-blue-300 hover:bg-blue-100'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      {isTransformMode ? '✓ Transform Active' : 'Enable Transform'}
                    </button>
                  </div>

                  {/* Interactive Status Notice */}
                  {isTransformMode ? (
                    <div className="bg-blue-100/70 border border-blue-300/80 rounded-lg p-2 text-[10px] text-blue-900 flex items-center gap-1.5">
                      <span className="text-blue-600 font-bold">ℹ️</span>
                      <span>Canvas Handles Active: ক্যানভাসের নীল বাউন্ডিং বক্স টেনে ছোট/বড় ও মুভ করতে পারেন।</span>
                    </div>
                  ) : (
                    <div className="bg-gray-100/70 border border-gray-200 rounded-lg p-2 text-[10px] text-gray-600">
                      Transform সক্রিয় করলে ক্যানভাসে হ্যান্ডেল ও বাউন্ডিং বক্স প্রদর্শিত হবে।
                    </div>
                  )}

                  {/* Quick Centering, Fit and Reset Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-blue-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectTransform((prev) => ({ ...prev, x: 2000, y: 2000 }));
                        showToast('✓ Centered to artboard');
                      }}
                      className="px-2 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-lg text-[10px] font-bold text-center transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      title="Center to artboard"
                    >
                      <span>🎯</span> Center
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const natW = sourceImageNatural.width || 1000;
                        const natH = sourceImageNatural.height || 1000;
                        const maxDim = Math.max(natW, natH);
                        const initScale = maxDim > 0 ? parseFloat((2800 / maxDim).toFixed(3)) : 1;
                        setSubjectTransform({ x: 2000, y: 2000, scale: initScale, rotation: 0 });
                        showToast('✓ Fit to canvas');
                      }}
                      className="px-2 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-lg text-[10px] font-bold text-center transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      title="Fit subject onto canvas"
                    >
                      <span>↺</span> Fit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectTransform({ x: 2000, y: 2000, scale: 1, rotation: 0 });
                        showToast('✓ Reset transform');
                      }}
                      className="px-2 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-lg text-[10px] font-bold text-center transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      title="Reset position and 100% scale"
                    >
                      <span>⟲</span> 100%
                    </button>
                  </div>

                  {/* Scale (Size) Slider & Quick +/- */}
                  <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-blue-200/80">
                    <div className="flex justify-between items-center text-[11px] font-medium text-blue-950">
                      <span className="font-bold text-gray-800">Subject Scale (Size)</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSubjectTransform((prev) => ({
                              ...prev,
                              scale: Math.max(0.05, parseFloat((prev.scale - 0.05).toFixed(3))),
                            }))
                          }
                          className="w-5 h-5 rounded bg-gray-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer"
                          title="Zoom Out (-5%)"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-blue-800 text-[11px] min-w-[42px] text-center">
                          {Math.round(subjectTransform.scale * 100)}%
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSubjectTransform((prev) => ({
                              ...prev,
                              scale: Math.min(5.0, parseFloat((prev.scale + 0.05).toFixed(3))),
                            }))
                          }
                          className="w-5 h-5 rounded bg-gray-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold flex items-center justify-center text-xs shadow-2xs cursor-pointer"
                          title="Zoom In (+5%)"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3.5"
                      step="0.01"
                      value={subjectTransform.scale}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) =>
                        setSubjectTransform((prev) => ({
                          ...prev,
                          scale: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-[#2563eb]"
                    />
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      {[0.5, 0.75, 1.0, 1.5, 2.0].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSubjectTransform((prev) => ({ ...prev, scale: s }))}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                            Math.round(subjectTransform.scale * 100) === Math.round(s * 100)
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50'
                          }`}
                        >
                          {Math.round(s * 100)}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rotation Slider & 90-degree Turns */}
                  <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-blue-200/80">
                    <div className="flex justify-between items-center text-[11px] font-medium text-blue-950">
                      <span className="font-bold text-gray-800">Rotation Angle</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setSubjectTransform((prev) => ({
                              ...prev,
                              rotation: ((prev.rotation - 90) % 360),
                            }))
                          }
                          className="px-1.5 py-0.5 rounded bg-gray-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-[10px] cursor-pointer"
                          title="Rotate 90° CCW"
                        >
                          ↶ -90°
                        </button>
                        <span className="font-mono font-bold text-blue-800 text-[11px] min-w-[36px] text-center">
                          {Math.round(subjectTransform.rotation || 0)}°
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSubjectTransform((prev) => ({
                              ...prev,
                              rotation: ((prev.rotation + 90) % 360),
                            }))
                          }
                          className="px-1.5 py-0.5 rounded bg-gray-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold text-[10px] cursor-pointer"
                          title="Rotate 90° CW"
                        >
                          ↷ +90°
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={subjectTransform.rotation || 0}
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onChange={(e) =>
                        setSubjectTransform((prev) => ({
                          ...prev,
                          rotation: parseInt(e.target.value, 10),
                        }))
                      }
                      className="w-full accent-[#2563eb]"
                    />
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      {[-180, -90, 0, 90, 180].map((deg) => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() => setSubjectTransform((prev) => ({ ...prev, rotation: deg }))}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                            Math.round(subjectTransform.rotation || 0) === deg
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50'
                          }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position Coordinates X & Y */}
                  <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-blue-200/80">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-700">Position X</span>
                        <span className="font-mono text-blue-700">{Math.round(subjectTransform.x)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="4000"
                        step="10"
                        value={subjectTransform.x}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) =>
                          setSubjectTransform((prev) => ({ ...prev, x: parseInt(e.target.value, 10) }))
                        }
                        className="w-full accent-[#2563eb]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-gray-700">Position Y</span>
                        <span className="font-mono text-blue-700">{Math.round(subjectTransform.y)}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="4000"
                        step="10"
                        value={subjectTransform.y}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) =>
                          setSubjectTransform((prev) => ({ ...prev, y: parseInt(e.target.value, 10) }))
                        }
                        className="w-full accent-[#2563eb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Auto Fit Modes */}
                <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-800">Auto Fit Preset</label>
                    <span className="text-[9px] font-medium text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">
                      Smart Alpha Trim
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Fit to Short Edge', 'Fit to Long Edge', 'Cover', 'Contain'] as FitMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleFitModeChange(mode)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                          fitMode === mode
                            ? 'bg-[#2563eb] text-white shadow-2xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY 5: PURE VECTOR STICKER                                   */}
            {/* ================================================================= */}
            {activeCategory === 'sticker' && (
              <div className="space-y-4">
                {/* Sticker Underlay Toggle */}
                <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 block">
                      🏷️ Vector Sticker Underlay
                    </span>
                    <input
                      type="checkbox"
                      checked={stickerUnderlayEnabled}
                      onChange={(e) => setStickerUnderlayEnabled(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>

                {stickerUnderlayEnabled && (
                  <div className="space-y-3 pl-1 border-l-2 border-emerald-300 ml-1">
                    {/* Sticker Offset */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-gray-800">Outline Offset</span>
                        <span className="font-mono text-emerald-700 font-bold">{stickerOffset}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150"
                        step="2"
                        value={stickerOffset}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) => setStickerOffset(parseInt(e.target.value, 10))}
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    {/* Sticker Color */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-700 block">
                        Sticker Background Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={stickerColor}
                          onChange={(e) => setStickerColor(e.target.value)}
                          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={stickerColor}
                          onChange={(e) => setStickerColor(e.target.value)}
                          className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Fill Holes in Sticker */}
                    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stickerFillHoles}
                        onChange={(e) => setStickerFillHoles(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-gray-700">
                        Fill Inner Holes
                      </span>
                    </label>

                    {/* Sticker Shift X / Y */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>Shift X</span>
                          <span className="font-mono">{stickerShiftX}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="2"
                          value={stickerShiftX}
                          onPointerDown={handleSliderPointerDown}
                          onPointerUp={handleSliderPointerUp}
                          onChange={(e) => setStickerShiftX(parseInt(e.target.value, 10))}
                          className="w-full accent-emerald-600"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span>Shift Y</span>
                          <span className="font-mono">{stickerShiftY}px</span>
                        </div>
                        <input
                          type="range"
                          min="-80"
                          max="80"
                          step="2"
                          value={stickerShiftY}
                          onPointerDown={handleSliderPointerDown}
                          onPointerUp={handleSliderPointerUp}
                          onChange={(e) => setStickerShiftY(parseInt(e.target.value, 10))}
                          className="w-full accent-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Accent Contour Stroke */}
                    <div className="bg-red-50/70 border border-red-200 p-2.5 rounded-xl space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-red-900">
                          🎯 Accent Contour Stroke
                        </span>
                        <input
                          type="checkbox"
                          checked={accentStrokeEnabled}
                          onChange={(e) => setAccentStrokeEnabled(e.target.checked)}
                          className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {accentStrokeEnabled && (
                        <div className="space-y-2 pt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Stroke Width</span>
                              <span className="font-mono">{accentStrokeWidth}px</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="50"
                              step="1"
                              value={accentStrokeWidth}
                              onPointerDown={handleSliderPointerDown}
                              onPointerUp={handleSliderPointerUp}
                              onChange={(e) => setAccentStrokeWidth(parseInt(e.target.value, 10))}
                              className="w-full accent-red-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Stroke Offset</span>
                              <span className="font-mono">{accentStrokeOffset}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="60"
                              step="1"
                              value={accentStrokeOffset}
                              onPointerDown={handleSliderPointerDown}
                              onPointerUp={handleSliderPointerUp}
                              onChange={(e) => setAccentStrokeOffset(parseInt(e.target.value, 10))}
                              className="w-full accent-red-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span>Opacity</span>
                              <span className="font-mono">{Math.round(accentStrokeOpacity * 100)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="1.0"
                              step="0.05"
                              value={accentStrokeOpacity}
                              onPointerDown={handleSliderPointerDown}
                              onPointerUp={handleSliderPointerUp}
                              onChange={(e) => setAccentStrokeOpacity(parseFloat(e.target.value))}
                              className="w-full accent-red-600"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span>Shift X</span>
                                <span className="font-mono">{accentStrokeShiftX}px</span>
                              </div>
                              <input
                                type="range"
                                min="-40"
                                max="40"
                                step="2"
                                value={accentStrokeShiftX}
                                onPointerDown={handleSliderPointerDown}
                                onPointerUp={handleSliderPointerUp}
                                onChange={(e) => setAccentStrokeShiftX(parseInt(e.target.value, 10))}
                                className="w-full accent-red-600"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span>Shift Y</span>
                                <span className="font-mono">{accentStrokeShiftY}px</span>
                              </div>
                              <input
                                type="range"
                                min="-40"
                                max="40"
                                step="2"
                                value={accentStrokeShiftY}
                                onPointerDown={handleSliderPointerDown}
                                onPointerUp={handleSliderPointerUp}
                                onChange={(e) => setAccentStrokeShiftY(parseInt(e.target.value, 10))}
                                className="w-full accent-red-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="color"
                              value={accentStrokeColor}
                              onChange={(e) => setAccentStrokeColor(e.target.value)}
                               className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                            />
                            <span className="text-[10px] text-gray-700 font-mono">{accentStrokeColor}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY 6: ADVANCED FX                                           */}
            {/* ================================================================= */}
            {activeCategory === 'fx' && (
              <div className="space-y-4">
                {/* Displacement Map */}
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 space-y-2">
                  <label className="text-[11px] font-bold text-gray-800 block">
                    Displacement Wave
                  </label>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>Amount</span>
                        <span className="font-mono">{displacementAmount}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={displacementAmount}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) => setDisplacementAmount(parseInt(e.target.value, 10))}
                        className="w-full accent-[#db2777]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>Frequency</span>
                        <span className="font-mono">{displacementFrequency}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={displacementFrequency}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onChange={(e) => setDisplacementFrequency(parseInt(e.target.value, 10))}
                        className="w-full accent-[#db2777]"
                      />
                    </div>
                  </div>
                </div>

                {/* Posterization */}
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Posterization</span>
                    <span className="font-mono text-gray-600">{samplingPosterize}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={samplingPosterize}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setSamplingPosterize(parseInt(e.target.value, 10))}
                    className="w-full accent-[#db2777]"
                  />
                </div>

                {/* Stochastic Noise */}
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Noise</span>
                    <span className="font-mono text-gray-600">{noiseAmount}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="2"
                    value={noiseAmount}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setNoiseAmount(parseInt(e.target.value, 10))}
                    className="w-full accent-[#db2777]"
                  />
                </div>

                {/* Quantization */}
                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-800">Quantization</span>
                    <span className="font-mono text-gray-600">{quantizeLevels}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={quantizeLevels}
                    onPointerDown={handleSliderPointerDown}
                    onPointerUp={handleSliderPointerUp}
                    onChange={(e) => setQuantizeLevels(parseInt(e.target.value, 10))}
                    className="w-full accent-[#db2777]"
                  />
                </div>
              </div>
            )}

            {/* ================================================================= */}
            {/* CATEGORY 8: EXPORT & OUTPUT                                       */}
            {/* ================================================================= */}
            {activeCategory === 'export' && (
              <div className="space-y-4">
                {/* 1. Microstock & Production Vector Downloads */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-900 block flex items-center gap-1.5">
                    <span>💾</span> Export Formats
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {/* SVG Vector */}
                    <button
                      type="button"
                      onClick={onExportSvg}
                      className="p-3 bg-[#db2777] hover:bg-[#be185d] text-white rounded-xl shadow-xs flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer group"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">SVG Vector</span>
                      <span className="text-[9px] text-pink-100">Pure 4000px Vector</span>
                    </button>

                    {/* High-Res PNG */}
                    <button
                      type="button"
                      onClick={onExportPng}
                      className="p-3 bg-gray-800 hover:bg-black text-white rounded-xl shadow-xs flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer group"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold">High-Res PNG</span>
                      <span className="text-[9px] text-gray-300">4000x4000 px</span>
                    </button>
                  </div>
                </div>

                {/* Batch All ZIP Export */}
                {loadedImagesCount > 1 && (
                  <button
                    type="button"
                    onClick={onExportAllZip}
                    disabled={isExportingAll}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <FileArchive className="w-4 h-4" />
                    <span>
                      {isExportingAll
                        ? `Exporting (${exportProgress.current}/${exportProgress.total})...`
                        : `Batch Export ZIP (${loadedImagesCount} Images)`}
                    </span>
                  </button>
                )}

                {/* 2. Presets Manager */}
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-800 block">
                      Preset Library
                    </label>
                    <button
                      type="button"
                      onClick={onSaveCurrentPreset}
                      className="text-[10px] text-[#db2777] hover:underline font-bold"
                    >
                      + Save Current
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {presets.map((pr) => {
                      const isSelected = activePresetId === pr.id;
                      return (
                        <div
                          key={pr.id}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                            isSelected
                              ? 'bg-pink-50 border-[#db2777] text-[#db2777] font-bold'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onApplyPreset(pr.id)}
                            className="flex-1 text-left cursor-pointer"
                          >
                            {pr.name}
                          </button>
                          {pr.isCustom && (
                            <button
                              type="button"
                              onClick={() => onDeletePreset(pr.id)}
                              className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                              title="Delete preset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
