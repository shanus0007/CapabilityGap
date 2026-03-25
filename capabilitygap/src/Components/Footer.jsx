import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Facebook, Linkedin, Instagram, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white pt-24 pb-8 overflow-hidden border-t border-slate-100">
      {/* Grid Pattern Background for Light Mode */}
      <div
        className="absolute inset-0 opacity-[0.6] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Large Green CTA Box (Exact from Image) */}
        <div className="bg-[#b2b0e3] rounded-4xl p-10 md:p-16 text-center text-white shadow-2xl shadow-[#1EB952]/20 mb-20 relative overflow-hidden">

          {/* Subtle floating box decorations to match the image's squares */}
          <div className="absolute top-10 left-[20%] w-16 h-16 bg-white/10 rounded-md"></div>
          <div className="absolute top-1/3 left-[10%] w-24 h-24 bg-white/5 rounded-xl"></div>
          <div className="absolute top-8 right-[30%] w-12 h-12 bg-white/10 rounded-sm"></div>
          <div className="absolute bottom-16 right-[15%] w-20 h-20 bg-white/10 rounded-xl"></div>
          <div className="absolute bottom-6 left-[35%] w-20 h-10 bg-white/5 rounded-md"></div>
          <div className="absolute top-1/2 right-[20%] w-32 h-16 bg-white/5 rounded-lg"></div>
          <div className="absolute -bottom-8 right-[40%] w-24 h-24 bg-white/10 rounded-4xl rotate-12"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo box */}
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <Trees className="text-black" size={28} />
            </div>

            <h2 className="text-3xl text-black md:text-[2.75rem] leading-[1.1] font-bold mb-6 tracking-tight max-w-2xl">
              Transform scattered marketing<br />into predictable growth
            </h2>

            <p className="text-black/90 md:text-lg mb-10 max-w-2xl mx-auto font-medium">
              The only Allbound agency that seamlessly combines inbound attraction with outbound acceleration for SMEs generating €50K+ monthly revenue.
            </p>

            <button className="bg-white text-[#1EB952] px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all outline-none">
              Get started now
            </button>
          </div>
        </div>

        {/* Footer Links & Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 px-4">
          {/* Left Column (Brand + Newsletter) */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#1EB952] text-white rounded-lg flex items-center justify-center">
                <Trees size={20} />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Aurivus</span>
            </Link>

            <p className="text-slate-600 mb-8 font-medium">
              Systematic growth for ambitious businesses.
            </p>

            <form className="flex items-center bg-slate-50 border border-slate-200 rounded-full p-1.5 shadow-sm max-w-88" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Email address"
                className="bg-transparent border-none outline-none px-4 w-full text-sm text-slate-800 placeholder-slate-400 font-medium"
              />
              <button type="submit" className="bg-[#1EB952] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#199d45] transition-colors shrink-0 shadow-sm">
                Subscribe
              </button>
            </form>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 tracking-wide">Pages</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">About</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Blog details</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 tracking-wide">Services</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Content marketing</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Email marketing</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Multi-channel outbound</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Social media advertising</Link></li>
              <li><Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Revenue operations</Link></li>
            </ul>
          </div>

          {/* Contact Component */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 tracking-wide">Contact</h3>
            <ul className="space-y-4 mb-6">
              <li className="text-slate-500 text-sm font-medium flex items-center gap-2">
                Email: <a href="mailto:hello@allboundpro.com" className="hover:text-[#1EB952] underline decoration-slate-300 underline-offset-4">hello@allboundpro.com</a>
              </li>
              <li className="text-slate-500 text-sm font-medium">
                Phone: +45 31 45 67 89
              </li>
            </ul>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#1EB952] hover:text-white hover:border-[#1EB952] transition-colors duration-300">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#1EB952] hover:text-white hover:border-[#1EB952] transition-colors duration-300">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#1EB952] hover:text-white hover:border-[#1EB952] transition-colors duration-300">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-[#1EB952] hover:text-white hover:border-[#1EB952] transition-colors duration-300">
                <Send size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policy Links */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <p className="text-slate-500 text-sm font-medium">
            © 2024 CapabilityGap. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0">
            <Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Terms of Service</Link>
            <Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Security</Link>
            <Link to="#" className="text-slate-500 hover:text-[#1EB952] text-sm font-medium transition-colors">Cookie</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
