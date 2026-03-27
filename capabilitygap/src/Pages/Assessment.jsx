import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { calculateCapabilityScores } from '../utils/scoreCalculator';
import { analyzeSkillGaps } from '../utils/gapAnalyzer';
import { generateRoleAssessment } from '../utils/aiQuestionGenerator';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, Sparkles, BrainCircuit, Trees } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

// Modern Clean EdTech UI Classes
const wrapCls = "w-full flex flex-col items-center justify-center my-auto max-w-[1000px] mx-auto py-4 md:py-6 transition-all duration-300";
const cardLightCls = "bg-white rounded-4xl p-6 sm:p-10 w-full max-w-[800px] shadow-xl shadow-slate-200/50 border border-slate-100 relative";

// Stable Application UI Container extracted outside assessment render queue!
const AppShell = ({ children, session }) => (
  <div className="h-[100dvh] w-full bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden">
    <Sidebar session={session} />
    <main className="flex-1 overflow-hidden relative bg-slate-50">
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start transition-colors duration-500">
        {children}
      </div>
    </main>
  </div>
);

const btnPrimary = "bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-8 rounded-2xl text-base font-semibold transition-all duration-300 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
const btnSecondary = "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 py-3.5 px-8 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

const Assessment = ({ session }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track inputs and dynamic state flow matching targeted role initialization!
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState([]);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('role_select'); // role_select, generating_ai, ready, missing_data, active, submitting, finished
  const [results, setResults] = useState([]);
  const [fetchDiagnostic, setFetchDiagnostic] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  // Primary Initiation Sequence logic triggering Gemini conditionally on unknown roles!
  const handleBeginTargeting = async () => {
    if (!targetRoleInput.trim()) return;
    const roleName = targetRoleInput.trim();
    setSelectedRole(roleName);
    setStatus('generating_ai');

    try {
      // 1. Check if we already hold database thresholds natively preventing duplicate generation
      const { data: roleCheck } = await supabase.from('role_requirements')
        .select('skill_id')
        .ilike('role_name', roleName);

      // 2. If empty, the user typed an arbitrary specific role. Hit Gemini API!
      if (!roleCheck || roleCheck.length === 0) {
        const genResult = await generateRoleAssessment(roleName);
        if (!genResult.success) {
          setFetchDiagnostic(`Gemini AI Engine Failed: ${genResult.error}`);
          setStatus('missing_data');
          return;
        }
      }

      // 3. Securely fetch ONLY the questions strictly mapped to this Role's underlying required skills!
      const { data: activeRequirements } = await supabase.from('role_requirements')
        .select('skill_id')
        .ilike('role_name', roleName);

      if (activeRequirements && activeRequirements.length > 0) {
        const mappedSkillIds = activeRequirements.map(r => r.skill_id);
        const { data: rawQData, error } = await supabase.from('questions')
          .select('*')
          .in('skill_id', mappedSkillIds);

        if (error) throw error;

        const { data: allSkills } = await supabase.from('skills').select('id, skill_name');
        const qData = rawQData || [];

        if (allSkills?.length > 0) {
          qData.forEach(q => {
            const match = allSkills.find(s => s.id === q.skill_id);
            if (match) q.skills = { skill_name: match.skill_name };
          });
        }
        if (!qData || qData.length === 0) {
          setFetchDiagnostic('SQL Fetch succeeded but returned 0 mapped skill questions natively.');
          setStatus('missing_data');
          return;
        }

        const mappedQuestions = qData.map(q => {
          let displayContent = q.question || "System evaluation string invalid.";
          let displayCorrect = q.correct_option || "System Error Option";
          let displayOptions = [displayCorrect, 'Option B', 'Option C', 'Option D'];
          let displayDifficulty = 'Basic';

          if (typeof q.question === 'string' && q.question.startsWith('{')) {
            try {
              const parsed = JSON.parse(q.question);
              displayContent = parsed.text || displayContent;
              displayOptions = parsed.options || displayOptions;
              displayDifficulty = parsed.difficulty || displayDifficulty;

              // Shuffle the real options intelligently so it isn't always A
              if (!displayOptions.includes(displayCorrect)) displayOptions[0] = displayCorrect;
              displayOptions.sort(() => Math.random() - 0.5);
            } catch (e) { console.error(e) }
          } else {
            displayOptions.sort(() => Math.random() - 0.5);
          }

          return {
            ...q,
            displayContent,
            options: displayOptions,
            difficulty: displayDifficulty,
            correct_answer: displayCorrect,
            skills: q.skills || { skill_name: 'Core Capability' }
          };
        });

        setQuestions(mappedQuestions);
        setAnswers(mappedQuestions.map(() => ({ option: null, confidence: null })));
        setTimePerQuestion(mappedQuestions.map(() => 0));

        setStatus('ready');
      } else {
        setFetchDiagnostic('Gemini succeeded, but requirements mapping failed natively in-database.');
        setStatus('missing_data');
      }
    } catch (err) {
      console.error(err);
      setFetchDiagnostic(err.message || JSON.stringify(err));
      setStatus('missing_data');
    }
  };

  // Timer logic for active state
  useEffect(() => {
    let timer;
    if (status === 'active') {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setTimePerQuestion(prev => {
          const newTimes = [...prev];
          newTimes[currentIndex] += 1;
          return newTimes;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, currentIndex]);

  const startAssessment = () => {
    setStatus('active');
    setElapsedTime(0);
  };

  const updateCurrentAnswer = (option, confidence) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      option: option !== undefined ? option : newAnswers[currentIndex].option,
      confidence: confidence !== undefined ? confidence : newAnswers[currentIndex].confidence
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setStatus('submitting');

    // Process final attempt payloads across all tracked navigation instances
    const attemptRecords = questions.map((q, idx) => ({
      user_id: session?.user?.id || '00000000-0000-0000-0000-000000000000',
      question_id: q.id,
      selected_option: answers[idx].option,
      correct: answers[idx].option === q.correct_answer,
      time_taken: timePerQuestion[idx] || 1,
      confidence_rating: answers[idx].confidence || 3
    }));

    setResults(attemptRecords);

    try {
      if (session?.user?.id) {
        await supabase.from('attempts').insert(attemptRecords);
        // Generates the baseline capability math natively
        await calculateCapabilityScores(session.user.id);

        setIsAnalyzing(true);
        // Natively runs the selectedRole the user plugged in at the very start!
        await analyzeSkillGaps(session.user.id, selectedRole);
        setIsAnalyzing(false);
      }
      setStatus('finished');
    } catch (e) {
      console.error("Failed to safely commit final assessment logs", e);
      setStatus('finished'); // Fails gracefully toward dashboard
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------- STATE ROUTING SCREENS ----------- 

  if (status === 'role_select') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center">

            <div className="w-[60px] h-[60px] bg-[#0a0f1c] text-white rounded-full flex items-center justify-center shadow-lg shadow-black/10 mb-5 mx-auto">
              <Trees size={30} fill="white" />
            </div>

            <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1e293b] mb-2 text-center tracking-tight">Generate Your AI Skill Assessment</h1>

            <p className="text-slate-500 text-[15.5px] mb-8 max-w-[800px] text-center leading-relaxed font-medium px-4">
              Enter your target role, and our AI will generate a personalized skill assessment, capability benchmarks, and a tailored evaluation designed specifically for your career goal.
            </p>

            <div className="w-full max-w-[640px] flex flex-col items-center">

              <div className="w-full relative mb-4">
                <label className="absolute top-1.5 left-4 text-[13px] font-semibold text-slate-400">Target Role</label>
                <input
                  type="text"
                  placeholder="Enter target role (e.g. Software Engineer, Frontend Developer, UI/UX Designer)"
                  className="w-full bg-white border border-slate-200 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-400/20 rounded-[14px] px-4 pt-[24px] pb-2 text-[15.5px] font-semibold text-slate-800 outline-none transition-all shadow-sm placeholder:text-slate-400 placeholder:font-medium"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleBeginTargeting() }}
                />
              </div>

              <div className="w-full p-2 rounded-full bg-linear-to-b from-[#e9d5ff]/50 to-[#d8b4fe]/30 shadow-[0_8px_32px_-8px_rgba(126,34,206,0.25)] backdrop-blur-md mt-2 group relative">
                <button
                  className="relative w-full flex items-center justify-center gap-2.5 text-white font-bold text-[18px] py-3.5 rounded-full bg-linear-to-b from-[#9333ea] via-[#7e22ce] to-[#581c87] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_16px_rgba(88,28,135,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#a855f7] hover:to-[#6b21a8] active:scale-[0.98]"
                  onClick={handleBeginTargeting}
                  disabled={!targetRoleInput.trim()}
                >
                  <span className="tracking-wide text-[19px] pt-px drop-shadow-sm">Generate My Assessment</span>
                  <Sparkles size={18} className="text-white drop-shadow-md" fill="white" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-2.5 mt-6">
                <span className="bg-[#f8fafc] text-[#64748b] px-4 py-1.5 rounded-full text-[13px] font-semibold border border-slate-200 flex items-center gap-1.5 shadow-sm">
                  <span className="text-slate-400 text-[10px]">▼</span> AI Powered
                </span>
                <span className="bg-[#f8fafc] text-[#64748b] px-4 py-1.5 rounded-full text-[13px] font-semibold border border-slate-200 shadow-sm">
                  Role-Based
                </span>
                <span className="bg-[#f8fafc] text-[#64748b] px-4 py-1.5 rounded-full text-[13px] font-semibold border border-slate-200 shadow-sm">
                  Personalized
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-[36px] w-full">
              {/* Card 1 */}
              <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="text-[#a855f7]" size={22} fill="#e9d5ff" />
                  <h3 className="text-[15px] font-bold text-[#1e293b]">AI-Generated Questions</h3>
                </div>
                <p className="text-[14px] text-slate-500 leading-relaxed font-medium">Questions are generated based on your target role and required skills.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-[3px] items-end h-[20px]">
                    <div className="w-[5px] h-[10px] bg-emerald-500 rounded-sm"></div>
                    <div className="w-[5px] h-[18px] bg-indigo-500 rounded-sm"></div>
                    <div className="w-[5px] h-[14px] bg-purple-500 rounded-sm"></div>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#1e293b]">Capability Analysis</h3>
                </div>
                <p className="text-[14px] text-slate-500 leading-relaxed font-medium">We evaluate your knowledge, speed, and confidence.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-slate-100 rounded-[20px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                <div className="flex items-center gap-[10px] mb-3 relative">
                  <div className="relative shrink-0">
                    <div className="w-[20px] h-[24px] border-[2px] border-[#3b82f6] rounded-[4px] relative bg-blue-50">
                      <div className="absolute top-[4px] left-[3px] right-[3px] h-[2px] bg-blue-300 rounded-sm"></div>
                      <div className="absolute top-[9px] left-[3px] right-[5px] h-[2px] bg-blue-300 rounded-sm"></div>
                    </div>
                    <div className="absolute -bottom-1 -right-[6px] w-[14px] h-[14px] bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white text-[9px] leading-none font-black block pt-[0.5px]">✓</span>
                    </div>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#1e293b] leading-tight">Personalized <br />Roadmap</h3>
                </div>
                <p className="text-[14px] text-slate-500 leading-relaxed font-medium">Get a structured improvement plan based on your results.</p>
              </div>
            </div>

          </div>
        </div>
      </AppShell>
    );
  }

  if (status === 'generating_ai' || status === 'submitting' || status === 'loading') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-purple-100 border-t-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>
            <div className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              {status === 'generating_ai' ? `Synthesizing Intelligence Models for ${selectedRole}...` :
                status === 'submitting' ? 'Scoring your assessment...' : 'Loading Assessment...'}
            </div>
            {status === 'generating_ai' && <p className="text-slate-400 font-medium">Dynamically constructing skill thresholds via Google Gemini API...</p>}
          </div>
        </div>
      </AppShell>
    );
  }

  if (status === 'missing_data') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className={`${cardLightCls} text-center flex flex-col items-center`}>
            <AlertCircle size={48} className="text-amber-400 mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Intelligence Blocked</h1>
            <p className="text-rose-500 font-mono text-sm mb-4 p-4 bg-rose-50 rounded-lg border border-rose-100 w-full text-left">Error Log: {fetchDiagnostic}</p>
            <p className="text-slate-500 mb-8 max-w-lg">The AI generated the schema natively, but your database is actively blocking Read/Write execution. If you have Row Level Security (RLS) enabled on your custom tables, please disable it.</p>
            <button className={btnPrimary} onClick={() => setStatus('role_select')}><ChevronLeft size={18} /> Retry Generation Target</button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (status === 'ready') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className={`${cardLightCls} text-center flex flex-col items-center`}>
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} />
            </div>
            <div className="inline-block bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-purple-100">
              {selectedRole} Benchmark Compiled
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Intelligence Ready</h1>
            <p className="text-slate-500 text-lg mb-8 max-w-lg">
              Gemini successfully generated the native constraint metrics mapping your requested role! Your assessment sequence begins now.
            </p>
            <button className={btnPrimary} onClick={startAssessment}>
              Initialize Assessment <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (status === 'finished') {
    const score = results.filter(r => r.correct).length;
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className={`${cardLightCls} text-center max-w-3xl`}>
            <div className="inline-block bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
              Evaluation Complete
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Metrics Finalized</h1>

            <div className="text-[6rem] font-black text-slate-800 my-6 tracking-tighter">
              {Math.round((score / questions.length) * 100)}<span className="text-4xl text-slate-400 relative -top-8">%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Accuracy Rate</div>
                <div className="text-2xl font-bold text-slate-800">{score} / {questions.length}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Module Time</div>
                <div className="text-2xl font-bold text-slate-800">{formatTime(elapsedTime)}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Psychological Confidence</div>
                <div className="text-2xl font-bold text-slate-800">
                  {(results.reduce((acc, r) => acc + r.confidence_rating, 0) / questions.length).toFixed(1)} <span className="text-sm text-slate-400">/ 5</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 mb-6 flex flex-col items-center shadow-lg shadow-indigo-100/50">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Analysis Complete!</h3>
              <p className="text-sm text-indigo-600/80 mb-6 max-w-md">Your {selectedRole} capability scores and bespoke AI Roadmap have securely finished mapping against your targeted requirements natively.</p>
              <button className={`${btnPrimary} w-full sm:w-auto bg-linear-to-r from-indigo-500 to-purple-600 hover:to-purple-700 shadow-indigo-500/30 font-bold`} onClick={() => navigate('/dashboard')}>
                View Personalized Dashboard <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Active Assessment State Variables
  const currentQ = questions[currentIndex];
  const currentAns = answers[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <AppShell>
      <div className={wrapCls}>
        {/* HEADER AREA */}
        <div className="w-full text-left mb-2 px-2 mt-4 md:mt-0">
          <h1 className="text-[28px] font-bold text-slate-700 mb-3 tracking-snug">Skill Assessment</h1>
          <p className="text-slate-500 text-[15px]">Answer the questions carefully. Your speed, accuracy, and confidence will be used to analyze your capability.</p>

          <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-y border-slate-200/70 my-8 text-[15px]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-1.5 bg-[#185adb] rounded-full shrink-0"></div>
              <span className="text-slate-600 font-medium whitespace-nowrap">Question {currentIndex + 1} of {questions.length}</span>
              <div className="w-24 h-1 bg-blue-100 rounded-full ml-1 overflow-hidden hidden sm:block mt-0.5">
                <div className="h-full bg-[#185adb] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-800 font-bold mt-4 md:mt-0">
              <Clock size={20} className="text-slate-500" strokeWidth={2} />
              <span className="text-slate-500 font-medium mr-1">Time:</span> {formatTime(elapsedTime)}
            </div>

            <div className="text-slate-600 font-medium mt-4 md:mt-0">
              Role: <span className="font-bold text-slate-800">{selectedRole}</span>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[16px] w-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-200/80 flex flex-col mb-10">

          <div className="p-8 sm:p-12">
            {/* Question Text */}
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1e293b] mb-10 leading-snug">
              {currentQ.displayContent}
            </h2>

            {/* Multiple Choice Options */}
            <div className="flex flex-col gap-2 mb-12">
              {currentQ.options.map((opt, idx) => {
                const isSelected = currentAns?.option === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => updateCurrentAnswer(opt, currentAns?.confidence || 3)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4 ${isSelected
                        ? 'border border-slate-200 bg-[#f8fafc] shadow-xs'
                        : 'border border-transparent hover:bg-slate-50/50'
                      }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      {isSelected ? (
                        <CheckCircle2 size={24} fill="#28A745" color="white" strokeWidth={2} />
                      ) : (
                        <div className="w-[20px] h-[20px] border-2 border-slate-200 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-[15.5px] ${isSelected ? 'text-[#0f172a] font-medium' : 'text-[#334155]'}`}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Confidence Slider Phase */}
            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-[15px] font-bold text-[#334155] mb-12">How confident are you about your answer?</h3>

              {/* Custom 5-step horizontal tracker */}
              <div className="relative flex justify-between items-center w-full px-2 sm:px-8 mb-10">
                <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-[3px] bg-slate-100 -z-10 rounded-full"></div>
                {[
                  { val: 1, label: "Guess" },
                  { val: 2, label: "Not Sure" },
                  { val: 3, label: "Somewhat Sure" },
                  { val: 4, label: "Confident" },
                  { val: 5, label: "Very Confident" }
                ].map(({ val, label }) => {
                  const isActive = currentAns?.confidence === val;
                  return (
                    <div key={val} className="relative flex flex-col items-center cursor-pointer group z-10" onClick={() => updateCurrentAnswer(undefined, val)}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[15px] transition-all duration-200 ${isActive ? 'bg-[#28A745] text-white shadow-[0_2px_8px_rgba(40,167,69,0.3)]' : 'bg-transparent text-transparent group-hover:bg-slate-100 group-hover:text-slate-400'
                        }`}>
                        {isActive ? val : ''}
                      </div>
                      {/* Inactive tick mark on the line */}
                      {!isActive && (
                        <div className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[10px] bg-slate-200 rounded-full group-hover:bg-transparent pointer-events-none"></div>
                      )}

                      <div className="absolute top-10 w-28 text-center flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-1.5">
                        {!isActive && <span className="font-bold text-slate-500 text-[15px]">{val}</span>}
                        <span className={`text-[13px] sm:text-[14px] leading-tight ${isActive ? 'font-bold text-[#334155]' : 'text-slate-500'}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer Action Row */}
          <div className="bg-[#f8fafc] border-t border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 rounded-b-[16px]">
            <button
              className="w-full sm:w-auto bg-white border border-slate-200 text-[#334155] font-semibold px-8 py-3.5 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
              disabled={currentIndex === 0}
              onClick={handlePrevious}
            >
              Previous
            </button>

            <button
              className="w-full justify-center bg-[#185adb] text-white font-semibold flex-1 max-w-[220px] py-3.5 rounded-xl shadow-[0_2px_8px_rgba(24,90,219,0.25)] hover:bg-blue-700 disabled:opacity-50 transition-colors text-center text-[15.5px]"
              disabled={!currentAns?.option || !currentAns?.confidence}
              onClick={currentIndex === questions.length - 1 ? handleSubmit : handleNext}
            >
              {currentIndex === questions.length - 1 ? 'Submit & Finalize' : 'Next'}
            </button>

            {currentIndex !== questions.length - 1 && (
              <button
                className="w-full justify-center bg-[#28A745] text-white font-semibold flex-1 max-w-[220px] py-3.5 rounded-xl shadow-[0_2px_8px_rgba(40,167,69,0.25)] hover:bg-[#218838] disabled:opacity-50 transition-colors text-center text-[15.5px]"
                disabled={!currentAns?.option || !currentAns?.confidence}
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
};

export default Assessment;
