import React from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-[#050505] border-t border-white/5 relative overflow-hidden">
      
      {/* Technical Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 border border-white/10 bg-[#0A0A0A]">
            
            {/* INFO COLUMN */}
            <div className="lg:col-span-5 p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative">
                {/* Decorative Markers */}
                <div className="absolute top-4 left-4 w-2 h-2 border border-white/20"></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 border border-white/20"></div>

                <div>
                    <Reveal>
                        <div className="flex items-center gap-2 mb-6">
                             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                             <span className="text-xs font-mono text-primary uppercase tracking-widest">System Online</span>
                        </div>
                        <h2 className="font-display font-semibold text-5xl md:text-7xl text-white mb-8 leading-[0.9]">
                            Start<br/>
                            Project<span className="text-primary">.</span>
                        </h2>
                    </Reveal>
                    <Reveal delay={200}>
                        <p className="text-lg text-neutral-400 font-light max-w-sm mb-12">
                            Prêt à construire quelque chose d'exceptionnel ? Remplissez le manifeste technique ci-contre pour initialiser la séquence.
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={300}>
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-mono text-neutral-600 uppercase mb-2">Communication Uplink</p>
                            <a href="mailto:hello@maxence.design" className="block text-2xl text-white hover:text-primary transition-colors w-fit font-display">
                                hello@maxence.design
                            </a>
                        </div>
                        <div>
                             <p className="text-xs font-mono text-neutral-600 uppercase mb-2">Location Signal</p>
                             <p className="text-xl text-white font-display">Paris, France</p>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* FORM COLUMN */}
            <div className="lg:col-span-7 p-12 lg:p-20 relative bg-[#080808]">
                 {/* Decorative Lines */}
                 <div className="absolute top-0 left-8 w-[1px] h-full bg-white/5"></div>
                 
                 <form className="space-y-12 relative z-10" onSubmit={(e) => e.preventDefault()}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="group relative">
                            <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">01</span>
                            <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">[ IDENTIFIANT ]</label>
                            <input 
                                type="text" 
                                id="name" 
                                className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-800 font-display"
                                placeholder="Nom complet" 
                            />
                        </div>
                        
                        <div className="group relative">
                             <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">02</span>
                            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">[ FREQUENCE ]</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-800 font-display"
                                placeholder="Adresse email" 
                            />
                        </div>
                    </div>

                    <div className="group relative">
                        <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">03</span>
                        <label htmlFor="type" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">[ TYPE DE MISSION ]</label>
                        <div className="flex flex-wrap gap-4">
                            {['Design System', 'Web App', 'Marketing Site', 'Audit'].map(type => (
                                <button key={type} className="px-4 py-2 border border-white/10 rounded-sm text-sm text-neutral-400 hover:bg-white/5 hover:text-white hover:border-white/30 transition-all">
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="group relative">
                        <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">04</span>
                        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">[ DONNÉES ]</label>
                        <textarea 
                            id="message" 
                            rows={4} 
                            className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-neutral-800 font-display"
                            placeholder="Détails de la mission..."
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-white text-black py-6 text-lg font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-4 group">
                        Initialiser
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </form>
            </div>

        </div>
      </div>
    </section>
  );
};