import React, { useState } from 'react'
import { Check, Loader2, Coins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { addCredits } from '../utils/creditManager'
import { useNotifications } from '../context/NotificationContext'
import Sidebar from '../Components/Sidebar'

const Pricing = ({ session }) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const { addNotification } = useNotifications()

    const handleBuy = async (creditAmount, planName) => {
        if (!session) { navigate('/login'); return }
        setLoading(true)
        setSuccessMsg('')
        const { ok, newBalance, error } = await addCredits(
            session,
            creditAmount,
            `Purchased "${planName}" pack (${creditAmount} credits)`
        )
        setLoading(false)
        if (ok) {
            setSuccessMsg(`Successfully added ${creditAmount} credits!`)
            addNotification({
                title: 'Credits Purchased! 🎉',
                message: `${creditAmount} credits added. New balance: ${newBalance}.`,
                type: 'credit',
            })
            setTimeout(() => setSuccessMsg(''), 5000)
        }
    }

    const plans = [
        {
            label: 'STARTER',
            name: 'Basic Pack',
            price: '₹99',
            credits: '500',
            description: 'Perfect For Small Careers',
            buttonText: 'Buy Pack',
            features: ['500 Capability Credits', '10 AI Assessments', 'Standard AI Support'],
            highlight: false
        },
        {
            label: 'PROFESSIONAL',
            name: 'Pro Pack',
            price: '₹199',
            credits: '1500',
            description: 'Perfect For Growing Roles',
            buttonText: 'Buy Pack',
            features: ['1500 Capability Credits', 'Unlimited AI Assessments', 'Priority Resume Gap Analysis', 'Risk-Free Guarantee'],
            highlight: true
        },
        {
            label: 'ENTERPRISE',
            name: 'Elite Pack',
            price: '₹499',
            credits: '5000',
            description: 'For Large Organizations',
            buttonText: 'Buy Pack',
            features: ['5000 Capability Credits', 'Custom Skill Assessments', 'Dedicated Account Support', 'Advanced Analytics'],
            highlight: false
        }
    ]

    const userCredits = session?.user?.user_metadata?.credits ?? 1000

    return (
        <div className="h-dvh w-full bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-800 overflow-hidden">
            <Sidebar session={session} />
            <main className="flex-1 overflow-hidden relative bg-white">
                <div className="absolute inset-0 overflow-y-auto pt-16 pb-24">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Pricing plans</h1>
                        <p className="text-slate-500 font-medium">Choose the right plan for your needs.</p>
                    </div>


                    {successMsg && (
                        <div className="max-w-6xl mx-auto px-8 mb-8">
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                                <Check size={18} /> {successMsg}
                            </div>
                        </div>
                    )}

                    {/* Minimalist Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
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
                                        onClick={() => handleBuy(parseInt(plan.credits), plan.name)}
                                        disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-3xl font-black text-sm transition-all duration-300 shadow-xl shadow-slate-900/10 mb-8 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : plan.buttonText}
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

                    <div className="mt-20 text-center opacity-30 grayscale pointer-events-none flex items-center justify-center gap-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Pricing
