import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import { 
    LayoutDashboard, CheckSquare, Target, 
    MapPin, BarChart3, LogOut, Trees
} from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0">
            <div>
                <div className="p-6 flex items-center gap-2 cursor-pointer no-underline mb-2" onClick={() => navigate('/')}>
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
                    
                    <button onClick={() => navigate('/roadmap')} 
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl relative transition-colors ${isActive('/roadmap') ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                        {isActive('/roadmap') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></div>}
                        <MapPin size={18} />
                        Learning Roadmap
                    </button>
                </div>
            </div>

            <div className="px-4 pb-6 space-y-1 text-sm font-medium">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
