import React, { useMemo, useState } from 'react';
import { Reveal } from '../Reveal';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';
import { PortfolioDetailPage } from './PortfolioDetailPage';
import { redesignProjects } from '../../data';
import { useTranslation } from '../../../utils/i18n/useTranslation';
import { getLocalizedValue } from '../../../utils/i18n/localeUtils';

const FILTERS = [
    { value: 'all', key: 'all' },
    { value: 'Fintech', key: 'fintech' },
    { value: 'SaaS', key: 'saas' },
    { value: 'E-Commerce', key: 'ecommerce' },
    { value: 'Mobile', key: 'mobile' },
    { value: 'Web3', key: 'web3' },
    { value: 'AI', key: 'ai' },
    { value: 'Other', key: 'other' },
];

const CATEGORY_LABELS = {
    Fintech: { fr: 'Fintech', en: 'Fintech' },
    'E-Commerce': { fr: 'E-commerce', en: 'E-Commerce' },
    SaaS: { fr: 'SaaS', en: 'SaaS' },
    Mobile: { fr: 'Mobile', en: 'Mobile' },
    Web3: { fr: 'Web3', en: 'Web3' },
    AI: { fr: 'IA', en: 'AI' },
    Other: { fr: 'Autre', en: 'Other' },
};

const PORTFOLIO_COPY = {
    fr: {
        title: { line1: 'Archive', line2: 'visuelle' },
        filters: {
            all: 'Tous', fintech: 'Fintech', saas: 'SaaS', ecommerce: 'E-commerce',
            mobile: 'Mobile', web3: 'Web3', ai: 'IA', other: 'Autres'
        },
    },
    en: {
        title: { line1: 'Visual', line2: 'Archive' },
        filters: {
            all: 'All', fintech: 'Fintech', saas: 'SaaS', ecommerce: 'E-Commerce',
            mobile: 'Mobile', web3: 'Web3', ai: 'AI', other: 'Other'
        },
    },
} as const;

interface PortfolioPageProps {
    items?: Project[];
    onProjectClick?: (id: string | number) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ items, onProjectClick }) => {
    const [filter, setFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const { language } = useTranslation();
    const copy = PORTFOLIO_COPY[language];
    const filters = useMemo(() => FILTERS.map((entry) => ({
        value: entry.value,
        label: copy.filters[entry.key as keyof typeof copy.filters] ?? entry.value,
    })), [copy.filters]);

    const projects = items && items.length > 0 ? items : redesignProjects;

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        onProjectClick?.(project.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextProject = () => {
        if (!selectedProject || projects.length === 0) return;
        const currentIndex = projects.findIndex((proj) => proj.id === selectedProject.id);
        const nextIndex = (currentIndex + 1) % projects.length;
        setSelectedProject(projects[nextIndex]);
    };

    if (selectedProject) {
        return (
            <PortfolioDetailPage
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onNext={projects.length > 1 ? handleNextProject : undefined}
            />
        );
    }

    const filteredItems = filter === 'all' 
        ? projects 
        : projects.filter(item => item.category === filter);

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <Reveal>
                <h1 className="font-display font-bold text-6xl md:text-8xl text-white">{copy.title.line1}<br/>{copy.title.line2}<span className="text-primary">.</span></h1>
            </Reveal>
            
            {/* Filter Pills */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                {filters.map(cat => (
                    <button 
                        key={cat.value}
                        onClick={() => setFilter(cat.value)}
                        className={`text-sm font-medium uppercase tracking-widest transition-all whitespace-nowrap px-4 py-2 rounded-full border ${
                            filter === cat.value 
                            ? 'bg-white text-black border-white' 
                            : 'border-white/10 text-neutral-500 hover:border-white hover:text-white'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item) => (
                <Reveal key={item.id} width="100%">
                    <div 
                        onClick={() => handleSelectProject(item)}
                        className="group relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer mb-8 border border-white/5 bg-[#0A0A0A]"
                    >
                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8 backdrop-blur-sm">
                            <span className="text-primary text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 mb-2">
                                {item.client}
                            </span>
                            <h3 className="text-3xl font-display font-medium text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                {getLocalizedValue(language, item.title, item.title_en)}
                            </h3>
                            <div className="mt-4 w-12 h-[1px] bg-white/30 group-hover:w-full transition-all duration-700 delay-100"></div>
                            <div className="mt-4 flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                <span className="text-xs text-neutral-300 uppercase">{(CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]?.[language]) ?? item.category}</span>
                                <span className="text-xs text-neutral-300 font-mono">2024</span>
                            </div>
                         </div>
                         
                         {/* Image */}
                         <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full aspect-square object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                         />
                         
                         {/* Floating Action Button */}
                         <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-black hover:scale-110">
                            <ArrowUpRight size={20} />
                         </div>
                    </div>
                </Reveal>
            ))}
        </div>

      </div>
    </div>
  );
};