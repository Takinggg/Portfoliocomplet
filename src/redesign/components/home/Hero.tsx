import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Reveal } from '../Reveal';
import { useTranslation } from '../../../utils/i18n/useTranslation';
import { PageView } from '../../types';

const HERO_COPY = {
  fr: {
    status: 'Système v3.0 en ligne',
    title: {
      line1: 'Au-delà',
      line2: 'des attentes',
      line3: 'digitales',
    },
    description: {
      before: 'Une architecture',
      strong: 'scalable',
      after: 'pour des marques ambitieuses. Je conçois des écosystèmes digitaux complets :',
      highlight: 'Landing pages, CRM, dashboards et interfaces marketing.',
    },
    ctaPrimary: 'Explorer',
    techStack: {
      top: 'REACT 18 / VITE / SUPABASE',
      bottom: 'ARCHITECTURE FULL STACK',
    },
    availability: {
      label: 'Disponibilité actuelle',
      value: 'T4 2025',
    },
  },
  en: {
    status: 'v3.0 system online',
    title: {
      line1: 'Beyond',
      line2: 'digital',
      line3: 'expectations',
    },
    description: {
      before: 'A',
      strong: 'scalable architecture',
      after: 'for ambitious brands. I design complete digital ecosystems:',
      highlight: 'Landing pages, CRM, dashboards and marketing interfaces.',
    },
    ctaPrimary: 'Explore',
    techStack: {
      top: 'REACT 18 / VITE / SUPABASE',
      bottom: 'FULL STACK ARCHITECTURE',
    },
    availability: {
      label: 'Current availability',
      value: 'Q4 2025',
    },
  },
} as const;

interface HeroProps {
  onNavigate?: (page: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const copy = HERO_COPY[language];
  const handleExploreClick = React.useCallback(() => onNavigate?.('services'), [onNavigate]);
  const handleContactClick = React.useCallback(() => onNavigate?.('contact'), [onNavigate]);
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden border-b border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
          
          {/* Massive Editorial Heading */}
          <h1 className="font-display font-medium home-hero-heading tracking-tight text-white mb-12 uppercase text-center mix-blend-difference">
            <Reveal delay={100} width="100%">
              <span className="block text-neutral-500">{copy.title.line1}</span>
            </Reveal>
            <Reveal delay={200} width="100%">
              <span className="block">{copy.title.line2}</span>
            </Reveal>
            <Reveal delay={300} width="100%">
               <span className="block text-white">{copy.title.line3}<span className="text-primary">.</span></span>
            </Reveal>
          </h1>

          <Reveal delay={400}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-3xl mx-auto mt-8 bg-[#0F0F0F]/80 backdrop-blur-md p-6 rounded-2xl border border-white/5">
               <div className="w-full md:w-auto text-left flex-[2]">
                  <p className="text-lg text-neutral-300 leading-relaxed font-light">
                      {copy.description.before} <strong>{copy.description.strong}</strong> {copy.description.after}{' '}
                      <span className="text-white underline decoration-primary decoration-2 underline-offset-4">
                        {copy.description.highlight}
                      </span>
                  </p>
               </div>
               <div className="hidden md:block w-[1px] h-12 bg-white/10"></div>
               <div className="flex gap-4">
                    <button onClick={handleExploreClick} className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-primary transition-colors">
                      {copy.ctaPrimary}
                  </button>
                  <button onClick={handleContactClick} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                      <ArrowUpRight size={20} />
                  </button>
               </div>
            </div>
          </Reveal>

        </div>

        {/* Bottom Navigation / Scroll */}
        <div className="absolute bottom-10 left-0 w-full px-6 flex justify-between items-end pointer-events-none">
            <div className="hidden md:block text-xs font-mono text-neutral-600">
                {copy.techStack.top}<br/>
                {copy.techStack.bottom}
            </div>
             <div className="hidden md:block text-xs font-mono text-neutral-600 text-right">
                {copy.availability.label.toUpperCase()}<br/>
                {copy.availability.value}
            </div>
        </div>

      </div>
    </section>
  );
};