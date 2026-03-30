import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Bell, User, LogOut, 
    LayoutDashboard, CheckSquare, Target, 
    MapPin, BarChart3, ChevronRight, CheckCircle2, Circle, Trees
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';

export default function Roadmap({ session }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [weeks, setWeeks] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchGaps = async () => {
            try {
                const { data: rawGapData, error } = await supabase
                    .from('skill_gaps')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .gt('gap_score', 0)
                    .order('gap_score', { ascending: false });

                if (error) throw error;

                const { data: allSkills } = await supabase.from('skills').select('id, skill_name');
                const gapData = rawGapData || [];
                
                if (allSkills?.length > 0) {
                   gapData.forEach(g => {
                       const match = allSkills.find(s => s.id === g.skill_id);
                       if (match) g.skills = { name: match.skill_name };
                   });
                }

                const { data: allRecs } = await supabase
                    .from('recommendations')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('id', { ascending: false })
                    .limit(1);
                
                const recData = allRecs?.length > 0 ? allRecs[0] : null;

                // Dynamically generate a 4-week roadmap
                const newWeeks = [];
                const gaps = gapData || [];
                const aiPlan = recData || {};

                for (let i = 0; i < 4; i++) {
                    const focusGap = gaps[i % gaps.length]; // Loop over if fewer than 4 gaps
                    let severityStr = 'Refinement';
                    if (focusGap?.gap_score > 40) severityStr = 'Intensive Focus';
                    else if (focusGap?.gap_score > 15) severityStr = 'Moderate Focus';
                    
                    const coreRecText = aiPlan.topics ? `Study Recommended Topic: ${aiPlan.topics.substring(0, 100)}...` : `Review fundamental formulas and architectures for ${focusGap?.skills?.name || 'this module'}`;

                    newWeeks.push({
                        id: `week-${i+1}`,
                        title: `Week ${i+1}: ${focusGap ? focusGap.skills.name : 'General Mastery'}`,
                        severity: focusGap ? severityStr : 'Mastery',
                        gap: focusGap?.gap_score || 0,
                        tasks: focusGap ? [
                           { id: `t-${i}-1`, text: coreRecText, completed: false },
                           { id: `t-${i}-2`, text: `Complete 10 dynamic practice problems strictly eliminating your ${focusGap.gap_score}% capability deficit`, completed: false },
                           { id: `t-${i}-3`, text: `Take a targeted milestone quiz to lock in ${focusGap.skills.name} retention thresholds`, completed: false }
                        ] : [
                           { id: `t-${i}-1`, text: 'Explore advanced algorithms application beyond requirement baselines', completed: false },
                           { id: `t-${i}-2`, text: 'Participate in a weekly mock interview', completed: false }
                        ]
                    });
                }
                
                // Initialize local progress tracking state
                const savedProgress = localStorage.getItem(`roadmap_prog_${session.user.id}`);
                if (savedProgress) {
                   const parsed = JSON.parse(savedProgress);
                   newWeeks.forEach(w => {
                       w.tasks.forEach(t => {
                           if (parsed[t.id]) t.completed = true;
                       });
                   });
                }

                setWeeks(newWeeks);
                updateOverallProgress(newWeeks);
            } catch (err) {
                console.error("Roadmap fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGaps();
    }, [session?.user?.id]);

    const updateOverallProgress = (weeklyData) => {
        let total = 0; let done = 0;
        weeklyData.forEach(w => {
            w.tasks.forEach(t => { total++; if(t.completed) done++; });
        });
        setProgress(total === 0 ? 0 : Math.round((done / total) * 100));
    };

    const toggleTask = (weekId, taskId) => {
        const nextWeeks = [...weeks];
        const week = nextWeeks.find(w => w.id === weekId);
        const task = week.tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        
        setWeeks(nextWeeks);
        updateOverallProgress(nextWeeks);

        // Save progress locally
        const memory = JSON.parse(localStorage.getItem(`roadmap_prog_${session.user.id}`) || '{}');
        memory[taskId] = task.completed;
        localStorage.setItem(`roadmap_prog_${session.user.id}`, JSON.stringify(memory));
    };

    if (!session) return null;
    const user = session.user;
    const name = user.user_metadata?.full_name || 'User';

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
            {/* ---------------- SIDEBAR ---------------- */}
            <Sidebar session={session} />

            {/* ---------------- MAIN CONTENT ---------------- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* ---------------- HEADER ---------------- */}
                <header className="h-20 bg-[#F8FAFC] hidden md:flex items-center justify-between px-8 border-b border-transparent shrink-0">
                    <div className="relative w-full max-w-md hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search modules..."
                            className="w-full bg-white pl-11 pr-4 py-2.5 rounded-full border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium placeholder-slate-400 shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-6 ml-auto mt-4 md:mt-0">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 border border-white rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            {user.user_metadata?.avatar_url ? (
                                <img 
                                    src={user.user_metadata.avatar_url} 
                                    alt="UserAvatar" 
                                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                                />
                            ) : (
                                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm border-2 border-white shadow-sm">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-lg text-slate-400 animate-pulse font-medium">Generating Intelligence Roadmap...</div>
                        </div>
                    ) : weeks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
                            <Target size={48} className="text-indigo-400 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Skill Gaps Detected</h2>
                            <p className="text-slate-500 mb-6">Take a baseline assessment to generate your personalized learning roadmap.</p>
                            <button onClick={() => navigate('/assessment')} className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-600 transition">
                                Start Assessment
                            </button>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto pb-12">
                            {/* Blueprint Header */}
                            <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-xl shadow-indigo-900/10 relative overflow-hidden text-white">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full"></div>
                                <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-500/20 blur-[60px] rounded-full"></div>
                                
                                <div className="relative z-10">
                                    <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-indigo-200 border border-white/10">
                                        Personalized Blueprint
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Your 4-Week Learning Roadmap</h1>
                                    <p className="text-lg text-indigo-100 max-w-xl mb-8 leading-relaxed opacity-90">
                                        This timeline has been dynamically generated to permanently close your highest capability gaps evaluated during your last baseline test.
                                    </p>
                                    
                                    {/* Master Progress Bar */}
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-medium text-indigo-200 uppercase tracking-widest">Master Completion Tracking</span>
                                            <span className="text-2xl font-bold text-white">{progress}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className="h-full bg-linear-to-r from-[#00f2fe] to-[#4facfe] rounded-full transition-all duration-1000 ease-out relative"
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Tasks */}
                            <div className="space-y-6">
                                {weeks.map((week, index) => (
                                    <div key={week.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                                                    {week.title}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${
                                                        week.severity === 'Intensive Focus' ? 'bg-rose-50 text-rose-500' :
                                                        week.severity === 'Moderate Focus' ? 'bg-amber-50 text-amber-500' :
                                                        'bg-indigo-50 text-indigo-500'
                                                    }`}>
                                                        {week.severity}
                                                    </span>
                                                    {week.gap > 0 && <span className="text-sm font-medium text-slate-400">Bridging {week.gap}% Gap</span>}
                                                </div>
                                            </div>
                                            
                                            {/* Progress Circular Dial for Week */}
                                            {(() => {
                                                const cw = week.tasks.filter(t=>t.completed).length;
                                                const tw = week.tasks.length;
                                                const pct = tw === 0 ? 0 : (cw / tw) * 100;
                                                const cRad = 16; const cCirc = cRad * Math.PI * 2;
                                                return (
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        <div className="text-right">
                                                            <div className="text-sm font-bold text-slate-700">{cw} of {tw}</div>
                                                            <div className="text-xs text-slate-400 font-medium">Tasks Closed</div>
                                                        </div>
                                                        <div className="relative w-12 h-12 flex items-center justify-center">
                                                            <svg className="transform -rotate-90 w-12 h-12">
                                                                <circle cx="24" cy="24" r={cRad} stroke="#F1F5F9" strokeWidth="4" fill="none" />
                                                                <circle cx="24" cy="24" r={cRad} stroke={pct === 100 ? "#10B981" : "#4F46E5"} strokeWidth="4" fill="none" 
                                                                    strokeDasharray={cCirc} strokeDashoffset={cCirc - (pct/100)*cCirc} className="transition-all duration-500" />
                                                            </svg>
                                                            {pct === 100 && <CheckCircle2 size={14} className="absolute text-emerald-500 bg-white rounded-full" />}
                                                        </div>
                                                    </div>
                                                )
                                            })()}
                                        </div>

                                        {/* Task Checkboxes */}
                                        <div className="space-y-3">
                                            {week.tasks.map(task => (
                                                <div 
                                                    key={task.id} 
                                                    onClick={() => toggleTask(week.id, task.id)}
                                                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                                                        task.completed 
                                                            ? 'bg-slate-50 border-slate-100 opacity-60' 
                                                            : 'bg-white border-slate-200/60 hover:border-indigo-200 hover:shadow-sm shadow-indigo-100/20'
                                                    }`}
                                                >
                                                    <div className="mt-0.5 shrink-0">
                                                        {task.completed ? (
                                                            <CheckCircle2 size={24} className="text-emerald-500" />
                                                        ) : (
                                                            <Circle size={24} className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <p className={`text-[15px] font-medium leading-relaxed transition-all ${
                                                        task.completed ? 'text-slate-500 line-through' : 'text-slate-700'
                                                    }`}>
                                                        {task.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-12 text-center pb-8">
                                <p className="text-slate-400 text-sm">Once you clear 100% of your roadmap tasks, we critically recommend re-running the diagnostic assessment.</p>
                                <button onClick={() => navigate('/assessment')} className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 rounded-full transition-colors text-sm">
                                    Re-Take Baseline Assessment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
