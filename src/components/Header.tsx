import React from 'react';
import {
  Layers,
  Sparkles,
  Download,
  HelpCircle,
  FolderArchive,
  RefreshCw,
  Globe,
  Sliders,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { EngineMode } from '../core/types';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  engineMode: EngineMode;
  onEngineChange: (mode: EngineMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBatch: () => void;
  onOpenAi: () => void;
  onOpenInstallGuide: () => void;
  onOpenQualityReport: () => void;
  onDownloadExtension: () => void;
  onDownloadJsxScript: () => void;
  onReset: () => void;
  isDownloadingZip: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  engineMode,
  onEngineChange,
  language,
  onLanguageChange,
  onOpenBatch,
  onOpenAi,
  onOpenInstallGuide,
  onOpenQualityReport,
  onDownloadExtension,
  onDownloadJsxScript,
  onReset,
  isDownloadingZip,
}) => {
  const t = translations[language];

  return (
    <header className="bg-[#1c1c1c] border-b border-[#333333] px-4 py-2.5 flex items-center justify-between select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#1473e6] to-[#0d5bb8] flex items-center justify-center shadow-inner">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-white tracking-wide">{t.appTitle}</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2b2b2b] text-[#1473e6] font-semibold border border-[#3d3d3d]">
              CEP 9+ / ILST
            </span>
          </div>
          <p className="text-[11px] text-[#8e8e8e] leading-tight">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Engine Switcher */}
      <div className="hidden md:flex items-center bg-[#121212] p-1 rounded-md border border-[#333333]">
        <button
          onClick={() => onEngineChange('precision')}
          className={`px-3 py-1 text-xs rounded transition-all font-medium flex items-center gap-1.5 ${
            engineMode === 'precision'
              ? 'bg-[#1473e6] text-white shadow'
              : 'text-[#9e9e9e] hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.enginePrecision}
        </button>
        <button
          onClick={() => onEngineChange('native')}
          className={`px-3 py-1 text-xs rounded transition-all font-medium ${
            engineMode === 'native'
              ? 'bg-[#383838] text-white shadow'
              : 'text-[#9e9e9e] hover:text-white'
          }`}
        >
          {t.engineNative}
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Batch Queue */}
        <button
          onClick={onOpenBatch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#292929] hover:bg-[#363636] text-[#dcdcdc] rounded text-xs border border-[#3e3e3e] transition-colors"
          title="Batch Processing"
        >
          <FolderArchive className="w-3.5 h-3.5 text-[#e3a62f]" />
          <span className="hidden sm:inline">Batch Mode</span>
        </button>

        {/* AI Assistant */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#292929] hover:bg-[#363636] text-[#dcdcdc] rounded text-xs border border-[#3e3e3e] transition-colors"
          title="AI Parameter Optimizer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="hidden sm:inline">AI Auto</span>
        </button>

        {/* Quality Check */}
        <button
          onClick={onOpenQualityReport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#292929] hover:bg-[#363636] text-[#dcdcdc] rounded text-xs border border-[#3e3e3e] transition-colors"
          title="Quality Control Report"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
          <span className="hidden sm:inline">QC Check</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-1.5 bg-[#292929] hover:bg-[#363636] text-[#a0a0a0] hover:text-white rounded border border-[#3e3e3e]"
          title="Reset Defaults"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Language */}
        <button
          onClick={() => onLanguageChange(language === 'en' ? 'bn' : 'en')}
          className="flex items-center gap-1 px-2 py-1.5 bg-[#292929] hover:bg-[#363636] text-[#dcdcdc] rounded text-xs border border-[#3e3e3e]"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px]">{language.toUpperCase()}</span>
        </button>

        {/* Setup Guide */}
        <button
          onClick={onOpenInstallGuide}
          className="p-1.5 bg-[#292929] hover:bg-[#363636] text-[#a0a0a0] hover:text-white rounded border border-[#3e3e3e]"
          title="Illustrator Extension Setup Guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Download Standalone .JSX Script (Primary Action) */}
        <button
          onClick={onDownloadJsxScript}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e3a62f] hover:bg-[#d9961f] text-black font-bold rounded text-xs shadow-md transition-all animate-pulse hover:animate-none"
          title="Download standalone Adobe Illustrator JSX Script file to run via File > Scripts > Other Script..."
        >
          <FileCode className="w-3.5 h-3.5 fill-black" />
          <span>{language === 'bn' ? 'ইলাস্ট্রেটর .JSX স্ক্রিপ্ট ডাউনলোড' : 'Download .JSX Script'}</span>
        </button>
      </div>
    </header>
  );
};
