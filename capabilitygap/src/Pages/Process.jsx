import React from 'react'
import { UserPlus, FileText, Database, Brain, Target, Map } from 'lucide-react'

const Process = () => {
    const steps = [
        {
            icon: <UserPlus size={24} />,
            title: 'Registration',
            description: 'Student registers and selects target role.'
        },
        {
            icon: <FileText size={24} />,
            title: 'Diagnostic Assessment',
            description: 'Student takes a diagnostic assessment.'
        },
        {
            icon: <Database size={24} />,
            title: 'Data Collection',
            description: 'System collects performance data.'
        },
        {
            icon: <Brain size={24} />,
            title: 'AI Analysis',
            description: 'AI analyzes skill levels.'
        },
        {
            icon: <Target size={24} />,
            title: 'Gap Detection',
            description: 'Capability gaps are detected.'
        },
        {
            icon: <Map size={24} />,
            title: 'Learning Roadmap',
            description: 'A personalized learning roadmap is generated.'
        }
    ]

    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-sm font-bold tracking-wider text-indigo-600 uppercase">How It Works</span>
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        From Assessment to <span className="font-Queensila italic">Mastery</span>
                    </h1>
                    <p className="text-xl text-slate-600">
                        Our automated process evaluates your current knowledge and provides a customized learning path.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="w-12 h-12 bg-slate-900 group-hover:bg-indigo-600 transition-colors text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                                {step.icon}
                            </div>
                            <div className="absolute top-8 right-8 text-6xl font-black text-slate-50 opacity-50 select-none transition-transform group-hover:scale-110">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Process
