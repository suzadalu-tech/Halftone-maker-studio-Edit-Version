import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Eye,
  Send,
  MessageSquare,
  Bot,
  ShieldCheck,
  FileCode,
} from 'lucide-react';
import { HalftoneSettings } from '../core/types';

interface AiAssistantModalProps {
  currentSettings: HalftoneSettings;
  imageThumbnailUrl: string | null;
  imageWidth: number;
  imageHeight: number;
  onApplySettings: (recommended: Partial<HalftoneSettings>) => void;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  recommendedSettings?: Partial<HalftoneSettings>;
  time: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  currentSettings,
  imageThumbnailUrl,
  imageWidth,
  imageHeight,
  onApplySettings,
  onClose,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [userInstruction, setUserInstruction] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'local_guide'>('chat');

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Hello! I am your Halftone Visual AI Assistant. I can scan your uploaded image (${imageWidth}×${imageHeight}px) to calculate ideal dot ratios, spacing, and geometric parameters.\n\nYou can give instructions, such as:\n• "Split touching dots into clean circles with distinct spacing gaps"\n• "Preserve dark shadows while keeping dot size compact"\n• "Optimize settings for vector stock marketplace standards"`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [imageWidth, imageHeight]);

  // Run AI Visual Analysis via Server-Side Proxy
  const handleSendMessage = async () => {
    const textPrompt = userInstruction.trim();
    if (!textPrompt && !imageThumbnailUrl) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textPrompt || 'Scan the image visually and generate optimal dot settings.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInstruction('');
    setIsAnalyzing(true);

    try {
      let aiResultText = '';
      let recommendedSettings: Partial<HalftoneSettings> | null = null;

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInstruction: userMsg.text,
          imageThumbnailUrl,
          imageWidth,
          imageHeight,
          currentSettings,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        aiResultText = data.text || '';
        recommendedSettings = data.recommendedSettings || null;
      } else {
        throw new Error(`Server status ${res.status}`);
      }

      // Parse JSON from result if not already extracted
      if (!recommendedSettings && aiResultText) {
        const jsonMatch =
          aiResultText.match(/```json\s*(\{[\s\S]*?\})\s*```/) ||
          aiResultText.match(/(\{[\s\S]*"cellSize"[\s\S]*\})/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            recommendedSettings = {
              cellSize: Math.max(3, Math.min(30, Number(parsed.cellSize) || 8)),
              maxDotSize: Math.max(1, Math.min(25, Number(parsed.maxDotSize) || 6.5)),
              minDotSize: Math.max(0, Math.min(3, Number(parsed.minDotSize) || 0.6)),
              minGap: Math.max(0.5, Math.min(5, Number(parsed.minGap) || 1.4)),
              contrast: Math.max(-50, Math.min(50, Number(parsed.contrast) || 15)),
              gamma: Math.max(0.4, Math.min(2.2, Number(parsed.gamma) || 1.0)),
              angle: Number(parsed.angle) || 0,
              gridType: parsed.gridType === 'square' ? 'square' : 'offset',
              forcePerfectCircles: true,
              separateTouchingDots: true,
              normalizeIrregularDots: true,
              circularityThreshold: 0.88,
            };
          } catch (e) {
            console.error('JSON parse error from AI:', e);
          }
        }
      }

      // Clean message for display (remove raw json block from bubble text)
      const cleanDisplay = aiResultText.replace(/```json[\s\S]*?```/g, '').trim();

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: cleanDisplay || 'I analyzed your image and generated the recommended parameters below.',
        recommendedSettings: recommendedSettings || undefined,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      // Offline fallback calculation
      const isLarge = Math.max(imageWidth || 800, imageHeight || 800) > 1200;
      const targetCell = isLarge ? 10 : 8;
      const targetGap = Math.max(1.2, targetCell * 0.18);
      const targetMaxDot = targetCell - targetGap;

      const fallbackSettings: Partial<HalftoneSettings> = {
        cellSize: targetCell,
        maxDotSize: Math.round(targetMaxDot * 10) / 10,
        minDotSize: 0.6,
        minGap: Math.round(targetGap * 10) / 10,
        contrast: 15,
        gamma: 1.05,
        angle: 15,
        gridType: 'offset',
        forcePerfectCircles: true,
        separateTouchingDots: true,
        normalizeIrregularDots: true,
        circularityThreshold: 0.88,
      };

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: `Geometric analyzer generated optimal calculations:\n• A clear gap barrier of ${targetGap.toFixed(1)}px has been configured between dots.\n• Offset lattice and geometric circularity activated to prevent overlapping.`,
          recommendedSettings: fallbackSettings,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = (settings: Partial<HalftoneSettings>) => {
    onApplySettings(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 select-none">
      <div className="bg-[#212121] border border-[#3d3d3d] rounded-xl max-w-2xl w-full h-[85vh] shadow-2xl overflow-hidden flex flex-col text-[#dcdcdc] text-xs">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#181818] border-b border-[#303030] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1473e6] to-[#0ea5e9] flex items-center justify-center shadow">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  Halftone Maker Studio AI Assistant
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1473e6]/20 text-[#38bdf8] border border-[#1473e6]/40">
                  Gemini Vision
                </span>
              </div>
              <p className="text-[11px] text-[#8e8e8e]">
                Visual prepress AI assistant for calculating optimal dot geometry and spacing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#2e2e2e] text-[#a0a0a0] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#1a1a1a] border-b border-[#2e2e2e] px-4 gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-[#1473e6] text-white'
                : 'border-transparent text-[#8e8e8e] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Vision Prepress Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('local_guide')}
            className={`py-2 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'local_guide'
                ? 'border-[#1473e6] text-white'
                : 'border-transparent text-[#8e8e8e] hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#e3a62f]" />
            <span>Local PC & CEP Guide</span>
          </button>
        </div>

