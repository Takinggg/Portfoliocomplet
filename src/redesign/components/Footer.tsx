import React from 'react';
import { ArrowUp } from 'lucide-react';
import { PageView } from '../types';
import { useTranslation } from '../../utils/i18n/useTranslation';

interface FooterProps {
    onNavigate: (page: PageView) => void;
    language?: 'fr' | 'en';
}

const FOOTER_COPY = {
  fr: {
    socialsLabel: 'Réseaux',
    sitemapLabel: 'Plan du site',
    legalLabel: 'Légal',
    socialLinks: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maxence-foulon' },
      { label: 'Twitter / X', href: 'https://twitter.com' },
    ],
    sitemapItems: [
      { id: 'home', label: 'Accueil' },
      { id: 'services', label: 'Services' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'casestudies', label: 'Études de cas' },
    ] as Array<{ id: PageView; label: string }>,
    legalLinks: {
      privacy: 'Confidentialité',
      terms: 'Conditions générales',
      imprint: 'Mentions légales',
    },
    rgpd: 'Infrastructure conforme RGPD',
    system: 'Système v3.0.1',
  },
  en: {
    socialsLabel: 'Socials',
    sitemapLabel: 'Sitemap',
    legalLabel: 'Legal',
    socialLinks: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/maxence-foulon' },
      { label: 'Twitter / X', href: 'https://twitter.com' },
    ],
    sitemapItems: [
      { id: 'home', label: 'Home' },
      { id: 'services', label: 'Services' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'casestudies', label: 'Case Studies' },
    ] as Array<{ id: PageView; label: string }>,
    legalLinks: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      imprint: 'Legal Notice',
    },
    rgpd: 'RGPD compliant infrastructure',
    system: 'System v3.0.1',
  },
} as const;

const getLegalLinkSlugs = (lang: 'fr' | 'en') => (
  lang === 'en'
    ? { privacy: 'privacy', terms: 'terms', imprint: 'imprint' }
    : { privacy: 'confidentialite', terms: 'conditions', imprint: 'mentions-legales' }
);

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  const { language: currentLanguage } = useTranslation();
  const resolvedLanguage = language ?? currentLanguage;
  const copy = FOOTER_COPY[resolvedLanguage];
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const legalSlugs = getLegalLinkSlugs(resolvedLanguage);
  const legalLinks = Object.entries(copy.legalLinks).map(([key, label]) => ({
    label,
    href: `/${resolvedLanguage}/legal/${(legalSlugs as Record<string, string>)[key]}`,
  }));

  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/5 overflow-visible">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 flex-1">
                <div className="flex flex-col gap-4">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-2">{copy.socialsLabel}</h4>
                    {copy.socialLinks.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-2">{copy.sitemapLabel}</h4>
                    {copy.sitemapItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className="text-left text-neutral-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    <h4 className="text-xs text-neutral-500 uppercase tracking-widest mb-2">{copy.legalLabel}</h4>
                    {legalLinks.map((link) => (
                      <a key={link.href} href={link.href} className="text-neutral-400 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    ))}
                </div>
             </div>

             <button 
                onClick={scrollToTop}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 group"
            >
                <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            </button>
        </div>
    <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-neutral-600 gap-4">
      <span>© {new Date().getFullYear()} MAXENCE DESIGN</span>
      <div className="flex flex-wrap gap-4 text-neutral-500">
        <span>{copy.rgpd}</span>
        <span>{copy.system}</span>
      </div>
    </div>
      </div>
    </footer>
  );
};