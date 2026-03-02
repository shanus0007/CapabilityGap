import React from 'react'
import { Link } from 'react-router-dom'
import { Trees, ArrowRight } from 'lucide-react'

const Signup = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-15 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row border border-slate-100 min-h-[600px]">
                {/* Left Side - Visual */}
                <div className="hidden md:flex flex-1 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8">
                            <Trees size={24} className="text-white" />
                            <span className="font-bold text-xl text-white tracking-tight">CapabilityGap</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
                            Start your transformation journey today.
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">1</div>
                                <span>Create your free account</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">2</div>
                                <span>Set up your organization profile</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">3</div>
                                <span>Start mapping your capabilities</span>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Get started with a 14-day free trial.</p>
                    </div>

                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Shanu"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="Sharma"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                placeholder="example@xyz.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                placeholder="Create a strong password"
                            />
                            <p className="text-xs text-slate-400 mt-1">Must be at least 8 characters.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="terms" className="rounded text-slate-900 focus:ring-slate-900" />
                            <label htmlFor="terms" className="text-sm text-slate-600">I agree to the <a href="#" className="font-bold text-slate-900 underline">Terms</a> and <a href="#" className="font-bold text-slate-900 underline">Privacy Policy</a></label>
                        </div>

                        <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                            Create Account <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-600 text-sm">
                            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
