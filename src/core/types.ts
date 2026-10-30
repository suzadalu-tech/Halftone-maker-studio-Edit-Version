/**
 * Halftone Maker Studio - Core Types & Interfaces
 */

export type EngineMode = 'precision' | 'native';
export type GridType = 'square' | 'offset';
export type SamplingMode = 'average' | 'center' | 'weighted';
export type EdgePreservation = 'off' | 'low' | 'medium' | 'high';
export type BoundaryHandling = 'clip' | 'remove' | 'allow';
export type ResponseCurve = 'linear' | 'gamma' | 'logarithmic' | 'smoothstep';
export type DotShape = 'circle'; // Circle is default/primary
export type NormalizationMode = 'preserve_area' | 'preserve_diameter';
export type UnitType = 'px' | 'pt' | 'mm' | 'inch';

export interface HalftoneSettings {
  // Engine
  engineMode: EngineMode;
  
  // Image Adjustments
  grayscale: boolean;
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  gamma: number;      // 0.2 to 3.0
  invert: boolean;
  threshold: number;  // 0 to 100, 0 = disabled
  blur: number;       // 0 to 10
  sharpen: number;    // 0 to 10
  
  // Halftone Grid
  dotShape: DotShape;
  gridType: GridType;
  angle: number;           // -45 to 45 deg
  cellSize: number;        // in px or selected units (e.g. 2 to 30)
  minDotSize: number;      // min diameter (or 0)
  maxDotSize: number;      // max diameter (<= cellSize - minGap)
  minGap: number;          // minimum distance between dot borders
  responseCurve: ResponseCurve;
  dotResponseFactor: number; // 0.5 to 2.0
  
  // Sampling
  samplingMode: SamplingMode;
  edgePreservation: EdgePreservation;
  boundaryHandling: BoundaryHandling;
  
  // Dot Cleanup
  enableCleanup: boolean;
  separateTouchingDots: boolean;
  removeTinyFragments: boolean;
  removeDuplicates: boolean;
  normalizeIrregularDots: boolean;
  forcePerfectCircles: boolean;
  circularityThreshold: number; // 0.50 to 0.99 (default 0.85)
  normalizationMode: NormalizationMode;
  minDotDiameter: number;       // discard below this
  maxDotDiameter: number;       // clamp or split above this
  fragmentRemovalThreshold: number; // in px
  rebuildProblematicDots: boolean;
  
  // Vector & Illustrator Output
  createEditableVector: boolean;
  groupDots: boolean;
  putArtworkInNewLayer: boolean;
  layerName: string;
  keepOriginalImage: 'keep' | 'hide' | 'delete';
  createBackground: boolean;
  backgroundColor: string;
  dotColor: string;
  
  // Output & Print Mode
  outputScale: number; // 0.25, 0.5, 1, 2, etc.
  outputDpi: number;   // 72, 150, 300
  printMode: boolean;
  printUnits: UnitType;
  minPhysicalDotMm: number; // e.g. 0.4 mm
  minPhysicalGapMm: number; // e.g. 0.2 mm
  fitArtboardToArtwork: boolean;
  createNewDocument: boolean;
}

export interface HalftoneDot {
  x: number;
  y: number;
  radius: number;
  luminance: number;
  color?: string;
  isNormalized?: boolean;
  isAdjustedForCollision?: boolean;
  originalShape?: string;
  id?: number;
}

export interface QualityReportData {
  imageName: string;
  engineMode: EngineMode;
  gridType: GridType;
  cellSize: number;
  totalCandidateDots: number;
  finalDots: number;
  normalizedDots: number;
  collisionAdjustedDots: number;
  fragmentsRemoved: number;
  duplicatesRemoved: number;
  mergedRegionsRebuilt: number;
  averageGap: number;
  minObservedGap: number;
  processingTimeMs: number;
  zeroSizeRemoved: number;
  allDotsCircular: boolean;
  isPassed: boolean;
}

export interface BatchItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  previewUrl: string;
  status: 'waiting' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  errorMessage?: string;
  resultReport?: QualityReportData;
  outputSvg?: string;
  outputJsx?: string;
}

export interface PresetItem {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  settings: Partial<HalftoneSettings>;
}
