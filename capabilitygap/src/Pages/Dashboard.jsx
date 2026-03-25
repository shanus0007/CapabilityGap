import React from 'react';
import { supabase } from '../supabase';
import { 
    Search, Bell, Inbox, User, LogOut, 
    LayoutDashboard, CheckSquare, Target, 
    MapPin, BarChart3, Settings, ShieldAlert
} from 'lucide-react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

// Data for Radar Chart
const radarData = [
    { subject: 'Data Structures', A: 70, fullMark: 100 },
    { subject: 'DBMS', A: 64, fullMark: 100 },
    { subject: 'Aptitude', A: 84, fullMark: 100 },
    { subject: 'Algorithms', A: 45, fullMark: 100 },
];

// Data for Area Chart
const areaData = [
    { name: 'Apr 13', score: 52 },
    { name: 'Apr 14', score: 60 },
    { name: 'Apr 15', score: 68 },
    { name: 'Apr 16', score: 65 },
    { name: 'Apr 19', score: 78 },
];

// Simple SVG Half Donut Component for metrics
const HalfDonut = ({ percentage, colorClass, gradientId, strokeWidth = 12, size = 120 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size / 2 + strokeWidth} className="overflow-visible">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="50%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <linearGradient id={`${gradientId}-blue`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
            </defs>
            {/* Background Arch */}
            <path
                d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            {/* Progress Arch */}
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
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (!session) return null;
    const user = session.user;
    const name = user.user_metadata?.full_name || 'User';

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
            {/* ---------------- SIDEBAR ---------------- */}
            <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between shrink-0">
                <div>
                    {/* Logo Section */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Target size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-900 leading-tight tracking-tight">Capability Gap</h1>
                            <p className="text-xs text-slate-500 font-medium">Intelligence System</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="px-4 py-4 space-y-1 text-sm font-medium">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50/50 text-indigo-600 rounded-2xl relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-colors">
                            <CheckSquare size={18} />
                            Take Assessment
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-colors">
                            <BarChart3 size={18} />
                            Skill Analysis
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-colors">
                            <MapPin size={18} />
                            Learning Roadmap
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-colors">
                            <Target size={18} />
                            Performance Analytics
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-colors">
                            <User size={18} />
                            Profile
                        </a>
                    </div>
                </div>

                {/* Bottom Links */}
                <div className="px-4 pb-6 space-y-1 text-sm font-medium">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-colors">
                        <Settings size={18} />
                        Settings
                    </a>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ---------------- MAIN CONTENT ---------------- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-[#F8FAFC] flex flex-col md:flex-row items-center justify-between px-8 border-b border-transparent shrink-0">
                    {/* Search Bar */}
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

                    {/* Right Tools */}
                    <div className="flex items-center gap-6 ml-auto mt-4 md:mt-0">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 border border-white rounded-full"></span>
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <Inbox size={20} />
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200">
                            <div className="w-9 h-9 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 text-sm">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Box 1: Overall Score */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-1">Overall Capability Score</h3>
                                <p className="text-4xl font-bold text-slate-800">72%</p>
                            </div>
                            <div className="relative transform translate-y-3">
                                <HalfDonut percentage={72} colorClass="text-purple-500" gradientId="grad-overall" size={100} strokeWidth={10} />
                            </div>
                        </div>

                        {/* Box 2: Role Readiness */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 mb-1">Role Readiness Score</h3>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-bold text-slate-800">58%</p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average</span>
                                </div>
                            </div>
                            <div className="relative transform translate-y-3 flex flex-col items-center">
                                <HalfDonut percentage={58} colorClass="text-blue-500" gradientId="grad-role" size={90} strokeWidth={8} />
                                <span className="absolute bottom-0 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Moderate</span>
                            </div>
                        </div>

                        {/* Box 3: Weakest Skill */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-center">
                            {/* Decorative blur blob */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-linear-to-br from-amber-200/40 to-rose-200/40 blur-2xl rounded-full"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldAlert size={16} className="text-amber-500" />
                                    <h3 className="text-sm font-semibold text-slate-500">Weakest Skill</h3>
                                </div>
                                <p className="text-2xl font-bold text-slate-800 mb-1">Algorithms</p>
                                <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                    Needs action
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        
                        {/* Capability Overview Card (Spans 2 cols) */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row">
                            <div className="flex-1 md:pr-6 md:border-r border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800 mb-1">Capability Overview</h3>
                                <p className="text-sm font-medium text-slate-400 mb-6">Track your skills, identify gaps, and improve with a structured roadmap.</p>
                                
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                            <PolarGrid stroke="#f1f5f9" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                            <Radar name="User" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorUv)" fillOpacity={0.6} />
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

                            {/* Right side of Overview */}
                            <div className="md:w-64 md:pl-8 pt-6 md:pt-0 flex flex-col justify-center gap-8">
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Overall Capability Score</h4>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-3xl font-bold text-slate-800 mb-1">72%</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-slate-500">Weak</span>
                                                <div className="w-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="w-2/3 h-full bg-indigo-500 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative transform translate-y-2 translate-x-1">
                                            <HalfDonut percentage={72} colorClass="text-blue-500" gradientId="grad-small-1" size={80} strokeWidth={6} />
                                            <span className="absolute bottom-0 text-[10px] font-bold text-blue-500 right-0 transform translate-x-2 bg-white px-1">Moderate</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Strongest Skill</h4>
                                    <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm mb-1">Communication</p>
                                            <span className="text-[10px] font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full uppercase">Top 4%</span>
                                        </div>
                                        <div className="w-10 h-10 bg-teal-100 text-teal-600 font-bold rounded-xl flex items-center justify-center text-sm">
                                            82
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personalized Improvement Plan */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Personalized Improvement Plan</h3>
                            
                            <div className="space-y-4 flex-1">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border border-indigo-200 bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-indigo-200">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Practice 15 Algorithm problems</span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border border-indigo-200 bg-indigo-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-indigo-200">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Complete DBMS revision module</span>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border-2 border-slate-200 bg-transparent flex items-center justify-center shrink-0 mt-0.5 group-hover:border-indigo-300 transition-colors"></div>
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Take a timed mock test</span>
                                </label>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 mb-1">Estimated Improvement Time</p>
                                <p className="text-sm font-bold text-slate-800 mb-3">2 weeks</p>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-linear-to-r from-indigo-300 to-blue-400 w-1/3 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                        
                        {/* Your Capability Gaps */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Your Capability Gaps</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr>
                                            <th className="pb-4 font-semibold text-slate-500 w-1/3">Skill</th>
                                            <th className="pb-4 font-semibold text-slate-500 text-center">Current Level</th>
                                            <th className="pb-4 font-semibold text-slate-500 text-center">Required Level</th>
                                            <th className="pb-4 font-semibold text-slate-500 text-right">Gap</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-medium">
                                        <tr>
                                            <td className="py-4 text-slate-800">Data Structures</td>
                                            <td className="py-4 text-slate-600 text-center">70%</td>
                                            <td className="py-4 text-slate-600 text-center">80%</td>
                                            <td className="py-4 text-right">
                                                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold">10%</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 text-slate-800 border-t border-slate-50">Algorithms</td>
                                            <td className="py-4 text-slate-600 text-center border-t border-slate-50">45%</td>
                                            <td className="py-4 text-slate-600 text-center border-t border-slate-50">75%</td>
                                            <td className="py-4 text-right border-t border-slate-50">
                                                <span className="inline-block px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-xs font-bold">30%</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 text-slate-800 border-t border-slate-50">DBMS</td>
                                            <td className="py-4 text-slate-600 text-center border-t border-slate-50">64%</td>
                                            <td className="py-4 text-slate-600 text-center border-t border-slate-50">75%</td>
                                            <td className="py-4 text-right border-t border-slate-50">
                                                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">11%</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Performance Analytics */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Analytics</h3>
                            <div className="flex-1 w-full relative min-h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={areaData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4}/>
                                                <stop offset="100%" stopColor="#f472b6" stopOpacity={0.4}/>
                                            </linearGradient>
                                            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#818cf8" />
                                                <stop offset="100%" stopColor="#c084fc" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} domain={[40, 100]} ticks={[50, 80, 100]} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 600, fontSize: '12px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="url(#lineGrad)" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorScore)" 
                                            activeDot={{ r: 6, fill: '#c084fc', stroke: 'white', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                                
                                {/* 78% Custom tooltip overlay for the image's specific visual */}
                                <div className="absolute right-[8%] top-[10%] bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transform shadow-indigo-500/30">
                                    78%
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
