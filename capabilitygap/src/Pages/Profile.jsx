import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Camera, Save,
    ChevronLeft, Loader2, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';

export default function Profile({ session }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // Curated high-quality avatars (DiceBear)
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

    // Form state
    const [fullName, setFullName] = useState(session?.user?.user_metadata?.full_name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState(session?.user?.user_metadata?.avatar_url || '');

    useEffect(() => {
        if (!session) {
            navigate('/login');
        }
    }, [session, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // 1. Update full name and avatar in user_metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl
                }
            });

            if (updateError) throw updateError;

            // 2. Update email if it changed (this sends a confirmation)
            if (email !== session.user.email) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: email
                });
                if (emailError) throw emailError;
                setMessage({
                    type: 'success',
                    text: 'Profile updated! A confirmation email has been sent to your new address.'
                });
            } else {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
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

            const fileExt = file.name.split('.').pop();
            const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
            setMessage({ type: 'success', text: 'Image uploaded! Remember to save changes.' });
            setShowAvatarPicker(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-800">
            {/* ---------------- SIDEBAR ---------------- */}
            <Sidebar session={session} />

            {/* ---------------- MAIN CONTENT ---------------- */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">

                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full z-0 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-tr-full z-0 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Profile</h1>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-rose-50 border-rose-100 text-rose-700'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => setShowAvatarPicker(true)}
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md ring-1 ring-slate-100 flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-95 duration-300">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-slate-400 capitalize">
                                                {fullName.charAt(0) || email.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold uppercase tracking-wider">
                                        Change
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-300">
                                        <Camera size={16} />
                                    </div>
                                </div>
                                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Change Photo</p>
                            </div>

                            {/* Avatar Selection Modal (Popup) */}
                            {showAvatarPicker && (
                                <div 
                                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                                    onClick={() => setShowAvatarPicker(false)}
                                >
                                    <div 
                                        className="bg-white rounded-[32px] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Choice Avatar</h3>
                                                <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Select a premium persona</p>
                                            </div>
                                            <button 
                                                onClick={() => setShowAvatarPicker(false)}
                                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        
                                        <div className="p-8 bg-slate-50/50">
                                            <div className="grid grid-cols-4 gap-4 mb-8">
                                                {avatars.map((url, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setAvatarUrl(url);
                                                            setShowAvatarPicker(false);
                                                        }}
                                                        className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 active:scale-95 ${avatarUrl === url
                                                            ? 'border-indigo-600 shadow-lg shadow-indigo-600/10'
                                                            : 'border-white hover:border-slate-200'
                                                            }`}
                                                    >
                                                        <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-4 py-2">
                                                    <div className="h-px flex-1 bg-slate-200"></div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">or upload yours</span>
                                                    <div className="h-px flex-1 bg-slate-200"></div>
                                                </div>

                                                <label className="w-full bg-white border border-slate-200 hover:border-indigo-200 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                                    <Camera size={18} className="text-indigo-600" />
                                                    Upload Custom Image
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleUploadImage}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                                        <User size={14} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-800 font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 px-1">
                                        <Mail size={14} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-800 font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-indigo-50 rounded-[20px] p-6 border border-indigo-100">
                                <h3 className="text-[14px] font-bold text-indigo-900 mb-1 flex items-center gap-2">
                                    <AlertCircle size={16} /> Important Note
                                </h3>
                                <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                                    Updating your email address will require you to confirm the change by clicking the link sent to your new email before it becomes active.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Updating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Profile Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
