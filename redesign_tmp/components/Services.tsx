import React from 'react';
import { Palette, Code2, BrainCircuit, ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { Reveal } from './Reveal';

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-40 bg-background relative z-20">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 border-b border-white/10 pb-8">
            <Reveal>
                <h2 className="font-display font-semibold text-6xl md:text-8xl text-white">Expertise<span className="text-primary">.</span></h2>
            </Reveal>
            <Reveal delay={200}>
                <div className="text-right">
                     <p className="text-neutral-500 text-sm uppercase tracking-widest mb-2">Services</p>
                     <p className="text-white text-xl max-w-xs">Design, Code & Strategy combined.</p>
                </div>
            </Reveal>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[600px]">
          
          {/* Large Card - UI/UX */}
          <div className="md:col-span-2 h-full">
            <Reveal className="h-full">
                <SpotlightCard className="h-full p-8 md:p-12 flex flex-col justify-between group bg-[#080808] border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="p-4 rounded-full border border-white/10 bg-white/5 text-white mb-8 group-hover:bg-white group-hover:text-black transition-colors duration-500">
                            <Palette size={32} strokeWidth={1.5} />
                        </div>
                        <ArrowUpRight className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 text-white" size={32} strokeWidth={1} />
                    </div>
                    
                    <div>
                        <h3 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">Product Design</h3>
                        <p className="text-neutral-400 text-lg md:text-xl max-w-lg mb-10 font-light leading-relaxed">
                            Je conçois des systèmes complets, des parcours utilisateurs fluides et des interfaces qui convertissent. L'esthétique au service de la fonction.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-wider text-neutral-400">Design Systems</span>
                            <span className="px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-wider text-neutral-400">Prototyping</span>
                            <span className="px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-wider text-neutral-400">Mobile Apps</span>
                        </div>
                    </div>
                </SpotlightCard>
            </Reveal>
          </div>

          {/* Right Column - Stacked Cards */}
          <div className="flex flex-col gap-4 md:gap-6 h-full">
            
            {/* Top Card - Dev */}
            <Reveal delay={200} className="flex-1">
                <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-between group bg-[#080808] border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-full border border-white/10 bg-white/5 text-white group-hover:bg-primary group-hover:text-black transition-colors duration-500">
                            <Code2 size={24} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-display font-medium text-white mb-3">Creative Dev</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">React, Next.js, WebGL. Du code propre pour des expériences fluides et mémorables.</p>
                    </div>
                </SpotlightCard>
            </Reveal>

            {/* Bottom Card - AI */}
            <Reveal delay={300} className="flex-1">
                <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-between group bg-[#080808] border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="p-3 rounded-full border border-white/10 bg-white/5 text-white group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">
                            <BrainCircuit size={24} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-display font-medium text-white mb-3">AI Integration</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">Automation & LLMs. L'intelligence artificielle pour booster votre productivité.</p>
                    </div>
                </SpotlightCard>
            </Reveal>
            
          </div>
        </div>

      </div>
    </section>
  );
};