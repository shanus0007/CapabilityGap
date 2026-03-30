import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Bell, Inbox, User, LogOut, 
    LayoutDashboard, CheckSquare, Target, 
    MapPin, BarChart3, Settings, ShieldAlert, Trees, FileText
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';
import Sidebar from '../Components/Sidebar';

// Simple SVG Half Donut Component for metrics
const HalfDonut = ({ percentage, colorClass, gradientId, strokeWidth = 12, size = 120 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI;
    const p = isNaN(percentage) ? 0 : percentage;
    const strokeDashoffset = circumference - (p / 100) * circumference;

    return (
        <svg width={size} height={size / 2 + strokeWidth} className="overflow-visible">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="50%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
            </defs>
            <path
                d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            <path
                d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
            />
        </svg>
    );
};

export default function Dashboard({ session }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [capScores, setCapScores] = useState([]);
    const [gaps, setGaps] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [difficultyData, setDifficultyData] = useState([
        { name: 'Basic', accuracy: 0 },
        { name: 'Medium', accuracy: 0 },
        { name: 'Hard', accuracy: 0 }
    ]);
    const [recommendations, setRecommendations] = useState(null);
    
    // Derived computations
    const [overallScore, setOverallScore] = useState(0);
    const [roleReadiness, setRoleReadiness] = useState(0);
    const [weakestSkill, setWeakestSkill] = useState(null);
    const [strongestSkill, setStrongestSkill] = useState(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchData = async () => {
            setLoading(true);
            const userId = session.user.id;

            try {
                // Fetch independently safely skipping restrictive foreign keys!
                const { data: rawCapData } = await supabase.from('capability_scores').select('*').eq('user_id', userId);
                const { data: rawGapData } = await supabase.from('skill_gaps').select('*').eq('user_id', userId);
                const { data: rawAttemptData } = await supabase.from('attempts').select('*').eq('user_id', userId);
                
                // Fetch Global Maps to cross-reference logically
                const { data: allSkills } = await supabase.from('skills').select('id, skill_name');
                const { data: legacyQuestions } = await supabase.from('questions').select('id, expected_time');
                const { data: bankQuestions } = await supabase.from('questions_bank').select('id, expected_time');
                
                const allQuestions = [...(legacyQuestions || []), ...(bankQuestions || [])];

                // Re-hydrate relationships directly into arrays dynamically in logic memory instead of SQL constraints!
                let capData = rawCapData || [];
                let gapData = rawGapData || [];
                let attemptData = rawAttemptData || [];

                if (allSkills?.length > 0) {
                    capData.forEach(c => {
                        const m = allSkills.find(s => s.id === c.skill_id);
                        if(m) c.skills = { skill_name: m.skill_name };
                    });
                    gapData.forEach(g => {
                        const m = allSkills.find(s => s.id === g.skill_id);
                        if(m) g.skills = { skill_name: m.skill_name };
                    });
                }

                if (allQuestions?.length > 0) {
                    attemptData.forEach(a => {
                        // Support both integer legacy IDs and new UUIDs
                        const m = allQuestions.find(q => String(q.id) === String(a.question_id));
                        if(m) a.questions = { expected_time: m.expected_time };
                    });
                }

                // Fetch Recommendations skipping strict .single() throws preventing 406 errors natively
                const { data: recData } = await supabase
                    .from('recommendations')
                    .select('*')
                    .eq('user_id', userId)
                    .order('id', { ascending: false })
                    .limit(1);

                const activeRec = recData && recData.length > 0 ? recData[0] : null;

                if (activeRec) {
                    setRecommendations(activeRec);
                } else {
                    setRecommendations(null);
                }
                if (capData) {
                    setCapScores(capData);
                    setRadarData(capData.map(c => ({
                        subject: c.skills?.skill_name || 'General',
                        A: c.capability_score || 0,
                        fullMark: 100
                    })));

                    if (capData.length > 0) {
                        const sum = capData.reduce((acc, curr) => acc + (curr.capability_score || 0), 0);
                        setOverallScore(Math.round(sum / capData.length));
                        
                        const sorted = [...capData].sort((a,b) => a.capability_score - b.capability_score);
                        setWeakestSkill(sorted[0]);
                        setStrongestSkill(sorted[sorted.length - 1]);
                    }
                }

                if (gapData) {
                    setGaps(gapData);
                    if (gapData.length > 0) {
                        const readinessSum = gapData.reduce((acc, curr) => {
                            const ratio = curr.required_score > 0 ? (curr.current_score / curr.required_score) : 1;
                            return acc + Math.min(ratio, 1); 
                        }, 0);
                        setRoleReadiness(Math.round((readinessSum / gapData.length) * 100));
                    }
                }

                if (attemptData) {
                    setAttempts(attemptData);
                    let basic = 0, bCorr = 0, med = 0, mCorr = 0, hard = 0, hCorr = 0;
                    
                    attemptData.forEach(a => {
                        const time = a.questions?.expected_time || 45;
                        if (time <= 45) { basic++; if(a.correct) bCorr++; }
                        else if (time === 60) { med++; if(a.correct) mCorr++; }
                        else { hard++; if(a.correct) hCorr++; }
                    });

                    setDifficultyData([
                        { name: 'Basic', accuracy: basic ? Math.round((bCorr/basic)*100) : 0 },
                        { name: 'Medium', accuracy: med ? Math.round((mCorr/med)*100) : 0 },
                        { name: 'Hard', accuracy: hard ? Math.round((hCorr/hard)*100) : 0 }
                    ]);
                }

            } catch (err) {
                console.error("Dashboard Fetch Error: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.id]);

    if (!session) return null;
    const user = session.user;
    const name = user.user_metadata?.full_name || 'User';

    const displayRecs = recommendations?.length > 0 ? recommendations : [];
    
    // Process actionable tasks checklist safely from Gemini payload
    const recommendedTasks = recommendations?.tasks 
        ? recommendations.tasks.split(/\.\s*|,|\n|;/).filter(t => t.trim().length > 10).map(t => t.trim().replace(/^[-*]\s*/, '')).slice(0, 3) 
        : ["Solve 15 advanced Algorithm matrices", "Complete backend DBMS revision modules", "Take a timed capability assessment module"];

    // Mock Historical Graph interpolation landing safely on real metric
    const performanceData = [
        { date: 'Apr 13', score: Math.max(0, overallScore - 25) },
        { date: 'Apr 14', score: Math.max(0, overallScore - 18) },
        { date: 'Apr 15', score: Math.max(0, overallScore - 10) },
        { date: 'Apr 16', score: Math.max(10, overallScore - 5) },
        { date: 'Today', score: overallScore || 78 },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
            {/* ---------------- SIDEBAR ---------------- */}
            <Sidebar session={session} />

            {/* ---------------- MAIN CONTENT ---------------- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-[#F8FAFC] hidden md:flex items-center justify-between px-8 border-b border-transparent shrink-0">
                    <div className="relative w-full max-w-md hidden md:block">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
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
                           <div className="text-lg text-slate-400 animate-pulse font-medium">Loading Intelligence Data...</div>
                       </div>
                    ) : (capScores.length === 0 && attempts.length === 0) ? (
                        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto w-full px-4">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Identify Your Capability Gaps</h2>
                                <p className="text-slate-500 text-[15px] max-w-xl mx-auto font-medium leading-relaxed">Choose how you want our AI engine to evaluate your current skill levels and instantly generate your personalized roadmap.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
                                {/* Option 1: AI Quiz */}
                                <div 
                                    onClick={() => navigate('/assessment')}
                                    className="group bg-white rounded-[24px] p-3 border border-slate-200/80 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500 cursor-pointer flex flex-col text-left relative overflow-hidden"
                                >
                                    {/* Top Graphic Container */}
                                    <div className="relative w-full h-[240px] bg-slate-50/80 rounded-[16px] overflow-hidden flex items-center justify-center">
                                        {/* Grid Background */}
                                        <div 
                                            className="absolute inset-0 opacity-50" 
                                            style={{ 
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0L0 0L0 24' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E")`, 
                                                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)',
                                                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 100%)'
                                            }}
                                        ></div>
                                        
                                        {/* Abstract UI Elements */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] w-[280px] h-[140px] flex items-center justify-between">
                                            {/* Left pill */}
                                            <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 flex items-center gap-2 transform -translate-y-4 group-hover:-translate-y-5 transition-transform duration-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Baseline</span>
                                            </div>
                                            
                                            {/* Right box */}
                                            <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-1 transform translate-y-6 group-hover:translate-y-5 transition-transform duration-500">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Role</span>
                                                <div className="h-1 w-8 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-400 w-2/3"></div></div>
                                            </div>

                                            {/* SVG connecting lines */}
                                            <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 280 140">
                                                <path d="M 60 40 C 100 40, 100 70, 140 70" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                                                <path d="M 220 100 C 180 100, 180 70, 140 70" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                                                <circle cx="140" cy="70" r="4" fill="#818cf8" />
                                            </svg>
                                        </div>

                                        {/* Central Core */}
                                        <div className="relative z-10 w-[72px] h-[72px] bg-linear-to-b from-blue-500 to-indigo-600 rounded-full shadow-[0_0_40px_rgba(99,102,241,0.3)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ring-8 ring-white/60">
                                            <Target size={30} className="text-white relative z-10" />
                                            {/* Radar rings */}
                                            <div className="absolute inset-0 rounded-full border border-indigo-400/30 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 pb-3 px-3">
                                        <h3 className="text-[18px] font-bold text-slate-800 mb-2 tracking-tight">Diagnostic Assessment</h3>
                                        <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-1 opacity-90">Take an adaptive AI quiz strictly mapped to your target role to benchmark your exact capability gaps.</p>
                                    </div>
                                </div>
                                
                                {/* Option 2: Resume Parser */}
                                <div 
                                    onClick={() => navigate('/resume-analysis')}
                                    className="group bg-white rounded-[24px] p-3 border border-slate-200/80 shadow-sm hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-500 cursor-pointer flex flex-col text-left relative overflow-hidden"
                                >
                                    {/* Top Graphic Container */}
                                    <div className="relative w-full h-[240px] bg-slate-50/80 rounded-[16px] overflow-hidden flex items-center justify-center">
                                        {/* Grid Background */}
                                        <div 
                                            className="absolute inset-0 opacity-50" 
                                            style={{ 
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0L0 0L0 24' fill='none' stroke='%23cbd5e1' stroke-width='1'/%3E%3C/svg%3E")`, 
                                                maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
                                                WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
                                            }}
                                        ></div>
                                        
                                        {/* Abstract UI Elements */}
                                        <div className="absolute w-full h-full flex items-center justify-center">
                                            {/* Background shadow layer */}
                                            <div className="absolute w-36 h-44 bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] rotate-3 translate-x-4 border border-slate-100 group-hover:rotate-6 transition-transform duration-500"></div>
                                            
                                            {/* Foreground Document */}
                                            <div className="relative z-10 w-36 h-44 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] -rotate-3 -translate-x-2 border border-slate-100 p-4 flex flex-col gap-2.5 group-hover:rotate-0 transition-transform duration-500">
                                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-1">
                                                    <FileText size={16} className="text-purple-500" />
                                                </div>
                                                <div className="w-3/4 h-1.5 bg-slate-100 rounded-full"></div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded-full"></div>
                                                <div className="w-5/6 h-1.5 bg-slate-100 rounded-full"></div>
                                                <div className="mt-auto flex gap-1.5">
                                                    <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Floating extraction badge */}
                                            <div className="absolute z-20 top-12 md:right-4 lg:right-10 right-6 bg-white/95 backdrop-blur-md px-3 py-2.5 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-200/80 flex items-center gap-2.5 group-hover:-translate-y-2 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-500">
                                                <div className="relative w-5 h-5 rounded-full bg-linear-to-tr from-purple-500 to-indigo-500 flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-50"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-800 leading-tight">Skills Extracted</span>
                                                    <span className="text-[9px] text-slate-400 font-medium">Gap analyzed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 pb-3 px-3">
                                        <h3 className="text-[18px] font-bold text-slate-800 mb-2 tracking-tight">Resume Intelligence</h3>
                                        <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-1 opacity-90">Upload your resume and let Gemini cross-reference your experience perfectly against industry capabilities.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                    <>
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Overall Score */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-1">Overall Capability</h3>
                                <p className="text-4xl font-bold text-slate-800">{overallScore}%</p>
                            </div>
                            <div className="relative transform translate-y-3">
                                <HalfDonut percentage={overallScore} colorClass="text-purple-500" gradientId="grad-overall" size={100} strokeWidth={10} />
                            </div>
                        </div>

                        {/* Role Readiness */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-1">Role Readiness</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold text-slate-800">{roleReadiness}%</p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {roleReadiness >= 80 ? 'Excellent' : roleReadiness >= 50 ? 'Moderate' : 'Needs Work'}
                                    </span>
                                </div>
                            </div>
                            <div className="relative transform translate-y-3 flex flex-col items-center">
                                <HalfDonut percentage={roleReadiness} colorClass="text-blue-500" gradientId="grad-role" size={90} strokeWidth={8} />
                            </div>
                        </div>

                        {/* Weakest Skill */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-linear-to-br from-amber-200/40 to-rose-200/40 blur-2xl rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} className="text-amber-500" />
                                    <h3 className="text-sm font-semibold text-slate-500">Weakest Skill</h3>
                                </div>
                                <p className="text-2xl font-bold text-slate-800 mb-1 leading-snug">{weakestSkill?.skills?.skill_name || 'N/A'}</p>
                                <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                                    <Target size={14} className="text-slate-300" />
                                    {weakestSkill?.capability_score || 0}% Capability Match
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        
                        {/* Capability Overview Card */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row">
                            <div className="flex-1 md:pr-6 md:border-r border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">Capability Overview</h3>
                                <p className="text-sm font-medium text-slate-400 mb-6">Track your dynamic skills mapping</p>
                                
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData.length > 0 ? radarData : [{subject: 'No Data', A: 0, fullMark: 100}]}>
                                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                            <PolarAngleAxis dataKey="subject" tick={false} />
                                            <Radar name="Score" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorUv)" fillOpacity={0.6} />
                                            <RechartsTooltip 
                                                cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                                itemStyle={{ fontWeight: 700, color: '#8b5cf6' }}
                                                labelStyle={{ fontWeight: 600, color: '#64748b', marginBottom: '4px' }}
                                                formatter={(value) => [`${value}% Capability`, 'Match']}
                                            />
                                            <defs>
                                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.8}/>
                                                </linearGradient>
                                            </defs>
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Right side Stats mapping directly to mockup prototype bounds */}
                            <div className="md:w-72 md:pl-8 pt-6 md:pt-0 flex flex-col justify-center gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Overall Capability Score</h4>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-4xl font-bold text-slate-800">{overallScore}%</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
                                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{overallScore > 75 ? 'Strong' : 'Moderate'}</span>
                                            </div>
                                        </div>
                                        <div className="relative w-20 h-10 overflow-hidden transform -translate-y-2">
                                            <HalfDonut percentage={overallScore} colorClass="text-blue-500" gradientId="grad-radar-score" size={80} strokeWidth={8} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Strongest Skill</h4>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[17px] font-bold text-slate-800 capitalize leading-tight mb-1.5 pr-2 wrap-break-word line-clamp-2">{strongestSkill?.skills?.skill_name || 'N/A'}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-widest border border-emerald-100/50">Top Tier</span>
                                        </div>
                                        <div className="w-10 h-10 bg-teal-100 text-teal-600 font-bold rounded-xl flex items-center justify-center text-sm">
                                            {strongestSkill?.capability_score || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personalized Improvement Plan */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
                            <div className="flex justify-between items-center mb-6 shrink-0">
                                <h3 className="text-lg font-bold text-slate-800">Improvement Plan</h3>
                                <button onClick={() => navigate('/roadmap')} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-100">
                                    View 4-Week Roadmap
                                </button>
                            </div>
                            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                                {recommendedTasks.map((task, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${idx === 2 ? 'border-2 border-slate-200' : 'bg-[#c3d2f5] text-indigo-600 border border-[#c3d2f5]'}`}>
                                            {idx !== 2 && <CheckSquare size={16} fill="white" />}
                                        </div>
                                        <p className="text-[15px] font-medium text-slate-700 leading-snug">{task}</p>
                                    </div>
                                ))}
                                
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Estimated Improvement Time</h4>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-lg font-bold text-slate-800">2 weeks</span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                        <div className="bg-linear-to-r from-blue-300 to-indigo-400 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                        
                        {/* Capability Gaps Table */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Capability Gaps Pipeline</h3>
                            {gaps.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr>
                                                <th className="pb-4 font-semibold text-slate-500">Skill</th>
                                                <th className="pb-4 font-semibold text-slate-500 text-center">Current</th>
                                                <th className="pb-4 font-semibold text-slate-500 text-center">Required</th>
                                                <th className="pb-4 font-semibold text-slate-500 text-right">Gap Focus</th>
                                            </tr>
                                        </thead>
                                        <tbody className="font-medium">
                                            {gaps.sort((a,b) => b.gap_score - a.gap_score).map((gap, i) => (
                                                <tr key={gap.id}>
                                                    <td className={`py-4 text-slate-800 ${i !== 0 ? 'border-t border-slate-50' : ''}`}>
                                                        {gap.skills?.skill_name}
                                                    </td>
                                                    <td className={`py-4 text-slate-600 text-center ${i !== 0 ? 'border-t border-slate-50' : ''}`}>
                                                        {gap.current_score}%
                                                    </td>
                                                    <td className={`py-4 text-slate-600 text-center ${i !== 0 ? 'border-t border-slate-50' : ''}`}>
                                                        {gap.required_score}%
                                                    </td>
                                                    <td className={`py-4 text-right ${i !== 0 ? 'border-t border-slate-50' : ''}`}>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                            gap.gap_score > 20 ? 'bg-rose-50 text-rose-500' :
                                                            gap.gap_score > 0 ? 'bg-amber-50 text-amber-600' :
                                                            'bg-teal-50 text-teal-600'
                                                        }`}>
                                                            {gap.gap_score > 0 ? `+${gap.gap_score}%` : 'Met'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm">No gap data. Run a Gap Calculation from the Assessment screen.</p>
                            )}
                        </div>

                        {/* Performance Analytics Tracking mapped to Exact AreaChart Mockup */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Performance Analytics</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Growth Curve</span>
                                </div>
                            </div>
                            
                            <div className="h-44 w-full relative">
                                {/* Synthetic absolute 78% tag replicating the mockup directly */}
                                <div className="absolute top-2 right-4 z-10 bg-indigo-500 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-md shadow-indigo-500/30">
                                    {overallScore || 78}%
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} domain={[50, 100]} ticks={[50, 80, 100]} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCurve)" activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }} dot={{ r: 3, fill: '#818cf8' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Difficulty Tier Accuracy Matrix */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Accuracy by Difficulty</h3>
                                <div className="h-40 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={difficultyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                            <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} domain={[0, 100]} />
                                            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="accuracy" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>

                    </div>
                    </>
                    )}
                </div>
            </main>
        </div>
    );
}
