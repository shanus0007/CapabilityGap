import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { calculateCapabilityScores } from '../utils/scoreCalculator';
import { analyzeSkillGaps } from '../utils/gapAnalyzer';
import { generateAssessmentSession } from '../utils/aiQuestionGenerator';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, Sparkles, Trees } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

// Responsive wrapper — full width on mobile, constrained on larger screens
const wrapCls = "w-full flex flex-col items-center mx-auto px-3 sm:px-5 py-3 sm:py-5 max-w-full sm:max-w-[640px] md:max-w-[800px] lg:max-w-[920px]";

// Stable Application UI Container
const AppShell = ({ children, session }) => (
  <div className="h-dvh w-full bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden">
    <Sidebar session={session} />
    <main className="flex-1 overflow-hidden relative bg-slate-50">
      <div className="absolute inset-0 overflow-y-auto flex flex-col items-center justify-center p-3 sm:p-5 transition-colors duration-500">
        {children}
      </div>
    </main>
  </div>
);

const Assessment = ({ session }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [answers, setAnswers] = useState([]);
  const [timePerQuestion, setTimePerQuestion] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('role_select');
  const [results, setResults] = useState([]);
  const [fetchDiagnostic, setFetchDiagnostic] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleBeginTargeting = async () => {
    if (!targetRoleInput.trim()) return;
    const roleName = targetRoleInput.trim();
    setSelectedRole(roleName);
    setStatus('generating_ai');
    try {
      const genResult = await generateAssessmentSession(session?.user?.id, roleName);
      if (!genResult.success) {
        setFetchDiagnostic(`AI Engine failed: ${genResult.error}`);
        setStatus('missing_data');
        return;
      }
      const sessionId = genResult.sessionId;
      const { data: qLinks, error: linkError } = await supabase
        .from('session_questions')
        .select(`order_index, questions_bank:question_id (*)`)
        .eq('session_id', sessionId)
        .order('order_index', { ascending: true });
      if (linkError) throw linkError;
      if (!qLinks || qLinks.length === 0) {
        setFetchDiagnostic('SQL Fetch succeeded but returned 0 mapped session questions.');
        setStatus('missing_data');
        return;
      }
      const mappedQuestions = qLinks.map(link => {
        const q = link.questions_bank;
        const displayOptions = [q.option_a, q.option_b, q.option_c, q.option_d].sort(() => Math.random() - 0.5);
        return {
          id: q.id,
          displayContent: q.question,
          options: displayOptions,
          difficulty: q.difficulty,
          correct_answer: q.correct_option,
          expected_time: q.expected_time,
          skills: { skill_name: q.skill_name }
        };
      });
      setQuestions(mappedQuestions);
      setAnswers(mappedQuestions.map(() => ({ option: null, confidence: null })));
      setTimePerQuestion(mappedQuestions.map(() => 0));
      setStatus('ready');
    } catch (err) {
      console.error(err);
      setFetchDiagnostic(err.message || JSON.stringify(err));
      setStatus('missing_data');
    }
  };

  useEffect(() => {
    let timer;
    if (status === 'active') {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setTimePerQuestion(prev => {
          const t = [...prev];
          t[currentIndex] += 1;
          return t;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, currentIndex]);

  const startAssessment = () => { setStatus('active'); setElapsedTime(0); };

  const updateCurrentAnswer = (option, confidence) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      option: option !== undefined ? option : newAnswers[currentIndex].option,
      confidence: confidence !== undefined ? confidence : newAnswers[currentIndex].confidence
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => { if (currentIndex < questions.length - 1) setCurrentIndex(p => p + 1); };
  const handlePrevious = () => { if (currentIndex > 0) setCurrentIndex(p => p - 1); };

  const handleSubmit = async () => {
    setStatus('submitting');
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
        await calculateCapabilityScores(session.user.id);
        setIsAnalyzing(true);
        await analyzeSkillGaps(session.user.id, selectedRole);
        setIsAnalyzing(false);
      }
      setStatus('finished');
    } catch (e) {
      console.error(e);
      setStatus('finished');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── ROLE SELECT ────────────────────────────────────────────────────────────
  if (status === 'role_select') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className="bg-white rounded-2xl sm:rounded-[32px] p-5 sm:p-8 w-full shadow-sm border border-slate-100 flex flex-col items-center">

            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0a0f1c] text-white rounded-full flex items-center justify-center shadow-lg mb-4 sm:mb-5">
              <Trees size={24} fill="white" className="sm:hidden" />
              <Trees size={30} fill="white" className="hidden sm:block" />
            </div>

            <h1 className="text-[22px] sm:text-[28px] lg:text-[32px] font-bold text-[#1e293b] mb-2 text-center tracking-tight leading-tight">
              Generate Your AI Skill Assessment
            </h1>

            <p className="text-slate-500 text-[14px] sm:text-[15px] mb-6 sm:mb-8 max-w-[600px] text-center leading-relaxed font-medium px-1">
              Enter your target role and our AI will generate a personalized assessment designed for your career goal.
            </p>

            <div className="w-full max-w-[560px] flex flex-col items-center gap-3">
              <div className="w-full relative">
                <label className="absolute top-1.5 left-4 text-[11px] sm:text-[12px] font-semibold text-slate-400">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, UI/UX Designer, Figma, Ai Developer..."
                  className="w-full bg-white border border-slate-200 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-400/20 rounded-[14px] px-4 pt-[22px] pb-2 text-[14px] sm:text-[15px] font-semibold text-slate-800 outline-none transition-all shadow-sm placeholder:text-slate-400"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleBeginTargeting(); }}
                />
              </div>

              <div className="w-full p-1.5 sm:p-2 rounded-full bg-linear-to-b from-[#e9d5ff]/50 to-[#d8b4fe]/30 shadow-[0_8px_32px_-8px_rgba(126,34,206,0.25)]">
                <button
                  className="relative w-full flex items-center justify-center gap-2 text-white font-bold text-[16px] sm:text-[18px] py-3 sm:py-3.5 rounded-full bg-linear-to-b from-[#9333ea] via-[#7e22ce] to-[#581c87] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-300 disabled:opacity-50 hover:from-[#a855f7] active:scale-[0.98]"
                  onClick={handleBeginTargeting}
                  disabled={!targetRoleInput.trim()}
                >
                  Generate My Assessment
                  <Sparkles size={16} className="text-white" fill="white" />
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {['AI Powered', 'Role-Based', 'Personalized'].map(tag => (
                  <span key={tag} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-full text-[12px] font-semibold border border-slate-200 shadow-sm">{tag}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 w-full">
              {[
                { icon: <Sparkles size={18} className="text-purple-500" fill="#e9d5ff" />, title: 'AI-Generated Questions', desc: 'Questions tailored to your target role and required skills.' },
                { icon: <div className="flex gap-[3px] items-end h-4"><div className="w-1 h-2 bg-emerald-500 rounded-sm" /><div className="w-1 h-4 bg-indigo-500 rounded-sm" /><div className="w-1 h-3 bg-purple-500 rounded-sm" /></div>, title: 'Capability Analysis', desc: 'We evaluate your knowledge, speed, and confidence.' },
                { icon: <CheckCircle2 size={18} className="text-blue-500" />, title: 'Personalized Roadmap', desc: 'Get a structured improvement plan based on your results.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white border border-slate-100 rounded-xl sm:rounded-[20px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1e293b]">{title}</h3>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── LOADING / SUBMITTING ────────────────────────────────────────────────────
  if (status === 'generating_ai' || status === 'submitting' || status === 'loading') {
    return (
      <AppShell session={session}>
        <div className="flex flex-col items-center justify-center gap-5 px-4 text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20">
            <div className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-purple-100 border-t-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          </div>
          <p className="text-[16px] sm:text-[18px] font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse max-w-xs sm:max-w-md">
            {status === 'generating_ai' ? `Creating Your Personalized Assessment for ${selectedRole}...` :
              status === 'submitting' ? 'Scoring your assessment...' : 'Loading...'}
          </p>
          {status === 'generating_ai' && (
            <p className="text-slate-400 text-[13px] sm:text-[14px]">This may take a few seconds. We’re preparing your personalized assessment....</p>
          )}
        </div>
      </AppShell>
    );
  }

  // ─── ERROR ───────────────────────────────────────────────────────────────────
  if (status === 'missing_data') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full border border-slate-100 shadow-md text-center flex flex-col items-center">
            <AlertCircle size={40} className="text-amber-400 mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Intelligence Blocked</h1>
            <p className="text-rose-500 font-mono text-xs sm:text-sm mb-4 p-3 sm:p-4 bg-rose-50 rounded-lg border border-rose-100 w-full text-left break-all">{fetchDiagnostic}</p>
            <p className="text-slate-500 text-[13px] sm:text-[14px] mb-6 max-w-sm">
              {fetchDiagnostic.toLowerCase().includes('429') || fetchDiagnostic.toLowerCase().includes('quota')
                ? "AI strict 15-requests-per-minute limit! Please wait exactly 60 seconds before generating a new assessment."
                : fetchDiagnostic.includes('AI Engine failed')
                  ? "The AI was unable to safely process your request. Check your API key or prompt complexity."
                  : "The AI succeeded but your database rejected the save. Disable RLS on your custom tables."}
            </p>
            <button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-[14px] transition-colors"
              onClick={() => setStatus('role_select')}
            >
              <ChevronLeft size={16} /> Retry
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── READY ───────────────────────────────────────────────────────────────────
  if (status === 'ready') {
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full border border-slate-100 shadow-md text-center flex flex-col items-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <CheckCircle2 size={32} className="sm:hidden" />
              <CheckCircle2 size={40} className="hidden sm:block" />
            </div>
            <span className="inline-block bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-purple-100">
              {selectedRole} Benchmark Compiled
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">You’re All Set</h1>
            <p className="text-slate-500 text-[13px] sm:text-base mb-6 sm:mb-8 max-w-sm sm:max-w-lg">
              We’ve created your personalized assessment based on your target role. Start your assessment and discover your skill level.
            </p>
            <button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-[14px] sm:text-base transition-colors shadow-md shadow-indigo-200"
              onClick={startAssessment}
            >
              Start Assessment <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── FINISHED ────────────────────────────────────────────────────────────────
  if (status === 'finished') {
    const score = results.filter(r => r.correct).length;
    const pct = Math.round((score / questions.length) * 100);
    const avgConf = (results.reduce((a, r) => a + r.confidence_rating, 0) / questions.length).toFixed(1);
    return (
      <AppShell session={session}>
        <div className={wrapCls}>
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full border border-slate-100 shadow-md text-center">
            <span className="inline-block bg-emerald-50 text-emerald-600 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4">
              Evaluation Complete
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">Metrics Finalized</h1>

            <div className="text-[4rem] sm:text-[6rem] font-black text-slate-800 my-3 sm:my-6 tracking-tighter leading-none">
              {pct}<span className="text-2xl sm:text-4xl text-slate-400 relative -top-4 sm:-top-8">%</span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8">
              {[
                { label: 'Accuracy', value: `${score} / ${questions.length}` },
                { label: 'Time', value: formatTime(elapsedTime) },
                { label: 'Avg Confidence', value: `${avgConf}/5` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 p-3 sm:p-5 rounded-xl sm:rounded-3xl border border-slate-100">
                  <div className="text-slate-400 text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2">{label}</div>
                  <div className="text-base sm:text-2xl font-bold text-slate-800">{value}</div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50/50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-indigo-100 flex flex-col items-center shadow-sm">
              <h3 className="text-lg sm:text-xl font-bold text-indigo-900 mb-1 sm:mb-2">Analysis Complete!</h3>
              <p className="text-[12px] sm:text-sm text-indigo-600/80 mb-4 sm:mb-6 max-w-sm">
                Your {selectedRole} capability scores and AI roadmap are ready.
              </p>
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:to-purple-700 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold text-[14px] sm:text-base transition-colors shadow-md"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ─── ACTIVE QUIZ ─────────────────────────────────────────────────────────────
  const currentQ = questions[currentIndex];
  const currentAns = answers[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <AppShell>
      <div className={wrapCls}>

        {/* HEADER BAR */}
        <div className="w-full flex items-center justify-between px-1 py-2 mb-2 sm:mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-20 sm:w-32 h-1.5 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#185adb] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="text-[12px] sm:text-[13px] font-semibold text-slate-700">
              Q{currentIndex + 1}<span className="text-slate-400 font-normal">/{questions.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            <span className="font-mono text-[12px] sm:text-[13px] font-semibold text-slate-700">{formatTime(elapsedTime)}</span>
          </div>
          <span className="text-slate-400 text-[11px] sm:text-[12px] hidden sm:inline truncate max-w-[120px]">{selectedRole}</span>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-xl sm:rounded-2xl w-full border border-slate-200 shadow-md flex flex-col">
          <div className="p-4 sm:p-6 lg:p-8">

            {/* Question */}
            <p className="text-[15px] sm:text-[17px] lg:text-[18px] font-semibold text-[#1e293b] mb-4 sm:mb-6 leading-relaxed">
              {currentQ.displayContent}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2 sm:gap-2.5 mb-4 sm:mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = currentAns?.option === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => updateCurrentAnswer(opt, currentAns?.confidence || 3)}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-150 flex items-center gap-2.5 sm:gap-3 text-[13.5px] sm:text-[15px] font-medium ${isSelected
                      ? 'border-2 border-[#185adb] bg-blue-50 text-[#185adb]'
                      : 'border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
                      {isSelected ? (
                        <CheckCircle2 size={18} fill="#185adb" color="white" strokeWidth={2} className="sm:hidden" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full sm:hidden"></div>
                      )}
                      {isSelected ? (
                        <CheckCircle2 size={20} fill="#185adb" color="white" strokeWidth={2} className="hidden sm:block" />
                      ) : (
                        <div className="w-[18px] h-[18px] border-2 border-slate-300 rounded-full hidden sm:block"></div>
                      )}
                    </div>
                    <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Confidence — shown after selection */}
            {currentAns?.option && (
              <div className="pt-3 sm:pt-4 border-t border-slate-100">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">
                  How confident are you?
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    { val: 1, label: 'Guessing' },
                    { val: 2, label: 'Not Sure' },
                    { val: 3, label: 'Somewhat' },
                    { val: 4, label: 'Confident' },
                    { val: 5, label: 'Very Sure' },
                  ].map(({ val, label }) => {
                    const isActive = currentAns?.confidence === val;
                    return (
                      <button
                        key={val}
                        onClick={() => updateCurrentAnswer(undefined, val)}
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] font-semibold border transition-all duration-150 ${isActive
                          ? 'bg-[#28A745] text-white border-[#28A745] shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                          }`}
                      >
                        {val}. {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 rounded-b-xl sm:rounded-b-2xl">
            <button
              className="text-slate-600 text-[12px] sm:text-[14px] font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              disabled={currentIndex === 0}
              onClick={handlePrevious}
            >
              ← <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
            </button>
            <div className="flex-1"></div>
            {currentIndex !== questions.length - 1 && (
              <button
                className="text-[12px] sm:text-[14px] font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 transition-colors shadow-sm"
                disabled={!currentAns?.option || !currentAns?.confidence}
                onClick={handleSubmit}
              >
                Submit Early
              </button>
            )}
            <button
              className="text-[12px] sm:text-[14px] font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#185adb] text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm"
              disabled={!currentAns?.option || !currentAns?.confidence}
              onClick={currentIndex === questions.length - 1 ? handleSubmit : handleNext}
            >
              {currentIndex === questions.length - 1 ? 'Finish ✓' : 'Next →'}
            </button>
          </div>
        </div>

      </div>
    </AppShell>
  );
};

export default Assessment;
