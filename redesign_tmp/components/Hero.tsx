import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Reveal } from './Reveal';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden border-b border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Status Indicator */}
        <Reveal>
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">Available for new projects</span>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
          
          {/* Massive Editorial Heading */}
          <h1 className="font-display font-medium text-[12vw] leading-[0.8] tracking-tight text-white mb-12 uppercase text-center mix-blend-difference">
            <Reveal delay={100} width="100%">
              <span className="block">Digital</span>
            </Reveal>
            <Reveal delay={200} width="100%">
              <span className="block text-neutral-600">Designer</span>
            </Reveal>
            <Reveal delay={300} width="100%">
               <div className="flex items-center justify-center gap-4 md:gap-8">
                <span className="block">& Developer</span>
                <span className="w-4 h-4 md:w-8 md:h-8 bg-primary rounded-full block mt-2 md:mt-4"></span>
               </div>
            </Reveal>
          </h1>

          <Reveal delay={400}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-2xl mx-auto mt-8">
               <div className="w-full md:w-auto text-left md:text-right flex-1">
                  <span className="block text-xs text-neutral-500 uppercase tracking-widest mb-1">Location</span>
                  <span className="block text-lg">Paris, France</span>
               </div>
               <div className="hidden md:block w-[1px] h-12 bg-white/10"></div>
               <div className="w-full md:w-auto text-left flex-[2]">
                  <p className="text-xl text-neutral-400 leading-relaxed font-light">
                      I craft <span className="text-white">radical digital experiences</span> for brands that refuse to blend in. Blending aesthetics with performance.
                  </p>
               </div>
            </div>
          </Reveal>

        </div>

        {/* Bottom Navigation / Scroll */}
        <div className="absolute bottom-10 left-0 w-full px-6 flex justify-between items-end">
            <div className="hidden md:block text-xs font-mono text-neutral-600">
                (SCROLL)<br/>
                TO EXPLORE
            </div>
            <a href="#work" className="mx-auto md:mx-0 p-4 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300 group">
                <ArrowDown size={24} className="group-hover:translate-y-1 transition-transform" />
            </a>
             <div className="hidden md:block text-xs font-mono text-neutral-600 text-right">
                EST. 2025<br/>
                PORTFOLIO
            </div>
        </div>

      </div>
    </section>
  );
};