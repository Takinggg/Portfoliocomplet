import React from 'react';
import { Reveal } from '../Reveal';
import { SpotlightCard } from '../SpotlightCard';
import { Check, Plus } from 'lucide-react';
import { ServicePack } from '../../types';

interface ServicesPageProps {
    services: ServicePack[];
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services }) => {
  return (
    <div className="pt-32 pb-20 bg-background min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-24 text-center max-w-4xl mx-auto">
            <Reveal width="100%">
                <h1 className="font-display font-bold text-6xl md:text-8xl text-white mb-6">Nos Offres<span className="text-primary">.</span></h1>
                <p className="text-xl text-neutral-400 font-light">
                    Des solutions claires, sans coûts cachés, adaptées à la maturité de votre projet.
                </p>
            </Reveal>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {services.map((pack, index) => (
                <Reveal key={pack.id} delay={index * 100} className="h-full">
                    <SpotlightCard className={`h-full p-8 rounded-2xl border flex flex-col ${pack.popular ? 'border-primary/50 bg-primary/5' : 'border-white/10 bg-[#0A0A0A]'}`}>
                        {pack.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                                Recommandé
                            </div>
                        )}
                        <div className="mb-8">
                            <h3 className="text-2xl font-display font-bold text-white mb-2">{pack.title}</h3>
                            <div className="text-3xl font-light text-neutral-300 mb-4">{pack.price}</div>
                            <p className="text-neutral-500 text-sm min-h-[40px]">{pack.description}</p>
                        </div>
                        
                        <div className="space-y-4 mb-8 flex-grow">
                            {pack.features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-4 h-4 rounded-full border border-primary/50 flex items-center justify-center text-primary">
                                        <Check size={10} />
                                    </div>
                                    <span className="text-neutral-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                            pack.popular 
                            ? 'bg-primary text-black hover:bg-white' 
                            : 'bg-white/10 text-white hover:bg-white hover:text-black'
                        }`}>
                            Choisir ce pack
                        </button>
                    </SpotlightCard>
                </Reveal>
            ))}
        </div>

        {/* Mini FAQ */}
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-20">
            <h2 className="font-display font-bold text-3xl text-white mb-12 text-center">Questions Fréquentes</h2>
            <div className="space-y-4">
                {['Comment se passe le paiement ?', 'Travaillez-vous avec des agences ?', 'Assurez-vous la maintenance ?'].map((q, i) => (
                    <div key={i} className="border-b border-white/10 pb-4">
                        <div className="flex justify-between items-center cursor-pointer hover:text-primary transition-colors">
                            <span className="text-lg text-white">{q}</span>
                            <Plus size={20} className="text-neutral-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};