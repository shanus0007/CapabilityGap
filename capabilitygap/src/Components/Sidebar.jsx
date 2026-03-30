import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import {
    LayoutDashboard, CheckSquare, Target, FileText,
    MapPin, BarChart3, LogOut, Trees, Menu, X, Bell, User
} from 'lucide-react';

export default function Sidebar({ session }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ---------------- MOBILE HEADER ---------------- */}
            <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-100 p-4 sticky top-0 z-40 shrink-0">
                <div className="flex items-center gap-2 cursor-pointer no-underline" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                        <Trees size={16} fill="white" />
                    </div>
                    <span className="font-bold text-lg tracking-tighter text-slate-900">CapabilityGap</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200 overflow-hidden">
                        {session?.user?.user_metadata?.avatar_url ? (
                            <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            session?.user?.user_metadata?.full_name ? session.user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'
                        )}
                    </div>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* ---------------- MOBILE DRAWER ---------------- */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={() => setMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white flex flex-col justify-between p-6 animate-in slide-in-from-right-full duration-300 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-xl tracking-tight text-slate-800">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="space-y-1 text-base font-semibold">
                                <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl relative transition-colors ${isActive('/dashboard') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <LayoutDashboard size={20} /> Dashboard
                                </button>
                                <button onClick={() => { setMobileMenuOpen(false); navigate('/assessment'); }}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl relative transition-colors ${isActive('/assessment') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <CheckSquare size={20} /> Take Assessment
                                </button>
                                <button onClick={() => { setMobileMenuOpen(false); navigate('/resume-analysis'); }}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl relative transition-colors ${isActive('/resume-analysis') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <FileText size={20} /> Resume Gap
                                </button>
                                <button onClick={() => { setMobileMenuOpen(false); navigate('/roadmap'); }}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl relative transition-colors ${isActive('/roadmap') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <MapPin size={20} /> Learning Roadmap
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl relative transition-colors ${isActive('/profile') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <User size={20} /> My Profile
                            </button>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-4 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors font-semibold">
                                <LogOut size={20} /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- DESKTOP SIDEBAR ---------------- */}
            <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0">
                <div>
                    <div className="p-6 flex items-center gap-2 cursor-pointer no-underline mb-2" onClick={() => navigate('/dashboard')}>
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                            <Trees size={20} fill="white" />
                        </div>
                        <span className="font-bold text-xl tracking-tighter text-slate-900">CapabilityGap</span>
                    </div>

                    <div className="px-4 space-y-1 text-sm font-medium">
                        <button onClick={() => navigate('/dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/dashboard') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            {isActive('/dashboard') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                            <LayoutDashboard size={18} />
                            Dashboard
                        </button>

                        <button onClick={() => navigate('/assessment')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/assessment') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            {isActive('/assessment') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                            <CheckSquare size={18} />
                            Take Assessment
                        </button>

                        <button onClick={() => navigate('/resume-analysis')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/resume-analysis') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            {isActive('/resume-analysis') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                            <FileText size={18} />
                            Resume Gap
                        </button>

                        <button onClick={() => navigate('/roadmap')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/roadmap') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            {isActive('/roadmap') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                            <MapPin size={18} />
                            Learning Roadmap
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-6 space-y-1 text-sm font-medium">
                    <button onClick={() => navigate('/profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/profile') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                        {isActive('/profile') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                        <User size={18} />
                        My Profile
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}
