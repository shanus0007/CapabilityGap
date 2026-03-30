import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Linkedin, Github, Twitter, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white pt-24 pb-8 overflow-hidden border-t border-slate-100">

      {/* Subtle Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      ></div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">

        {/* CTA Banner */}


        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 px-2">

          {/* Brand + Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                <Trees size={20} fill="white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">CapabilityGap</span>
            </Link>

            <p className="text-slate-500 mb-8 font-medium text-[14px] leading-relaxed max-w-xs">
              AI-powered skill gap analysis and personalized learning roadmaps to help you reach your target role faster.
            </p>

            <form
              className="flex items-center bg-slate-50 border border-slate-200 rounded-full p-1.5 shadow-sm max-w-xs"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="bg-transparent border-none outline-none px-4 w-full text-sm text-slate-800 placeholder-slate-400 font-medium"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 text-[13px] uppercase tracking-widest">Platform</h3>
            <ul className="space-y-3.5">
              <li><Link to="/" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Home</Link></li>
              <li><Link to="/process" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">How It Works</Link></li>
              <li><Link to="/assessment" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Take Assessment</Link></li>
              <li><Link to="/resume" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Resume Analysis</Link></li>
              <li><Link to="/dashboard" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 text-[13px] uppercase tracking-widest">Features</h3>
            <ul className="space-y-3.5">
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Skill Diagnostics</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Gap Detection</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">AI Roadmaps</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Resume Intelligence</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">Role Benchmarking</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-slate-900 mb-5 text-[13px] uppercase tracking-widest">Contact</h3>
            <ul className="space-y-3.5 mb-6">
              <li className="text-slate-500 text-sm font-medium">
                Email:{' '}
                <a
                  href="mailto:hello@capabilitygap.ai"
                  className="hover:text-blue-600 underline decoration-slate-200 underline-offset-4"
                >
                  hello@capabilitygap.ai
                </a>
              </li>
            </ul>

            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                <Linkedin size={15} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                <Github size={15} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                <Twitter size={15} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300">
                <Send size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} CapabilityGap. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-2 md:mt-0">
            <Link to="#" className="text-slate-400 hover:text-blue-600 text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-slate-400 hover:text-blue-600 text-sm font-medium transition-colors">Terms of Service</Link>
            <Link to="#" className="text-slate-400 hover:text-blue-600 text-sm font-medium transition-colors">Security</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
