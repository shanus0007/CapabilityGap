import React from 'react'
import { Target } from 'lucide-react'

const Process = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1100px] mx-auto px-6 py-12">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-[11px] font-bold tracking-widest text-[#2563eb] uppercase bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full inline-block">Adaptive Intelligence</span>
                    <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
                        Assess perfectly. Grow flawlessly.
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Unify your skill assessments and AI roadmap generation to confidently bridge your capability gaps.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full mt-4">

                    {/* Card 1: Unified Metrics */}
                    <div className="bg-white rounded-[24px] p-2.5 sm:p-3 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col group overflow-hidden">
                        <div className="bg-[#f8fafc] rounded-[16px] h-[260px] w-full relative overflow-hidden flex flex-col items-center justify-end px-6 pt-10 border border-slate-100">
                            {/* Inner App Window UI */}
                            <div className="w-full bg-white rounded-t-xl shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-x border-t border-slate-100 p-5 transform translate-y-3 group-hover:translate-y-1 transition-transform duration-500 ease-out">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Overall Score</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[26px] font-black tracking-tight text-slate-900 leading-none">82%</span>
                                            <span className="bg-emerald-100 text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded-full">+12%</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Roles Tracked</p>
                                        <span className="text-[22px] font-black tracking-tight text-slate-900 leading-none">3</span>
                                    </div>
                                </div>
                                {/* Abstract Line Chart */}
                                <div className="relative h-[90px] w-full flex items-end mt-2">
                                    <div className="absolute inset-0 flex flex-col justify-between pt-1">
                                        <div className="w-full border-t border-slate-100 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2 w-6">100%</span></div>
                                        <div className="w-full border-t border-slate-100 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2 w-6">75%</span></div>
                                        <div className="w-full border-t border-slate-100 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2 w-6">50%</span></div>
                                        <div className="w-full border-t border-slate-100 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2 w-6">25%</span></div>
                                    </div>
                                    <svg className="absolute left-[28px] right-0 bottom-0 h-full w-[calc(100%-28px)] overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <path d="M 0 40 L 15 40 L 25 25 L 40 25 L 45 15 L 50 20 L 70 0" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
                                        <circle cx="70" cy="0" r="2.5" fill="#3b82f6" className="group-hover:animate-ping opacity-80" />
                                        <circle cx="70" cy="0" r="2.5" fill="#3b82f6" />
                                        <line x1="70" y1="0" x2="85" y2="-15" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 2" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <path d="M 85 -15 L 95 -15 L 90 -20 M 95 -15 L 90 -10" fill="none" stroke="#2563eb" strokeWidth="1.5" className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 pb-4 px-3">
                            <h3 className="text-[19px] font-bold text-slate-900 mb-2 tracking-tight">Unified Capability View</h3>
                            <p className="text-slate-500 font-medium text-[14px] leading-relaxed">See your overall readiness score and tracked target roles in one clean, unified dashboard.</p>
                        </div>
                    </div>

                    {/* Card 2: AI Growth Insights */}
                    <div className="bg-white rounded-[24px] p-2.5 sm:p-3 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col group overflow-hidden">
                        <div className="bg-[#f8fafc] rounded-[16px] h-[260px] w-full relative overflow-hidden flex items-center justify-center border border-slate-100">

                            {/* Subtle background lines/grid */}
                            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L0 0L0 40' fill='none' stroke='%23f1f5f9' stroke-width='1.5'/%3E%3C/svg%3E")` }}></div>

                            {/* Top Abstract Connector */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[40px] border-b border-x border-slate-200/60 rounded-b-xl"></div>
                            <div className="absolute top-[38px] left-1/2 -translate-x-[80px] w-1 h-3 bg-blue-500 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <div className="absolute top-[38px] left-1/2 translate-x-[80px] w-1 h-3 bg-blue-500 -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                            {/* Central glowing star wrapper */}
                            <div className="relative z-10 w-[90px] h-[90px] bg-white rounded-full shadow-[0_15px_40px_rgba(59,130,246,0.15)] flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                                {/* Pure CSS 4-point star SVG */}
                                <svg viewBox="0 0 24 24" className="w-[48px] h-[48px] text-blue-500 fill-current group-hover:rotate-90 transition-transform duration-[1.5s] ease-in-out">
                                    <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                                </svg>
                                {/* Subtle inner glow */}
                                <div className="absolute inset-0 bg-blue-400 rounded-full blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            </div>

                            {/* Floating Pills */}
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                <div className="absolute top-[30%] right-[10%] bg-white px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 text-[10px] font-bold text-slate-600 rotate-6 transform group-hover:rotate-2 group-hover:-translate-y-2 transition-all duration-700 delay-75">Master Systems Design</div>
                                <div className="absolute top-[45%] left-[10%] bg-blue-50 px-3 py-1.5 rounded-full shadow-sm border border-blue-100 text-[10px] font-bold text-blue-600 -rotate-4 transform group-hover:-translate-y-1 group-hover:-rotate-1 transition-all duration-700">Learn Next.js Framework</div>
                                <div className="absolute top-[35%] left-[2%] bg-white px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 text-[10px] font-bold text-slate-600 -rotate-6 transform group-hover:translate-x-1 transition-all duration-700 delay-100">Upgrade React Skills</div>
                                <div className="absolute bottom-[20%] left-[6%] bg-white px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 text-[10px] font-bold text-slate-600 rotate-4 transform group-hover:-translate-y-1 transition-all duration-700">Complete CS Course</div>
                                <div className="absolute bottom-[22%] left-[45%] bg-white px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 text-[10px] font-bold text-slate-600 -rotate-2 transform group-hover:translate-y-1 transition-all duration-700 delay-100">Build Database Projects</div>
                                <div className="absolute bottom-[28%] right-[2%] bg-white px-3 py-1.5 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 text-[10px] font-bold text-slate-600 rotate-10 transform group-hover:rotate-14 transition-all duration-700">Practice Algorithms</div>
                            </div>
                        </div>
                        <div className="pt-6 pb-4 px-3">
                            <h3 className="text-[19px] font-bold text-slate-900 mb-2 tracking-tight">AI Gap Intelligence</h3>
                            <p className="text-slate-500 font-medium text-[14px] leading-relaxed">Actionable roadmap suggestions parsed directly from your capability data via Gemini AI.</p>
                        </div>
                    </div>

                    {/* Card 3: Product Usage Tracking */}
                    <div className="bg-white rounded-[24px] p-2.5 sm:p-3 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col group overflow-hidden">
                        <div className="bg-[#f8fafc] rounded-[16px] h-[260px] w-full relative overflow-hidden flex flex-col items-center justify-center gap-[14px] border border-slate-100">

                            {/* Stripe Integration Item */}
                            <div className="w-[280px] bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transform group-hover:-translate-y-1.5 transition-transform duration-500 ease-out">
                                <div className="w-11 h-11 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0 text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                                    <span className="text-[18px] font-black tracking-tighter">JS</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-bold text-slate-800">JavaScript Concepts</span>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full tracking-wide">85% SCORE</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 rounded-full w-[85%]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Gumroad Integration Item */}
                            <div className="w-[280px] bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transform group-hover:translate-x-3 transition-transform duration-500 delay-75 ease-out">
                                <div className="w-11 h-11 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 text-cyan-600 group-hover:bg-cyan-100 transition-colors">
                                    <span className="text-[20px] font-black">R</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-bold text-slate-800">React Architecture</span>
                                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full tracking-wide">42% GAP</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-200 rounded-full w-[42%]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Paddle Integration Item */}
                            <div className="w-[280px] bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transform -translate-x-2 group-hover:translate-x-0 group-hover:-translate-y-0.5 transition-transform duration-500 delay-150 ease-out">
                                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <span className="text-[16px] font-black">DB</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[14px] font-bold text-slate-800">PostgreSQL Design</span>
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full tracking-wide">90% SCORE</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 rounded-full w-[90%]"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="pt-6 pb-4 px-3">
                            <h3 className="text-[19px] font-bold text-slate-900 mb-2 tracking-tight">Skill Proficiency Mapping</h3>
                            <p className="text-slate-500 font-medium text-[14px] leading-relaxed">Track exactly where your skills stand against strict industry capability requirements in real-time.</p>
                        </div>
                    </div>

                    {/* Card 4: Feature Impact Analysis */}
                    <div className="bg-white rounded-[24px] p-2.5 sm:p-3 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col group overflow-hidden">
                        <div className="bg-[#f8fafc] rounded-[16px] h-[260px] w-full relative overflow-hidden flex items-center justify-center border border-slate-100">

                            {/* Graphic background lines */}
                            <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#f1f5f9] opacity-50"></div>

                            {/* Main embedded UI Chart */}
                            <div className="relative z-10 w-[240px] bg-white rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.05)] border border-slate-100 p-4 transform group-hover:scale-105 transition-transform duration-600 ease-out">
                                <div className="flex justify-between items-center mb-5">
                                    <span className="text-[14px] font-bold text-slate-800 text-center flex-1">Role Readiness</span>
                                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 absolute right-4">30 days ∨</span>
                                </div>

                                <div className="relative h-[110px] w-full flex items-end">
                                    {/* Y Axis Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pt-1 pb-1">
                                        <div className="w-full border-t border-slate-50 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2">50%</span></div>
                                        <div className="w-full border-t border-slate-50 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2">40%</span></div>
                                        <div className="w-full border-t border-slate-50 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2">30%</span></div>
                                        <div className="w-full border-t border-slate-50 flex items-start"><span className="text-[8px] text-slate-300 font-bold -mt-1.5 mr-2">20%</span></div>
                                    </div>

                                    {/* Curved Dual Area Chart */}
                                    <svg className="absolute left-[20px] right-0 bottom-0 h-full w-[calc(100%-20px)] overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="grad4" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M 0 40 C 10 40, 20 10, 35 10 C 45 10, 50 35, 60 35 C 70 35, 75 15, 85 15 C 90 15, 95 28, 100 20 L 100 40 L 0 40 Z" fill="url(#grad4)" />
                                        <path d="M 0 40 C 10 40, 20 10, 35 10 C 45 10, 50 35, 60 35 C 70 35, 75 15, 85 15 C 90 15, 95 28, 100 20" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Floating User Notifications */}
                            <div className="absolute z-20 top-[15%] left-[8%] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-2.5 -rotate-6 transform group-hover:-rotate-2 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-500 delay-50">
                                <div className="w-[18px] h-[18px] rounded-full bg-slate-200 overflow-hidden relative shadow-inner">
                                    <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-800">React Roadmap Completed</span>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></div>
                            </div>

                            <div className="absolute z-20 bottom-[18%] right-[5%] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-2.5 rotate-[4deg] transform group-hover:rotate-[8deg] group-hover:-translate-y-2 group-hover:translate-x-1 transition-transform duration-500 delay-100">
                                <div className="w-[18px] h-[18px] rounded-full bg-emerald-100 overflow-hidden relative shadow-inner">
                                    <img src="https://i.pravatar.cc/100?img=9" alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-800">Senior Role Unlocked</span>
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                            </div>

                        </div>
                        <div className="pt-6 pb-4 px-3">
                            <h3 className="text-[19px] font-bold text-slate-900 mb-2 tracking-tight">Career Progression Analysis</h3>
                            <p className="text-slate-500 font-medium text-[14px] leading-relaxed">Know exactly which skills drive your career growth—and which ones you need to focus on next.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Process
