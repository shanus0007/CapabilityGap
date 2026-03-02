import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const Contact = () => {
    return (
        <div className="pt-24 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-16">
                    <div>
                        <span className="text-sm font-bold tracking-wider text-indigo-600 uppercase">Get in Touch</span>
                        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Let's talk about your capabilities</h1>
                        <p className="text-xl text-slate-600 mb-12">
                            Have questions about our platform or want to schedule a demo? We'd love to hear from you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-slate-100 p-3 rounded-xl text-slate-900">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                                    <p className="text-slate-600">hello@capabilitygap.com</p>
                                    <p className="text-slate-600">support@capabilitygap.com</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200">
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                    <input type="text" id="first_name" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" placeholder="First Name" />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                    <input type="text" id="last_name" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" placeholder="Last Name" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" placeholder="example@xyz.com" />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
