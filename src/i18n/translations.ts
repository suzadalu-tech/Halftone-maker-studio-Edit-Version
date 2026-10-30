export type Language = 'en' | 'bn';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  inputSection: string;
  addImage: string;
  addMultiple: string;
  selectFolder: string;
  loadTestPattern: string;
  modeSection: string;
  engineNative: string;
  enginePrecision: string;
  imageSettings: string;
  grayscale: string;
  brightness: string;
  contrast: string;
  gamma: string;
  invert: string;
  threshold: string;
  halftoneSettings: string;
  dotShape: string;
  circle: string;
  gridType: string;
  gridSquare: string;
  gridOffset: string;
  angle: string;
  cellSize: string;
  minDotSize: string;
  maxDotSize: string;
  minGap: string;
  dotCleanup: string;
  enableCleanup: string;
  separateTouchingDots: string;
  removeTinyFragments: string;
  removeDuplicateDots: string;
  normalizeIrregularDots: string;
  forcePerfectCircles: string;
  circularityThreshold: string;
  fragmentRemovalThreshold: string;
  rebuildProblematicDots: string;
  vectorSettings: string;
  createEditableVector: string;
  groupDots: string;
  putInNewLayer: string;
  keepOriginalImage: string;
  layerName: string;
  createBackground: string;
  backgroundColor: string;
  dotColor: string;
  outputSection: string;
  scale: string;
  outputDpi: string;
  printMode: string;
  minPhysicalDot: string;
  preview: string;
  process: string;
  reset: string;
  savePreset: string;
  loadPreset: string;
  batchMode: string;
  qualityReport: string;
  exportExtendScript: string;
  exportSvg: string;
  downloadExtension: string;
  cleanExistingHalftone: string;
  aiAssistant: string;
  autoOptimize: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Halftone Maker Studio',
    appSubtitle: 'Professional Adobe Illustrator Vector Halftone Engine',
    inputSection: 'INPUT IMAGE',
    addImage: 'Add Image',
    addMultiple: 'Add Multiple Images',
    selectFolder: 'Select Folder',
    loadTestPattern: 'Load Test Pattern',
    modeSection: 'PROCESSING ENGINE',
    engineNative: 'Illustrator Native Workflow',
    enginePrecision: 'Halftone Maker Studio Engine',
    imageSettings: 'IMAGE ADJUSTMENTS',
    grayscale: 'Grayscale Conversion',
    brightness: 'Brightness',
    contrast: 'Contrast',
    gamma: 'Gamma Curve',
    invert: 'Invert Halftone',
    threshold: 'Threshold Cutoff',
    halftoneSettings: 'HALFTONE GRID & GEOMETRY',
    dotShape: 'Dot Shape',
    circle: 'Perfect Circle (2R × 2R)',
    gridType: 'Grid Lattice',
    gridSquare: 'Square Grid',
    gridOffset: 'Offset / Staggered Grid (Cell/2)',
    angle: 'Grid Rotation Angle',
    cellSize: 'Cell Size (Frequency)',
    minDotSize: 'Minimum Dot Diameter',
    maxDotSize: 'Maximum Dot Diameter',
    minGap: 'Minimum Gap Between Dots',
    dotCleanup: 'DOT CLEANUP & ARTIFACT REPAIR',
    enableCleanup: 'Enable Dot Cleanup',
    separateTouchingDots: 'Separate Touching Dots (Collision Prevention)',
    removeTinyFragments: 'Remove Tiny Fragments & Specks',
    removeDuplicateDots: 'Remove Duplicate Coincident Dots',
    normalizeIrregularDots: 'Normalize Irregular Dots to Mathematical Circles',
    forcePerfectCircles: 'Force Exact Circles (W=H)',
    circularityThreshold: 'Circularity Threshold (4πA/P²)',
    fragmentRemovalThreshold: 'Fragment Removal Threshold',
    rebuildProblematicDots: 'Rebuild Problematic / Merged Regions',
    vectorSettings: 'VECTOR & LAYER SETTINGS',
    createEditableVector: 'Create Editable Vector Geometry',
    groupDots: 'Group Dots Container',
    putInNewLayer: 'Put Artwork in New Layer',
    keepOriginalImage: 'Original Image Retention',
    layerName: 'Target Layer Name',
    createBackground: 'Create Background Plate',
    backgroundColor: 'Background Color',
    dotColor: 'Dot Fill Color',
    outputSection: 'OUTPUT & PRINT SPECIFICATIONS',
    scale: 'Scale Factor',
    outputDpi: 'Target Resolution (DPI)',
    printMode: 'Print Mode (Physical ink gap constraints)',
    minPhysicalDot: 'Min Physical Dot (mm)',
    preview: 'Live Preview',
    process: 'GENERATE VECTOR ARTWORK',
    reset: 'Reset Defaults',
    savePreset: 'Save Preset',
    loadPreset: 'Load Preset',
    batchMode: 'Batch Processing Queue',
    qualityReport: 'Quality Control Validation',
    exportExtendScript: 'Export Illustrator ExtendScript (.jsx)',
    exportSvg: 'Export Clean Vector (.svg)',
    downloadExtension: 'Download Illustrator CEP Extension Package',
    cleanExistingHalftone: 'Clean Existing Traced Halftone Selection',
    aiAssistant: 'AI Parameter Assistant',
    autoOptimize: 'AUTO OPTIMIZE',
  },
  bn: {
    appTitle: 'হাফটোন মেকার স্টুডিও',
    appSubtitle: 'অ্যাডোবি ইলাস্ট্রেটর ভেক্টর হাফটোন ইঞ্জিন',
    inputSection: 'ছবি ইনপুট',
    addImage: 'ছবি যোগ করুন',
    addMultiple: 'একাধিক ছবি যোগ করুন',
    selectFolder: 'ফোল্ডার নির্বাচন করুন',
    loadTestPattern: 'টেস্ট প্যাটার্ন লোড করুন',
    modeSection: 'প্রসেসিং ইঞ্জিন',
    engineNative: 'ইলাস্ট্রেটর নেটিভ ওয়ার্কফ্লো',
    enginePrecision: 'হাফটোন মেকার স্টুডিও ইঞ্জিন',
    imageSettings: 'ছবি সমন্বয়',
    grayscale: 'গ্রেস্কেল রূপান্তর',
    brightness: 'উজ্জ্বলতা',
    contrast: 'কনট্রাস্ট',
    gamma: 'গামা কার্ভ',
    invert: 'ইনভার্ট হাফটোন',
    threshold: 'থ্রেশহোল্ড কাটঅফ',
    halftoneSettings: 'হাফটোন গ্রিড ও জ্যামিতি',
    dotShape: 'ডটের আকৃতি',
    circle: 'নিখুঁত বৃত্ত (২R × ২R)',
    gridType: 'গ্রিড টাইপ',
    gridSquare: 'বর্গাকার গ্রিড',
    gridOffset: 'অফসেট / স্ট্যাগার্ড গ্রিড',
    angle: 'গ্রিড ঘূর্ণন কোণ',
    cellSize: 'সেল সাইজ (ফ্রিকোয়েন্সি)',
    minDotSize: 'সর্বনিম্ন ডট সাইজ',
    maxDotSize: 'সর্বোচ্চ ডট সাইজ',
    minGap: 'ডটের মধ্যবর্তী ন্যূনতম দূরত্ব (গ্যাপ)',
    dotCleanup: 'ডট ক্লিনআপ ও সমস্যা সমাধান',
    enableCleanup: 'ডট ক্লিনআপ চালু রাখুন',
    separateTouchingDots: 'সংযুক্ত ডট আলাদা করুন (কলিশন প্রিভেনশন)',
    removeTinyFragments: 'ক্ষুদ্র ভগ্নাংশ ও দাগ দূর করুন',
    removeDuplicateDots: 'ডুপ্লিকেট ডট অপসারণ করুন',
    normalizeIrregularDots: 'অসম আকৃতির ডটকে বৃত্তাকার করুন',
    forcePerfectCircles: 'সম্পূর্ণ বৃত্তে রূপান্তর (W=H)',
    circularityThreshold: 'বৃত্তাকারতার থ্রেশহোল্ড (4πA/P²)',
    fragmentRemovalThreshold: 'ফ্র্যাগমেন্ট ফিল্টার সীমা',
    rebuildProblematicDots: 'সমস্যাযুক্ত ও মিশ্রিত অংশ পুনর্নির্মাণ',
    vectorSettings: 'ভেক্টর ও লেয়ার সেটিংস',
    createEditableVector: 'সম্পাদনাযোগ্য ভেক্টর তৈরি করুন',
    groupDots: 'ডট গ্রুপ করুন',
    putInNewLayer: 'নতুন লেয়ারে রাখুন',
    keepOriginalImage: 'আসল ছবি সংরক্ষণ',
    layerName: 'লেয়ারের নাম',
    createBackground: 'ব্যাকগ্রাউন্ড তৈরি করুন',
    backgroundColor: 'ব্যাকগ্রাউন্ডের রঙ',
    dotColor: 'ডটের রঙ',
    outputSection: 'আউটপুট ও প্রিন্ট মোড',
    scale: 'স্কেল',
    outputDpi: 'রেজোলিউশন (DPI)',
    printMode: 'প্রিন্ট মোড',
    minPhysicalDot: 'ন্যূনতম ফিজিক্যাল ডট (মিমি)',
    preview: 'লাইভ প্রিভিউ',
    process: 'ভেক্টর আর্টওয়ার্ক তৈরি করুন',
    reset: 'রিসেট',
    savePreset: 'প্রিসেট সংরক্ষণ',
    loadPreset: 'প্রিসেট লোড',
    batchMode: 'ব্যাচ প্রসেসিং কিউ',
    qualityReport: 'কোয়ালিটি কন্ট্রোল রিপোর্ট',
    exportExtendScript: 'ইলাস্ট্রেটর এক্সটেন্ডস্ক্রিপ্ট (.jsx) ডাউনলোড',
    exportSvg: 'ভেক্টর (.svg) ডাউনলোড',
    downloadExtension: 'অ্যাডোবি সিইপি এক্সটেনশন ডাউনলোড',
    cleanExistingHalftone: 'বর্তমান সিলেকশন ক্লিন করুন',
    aiAssistant: 'এআই অ্যাসিস্ট্যান্ট',
    autoOptimize: 'অটো অপ্টিমাইজ',
  },
};
