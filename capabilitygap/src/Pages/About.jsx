import React from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'

const About = () => {
    return (
        <div className="pt-24 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-16 text-center">
                    <span className="text-sm font-bold tracking-wider text-slate-500 uppercase">Our Story</span>
                    <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Bridging the <span className="font-Queensila italic">Capability Gap</span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
                        We help organizations visualize and close the distance between their current state and their desired future.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Why We Exist</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            In a rapidly evolving digital landscape, businesses often struggle to identify where they are lacking.
                            CapabilityGap provides the tools and insights needed to pinpoint weaknesses and turn them into strengths.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                'Data-driven insights for strategic planning',
                                'Comprehensive capability mapping',
                                'Actionable roadmaps for growth',
                                'Continuous performance monitoring'
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 bg-green-100 p-1 rounded-full">
                                        <CheckCircle size={16} className="text-green-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-tr from-blue-100 to-indigo-50 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 shadow-xl">
                            <div className="h-64 flex items-center justify-center bg-white rounded-xl border border-dashed border-slate-300">
                                <span className="text-slate-400 font-medium">Visual Representation Placeholder</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

                    <h2 className="relative z-10 text-3xl font-bold mb-6">Ready to maximize your potential?</h2>
                    <p className="relative z-10 text-slate-300 text-lg max-w-2xl mx-auto mb-8">
                        Join hundreds of forward-thinking companies using our platform to drive transformation.
                    </p>
                    <button className="relative z-10 bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-slate-100 transition-colors inline-flex items-center gap-2">
                        Get Started <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default About
