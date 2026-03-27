import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { calculateCapabilityScores } from '../utils/scoreCalculator';
import { analyzeSkillGaps } from '../utils/gapAnalyzer';
import { generateRoleAssessment } from '../utils/aiQuestionGenerator';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertCircle, Sparkles, BrainCircuit, Trees } from 'lucide-react';
import Sidebar from '../Components/Sidebar';

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
                 if(!displayOptions.includes(displayCorrect)) displayOptions[0] = displayCorrect;
                 displayOptions.sort(() => Math.random() - 0.5);
               } catch(e) { console.error(e) }
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

  // Modern Clean EdTech UI Classes
  const wrapCls = "w-full flex flex-col items-center justify-center max-w-5xl mx-auto";
  const cardLightCls = "bg-white rounded-4xl p-8 sm:p-12 w-full max-w-4xl shadow-xl shadow-slate-200/50 border border-slate-100 relative";

  const AppShell = ({ children }) => (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
             <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-center bg-slate-50 transition-colors duration-500">
                  {children}
             </div>
        </main>
    </div>
  );
  const btnPrimary = "bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-8 rounded-2xl text-base font-semibold transition-all duration-300 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";
  const btnSecondary = "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 py-3.5 px-8 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // ----------- STATE ROUTING SCREENS ----------- 

  if (status === 'role_select') {
    return (
      <AppShell>
      <div className={wrapCls}>
        <div className={`${cardLightCls} text-center flex flex-col items-center`}>
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center shadow-xl shadow-black/20 mb-6">
            <Trees size={40} fill="white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">CapabilityGap AI</h1>
          <p className="text-slate-500 text-lg mb-10 max-w-xl">
            Type any specific job title. Our AI Engine will dynamically generate explicit capability matrices, core skill benchmarks, and bespoke assessment sequences just for you in seconds.
          </p>
          
          <div className="w-full max-w-sm flex flex-col items-center gap-4">
             <input
                type="text"
                placeholder="e.g. SDE, Frontend, UI/UX Designer..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 text-center font-bold text-lg outline-none transition-all shadow-inner"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleBeginTargeting() }}
             />
             <button className={`${btnPrimary} w-full justify-center text-lg py-4 mt-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:to-purple-700 shadow-indigo-500/25 border-t border-white/20`} onClick={handleBeginTargeting} disabled={!targetRoleInput.trim()}>
               <Sparkles size={20} /> Generate AI Assessment 
             </button>
          </div>
            <p className="text-slate-400 text-xs mt-6">Powered by Google Gemini 2.5 Flash</p>
        </div>
      </div>
      </AppShell>
    );
  }

  if (status === 'generating_ai' || status === 'submitting' || status === 'loading') {
    return (
      <AppShell>
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
      <AppShell>
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
      <AppShell>
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
            Initialize Assessment <ChevronRight size={18}/>
          </button>
        </div>
      </div>
      </AppShell>
    );
  }

  if (status === 'finished') {
    const score = results.filter(r => r.correct).length;
    return (
      <AppShell>
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
      {/* Master Progress Header */}
      <div className="w-full max-w-4xl mb-6 px-2 flex justify-between items-end">
        <div>
          <span className="text-indigo-600 font-bold text-lg">Question {currentIndex + 1}</span>
          <span className="text-slate-400 font-medium text-md ml-1">of {questions.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full font-mono text-sm font-bold border border-indigo-100">
          <Clock size={16} />
          {formatTime(elapsedTime)}
        </div>
      </div>
      
      {/* Progress Bar Track */}
      <div className="w-full max-w-4xl h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className={`${cardLightCls} animate-[fadeIn_0.5s_ease-out]`}>
        
        {/* Skill Category Badge */}
        <div className="absolute top-8 left-8 flex flex-col items-start gap-1">
          <div className="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            {currentQ.skills?.skill_name || 'General Module'}
          </div>
          <div className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-widest ${currentQ.difficulty === 'Advanced' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-indigo-50 text-indigo-500 border border-indigo-100'}`}>
            {currentQ.difficulty} Tier
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight mt-12 mb-10 text-slate-800">
          {currentQ.displayContent}
        </h2>

        {/* Multiple Choice Options */}
        <div className="flex flex-col gap-3 mb-10">
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentAns?.option === opt;
            return (
              <button
                key={idx}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center group ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
                onClick={() => updateCurrentAnswer(opt, currentAns?.confidence || 3)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold border-2 transition-colors ${
                  isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 text-slate-400 group-hover:border-indigo-300 group-hover:text-indigo-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`text-lg font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>

        {/* Confidence Slider Phase */}
        <div className={`transition-all duration-500 overflow-hidden ${currentAns?.option ? 'max-h-64 opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>
          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest text-center mb-6">Psychological Confidence Rating</h3>
            
            <div className="flex flex-col gap-6 max-w-xl mx-auto">
               <input
                type="range"
                min="1" max="5" step="1"
                value={currentAns?.confidence || 3}
                onChange={(e) => updateCurrentAnswer(undefined, parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between w-full px-1 text-xs sm:text-sm font-bold text-slate-400">
                <span className={currentAns?.confidence === 1 ? 'text-rose-500 border-b-2 border-rose-500 pb-1' : ''}>1 (Guess)</span>
                <span className={currentAns?.confidence === 2 ? 'text-orange-500' : ''}>2</span>
                <span className={currentAns?.confidence === 3 ? 'text-amber-500' : ''}>3 (Unsure)</span>
                <span className={currentAns?.confidence === 4 ? 'text-teal-500' : ''}>4</span>
                <span className={currentAns?.confidence === 5 ? 'text-emerald-500 border-b-2 border-emerald-500 pb-1' : ''}>5 (Certain)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Row */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-auto">
          <button 
            className={btnSecondary} 
            disabled={currentIndex === 0}
            onClick={handlePrevious}
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          {currentIndex === questions.length - 1 ? (
             <button 
               className={`${btnPrimary} bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-md truncate`}
               disabled={!currentAns?.option || !currentAns?.confidence || status === 'submitting'}
               onClick={handleSubmit}
             >
               {status === 'submitting' ? 'Calculating...' : 'Submit Evaluation'} <CheckCircle2 size={20} />
             </button>
          ) : (
             <button 
               className={btnPrimary}
               disabled={!currentAns?.option || !currentAns?.confidence}
               onClick={handleNext}
             >
               Next Stage <ChevronRight size={20} />
             </button>
          )}
        </div>
      </div>
    </div>
    </AppShell>
  );
};

export default Assessment;
