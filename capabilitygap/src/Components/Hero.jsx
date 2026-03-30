import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PieChart, Star, Activity, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <>
            <section className="relative w-full min-h-screen flex flex-col items-center overflow-hidden p-4 md:p-[40px] selection:bg-lime-300 selection:text-black text-slate-900 pb-20">
                {/* Radial Gradient Background from Top */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
                    }}
                />
                {/* Gradient blend to smoothly merge into the next white section */}
                <div className="absolute bottom-0 left-0 w-full h-32 sm:h-40 md:h-56 bg-linear-to-t from-[#ffffff] to-transparent z-0 pointer-events-none" />

                <div className="relative z-10 container mx-auto mt-20 px-4 md:px-20 py-12 lg:py-20">
                    <div className="flex flex-col items-center text-center justify-center max-w-4xl mx-auto space-y-6 md:space-y-8">

                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1]">
                            Capability gap <br className="hidden md:block" />
                            that <span className="relative inline-block">
                                leads you
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-lime-300 -z-10 opacity-70"></span>
                            </span>
                            <br className="hidden md:block " />
                            to your goals
                        </h1>

                        <p className="text-sm sm:text-lg font-normal text-gray-500 max-w-xl">
                            Precision capability intelligence for ambitious students powered by AI, built for measurable growth, and designed to bridge the gap between effort and achievement.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/signup')}
                                className="group bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center gap-3 font-medium shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto justify-center">
                                Get Early Access
                                <span className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={16} />
                                </span>
                            </button>
                        </div>

                    </div>


                </div>
            </section>

            <section>

                {/* Animated Cards Section */}
                <div className="mt-20 relative h-[650px] md:h-[400px] flex items-center justify-center perspective-1000">
                    {/* Card 1: Green (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : -100, y: isMobile ? -50 : 0, rotate: -10 }}
                        whileInView={{ opacity: 1, x: isMobile ? 0 : -180, y: isMobile ? -160 : 0, rotate: isMobile ? -5 : -15 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="absolute w-64 h-80 rounded-3xl shadow-2xl overflow-hidden border-4 border-white z-10 bg-white"
                    >
                        <img
                            src="https://i.postimg.cc/9McN1BM6/card-3.png"
                            alt="Fresh Insights"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Card 2: Purple (Center, Top) */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, x: 0, y: isMobile ? 0 : -20, rotate: 0, scale: 1.1 }}
                        transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="absolute w-64 h-80 rounded-3xl shadow-2xl overflow-hidden border-4 border-white z-20 bg-white"
                    >
                        <img
                            src="https://i.postimg.cc/C570m1wg/card-2.png"
                            alt="Tasty Results"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Card 3: Blue (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 100, y: isMobile ? 50 : 0, rotate: 10 }}
                        whileInView={{ opacity: 1, x: isMobile ? 0 : 180, y: isMobile ? 160 : 0, rotate: isMobile ? 5 : 15 }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                        viewport={{ once: false, margin: "-100px" }}
                        className="absolute w-64 h-80 rounded-3xl shadow-2xl overflow-hidden border-4 border-white z-10 bg-white"
                    >
                        <img
                            src="https://i.postimg.cc/xCPBS4hx/card-1.png"
                            alt="Fast Growth"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>


                <div className="flex flex-col items-center text-center justify-center max-w-4xl mx-auto space-y-6 md:space-y-8 mt-32 mb-16" >
                    <h1 className='text-3xl md:text-5xl font-medium tracking-tight'>
                        Meet Capability Gap <span className="font-ChettaVissto italic text-blue-600">Intelligence</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl text-lg px-4">
                        Experience the next generation of skill tracking and capability management in an intuitive, beautifully designed interface.
                    </p>
                </div>

                <div className="w-full max-w-6xl mx-auto px-4 md:px-8 relative mb-32 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative rounded-[20px] md:rounded-[32px] border border-gray-200/60 bg-white/40 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-2 md:p-3"
                    >
                        <div className="absolute inset-0 bg-linear-to-tr from-lime-100/30 to-slate-100/30 -z-10 rounded-[32px]" />
                        <div className="rounded-[12px] md:rounded-[20px] overflow-hidden border border-gray-200 bg-white shadow-inner flex flex-col">
                            {/* Browser Header Mockup */}
                            <div className="h-10 md:h-12 bg-gray-50/90 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                                </div>
                                <div className="ml-4 flex-1 flex justify-center">
                                    <div className="bg-white border border-gray-200/80 rounded-md px-4 py-1.5 text-[11px] md:text-xs text-gray-400 font-medium flex items-center justify-center min-w-[150px] md:min-w-[200px] shadow-sm">
                                        capabilitygap.com/dashboard
                                    </div>
                                </div>
                                <div className="w-[52px]"></div> {/* spacer for centering */}
                            </div>
                            <img
                                src="https://i.ibb.co/1fpmFQmD/sc-dashboard.png"
                                alt="Capability Gap Dashboard Preview"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

            </section>
        </>
    )
}

export default Hero