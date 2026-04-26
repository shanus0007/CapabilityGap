import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Camera, Save,
    ChevronLeft, Loader2, CheckCircle2, AlertCircle, X,
    Trophy, Star, Zap, Award, TrendingUp, Target, Coins, ArrowRight
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';

export default function Profile({ session }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    
    // Gamification stats
    const [stats, setStats] = useState({
        level: 4,
        xp: 2450,
        nextLevelXp: 3000,
        rank: 'Capability Apprentice',
        totalAssessments: 0,
        badges: [
            { id: 1, icon: <Zap size={20} />, name: 'Fast Learner', color: 'bg-amber-400' },
            { id: 2, icon: <Trophy size={20} />, name: 'Top 10%', color: 'bg-indigo-400' },
            { id: 3, icon: <Star size={20} />, name: 'Consistent', color: 'bg-emerald-400' },
        ]
    });

    const avatars = [
        `https://i.ibb.co/0VBrM4Wy/ab543df39527c537ec9586ded51db755.jpg`,
        `https://i.ibb.co/VWRh722z/9b7d0c6863133ce7adb1944aef304db0.jpg`,
        `https://i.ibb.co/7tHHJ1w8/3abb408279ad7288462ada2e213b2e49.jpg`,
        `https://i.ibb.co/nsWKCvGK/7d8cf8662ebf3817021569d2c67dfcf3.jpg`,
        `https://i.ibb.co/k6WrkL28/be04b3bb94dbc04559c21bc550e154dc.jpg`,
        `https://i.ibb.co/xtxhLv91/23d94796ec3b8905eea32d0d3cee159e.jpg`,
        `https://i.ibb.co/0yQZ1Nct/fccf996f13c5752df6b32ae216471dd3.jpg`,
        `https://i.ibb.co/2Ym3rpTv/e8937669b6d05bac87e40d7b4da855d2.jpg`
    ];

    const [fullName, setFullName] = useState(session?.user?.user_metadata?.full_name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState(session?.user?.user_metadata?.avatar_url || '');

    useEffect(() => {
        if (!session) { navigate('/login'); return; }
        const fetchStats = async () => {
            const { count } = await supabase.from('attempts').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
            setStats(prev => ({ ...prev, totalAssessments: count || 0 }));
        };
        fetchStats();
    }, [session, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                data: { full_name: fullName, avatar_url: avatarUrl }
            });
            if (updateError) throw updateError;
            if (email !== session.user.email) {
                await supabase.auth.updateUser({ email });
                setMessage({ type: 'success', text: 'Profile updated! Confirmation sent to new email.' });
            } else {
                setMessage({ type: 'success', text: 'Identity saved successfully!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async (event) => {
        try {
            setLoading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileName = `${session.user.id}-${Math.random()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('avatars').upload(fileName, file);
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
            setAvatarUrl(publicUrl);
            setShowAvatarPicker(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;
    const xpPercentage = (stats.xp / stats.nextLevelXp) * 100;
    const userCredits = session?.user?.user_metadata?.credits || 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
            <Sidebar session={session} />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
                <div className="max-w-6xl mx-auto pb-12 space-y-8">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/dashboard')} className="p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                                <ChevronLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Center</h1>
                                <p className="text-slate-500 font-medium text-sm">Level up your professional profile.</p>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-3xl flex items-center gap-3 border animate-in slide-in-from-top-4 duration-300 ${
                            message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <p className="text-sm font-bold">{message.text}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT: PLAYER CARD & COINS */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* Hero Card */}
                            <div className="bg-white rounded-[48px] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-br from-indigo-500 to-indigo-700 -z-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"></div>
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-slate-50 relative group/avatar">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-200 capitalize">{fullName[0] || '?'}</div>
                                            )}
                                        </div>
                                        <button onClick={() => setShowAvatarPicker(true)} className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition-all">
                                            <Camera size={18} />
                                        </button>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-900 leading-none">{fullName || 'Unnamed Player'}</h2>
                                    <div className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100">
                                        {stats.rank}
                                    </div>

                                    <div className="w-full mt-8 space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Zap size={14} className="text-amber-400 fill-amber-400" /> Level {stats.level}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-900">{stats.xp} / {stats.nextLevelXp} XP</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                            <div className="h-full bg-linear-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${xpPercentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COIN CARD (Prominent) */}
                            <div className="bg-linear-to-br from-slate-900 to-black rounded-[48px] p-8 text-white relative overflow-hidden shadow-2xl group border border-white/5">
                                <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Coins size={150} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Treasury</p>
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-5xl font-black">{userCredits}</h3>
                                        <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                                            <Coins size={28} />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 mt-4">Capability Credits</p>
                                    
                                    <button 
                                        onClick={() => navigate('/buy-credits')}
                                        className="mt-8 w-full bg-white/10 hover:bg-white/20 border border-white/10 py-4 rounded-3xl text-sm font-black flex items-center justify-center gap-2 transition-all group/btn"
                                    >
                                        Buy More Credits <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Badges Collection */}
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Award size={18} className="text-indigo-500" /> Achievements
                                </h3>
                                <div className="flex gap-4">
                                    {stats.badges.map(badge => (
                                        <div key={badge.id} className="group relative">
                                            <div className={`w-14 h-14 ${badge.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 cursor-pointer`}>
                                                {badge.icon}
                                            </div>
                                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none z-50">
                                                {badge.name}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                        <Star size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: IDENTITY SETTINGS */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-sm h-full">
                                <h3 className="text-xl font-black text-slate-900 mb-8">Personal Information</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Player Name</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input
                                                    type="text" required
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-12 pr-6 py-4.5 text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none transition-all"
                                                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Primary Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input
                                                    type="email" required
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-12 pr-6 py-4.5 text-slate-800 font-bold focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none transition-all"
                                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100/50 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                                            <TrendingUp size={24} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-black text-slate-900">Visibility Status: Active</p>
                                            <p className="text-[13px] text-slate-500 mt-1 font-medium leading-relaxed">Your capability blueprint is visible to premium recruitment agents. Level up to increase your visibility score.</p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit" disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[28px] font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 size={24} className="animate-spin" /> : <><Save size={20} /> Sync Identity Data</>}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Avatar Picker Modal */}
                {showAvatarPicker && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowAvatarPicker(false)}>
                        <div className="bg-white rounded-[48px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Select Persona</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">Identify your intelligence profile</p>
                                </div>
                                <button onClick={() => setShowAvatarPicker(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-4 gap-4">
                                    {avatars.map((url, idx) => (
                                        <div key={idx} onClick={() => { setAvatarUrl(url); setShowAvatarPicker(false); }}
                                            className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all hover:scale-105 ${avatarUrl === url ? 'border-indigo-600 shadow-xl' : 'border-white hover:border-slate-50'}`}>
                                            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-slate-50">
                                    <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-300 py-6 rounded-[32px] font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group">
                                        <Camera size={24} className="text-slate-400 group-hover:text-indigo-600" />
                                        <span className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-slate-900">Custom Upload</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
