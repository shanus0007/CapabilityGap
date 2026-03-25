import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, EyeOff, Eye, Trees, User, Loader2 } from 'lucide-react'
import { supabase } from '../supabase'

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            // Supabase usually requires email verification if auto_confirm is off.
            // If data.session is missing, it means confirmation is required.
            if (!data.session) {
                setSuccess('Account created! Please check your email for a confirmation link to sign in.')
                setName('')
                setEmail('')
                setPassword('')
            } else {
                navigate('/dashboard')
            }
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&q=80&w=2940')` }}
        >
            <div className="absolute inset-0 bg-blue-50/20 backdrop-blur-[2px]"></div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl sm:rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-full max-w-[360px] p-5 sm:p-6 md:p-8 relative z-10 border border-white/50">
                <div className="flex flex-col items-center mb-5">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-5 border border-slate-100">
                        <UserPlus size={20} className="text-slate-800" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Create an account</h2>
                    <p className="text-slate-500 text-sm text-center px-2">
                        Get started for free to bring your words, data, and teams together.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-medium text-center leading-relaxed">
                        {success}
                    </div>
                )}

                <form className="space-y-3" onSubmit={handleSignup}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium placeholder-slate-400"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-slate-400" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium placeholder-slate-400"
                            placeholder="Email"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock size={18} className="text-slate-400" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium placeholder-slate-400"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                            {showPassword ? (
                                <Eye size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                            ) : (
                                <EyeOff size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                            )}
                        </button>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-[#1c1c1e] text-white font-medium py-3 rounded-2xl hover:bg-black transition-colors shadow-lg shadow-black/10 mt-5 pt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Creating Account...' : 'Sign up'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 border-dashed"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-4 text-slate-400 rounded-full">Or sign up with</span>
                    </div>
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <button className="flex-1 bg-white border border-slate-100 shadow-sm py-2.5 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 48 48" className="group-hover:scale-110 transition-transform">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                    </button>
                    <button className="flex-1 bg-white border border-slate-100 shadow-sm py-2.5 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" className="group-hover:scale-110 transition-transform">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </button>
                    <button className="flex-1 bg-white border border-slate-100 shadow-sm py-2.5 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition-colors group">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="black" className="group-hover:scale-110 transition-transform">
                            <path d="M17.05 15.38c-.06-.03-2.65-1.02-2.65-4.04 0-3.46 2.82-4.68 2.94-4.73-1.61-2.35-4.1-2.66-4.99-2.71-2.11-.21-4.13 1.25-5.2 1.25-1.09 0-2.75-1.2-4.52-1.16-2.3.04-4.42 1.34-5.61 3.42-2.4 4.18-.61 10.38 1.73 13.78 1.14 1.66 2.48 3.5 4.25 3.44 1.7-.06 2.36-1.1 4.41-1.1 2.04 0 2.64 1.1 4.41 1.06 1.82-.04 2.98-1.68 4.1-3.34 1.3-1.9 1.84-3.74 1.86-3.84-.04-.02-3.66-1.4-3.73-4.03zM12.03 4.22c.94-1.14 1.58-2.73 1.4-4.32-1.37.06-3.05.91-4.01 2.05-.85 1.01-1.57 2.63-1.37 4.19 1.53.12 3.04-.79 3.98-1.92z" />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-slate-600 text-sm">
                        Already have an account? <Link to="/login" className="text-slate-900 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>

            {/* Logo in top left */}
            <Link to="/" className="hidden md:flex fixed top-6 left-36 z-50 items-center gap-2 px-2 py-2 pr-6 cursor-pointer no-underline mb-0 mt-0">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                    <Trees size={20} fill="white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">CapabilityGap</span>
            </Link>
        </div>
    )
}

export default Signup

