import React, { useState, useEffect, useRef } from 'react';
import { X, Scan, CheckCircle, AlertCircle, Briefcase, ChevronRight, Cpu, Loader2 } from 'lucide-react';
import { analyzeJobMatch } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobMatchModal: React.FC<JobMatchModalProps> = ({ isOpen, onClose }) => {
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setJdText('');
      setResult('');
      setScore(0);
      setShowResult(false);
      setIsAnalyzing(false);
    }
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    
    setIsAnalyzing(true);
    setShowResult(true);
    setResult('');
    setScore(0);

    try {
      const streamResult = await analyzeJobMatch(jdText);
      
      let fullText = '';
      let scoreFound = false;

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;

        // Parse Score on the fly
        if (!scoreFound) {
            const scoreMatch = fullText.match(/SCORE:\s*(\d+)/);
            if (scoreMatch) {
                const s = parseInt(scoreMatch[1]);
                animateScore(s);
                scoreFound = true;
                // Remove the metadata line from display text
                // We don't remove it from fullText to keep parsing logic simple, 
                // but we filter it in the render or formatted string if needed.
            }
        }
        
        // Clean up the display text (remove the raw SCORE line)
        const displayText = fullText.replace(/SCORE:\s*\d+\n?/, '');
        setResult(displayText);
      }
    } catch (error) {
      setResult("Error: Neural link failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const animateScore = (target: number) => {
    let current = 0;
    const interval = setInterval(() => {
        current += 1;
        setScore(current);
        if (current >= target) clearInterval(interval);
    }, 20);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container - Sci-fi HUD Style */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0a0a0a] border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] flex flex-col md:flex-row">
        
        {/* Decorative HUD Lines */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/10 rounded-tl-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/10 rounded-br-3xl pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* LEFT PANEL: Input */}
        <div className={`flex-1 flex flex-col p-8 border-b md:border-b-0 md:border-r border-white/10 transition-all duration-500 ${showResult && window.innerWidth >= 768 ? 'w-1/3 max-w-sm' : 'w-full'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Scan className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-mono tracking-tight">JOB MATCH AGENT</h2>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Analysis Protocol V3.0</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <label className="text-sm text-gray-400 mb-2 font-mono">粘贴职位描述 (JD)</label>
                <textarea 
                    className="flex-1 bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:border-white/30 focus:outline-none resize-none font-mono leading-relaxed mb-4"
                    placeholder="在此处粘贴 JD 内容..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    disabled={isAnalyzing}
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={!jdText.trim() || isAnalyzing}
                    className="group relative w-full py-4 bg-white text-black font-bold text-lg rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <Cpu />}
                        {isAnalyzing ? '正在分析...' : '开始深度匹配'}
                    </span>
                    <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </button>
            </div>
        </div>

        {/* RIGHT PANEL: Results */}
        {showResult && (
            <div className="flex-[2] bg-[#050505] relative overflow-hidden flex flex-col">
                {/* Scanning Line Animation */}
                {isAnalyzing && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan z-10 pointer-events-none" />
                )}

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Score Display */}
                    <div className="flex items-center gap-8 mb-12">
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="#333" strokeWidth="8" fill="transparent" />
                                <circle 
                                    cx="64" cy="64" r="60" 
                                    stroke="white" strokeWidth="8" 
                                    fill="transparent" 
                                    strokeDasharray={377}
                                    strokeDashoffset={377 - (377 * score) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-white font-mono">{score}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Match</span>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                AI 招聘建议
                            </h3>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${score > 80 ? 'bg-green-500' : score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                    style={{ width: `${score}%` }} 
                                />
                            </div>
                            <p className="text-gray-400 text-sm mt-3 font-mono">
                                {score > 85 ? ">> 极高匹配度。建议立即安排面试。" : score > 60 ? ">> 具备核心能力，部分技能需确认。" : ">> 匹配度较低，但具备转型潜力。"}
                            </p>
                        </div>
                    </div>

                    {/* Markdown Content */}
                    <div className="prose prose-invert max-w-none prose-headings:font-mono prose-headings:text-white prose-p:text-gray-400 prose-li:text-gray-300">
                        {/* We render the raw text, formatting it slightly with regex for bolding if needed, or just rely on whitespace */}
                         <div className="whitespace-pre-wrap font-sans text-base leading-7">
                            {result.split('###').map((section, i) => {
                                if (!section.trim()) return null;
                                const [title, ...content] = section.split('\n');
                                return (
                                    <div key={i} className="mb-8 animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                                        <h4 className="text-lg font-bold text-white mb-3 border-l-2 border-white pl-3 uppercase tracking-wide">
                                            {title}
                                        </h4>
                                        <div className="text-gray-300 pl-4">
                                            {content.join('\n')}
                                        </div>
                                    </div>
                                )
                            })}
                         </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* Empty State Placeholder for Right Panel */}
        {!showResult && (
             <div className="hidden md:flex flex-[2] items-center justify-center bg-[#050505] relative overflow-hidden">
                 <div className="text-center opacity-20">
                     <Scan className="w-24 h-24 mx-auto mb-4 text-white animate-pulse" />
                     <p className="text-white font-mono tracking-widest">WAITING FOR INPUT_</p>
                 </div>
             </div>
        )}

      </div>
      
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default JobMatchModal;