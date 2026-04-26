import React, { useState } from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ_DATA = [
    {
        question: "What is Capability Credits?",
        answer: "Capability Credits are the currency of our platform. You use them to run AI-powered diagnostic assessments, generate personalized learning roadmaps, and perform deep resume gap analysis."
    },
    {
        question: "How do I use my credits?",
        answer: "A standard AI Assessment costs 50 credits, while a Resume Gap Analysis costs 100 credits. Once purchased, credits are added to your wallet and deducted as you use these tools."
    },
    {
        question: "Do credits expire?",
        answer: "No! Purchased credits stay in your account forever. Trial credits (the initial 1000) also don't expire, allowing you to explore the platform at your own pace."
    },
    {
        question: "Can I get a refund for unused credits?",
        answer: "We offer a 7-day money-back guarantee if you haven't used more than 10% of your purchased credits. Contact our support team for assistance."
    }
];

const PricingSection = ({ onBuy, loading, session }) => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    const plans = [
        {
            label: 'STARTER',
            name: 'Basic Pack',
            price: '₹99',
            credits: '500',
            description: 'Perfect For Small Careers',
            buttonText: 'Get Started',
            features: ['500 Capability Credits', '10 AI Assessments', 'Standard AI Support'],
            highlight: false
        },
        {
            label: 'PROFESSIONAL',
            name: 'Pro Pack',
            price: '₹199',
            credits: '1500',
            description: 'Perfect For Growing Roles',
            buttonText: 'Get Started',
            features: ['1500 Capability Credits', 'Unlimited AI Assessments', 'Priority Resume Gap Analysis', 'Risk-Free Guarantee'],
            highlight: true
        },
        {
            label: 'ENTERPRISE',
            name: 'Elite Pack',
            price: '₹499',
            credits: '5000',
            description: 'For Large Organizations',
            buttonText: 'Contact Us',
            features: ['5000 Capability Credits', 'Custom Skill Assessments', 'Dedicated Account Support', 'Advanced Analytics'],
            highlight: false
        }
    ];

    return (
        <section id="pricing" className="py-32 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Pricing plans</h2>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto">Choose the right plan for your career goals. Straightforward credits for powerful career management.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {plans.map((plan, i) => (
                        <div key={i} className="bg-white rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px]">
                            {/* Card Top */}
                            <div className={`p-8 ${plan.highlight ? 'bg-indigo-50/50' : 'bg-slate-50/80'} border-b border-slate-100`}>
                                <div className="inline-flex px-4 py-1.5 bg-white rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 shadow-sm">
                                    {plan.label}
                                </div>
                                <div className="mb-4">
                                    <p className="text-4xl font-black text-slate-900 leading-none">
                                        {plan.price}
                                        <span className="text-sm font-bold text-slate-400 ml-1">/pack</span>
                                    </p>
                                </div>
                                <p className="text-sm font-bold text-slate-600">{plan.description}</p>
                            </div>

                            {/* Card Bottom */}
                            <div className="p-8 flex flex-col flex-1">
                                <button 
                                    onClick={() => onBuy ? onBuy(parseInt(plan.credits), plan.name) : navigate('/pricing')}
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-3xl font-black text-sm transition-all duration-300 shadow-xl shadow-slate-900/10 mb-8 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : plan.buttonText}
                                </button>

                                <ul className="space-y-4 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check size={16} className="text-slate-300 mt-0.5 shrink-0" />
                                            <span className="text-sm font-bold text-slate-500 leading-tight">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 mb-4">
                            Frequently Asked <span className="text-indigo-600">Questions</span>
                        </h2>
                        <p className="text-slate-500 font-medium">Everything you need to know about our credit system.</p>
                    </div>

                    <div className="space-y-4">
                        {FAQ_DATA.map((item, i) => (
                            <div 
                                key={i} 
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
                            >
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                                >
                                    <span className="text-[17px] font-bold text-slate-800">{item.question}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? 'bg-indigo-600 text-white rotate-180' : 'bg-indigo-50 text-indigo-600'}`}>
                                        {openFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>
                                <div 
                                    className={`transition-all duration-500 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
