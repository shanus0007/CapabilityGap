import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PieChart, Star, Activity, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'

const Hero = () => {
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
                            <button className="group bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center gap-3 font-medium shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto justify-center">
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


                <div className="flex flex-col items-center text-center justify-center max-w-4xl mx-auto space-y-6 md:space-y-8" >
                    <h1 className='text-3xl font-medium'>Meet Capability Gap <span className="font-ChettaVissto italic">Intelligence</span></h1>
                </div>
            </section>
        </>
    )
}

export default Hero