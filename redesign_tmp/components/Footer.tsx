import React from 'react';
import { ArrowUp } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
    onNavigate: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
             <div className="flex gap-8 md:gap-16">
                <div className="flex flex-col gap-4">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Socials</h4>
                    <a href="#" className="text-neutral-400 hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="text-neutral-400 hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="text-neutral-400 hover:text-white transition-colors">Twitter / X</a>
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Sitemap</h4>
                    <button onClick={() => onNavigate('home')} className="text-left text-neutral-400 hover:text-white transition-colors">Home</button>
                    <button onClick={() => onNavigate('services')} className="text-left text-neutral-400 hover:text-white transition-colors">Services</button>
                    <button onClick={() => onNavigate('casestudies')} className="text-left text-neutral-400 hover:text-white transition-colors">Case Studies</button>
                </div>
             </div>

             <button 
                onClick={scrollToTop}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 group"
            >
                <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            </button>
        </div>

        {/* Massive Name Signature */}
        <div className="relative">
            <h1 className="text-[18vw] leading-[0.8] font-display font-bold text-[#111] select-none tracking-tighter text-center">
                MAXENCE
            </h1>
            <div className="absolute bottom-4 w-full flex justify-between text-xs font-mono text-neutral-600 px-2">
                <span>© 2025 MAXENCE DESIGN</span>
                <span>SYSTEM V3.0.1</span>
            </div>
        </div>

      </div>
    </footer>
  );
};