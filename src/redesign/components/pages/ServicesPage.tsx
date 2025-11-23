import React from 'react';
import { Reveal } from '../Reveal';
import { SpotlightCard } from '../SpotlightCard';
import { Check, Plus } from 'lucide-react';
import { ServicePack } from '../../types';
import { useTranslation } from '../../../utils/i18n/useTranslation';
import { getLocalizedList, getLocalizedValue } from '../../../utils/i18n/localeUtils';

interface ServicesPageLabels {
    heading: string;
    subheading: string;
    recommendedBadge: string;
    buttonLabel: string;
    faqTitle: string;
    faqQuestions: string[];
}

interface ServicesPageProps {
        services: ServicePack[];
        labels?: Partial<ServicesPageLabels>;
        onSelectPack?: (packId: string) => void;
}

const DEFAULT_COPY = {
    fr: {
        heading: 'Nos Offres.',
        subheading: 'Des solutions claires, sans coûts cachés, adaptées à la maturité de votre projet.',
        recommendedBadge: 'Recommandé',
        buttonLabel: 'Choisir ce pack',
        faqTitle: 'Questions fréquentes',
        faqQuestions: [
            'Comment se passe le paiement ?',
            'Travaillez-vous avec des agences ?',
            'Assurez-vous la maintenance ?',
        ],
    },
    en: {
        heading: 'Our Offers.',
        subheading: 'Clear solutions with no hidden fees, tailored to your project maturity.',
        recommendedBadge: 'Recommended',
        buttonLabel: 'Select this pack',
        faqTitle: 'Frequently Asked Questions',
        faqQuestions: [
            'How does payment work?',
            'Do you collaborate with agencies?',
            'Do you handle maintenance?',
        ],
    },
} as const;

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, labels, onSelectPack }) => {
        const { language } = useTranslation();
        const baseCopy = DEFAULT_COPY[language];
        const mergedLabels: ServicesPageLabels = {
                ...baseCopy,
                ...labels,
                faqQuestions: labels?.faqQuestions ?? baseCopy.faqQuestions,
        };

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-24 text-center max-w-4xl mx-auto">
            <Reveal width="100%">
                <h1 className="font-display font-bold text-6xl md:text-8xl text-white mb-6">{mergedLabels.heading}<span className="text-primary">.</span></h1>
                <p className="text-xl text-neutral-400 font-light">
                    {mergedLabels.subheading}
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
                                {mergedLabels.recommendedBadge}
                            </div>
                        )}
                        <div className="mb-8">
                            <h3 className="text-2xl font-display font-bold text-white mb-2">{getLocalizedValue(language, pack.title, pack.title_en)}</h3>
                            <div className="text-3xl font-light text-neutral-300 mb-4">{getLocalizedValue(language, pack.price, pack.price_en)}</div>
                            <p className="text-neutral-500 text-sm min-h-[40px]">{getLocalizedValue(language, pack.description, pack.description_en)}</p>
                        </div>
                        
                        <div className="space-y-4 mb-8 flex-grow">
                            {getLocalizedList(language, pack.features, pack.features_en).map((feature, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-4 h-4 rounded-full border border-primary/50 flex items-center justify-center text-primary">
                                        <Check size={10} />
                                    </div>
                                    <span className="text-neutral-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                          onClick={() => onSelectPack?.(pack.id)}
                          className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
                            pack.popular 
                            ? 'bg-primary text-black hover:bg-white' 
                            : 'bg-white/10 text-white hover:bg-white hover:text-black'
                        }`}
                        >
                            {mergedLabels.buttonLabel}
                        </button>
                    </SpotlightCard>
                </Reveal>
            ))}
        </div>

        {/* Mini FAQ */}
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-20">
            <h2 className="font-display font-bold text-3xl text-white mb-12 text-center">{mergedLabels.faqTitle}</h2>
            <div className="space-y-4">
                {mergedLabels.faqQuestions.map((q, i) => (
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