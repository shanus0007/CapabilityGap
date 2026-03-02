import React from 'react'
import { Database, TrendingUp, Layers, Code } from 'lucide-react'

const Process = () => {
    const steps = [
        {
            icon: <Database size={24} />,
            title: 'Audit & Analysis',
            description: 'We start by deep-diving into your current infrastructure and capabilities to establish a clear baseline.'
        },
        {
            icon: <Layers size={24} />,
            title: 'Gap Identification',
            description: 'Our algorithms identify the precise gaps between where you are and where you need to be to meet your strategic goals.'
        },
        {
            icon: <Code size={24} />,
            title: 'Strategic Roadmap',
            description: 'We generate a detailed, actionable roadmap with prioritized initiatives to bridge the identified gaps.'
        },
        {
            icon: <TrendingUp size={24} />,
            title: 'Execution & Monitoring',
            description: 'Track progress in real-time as your team executes the plan, with continuous feedback loops for optimization.'
        }
    ]

    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-sm font-bold tracking-wider text-indigo-600 uppercase">How It Works</span>
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        From Insight to <span className="font-Queensila italic">Impact</span>
                    </h1>
                    <p className="text-xl text-slate-600">
                        Our proven methodology ensures that every step you take contributes directly to closing your capability gaps.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-slate-200 -z-10 transform translate-y-4"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                                {step.icon}
                            </div>
                            <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-50 select-none">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Implementation Timeline</h2>
                        <p className="text-slate-600 mb-6">
                            Most organizations see actionable results within the first 2 weeks. Our streamlined process is designed for speed without sacrificing depth.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-24 text-sm font-bold text-slate-500">Week 1</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-full rounded-full"></div>
                                </div>
                                <div className="text-sm font-bold text-slate-900">Discovery</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-24 text-sm font-bold text-slate-500">Week 2</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-full rounded-full"></div>
                                </div>
                                <div className="text-sm font-bold text-slate-900">Strategy</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-24 text-sm font-bold text-slate-500">Week 3+</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-800 w-full rounded-full"></div>
                                </div>
                                <div className="text-sm font-bold text-slate-900">Execution</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="w-64 h-64 rounded-full bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 border border-white shadow-inner">
                            <div className="text-center">
                                <div className="text-5xl font-black text-slate-900 mb-1">2.5x</div>
                                <div className="text-sm font-medium text-slate-600 uppercase tracking-widest">Faster Growth</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Process
