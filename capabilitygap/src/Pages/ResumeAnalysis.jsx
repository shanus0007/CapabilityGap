import React, { useState, useEffect } from 'react';

// Polyfill Promise.withResolvers which is strictly required by pdfjs-dist v4+ but missing in slightly older browsers (eg. Chrome <119)
if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

// Explicitly define worker directly using absolute UNPKG protocol to avoid Vite ?url undefined resolution fallback that crashes dynamically with cdnjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

import { analyzeResumeAndGenerateRoadmap } from '../utils/resumeAnalyzer';
import Sidebar from '../Components/Sidebar';
import {
  UploadCloud, FileText, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, ChevronRight, Activity, Zap
} from 'lucide-react';

// Reusable Application UI Container
const AppShell = ({ children, session }) => (
  <div className="h-dvh w-full bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden">
    <Sidebar session={session} />
    <main className="flex-1 overflow-hidden relative bg-slate-50">
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors duration-500">
        {children}
      </div>
    </main>
  </div>
);

const wrapCls = "w-full mx-auto max-w-[1200px] flex flex-col gap-6";

export default function ResumeAnalysis({ session }) {
  const [status, setStatus] = useState('upload'); // upload, processing, results, error
  const [targetRole, setTargetRole] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorDiagnostic, setErrorDiagnostic] = useState('');

  const [analysisData, setAnalysisData] = useState(null); // { skills, gaps, roadmap }
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert("Please upload a valid PDF document.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + ' \n';
      }
      return fullText;
    } catch (e) {
      console.error("PDF extraction failed natively:", e);
      throw new Error(`PDF Parsing Error: ${e.message || 'Unknown corruption or encryption'}`);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole.trim() || !selectedFile) return;

    setStatus('processing');
    try {
      // 1. Parse Native Web PDF
      const resumeText = await extractTextFromPDF(selectedFile);
      if (!resumeText || resumeText.length < 50) {
         throw new Error("Resume appears empty or text is not extractable (e.g., it's a scanned image without OCR).");
      }

      // 2. Trigger Gemini Intelligence
      const userId = session?.user?.id;
      const result = await analyzeResumeAndGenerateRoadmap(userId, targetRole, resumeText);

      if (!result.success) {
        throw new Error(result.error);
      }

      setAnalysisData(result);
      setStatus('results');

    } catch (err) {
      setErrorDiagnostic(err.message || String(err));
      setStatus('error');
    }
  };

  // ─── UPLOAD VIEW ─────────────────────────────────────────────────────────────
  if (status === 'upload') {
    return (
      <AppShell session={session}>
        <div className={wrapCls + " items-center justify-center min-h-[80vh]"}>
          <div className="bg-white rounded-[32px] p-6 sm:p-10 w-full max-w-[700px] shadow-sm border border-slate-100 flex flex-col items-center">
            
            <div className="w-16 h-16 bg-[#0a0f1c] text-white rounded-full flex items-center justify-center shadow-lg mb-6">
              <FileText size={30} fill="white" className="opacity-90" />
            </div>

            <h1 className="text-3xl font-bold text-[#1e293b] mb-2 text-center tracking-tight leading-tight">
              Resume Gap Intelligence
            </h1>
            <p className="text-slate-500 text-[15px] mb-10 max-w-[500px] text-center font-medium">
              Upload your resume and enter your target role. Gemini AI will cross-reference your experiences against strict industry requirements to map your exact capability gaps.
            </p>

            <div className="w-full flex justify-center mb-6">
              <label className={`w-full max-w-[500px] h-[180px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                selectedFile ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
              }`}>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                {selectedFile ? (
                  <>
                    <CheckCircle2 size={36} className="text-indigo-500 mb-3" />
                    <p className="font-semibold text-slate-800 text-[15px]">{selectedFile.name}</p>
                    <p className="text-slate-400 text-[12px] mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={36} className="text-slate-400 mb-3" />
                    <p className="font-semibold text-slate-700 text-[15px]">Click to upload your resume</p>
                    <p className="text-slate-400 text-[12px] mt-1">PDF format only, max 5MB</p>
                  </>
                )}
              </label>
            </div>

            <div className="w-full max-w-[500px] relative mb-6">
              <label className="absolute top-1.5 left-4 text-[12px] font-semibold text-slate-400">Target Role</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer, Data Scientist..."
                className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-[3px] focus:ring-indigo-400/20 rounded-xl px-4 pt-[22px] pb-2 text-[15px] font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <button
              className="w-full max-w-[500px] flex items-center justify-center gap-2 text-white font-bold text-[16px] py-4 rounded-xl bg-linear-to-b from-[#9333ea] to-[#6b21a8] shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedFile || !targetRole.trim()}
              onClick={handleAnalyze}
            >
              <Sparkles size={18} fill="white" /> Analyze Capability Gaps
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── PROCESSING ──────────────────────────────────────────────────────────────
  if (status === 'processing') {
    return (
      <AppShell session={session}>
        <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-4 border-purple-100 border-t-purple-500 rounded-full animate-[spin_1.2s_linear_infinite_reverse]"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-500"><Activity size={24} className="animate-pulse" /></div>
            </div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              Correlating Resume Intelligence...
            </h2>
            <p className="text-slate-500 font-medium max-w-sm">
              Gemini is actively benchmarking your parsed skills against Native DB required constraints for the {targetRole} role.
            </p>
        </div>
      </AppShell>
    );
  }

  // ─── ERROR ───────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <AppShell session={session}>
        <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
          <AlertCircle size={56} className="text-rose-500 mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Analysis Failed</h1>
          <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-left text-sm font-mono mb-8 wrap-break-word">
            {errorDiagnostic}
          </div>
          <button
            onClick={() => setStatus('upload')}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </AppShell>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  const { skills, gaps, roadmap } = analysisData;
  const highGaps = gaps.filter(g => g.gap_level === 'High');
  const mediumGaps = gaps.filter(g => g.gap_level === 'Medium');
  const lowGaps = gaps.filter(g => g.gap_level === 'Low');

  // Helper colors
  const gapColors = {
    'High': 'bg-rose-50 text-rose-700 border-rose-200',
    'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
    'Low': 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const profColors = {
    'Beginner': 'bg-slate-100 text-slate-600',
    'Intermediate': 'bg-blue-50 text-blue-700',
    'Advanced': 'bg-indigo-50 text-indigo-700',
    'Expert': 'bg-purple-50 text-purple-700'
  };

  return (
    <AppShell session={session}>
      <div className={wrapCls}>
        
        <div className="w-full flex flex-col md:flex-row gap-6 md:items-end md:justify-between py-2 border-b border-slate-200 mb-2">
          <div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Analysis Complete</span>
            <h1 className="text-3xl font-bold text-slate-900">Intelligence Report</h1>
            <p className="text-slate-500 font-medium mt-1">Targeting: <span className="text-slate-800 font-semibold">{targetRole}</span></p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            Go to Dashboard <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full mb-8">
          
          {/* LEFT COL: Extracted Skills Summary */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={20} className="text-amber-500" />
                <h2 className="text-[17px] font-bold text-slate-800">Extracted Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((sk, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded-lg border text-[13px] font-semibold flex items-center gap-2 ${profColors[sk.proficiency] || 'bg-slate-100 text-slate-700'}`}>
                    <span>{sk.skill_name}</span>
                    <span className="opacity-60 text-[10px] uppercase font-bold px-1 bg-black/5 rounded-sm">{sk.proficiency}</span>
                  </div>
                )) : (
                  <p className="text-slate-400 text-sm">No recognizable skills parsed natively from this resume PDF mapping context.</p>
                )}
              </div>
            </div>

            {/* Gap Stats */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-indigo-100 font-bold uppercase text-xs tracking-widest mb-4">Risk Severity Overview</h3>
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl font-black">{highGaps.length}</span>
                <span className="text-indigo-200 font-semibold pb-1">Critical Gaps</span>
              </div>
              <p className="text-indigo-200/80 text-sm font-medium mt-2 leading-relaxed">
                Found {mediumGaps.length} medium and {lowGaps.length} lower priority capability mismatches natively mapped to your goals.
              </p>
            </div>
          </div>

          {/* RIGHT COL: Detailed Gaps */}
          <div className="lg:col-span-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
             <div className="flex items-center gap-2 mb-6">
                <AlertTriangle size={20} className="text-rose-500" />
                <h2 className="text-[17px] font-bold text-slate-800">Detailed Capability Gaps</h2>
              </div>

              {gaps.length === 0 ? (
                <div className="py-10 text-center text-emerald-600 font-bold flex flex-col items-center">
                  <CheckCircle2 size={48} className="mb-4" />
                  <p>Your resume satisfies all primary capabilities for this role perfectly!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {gaps.map((g, i) => (
                    <div key={i} className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${gapColors[g.gap_level] || gapColors['Medium']}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[15px]">{g.skill_name}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-widest bg-white/50">{g.gap_level} GAP</span>
                        </div>
                        <p className="text-[13px] font-medium opacity-80 mb-2">
                          Resume has <strong>{g.resume_proficiency}</strong>, but Role strictly requires <strong>{g.required_proficiency}</strong>.
                        </p>
                        <p className="text-[13px] leading-relaxed opacity-90">{g.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* BOTTOM ROW: Roadmap Generator */}
        {roadmap && roadmap.phases && (
          <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-6 lg:p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Personalized Learning Roadmap</h2>
            <p className="text-slate-500 font-medium mb-8 max-w-3xl">{roadmap.summary || "Complete the following phases to directly close the gaps identified by the system natively."}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {roadmap.phases.map((phase, idx) => (
                <div key={idx} className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all h-full flex flex-col">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-800 text-[15px] mb-4">{phase.title}</h3>
                  <div className="flex flex-col gap-2.5 mt-auto">
                    {(phase.tasks || []).map((t, tid) => (
                      <div key={tid} className="flex gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></div>
                         <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
