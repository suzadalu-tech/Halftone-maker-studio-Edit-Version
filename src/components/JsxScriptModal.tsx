import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Play, CheckCircle2, Sparkles, Layers } from 'lucide-react';

interface JsxScriptModalProps {
  scriptCode: string;
  onClose: () => void;
  onDownloadScript: () => void;
}

export const JsxScriptModal: React.FC<JsxScriptModalProps> = ({
  scriptCode,
  onClose,
  onDownloadScript,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-[#242424] border border-[#444444] rounded-lg max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col text-[#dcdcdc] text-xs h-[88vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#1b1b1b] border-b border-[#333333] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#e3a62f]/20 border border-[#e3a62f]/40 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-[#e3a62f]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                ADOBE ILLUSTRATOR JSX SCRIPT — HALFTONE MAKER STUDIO CLEANER
              </h2>
              <span className="text-[11px] text-[#4ade80]">
                Vector script to perfect dot circles and split merged shapes with clean spacing gaps
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#333333] text-[#a0a0a0] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-[#1e1e1e] border-b border-[#303030] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadScript}
              className="flex items-center gap-2 px-4 py-2 bg-[#e3a62f] hover:bg-[#d9961f] text-black font-bold rounded text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4 fill-black" />
              <span>Download Halftone_Maker_Studio_Cleaner.jsx</span>
            </button>

            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#2d2d2d] hover:bg-[#383838] border border-[#444444] rounded text-white font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5 text-[#1473e6]" />}
              <span>{copied ? 'Code Copied!' : 'Copy Script Code'}</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#888888]">
            File: <strong>Halftone_Maker_Cleaner.jsx</strong>
          </div>
        </div>

        {/* Visual 3-Step Guide */}
        <div className="bg-[#18231c] border-b border-[#244b2f] p-4 text-[#cde8d5] space-y-2">
          <div className="font-bold text-white text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
            How to use directly in Adobe Illustrator:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
            <div className="bg-[#121c15] p-2.5 rounded border border-[#23422d] space-y-1">
              <span className="font-bold text-[#4ade80] block text-xs">1. Select Dots</span>
              <p className="text-[#a5c9b0]">
                Select your traced halftone artwork in Adobe Illustrator using the Selection Tool (V).
              </p>
            </div>

            <div className="bg-[#121c15] p-2.5 rounded border border-[#23422d] space-y-1">
              <span className="font-bold text-[#4ade80] block text-xs">2. Run Script</span>
              <p className="text-[#a5c9b0]">
                Go to <strong>File &gt; Scripts &gt; Other Script...</strong> (Ctrl+F12) and select this <strong>.jsx</strong> file.
              </p>
            </div>

            <div className="bg-[#121c15] p-2.5 rounded border border-[#23422d] space-y-1">
              <span className="font-bold text-[#4ade80] block text-xs">3. Perfect Circles &amp; Separation</span>
              <p className="text-[#a5c9b0]">
                Preserves exact dot diameters while ensuring pristine geometric circles with clean spacing gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Script Code Preview */}
        <div className="flex-1 bg-[#121212] p-4 overflow-y-auto font-mono text-[11px] text-[#e0e0e0] leading-relaxed">
          <pre className="whitespace-pre-wrap select-text">
            {scriptCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#1b1b1b] border-t border-[#333333] flex justify-between items-center">
          <span className="text-[11px] text-[#8e8e8e]">
            ✓ 100% Pure JSX Script — runs natively with zero external plugins or dependencies.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#333333] hover:bg-[#3d3d3d] text-white rounded font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
