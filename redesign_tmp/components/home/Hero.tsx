import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Reveal } from '../Reveal';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden border-b border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Status Indicator */}
        <Reveal>
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">v3.0 System Online</span>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
          
          {/* Massive Editorial Heading */}
          <h1 className="font-display font-medium text-[10vw] leading-[0.85] tracking-tight text-white mb-12 uppercase text-center mix-blend-difference">
            <Reveal delay={100} width="100%">
              <span className="block text-neutral-500">Beyond</span>
            </Reveal>
            <Reveal delay={200} width="100%">
              <span className="block">Digital</span>
            </Reveal>
            <Reveal delay={300} width="100%">
               <span className="block text-white">Expectations<span className="text-primary">.</span></span>
            </Reveal>
          </h1>

          <Reveal delay={400}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl mx-auto mt-8 bg-[#0F0F0F]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5">
               <div className="w-full md:w-auto text-left flex-[2]">
                  <p className="text-lg text-neutral-300 leading-relaxed font-light">
                      Une architecture <strong>Scalable</strong> pour des marques ambitieuses. Je conçois des écosystèmes digitaux complets : <span className="text-white underline decoration-primary decoration-2 underline-offset-4">CRM, Dashboards & Interfaces Marketing.</span>
                  </p>
               </div>
               <div className="hidden md:block w-[1px] h-12 bg-white/10"></div>
               <div className="flex gap-4">
                  <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-primary transition-colors">
                      Explorer
                  </button>
                  <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                      <ArrowUpRight size={20} />
                  </button>
               </div>
            </div>
          </Reveal>

        </div>

        {/* Bottom Navigation / Scroll */}
        <div className="absolute bottom-10 left-0 w-full px-6 flex justify-between items-end pointer-events-none">
            <div className="hidden md:block text-xs font-mono text-neutral-600">
                REACT 18 / VITE / SUPABASE<br/>
                FULL STACK ARCHITECTURE
            </div>
             <div className="hidden md:block text-xs font-mono text-neutral-600 text-right">
                CURRENT AVAILABILITY<br/>
                Q4 2025
            </div>
        </div>

      </div>
    </section>
  );
};