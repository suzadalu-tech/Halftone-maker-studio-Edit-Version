import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Split,
  Eye,
  SlidersHorizontal,
  CircleDot,
  CheckCircle2,
  AlertTriangle,
  Move,
  Layers,
} from 'lucide-react';
import { HalftoneDot, HalftoneSettings, QualityReportData } from '../core/types';

interface StagePreviewProps {
  originalCanvas: HTMLCanvasElement | null;
  halftoneDots: HalftoneDot[];
  settings: HalftoneSettings;
  qualityReport: QualityReportData | null;
  isProcessing: boolean;
  onExportExtendScript: () => void;
  onExportSvg: () => void;
}

export const StagePreview: React.FC<StagePreviewProps> = ({
  originalCanvas,
  halftoneDots,
  settings,
  qualityReport,
  isProcessing,
  onExportExtendScript,
  onExportSvg,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'halftone' | 'original'>('split');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage [0, 100]
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCenters, setShowCenters] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingSplitRef = useRef<boolean>(false);

  // Draw the Halftone Preview
  const renderCanvas = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !originalCanvas) return;

    const width = originalCanvas.width;
    const height = originalCanvas.height;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Background
    if (settings.createBackground) {
      ctx.fillStyle = settings.backgroundColor || '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    if (viewMode === 'original') {
      ctx.drawImage(originalCanvas, 0, 0);
      return;
    }

    // Render Halftone Vector Dots
    ctx.fillStyle = settings.dotColor || '#000000';
    for (let i = 0; i < halftoneDots.length; i++) {
      const dot = halftoneDots[i];
      if (dot.radius <= 0) continue;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inspection overlay
      if (showCenters) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(dot.x - 0.75, dot.y - 0.75, 1.5, 1.5);
        ctx.fillStyle = settings.dotColor || '#000000';
      }
    }

    // If Split Mode, clip and overlay original image on the left side
    if (viewMode === 'split') {
      const splitPx = (width * splitPos) / 100;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitPx, height);
      ctx.clip();
      ctx.drawImage(originalCanvas, 0, 0);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = '#1473e6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitPx, 0);
      ctx.lineTo(splitPx, height);
      ctx.stroke();
    }
  }, [originalCanvas, halftoneDots, settings, viewMode, splitPos, showCenters]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Split Wipe Dragging
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingSplitRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSplitRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSplitPos(pct);
    } else if (isDraggingPan) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingSplitRef.current = false;
    setIsDraggingPan(false);
  };

  // Zoom helpers
  const handleZoom = (delta: number) => {
    setZoom((z) => Math.max(0.1, Math.min(10, parseFloat((z + delta).toFixed(2)))));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom support
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((z) => Math.max(0.1, Math.min(10, parseFloat((z + zoomFactor).toFixed(2)))));
  };

  return (
    <main
      className="flex-1 flex flex-col bg-[#141414] overflow-hidden relative select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top View Toolbar */}
      <div className="h-10 bg-[#1e1e1e] border-b border-[#2b2b2b] px-4 flex items-center justify-between text-xs text-[#a0a0a0]">
        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-[#121212] p-0.5 rounded border border-[#303030]">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'split' ? 'bg-[#333333] text-white font-medium shadow-sm' : 'hover:text-white'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-[#1473e6]" />
            <span>Before | After</span>
          </button>
          <button
            onClick={() => setViewMode('halftone')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'halftone' ? 'bg-[#333333] text-white font-medium shadow-sm' : 'hover:text-white'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>Halftone Only</span>
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors ${
              viewMode === 'original' ? 'bg-[#333333] text-white font-medium shadow-sm' : 'hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#9e9e9e]" />
            <span>Original Source</span>
          </button>
        </div>

        {/* Status Indicators */}
        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          {isProcessing ? (
            <span className="text-[#38bdf8] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
              Calculating Halftone Grid...
            </span>
          ) : qualityReport ? (
            <div className="flex items-center gap-3 font-mono text-[10.5px]">
              <span className="text-[#4ade80] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {qualityReport.finalDots.toLocaleString()} Vector Circles
              </span>
              <span className="text-[#9e9e9e]">|</span>
              <span className="text-[#38bdf8]">Min Gap: {qualityReport.minObservedGap}px</span>
              <span className="text-[#9e9e9e]">|</span>
              <span className="text-[#a0a0a0]">{qualityReport.processingTimeMs} ms</span>
            </div>
          ) : (
            <span className="text-[#777777]">Ready for processing</span>
          )}
        </div>

        {/* Zoom & Inspection Controls */}
        <div className="flex items-center gap-2">
          {/* Centers overlay */}
          <button
            onClick={() => setShowCenters(!showCenters)}
            className={`px-2 py-1 rounded border text-[11px] flex items-center gap-1 ${
              showCenters
                ? 'bg-[#1473e6]/20 border-[#1473e6] text-[#38bdf8]'
                : 'bg-[#262626] border-[#383838] text-[#a0a0a0] hover:text-white'
            }`}
            title="Inspect Circle Centers & Math Bounds"
          >
            <CircleDot className="w-3 h-3" />
            <span className="hidden md:inline">Inspect Lattice</span>
          </button>

          {/* Zoom In/Out */}
          <div className="flex items-center bg-[#262626] rounded border border-[#383838]">
            <button
              onClick={() => handleZoom(-0.25)}
              className="p-1 hover:text-white border-r border-[#383838]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[10px] text-white">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.25)}
              className="p-1 hover:text-white border-l border-[#383838]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleResetZoom}
            className="p-1 bg-[#262626] hover:bg-[#333333] border border-[#383838] rounded text-[#a0a0a0] hover:text-white"
            title="Fit to Screen (100%)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="flex-1 flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing p-4"
        style={{
          backgroundImage:
            'radial-gradient(#262626 1px, transparent 1px), radial-gradient(#262626 1px, #141414 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
        onMouseDown={(e) => {
          if (e.button === 0 && !isDraggingSplitRef.current) {
            setIsDraggingPan(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
          }
        }}
      >
        {/* Floating Quick Zoom & Helper Controls on Canvas */}
        <div className="absolute bottom-5 right-5 z-30 flex items-center bg-[#1c1c1c]/90 backdrop-blur-md border border-[#3a3a3a] rounded-lg shadow-2xl p-1 gap-1">
          <button
            onClick={() => handleZoom(-0.25)}
            className="p-2 hover:bg-[#2e2e2e] text-[#b0b0b0] hover:text-white rounded transition-colors"
            title="Zoom Out (Ctrl - or Mouse Wheel Down)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-xs font-semibold text-[#38bdf8] min-w-[50px] text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.25)}
            className="p-2 hover:bg-[#2e2e2e] text-[#b0b0b0] hover:text-white rounded transition-colors"
            title="Zoom In (Ctrl + or Mouse Wheel Up)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-5 w-[1px] bg-[#3a3a3a] mx-0.5" />
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 text-xs hover:bg-[#2e2e2e] text-[#b0b0b0] hover:text-white rounded transition-colors flex items-center gap-1 font-medium"
            title="Reset Zoom to 100% Fit"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>100%</span>
          </button>
        </div>

        {/* Floating Pan Helper Notification */}
        <div className="absolute top-4 left-4 z-30 pointer-events-none opacity-60 hover:opacity-100 transition-opacity bg-black/60 backdrop-blur text-[11px] text-[#9e9e9e] px-2.5 py-1 rounded border border-white/10 font-mono">
          Scroll: Zoom In/Out | Drag: Pan
        </div>
        {/* Canvas Display with Zoom & Pan */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDraggingPan ? 'none' : 'transform 0.05s ease-out',
          }}
          className="shadow-2xl border border-[#383838] relative bg-white"
        >
          <canvas ref={previewCanvasRef} className="block" />

          {/* Interactive Split Divider Handle (in Split Mode) */}
          {viewMode === 'split' && originalCanvas && (
            <div
              style={{ left: `${splitPos}%` }}
              onMouseDown={handleSplitMouseDown}
              className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center cursor-ew-resize group z-10"
            >
              <div className="w-6 h-6 rounded-full bg-[#1473e6] shadow-lg border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Move className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Export & Action Ribbon */}
      <div className="h-12 bg-[#1b1b1b] border-t border-[#2d2d2d] px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs text-[#8e8e8e]">
          <span className="font-semibold text-white">Quality Guarantee:</span>
          <span className="hidden sm:inline">100% Mathematical Circles (Width = Height = 2R). Zero overlapping dots.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportExtendScript}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#383838] border border-[#444444] text-[#dcdcdc] rounded text-xs font-medium transition-colors"
            title="Export Adobe Illustrator JSX Script"
          >
            <Layers className="w-3.5 h-3.5 text-[#e3a62f]" />
            <span>Illustrator Script (.jsx)</span>
          </button>

          <button
            onClick={onExportSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#383838] border border-[#444444] text-[#dcdcdc] rounded text-xs font-medium transition-colors"
            title="Export Clean Scalable Vector Graphic"
          >
            <Split className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Export SVG</span>
          </button>
        </div>
      </div>
    </main>
  );
};
