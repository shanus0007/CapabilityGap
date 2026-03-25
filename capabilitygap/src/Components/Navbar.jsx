import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trees, Menu, X } from 'lucide-react'

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'About', to: '/about' },
        { name: 'Process', to: '/process' },
        { name: 'Pricing', to: '/pricing' },
        { name: 'Contact', to: '/contact' },
    ]

    const glassClass = isScrolled 
        ? 'bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/60' 
        : 'bg-transparent border border-transparent'

    return (
        <>
            {/* ---------------- DESKTOP LAYOUT (3 Separate Pills) ---------------- */}

            {/* 1. Left Pill: Logo */}
            <Link to="/" className={`hidden md:flex fixed top-6 left-36 z-50 items-center gap-2 px-2 py-2 pr-6 cursor-pointer no-underline transition-all duration-300 rounded-full ${glassClass}`}>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                    <Trees size={20} fill="white" />
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">CapabilityGap</span>
            </Link>

            {/* 2. Center Pill: Navigation */}
            <nav className={`hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 px-2 py-2 items-center gap-1 transition-all duration-300 rounded-full ${glassClass}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.to}
                        className="px-5 py-2.5 text-sm font-bold text-slate-800 hover:text-black transition-colors rounded-full hover:bg-slate-100"
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* 3. Right Pill: Auth Buttons */}
            <div className={`hidden md:flex fixed top-6 right-36 z-50 px-2 py-2 items-center gap-2 transition-all duration-300 rounded-full ${glassClass}`}>
                <Link to="/login" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                    Log in
                </Link>
                <Link to="/signup" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 text-sm font-bold bg-black text-white rounded-full hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg">
                    Sign up
                </Link>
            </div>


            {/* ---------------- MOBILE LAYOUT (Unified Bar) ---------------- */}
            <div className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%]">
                <nav className={`px-2 py-2 flex items-center justify-between transition-all duration-300 rounded-full ${glassClass}`}>
                    <Link to="/" className="flex items-center gap-2 pl-1">
                        <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                            <Trees size={20} fill="white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-900">CapabilityGap</span>
                    </Link>

                    <div className="pr-2 flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 rounded-full hover:bg-slate-100"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-60 bg-white flex flex-col p-6 animate-in slide-in-from-top-10 duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                <Trees size={20} fill="white" />
                            </div>
                            <span className="font-bold text-xl tracking-tighter text-slate-900">CapabilityGap</span>
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-full hover:bg-slate-100"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 text-center mt-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="text-2xl font-bold text-slate-900 py-3 hover:bg-slate-50 rounded-2xl"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 my-4 mx-10"></div>
                        <Link to="/login" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-slate-900 py-3 hover:bg-slate-50 rounded-2xl" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                        <Link to="/signup" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold bg-black text-white py-4 rounded-full mt-2 inline-block" onClick={() => setMobileMenuOpen(false)}>Sign up</Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
