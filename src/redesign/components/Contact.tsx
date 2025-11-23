import React from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { useTranslation } from '../../utils/i18n/useTranslation';

const CONTACT_COPY = {
    fr: {
        status: 'Système en ligne',
        title: { line1: 'Lancer', line2: 'le projet' },
        description: "Prêt à construire quelque chose d'exceptionnel ? Remplissez le manifeste technique pour initialiser la séquence.",
        contactLabel: 'Canal de communication',
        locationLabel: 'Signal de localisation',
        locationValue: 'Paris, France',
        email: 'hello@maxence.design',
        form: {
            name: { label: '[ IDENTIFIANT ]', placeholder: 'Nom complet' },
            email: { label: '[ FRÉQUENCE ]', placeholder: 'Adresse email' },
            type: { label: '[ TYPE DE MISSION ]', options: ['Design system', 'Application web', 'Site marketing', 'Audit'] },
            message: { label: '[ DONNÉES ]', placeholder: 'Détails de la mission...' },
            submit: 'Initialiser',
        },
    },
    en: {
        status: 'System online',
        title: { line1: 'Start', line2: 'project' },
        description: 'Ready to build something exceptional? Fill in the technical brief to trigger the sequence.',
        contactLabel: 'Communication uplink',
        locationLabel: 'Location signal',
        locationValue: 'Paris, France',
        email: 'hello@maxence.design',
        form: {
            name: { label: '[ IDENTIFIER ]', placeholder: 'Full name' },
            email: { label: '[ FREQUENCY ]', placeholder: 'Email address' },
            type: { label: '[ MISSION TYPE ]', options: ['Design system', 'Web app', 'Marketing site', 'Audit'] },
            message: { label: '[ DATA ]', placeholder: 'Project details...' },
            submit: 'Initialize',
        },
    },
} as const;

export const Contact: React.FC = () => {
    const { language } = useTranslation();
    const copy = CONTACT_COPY[language];
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
                             <span className="text-xs font-mono text-primary uppercase tracking-widest">{copy.status}</span>
                        </div>
                        <h2 className="font-display font-semibold text-5xl md:text-7xl text-white mb-8 leading-[0.9]">
                            {copy.title.line1}<br/>
                            {copy.title.line2}<span className="text-primary">.</span>
                        </h2>
                    </Reveal>
                    <Reveal delay={200}>
                        <p className="text-lg text-neutral-400 font-light max-w-sm mb-12">
                            {copy.description}
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={300}>
                    <div className="space-y-8">
                        <div>
                            <p className="text-xs font-mono text-neutral-600 uppercase mb-2">{copy.contactLabel}</p>
                            <a href={`mailto:${copy.email}`} className="block text-2xl text-white hover:text-primary transition-colors w-fit font-display">
                                {copy.email}
                            </a>
                        </div>
                        <div>
                             <p className="text-xs font-mono text-neutral-600 uppercase mb-2">{copy.locationLabel}</p>
                             <p className="text-xl text-white font-display">{copy.locationValue}</p>
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
                            <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">{copy.form.name.label}</label>
                            <input 
                                type="text" 
                                id="name" 
                                className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-800 font-display"
                                placeholder={copy.form.name.placeholder}
                            />
                        </div>
                        
                        <div className="group relative">
                             <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">02</span>
                            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">{copy.form.email.label}</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-800 font-display"
                                placeholder={copy.form.email.placeholder}
                            />
                        </div>
                    </div>

                    <div className="group relative">
                        <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">03</span>
                        <label htmlFor="type" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">{copy.form.type.label}</label>
                        <div className="flex flex-wrap gap-4">
                            {copy.form.type.options.map(type => (
                                <button key={type} className="px-4 py-2 border border-white/10 rounded-sm text-sm text-neutral-400 hover:bg-white/5 hover:text-white hover:border-white/30 transition-all">
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="group relative">
                        <span className="absolute -left-8 top-4 text-[10px] font-mono text-neutral-700">04</span>
                        <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4 group-focus-within:text-primary transition-colors">{copy.form.message.label}</label>
                        <textarea 
                            id="message" 
                            rows={4} 
                            className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-neutral-800 font-display"
                            placeholder={copy.form.message.placeholder}
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-white text-black py-6 text-lg font-bold uppercase tracking-widest hover:bg-primary transition-colors flex items-center justify-center gap-4 group">
                        {copy.form.submit}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </form>
            </div>

        </div>
      </div>
    </section>
  );
};