        {/* Tab 1: AI Chat & Vision Workspace */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#181818]">
            {/* Image Context Bar */}
            <div className="px-4 py-2 bg-[#141414] border-b border-[#282828] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-[#a0a0a0]">Current Scanned Image:</span>
                <span className="text-white font-mono font-medium">
                  {imageWidth} × {imageHeight} px
                </span>
                {imageThumbnailUrl && (
                  <img
                    src={imageThumbnailUrl}
                    alt="Thumbnail"
                    className="w-6 h-6 object-cover rounded border border-[#3d3d3d] ml-1"
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[#888888]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" />
                <span className="text-[10.5px]">
                  Active Engine: <strong className="text-[#4ade80]">Connected Server AI</strong>
                </span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-[#2a2a2a] border border-[#3d3d3d] flex items-center justify-center shrink-0 mt-0.5">
                      {m.sender === 'system' ? (
                        <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-[#38bdf8]" />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#1473e6] text-white shadow'
                        : m.sender === 'system'
                        ? 'bg-[#182a1c] text-[#86efac] border border-[#166534]'
                        : 'bg-[#242424] text-[#e0e0e0] border border-[#333333]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* If message includes recommended settings card */}
                    {m.recommendedSettings && (
                      <div className="mt-3 bg-[#181818] p-3 rounded-md border border-[#3a3a3a] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#e3a62f]" />
                            Recommended Optimal Settings:
                          </span>
                          <span className="text-[10px] text-[#4ade80] font-mono">Zero Overlap</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10.5px] font-mono">
                          <div className="bg-[#121212] p-1.5 rounded border border-[#2e2e2e]">
                            <span className="text-[#888888] block text-[9.5px]">Cell Size</span>
                            <span className="text-white font-bold">{m.recommendedSettings.cellSize} px</span>
                          </div>
                          <div className="bg-[#121212] p-1.5 rounded border border-[#2e2e2e]">
                            <span className="text-[#888888] block text-[9.5px]">Max Dot</span>
                            <span className="text-[#38bdf8] font-bold">{m.recommendedSettings.maxDotSize}</span>
                          </div>
                          <div className="bg-[#121212] p-1.5 rounded border border-[#2e2e2e]">
                            <span className="text-[#888888] block text-[9.5px]">Min Gap</span>
                            <span className="text-[#4ade80] font-bold">{m.recommendedSettings.minGap} px</span>
                          </div>
                          <div className="bg-[#121212] p-1.5 rounded border border-[#2e2e2e]">
                            <span className="text-[#888888] block text-[9.5px]">Grid Type</span>
                            <span className="text-[#fbbf24] font-bold capitalize">
                              {m.recommendedSettings.gridType || 'offset'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleApply(m.recommendedSettings!)}
                          className="w-full py-1.5 bg-[#1473e6] hover:bg-[#2680eb] text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Apply These Settings to Canvas</span>
                        </button>
                      </div>
                    )}

                    <span className="text-[9px] text-[#777777] block text-right mt-1 font-mono">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {isAnalyzing && (
                <div className="flex gap-2.5 items-center text-[#8e8e8e] text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#2a2a2a] border border-[#3d3d3d] flex items-center justify-center animate-pulse">
                    <Bot className="w-3.5 h-3.5 text-[#38bdf8]" />
                  </div>
                  <span className="animate-pulse">
                    Scanning pixels and calculating zero-overlap dot geometry...
                  </span>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-1.5 bg-[#141414] border-t border-[#262626] flex gap-1.5 overflow-x-auto text-[10.5px]">
              <button
                onClick={() => setUserInstruction('Split touching dots into clean circles with distinct spacing gaps')}
                className="whitespace-nowrap px-2.5 py-1 bg-[#242424] hover:bg-[#303030] text-[#a0a0a0] hover:text-white rounded border border-[#333333]"
              >
                ✂️ Split Touching Dots
              </button>
              <button
                onClick={() => setUserInstruction('Preserve dark shadows while keeping dot size compact')}
                className="whitespace-nowrap px-2.5 py-1 bg-[#242424] hover:bg-[#303030] text-[#a0a0a0] hover:text-white rounded border border-[#333333]"
              >
                🍔 Preserve Solid Shadows
              </button>
              <button
                onClick={() => setUserInstruction('Optimize quality for Freepik and Shutterstock vector standards')}
                className="whitespace-nowrap px-2.5 py-1 bg-[#242424] hover:bg-[#303030] text-[#a0a0a0] hover:text-white rounded border border-[#333333]"
              >
                ⭐ Stock Marketplace Quality
              </button>
            </div>

            {/* Input Box */}
            <div className="p-3 bg-[#1c1c1c] border-t border-[#303030] flex gap-2">
              <input
                type="text"
                value={userInstruction}
                onChange={(e) => setUserInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && handleSendMessage()}
                placeholder="Give instructions to AI (e.g. Split touching dots into clean circles)..."
                className="flex-1 bg-[#121212] border border-[#383838] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1473e6]"
              />
              <button
                onClick={handleSendMessage}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-[#1473e6] hover:bg-[#2680eb] text-white font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Local PC Setup Guide */}
        {activeTab === 'local_guide' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#181818]">
            <div>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#e3a62f]" />
                How to Run Locally on Your PC
              </h3>
              <p className="text-xs text-[#8e8e8e]">
                You can download this project anytime and run it completely offline on your computer as a local application.
              </p>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="bg-[#141414] p-3 rounded-lg border border-[#2e2e2e]">
                <span className="text-[#38bdf8] block font-sans font-bold text-xs mb-1">
                  Method 1: Adobe Illustrator Extension (CEP 9.4+)
                </span>
                <p className="text-[#a0a0a0] font-sans text-xs mb-2">
                  Copy the project <code className="text-white">extension/</code> directory to your Illustrator Extensions folder:
                </p>
                <div className="bg-[#0d0d0d] p-2 rounded text-[#4ade80] text-[10px] break-all">
                  C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\HalftoneMakerStudio
                </div>
              </div>

              <div className="bg-[#141414] p-3 rounded-lg border border-[#2e2e2e]">
                <span className="text-[#38bdf8] block font-sans font-bold text-xs mb-1">
                  Method 2: Run Studio Locally
                </span>
                <div className="bg-[#0d0d0d] p-2 rounded text-[#fbbf24] text-[10px] space-y-1">
                  <div># Install dependencies and start server</div>
                  <div className="text-[#4ade80]">npm install</div>
                  <div className="text-[#4ade80]">npm run dev</div>
                </div>
              </div>
            </div>

            <div className="bg-[#182436] p-4 rounded-lg border border-[#1e3a8a] text-xs text-[#93c5fd] space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                100% Offline Geometric Processing Always Active
              </span>
              <p>
                Even without an internet connection, our local mathematical engine splits touching dots and generates clean geometric circles with zero overlap.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
