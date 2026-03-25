import React from 'react'
import { supabase } from '../supabase'
import { LogOut, User } from 'lucide-react'

export default function Dashboard({ session }) {
    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    if (!session) return null;

    const user = session.user;
    const name = user.user_metadata?.full_name || 'User';

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-lg p-8">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700/50">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <User size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Welcome back,</h1>
                        <p className="text-3xl font-extrabold text-white">{name}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                        <p className="text-sm font-semibold text-slate-400 mb-1">User ID</p>
                        <p className="font-mono text-sm break-all text-slate-300">{user.id}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                        <p className="text-sm font-semibold text-slate-400 mb-1">Email Address</p>
                        <p className="text-sm text-slate-300">{user.email}</p>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <LogOut size={20} />
                    Secure Logout
                </button>
            </div>
        </div>
    )
}
