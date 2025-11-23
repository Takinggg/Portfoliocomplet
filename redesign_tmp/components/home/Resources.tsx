import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, FileCode, Layers } from 'lucide-react';
import { Reveal } from '../Reveal';
import { SpotlightCard } from '../SpotlightCard';

const resources = [
  {
    id: 1,
    title: "Architecture Supabase Scalable",
    category: "Backend Guide",
    date: "Oct 2024",
    readTime: "8 min read",
    icon: FileCode,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Design Systems sur Figma",
    category: "Workflow",
    date: "Sep 2024",
    readTime: "12 min read",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Le Guide du SEO React",
    category: "Performance",
    date: "Aug 2024",
    readTime: "5 min read",
    icon: BookOpen,
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2676&auto=format&fit=crop"
  }
];

export const Resources: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#050505] relative">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 border-b border-white/10 pb-8">
           <Reveal>
              <h2 className="font-display font-semibold text-5xl md:text-7xl text-white">
                  Resources<span className="text-primary">.</span>
              </h2>
           </Reveal>
           <Reveal delay={200}>
               <div className="text-right">
                   <p className="text-neutral-400 text-sm uppercase tracking-widest mb-2">Knowledge Base</p>
                   <p className="text-white text-xl">Guides techniques & documentation.</p>
               </div>
           </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* List Column */}
            <div className="lg:col-span-7 flex flex-col">
                {resources.map((item, index) => (
                    <Reveal key={item.id} delay={index * 100} width="100%">
                        <div 
                            className="group relative border-b border-white/5 py-10 cursor-pointer transition-colors hover:bg-white/5 px-4 -mx-4"
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-6">
                                    <span className="font-mono text-neutral-600 text-sm">0{item.id}</span>
                                    <div>
                                        <h3 className="text-3xl font-display font-medium text-white group-hover:text-primary transition-colors mb-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-neutral-500 uppercase tracking-wider">{item.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                                            <span className="text-xs text-neutral-500">{item.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Preview Column (Sticky) */}
            <div className="hidden lg:block lg:col-span-5 sticky top-32">
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
                    {resources.map((item, index) => (
                        <div 
                            key={item.id}
                            className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                activeIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                            }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80"></div>
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                                    <item.icon size={24} />
                                </div>
                                <p className="text-white text-lg font-light">
                                    Découvrez notre guide complet sur <span className="text-primary">{item.title}</span>. Inclus les snippets de code et les templates Figma.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};