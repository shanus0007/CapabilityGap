import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import {
    LayoutDashboard, CheckSquare, FileText,
    MapPin, LogOut, Trees, Menu, X, User, History, CreditCard
} from 'lucide-react';


export default function Sidebar({ session }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const handleLogout = async () => { await supabase.auth.signOut(); };
    const isActive = (path) => location.pathname === path;
    const userCredits = session?.user?.user_metadata?.credits ?? 1000;



    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/assessment', icon: <CheckSquare size={18} />, label: 'Take Assessment' },
        { path: '/resume-analysis', icon: <FileText size={18} />, label: 'Resume Gap' },
        { path: '/roadmap', icon: <MapPin size={18} />, label: 'Learning Roadmap' },
        { path: '/buy-credits', icon: <CreditCard size={18} />, label: 'Buy Credits' },
    ];

    return (
        <>
            {/* ── MOBILE HEADER ──────────────────────────────────────── */}
            <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-40 shrink-0">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                        <Trees size={16} fill="white" />
                    </div>
                    <span className="font-bold text-lg tracking-tighter text-slate-900">CapabilityGap</span>
                </div>
                <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Menu size={22} />
                </button>
            </div>

            {/* ── MOBILE DRAWER ──────────────────────────────────────── */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white flex flex-col justify-between p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-bold text-xl tracking-tight text-slate-800">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full">
                                    <X size={22} />
                                </button>
                            </div>
                            <div className="space-y-1 text-base font-semibold">
                                {navItems.map(({ path, icon, label }) => (
                                    <button key={path} onClick={() => { setMobileMenuOpen(false); navigate(path); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors ${isActive(path) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                        {icon} {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/credit-history'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors ${isActive('/credit-history') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <History size={18} /> Credit History
                            </button>
                            <button onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors ${isActive('/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                                <User size={18} /> My Profile
                            </button>
                            <div className="pt-2 mt-2 border-t border-slate-100">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-semibold">
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DESKTOP SIDEBAR ────────────────────────────────────── */}
            <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col shrink-0 h-screen sticky top-0">

                {/* Logo */}
                <div className="px-5 pt-5 pb-4 flex items-center gap-2 cursor-pointer border-b border-slate-100" onClick={() => navigate('/dashboard')}>
                    <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                        <Trees size={18} fill="white" />
                    </div>
                    <span className="font-bold text-[17px] tracking-tighter text-slate-900">CapabilityGap</span>
                </div>

                {/* Nav items */}
                <div className="px-3 pt-4 space-y-0.5 text-sm font-medium flex-1">
                    {navItems.map(({ path, icon, label }) => (
                        <button key={path} onClick={() => navigate(path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive(path) ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            {isActive(path) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-indigo-500 rounded-r-full" />}
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Bottom section */}
                <div className="px-3 pb-4 space-y-0.5 text-sm font-medium">
                    <button onClick={() => navigate('/credit-history')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/credit-history') ? 'bg-indigo-50/80 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                        {isActive('/credit-history') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-indigo-500 rounded-r-full" />}
                        <History size={18} />
                        Credit History
                    </button>

                    {/* Profile Dropdown Trigger */}
                    <div className="relative mt-2 pt-2 border-t border-slate-50">
                        <button
                            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all duration-200 group"
                        >
                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm border-2 border-white shadow-sm overflow-hidden shrink-0">
                                {session?.user?.user_metadata?.avatar_url ? (
                                    <img src={session.user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    (session?.user?.user_metadata?.full_name || session?.user?.email || 'U').charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                    {session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0]}
                                </p>
                            </div>
                        </button>

                    </div>
                </div>
            </aside>
        </>
    );
}
