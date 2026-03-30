import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, FileText, Target, Activity, Zap, CheckCircle2, FlaskConical, Code2, Globe, Cpu } from 'lucide-react';

const ResumeAnalysisSection = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-white py-32 overflow-hidden relative font-sans">

            {/* ─── BACKGROUND LAYERS ────────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 1. Subtle Radial Gradients */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/40 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/30 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                {/* 2. Particle Field (Pure CSS) */}
                <div className="absolute inset-0 opacity-[0.2]" style={{
                    backgroundImage: `radial-gradient(#3b82f6 0.5px, transparent 0.5px)`,
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">

                {/* ─── HEADER ─────────────────────────────────────────────── */}
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100/50 px-4 py-2 rounded-full mb-8 shadow-xs"
                    >
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <Sparkles size={10} className="text-white fill-white" />
                        </div>
                        <span className="text-[11px] font-black text-blue-700 uppercase tracking-[0.2em]">Next-Gen Intelligence</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[0.95] mb-8"
                    >
                        Benchmark your <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-Queensila">potential</span> against the best.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-l text-slate-500 font-medium leading-relaxed"
                    >
                        Our dual-engine AI scans your resume and target role simultaneously, constructing a high-fidelity capability blueprint that exposes every hidden growth opportunity.
                    </motion.p>
                </div>

                {/* ─── MAIN BLUEPRINT CONTAINER ──────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/40 backdrop-blur-xl rounded-[64px] p-4 md:p-12 border border-slate-200/50 relative min-h-[600px] flex items-center justify-center shadow-[0_40px_100px_rgba(0,0,0,0.03)]"
                >
                    {/* Inner Content Area */}
                    <div className="bg-[#f8fafc]/80 rounded-[48px] border border-white/80 w-full h-full min-h-[500px] relative overflow-hidden flex items-center justify-center">

                        {/* Blueprint Background Line Logic */}
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>

                        {/* ─── DYNAMIC NODE MAP ────────────────────────────────────── */}
                        <div className="relative w-full max-w-4xl mx-auto h-[450px]">

                            {/* SVG CONNECTIONS (Motion-Ready) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 800 450">
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d="M400 40 L400 120" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"
                                />
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                                    d="M400 180 L400 280" stroke="#3b82f6" strokeWidth="2.5"
                                />
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
                                    d="M400 140 C250 140, 180 140, 180 220" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="6 6"
                                />
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    whileInView={{ pathLength: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 1.2 }}
                                    d="M400 160 C550 160, 620 160, 620 220" stroke="#3b82f6" strokeWidth="2.5"
                                />
                            </svg>

                            {/* ─── NODES ─────────────────────────────────────────────── */}

                            {/* 1. Input Node */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-inner">
                                        <FileText size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[13px] font-black text-slate-800 leading-none mb-1">Career_Resume.pdf</p>
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Secure Input Verified</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 2. Core Engine Node */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                                className="absolute top-[120px] left-1/2 -translate-x-1/2 z-30 group"
                            >
                                <div className="relative">
                                    {/* Animated Glow Halo */}
                                    <div className="absolute -inset-4 bg-blue-500/20 rounded-[32px] blur-[20px] group-hover:bg-blue-500/30 transition-all duration-700 animate-pulse"></div>

                                    <div className="relative bg-white p-7 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-blue-100 min-w-[260px] cursor-default">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Dual-Core</span>
                                            </div>
                                            <Cpu size={14} className="text-slate-300" />
                                        </div>

                                        <h4 className="text-[20px] font-black text-slate-900 mb-2 leading-none">Gap Mapping Engine</h4>
                                        <div className="space-y-1.5 mb-5">
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: "85%" }}
                                                    transition={{ duration: 2, delay: 1 }}
                                                    className="h-full bg-blue-500 rounded-full"
                                                />
                                            </div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Analyzing Requirement Nodes</p>
                                        </div>

                                        <div className="flex gap-2">
                                            {[
                                                { icon: <Code2 size={12} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                                                { icon: <Globe size={12} />, color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
                                                { icon: <CheckCircle2 size={12} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                                            ].map((node, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ y: -3 }}
                                                    className={`${node.color} w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm transition-transform`}
                                                >
                                                    {node.icon}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 3. Deficiency Node (Left) */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                animate={{ y: [0, 8, 0] }}
                                transition={{
                                    x: { duration: 0.8, delay: 0.8 },
                                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute top-[220px] left-[20px] md:left-[80px] z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl shadow-rose-200/20 border border-slate-100 min-w-[200px] -rotate-2 hover:rotate-0 transition-all duration-500">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                                            <Zap size={16} fill="currentColor" />
                                        </div>
                                        <h5 className="text-[14px] font-black text-slate-800 leading-none">Critical Deficits</h5>
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                            <span className="text-[11px] font-bold text-slate-600">System Design</span>
                                            <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">-22%</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                                            <span className="text-[11px] font-bold text-slate-600">Algorithm</span>
                                            <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">-12%</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* 4. Mastery Node (Right) */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    x: { duration: 0.8, delay: 1 },
                                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute top-[240px] right-[20px] md:right-[80px] z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-50 min-w-[220px] rotate-2  hover:rotate-0 transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <h5 className="text-[15px] font-black text-slate-800 leading-none mb-1">Market Ready</h5>
                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified Assets</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['React Framework', 'SQL Design', 'AWS S3'].map((item, i) => (
                                            <span key={i} className="text-[10px] font-bold bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100/50 shadow-xs">{item}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* 5. Final Conversion Node (Bottom) */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 1.5 }}
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm"
                            >
                                <button
                                    onClick={() => navigate('/resume-analysis')}
                                    className="w-full bg-slate-900 group/btn text-white p-2 rounded-[32px] shadow-2xl hover:bg-black transition-all duration-500 relative overflow-hidden active:scale-95"
                                >
                                    <div className="relative z-10 bg-white/5 border border-white/10 rounded-[24px] p-5 flex items-center gap-6">
                                        <div className="flex -space-x-3">
                                            <img src="https://i.pravatar.cc/100?img=4" className="w-10 h-10 rounded-full border-2 border-slate-900 ring-2 ring-emerald-500/30" />
                                            <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-slate-900 ring-2 ring-blue-500/30" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-[14px] font-black leading-none mb-1 text-white">Unlock Growth Roadmap</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Deploy Our AI Analysis</span>
                                                <ArrowRight size={14} className="text-blue-400 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Button Hover Glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 blur-[60px] opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                                </button>
                            </motion.div>

                        </div>

                        {/* Floating Decorative Elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute top-12 left-12 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm hidden lg:block"
                        >
                            <FlaskConical size={18} className="text-indigo-400 mb-2" />
                            <p className="text-[10px] font-black text-slate-800 leading-tight">Industry Benchmarks<br /><span className="text-slate-400">Refreshed Hourly</span></p>
                        </motion.div>

                    </div>
                </motion.div>

                {/* Counter Metrics (Social Proof Feel) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-4xl mx-auto">
                    {[
                        { label: 'Resumes Parsed', val: '10+' },
                        { label: 'Role Accuracy', val: '98.8%' },
                        { label: 'Avg Gap Detection', val: '14' },
                        { label: 'Growth Speedup', val: '3x' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group">
                            <p className="text-3xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{stat.val}</p>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ResumeAnalysisSection;
