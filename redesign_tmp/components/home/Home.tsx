import React from 'react';
import { Hero } from './Hero';
import { Ecosystem } from './Ecosystem';
import { Results } from '../Results';
import { Process } from '../Process';
import { Work } from '../Work';
import { Reveal } from '../Reveal';
import { ArrowRight } from 'lucide-react';
import { PageView } from '../../types';

interface HomeProps {
    onChangePage: (page: PageView) => void;
}

export const Home: React.FC<HomeProps> = ({ onChangePage }) => {
  return (
    <div className="animate-in fade-in duration-700">
      <Hero />
      <Ecosystem />
      <Results />
      <Work onNavigate={onChangePage} />
      <Process />
      
      {/* Final CTA Section */}
      <section className="py-40 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
            <Reveal width="100%">
                <h2 className="text-[6vw] md:text-[5vw] font-display font-bold text-white leading-[0.9] mb-8">
                    Prêt à passer au<br/>
                    <span className="text-neutral-700">niveau supérieur ?</span>
                </h2>
            </Reveal>
            <Reveal delay={200} width="100%">
                <button 
                    onClick={() => onChangePage('contact')}
                    className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full text-xl font-bold uppercase tracking-wider hover:bg-primary transition-all duration-300"
                >
                    Démarrer le projet
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </Reveal>
        </div>
      </section>
    </div>
  );
};