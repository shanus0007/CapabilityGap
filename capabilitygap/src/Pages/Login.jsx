import React from 'react'
import { Link } from 'react-router-dom'
import { Trees } from 'lucide-react'

const Login = () => {
    return (
        <div className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 md:p-10 border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4">
                        <Trees size={24} fill="white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700">Password</label>
                            <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0">
                        Sign In
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 text-sm">
                        Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
