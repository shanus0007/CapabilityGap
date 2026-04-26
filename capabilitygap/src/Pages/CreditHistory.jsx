import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Coins,
    Loader2,
    RefreshCw,
    CreditCard,
    AlertCircle
} from 'lucide-react';

const AppShell = ({ children, session }) => (
    <div className="h-dvh w-full bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden">
        <Sidebar session={session} />
        <main className="flex-1 overflow-hidden relative bg-slate-50">
            <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </main>
    </div>
);

const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

export default function CreditHistory({ session }) {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        setLoading(true);
        setError('');
        const { data, error: err } = await supabase
            .from('credit_transactions')
            .select('*')
            .eq('user_id', session?.user?.id)
            .order('created_at', { ascending: false });

        if (err) setError(err.message);
        else setTransactions(data || []);
        setLoading(false);
    };

    useEffect(() => {
        if (!session) { navigate('/login'); return; }
        fetchTransactions();
    }, [session]);

    const totalSpent   = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const totalEarned  = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const currentBal   = session?.user?.user_metadata?.credits ?? 1000;

    return (
        <AppShell session={session}>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Wallet</span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Credit History</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Every credit earned and spent on your account.</p>
                </div>
                <button
                    onClick={fetchTransactions}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: 'Current Balance',
                        value: currentBal,
                        icon: <Coins size={22} className="text-indigo-500" />,
                        bg: 'bg-indigo-50 border-indigo-100',
                        text: 'text-indigo-700',
                        suffix: 'credits'
                    },
                    {
                        label: 'Total Purchased',
                        value: totalEarned,
                        icon: <ArrowUpCircle size={22} className="text-emerald-500" />,
                        bg: 'bg-emerald-50 border-emerald-100',
                        text: 'text-emerald-700',
                        suffix: 'credits'
                    },
                    {
                        label: 'Total Spent',
                        value: totalSpent,
                        icon: <ArrowDownCircle size={22} className="text-rose-500" />,
                        bg: 'bg-rose-50 border-rose-100',
                        text: 'text-rose-700',
                        suffix: 'credits'
                    },
                ].map(({ label, value, icon, bg, text, suffix }) => (
                    <div key={label} className={`flex items-center gap-4 p-5 rounded-2xl border ${bg}`}>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-white">
                            {icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                            <p className={`text-2xl font-black ${text}`}>{value} <span className="text-sm font-semibold opacity-60">{suffix}</span></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table / list */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
                    <CreditCard size={18} className="text-slate-400" />
                    <h2 className="font-bold text-slate-800 text-[15px]">Transaction Log</h2>
                    {!loading && (
                        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {transactions.length} entries
                        </span>
                    )}
                </div>

                {loading && (
                    <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
                        <Loader2 size={24} className="animate-spin" />
                        <span className="text-sm font-semibold">Loading transactions...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-rose-500">
                        <AlertCircle size={36} />
                        <p className="font-semibold text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Coins size={28} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-semibold text-sm">No transactions yet.</p>
                        <p className="text-slate-400 text-xs max-w-xs text-center">
                            Your credit history will appear here once you run an assessment, resume analysis, or purchase credits.
                        </p>
                    </div>
                )}

                {!loading && !error && transactions.length > 0 && (
                    <div className="divide-y divide-slate-100">
                        {transactions.map((tx) => {
                            const isCredit = tx.type === 'credit';
                            return (
                                <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors">
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                        {isCredit
                                            ? <ArrowUpCircle size={20} className="text-emerald-500" />
                                            : <ArrowDownCircle size={20} className="text-rose-500" />
                                        }
                                    </div>

                                    {/* Description */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{tx.description}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.created_at)}</p>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right shrink-0">
                                        <p className={`text-base font-black ${isCredit ? 'text-emerald-600' : 'text-rose-500'}`}>
                                            {isCredit ? '+' : '−'}{tx.amount}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-medium">
                                            Balance: {tx.balance_after}
                                        </p>
                                    </div>

                                    {/* Type badge */}
                                    <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                        {tx.type}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
