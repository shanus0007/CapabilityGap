import React from 'react'
import { Check } from 'lucide-react'

const Pricing = () => {
    const plans = [
        {
            name: 'Starter',
            price: '₹99',
            description: 'Perfect for small teams getting started.',
            features: [
                'Up to 5 team members',
                'Basic capability mapping',
                'Quarterly reports',
                'Email support'
            ],
            cta: 'Start Free Trial',
            popular: false
        },
        {
            name: 'Professional',
            price: '₹199',
            description: 'For growing organizations needing specialized tools.',
            features: [
                'Up to 20 team members',
                'Advanced gap analysis',
                'Monthly detailed reports',
                'Priority support',
                'API Access'
            ],
            cta: 'Get Started',
            popular: true
        },
        {
            name: 'Enterprise',
            price: '₹299',
            description: 'Tailored solutions for large-scale operations.',
            features: [
                'Unlimited team members',
                'Full platform access',
                'Real-time analytics',
                'Dedicated success manager',
                'SSO & Advanced Security'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ]

    return (
        <div className="pt-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Choose the plan that best fits your needs. No hidden fees, ever.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-8 shadow-sm border transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold uppercase py-1 px-4 rounded-full tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline text-slate-900">
                                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>}
                                </div>
                                <p className="mt-2 text-slate-500 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${plan.popular
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                }`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <p className="text-slate-500 text-sm">
                        All prices are in USD. Need a custom plan? <a href="#" className="text-indigo-600 hover:underline font-bold">Talk to us</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Pricing
