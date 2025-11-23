import React, { useMemo, useState } from 'react';
import { Reveal } from '../Reveal';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';
import { useTranslation } from '../../../utils/i18n/useTranslation';
import { getLocalizedValue } from '../../../utils/i18n/localeUtils';

interface CaseStudiesPageLabels {
    heading: string;
    allFilter: string;
}

interface CaseStudiesPageProps {
        projects: Project[];
        onProjectClick?: (id: string | number) => void;
        labels?: Partial<CaseStudiesPageLabels>;
}

const CASE_STUDIES_COPY = {
    fr: {
        heading: 'Études de cas',
        allFilter: 'Toutes',
    },
    en: {
        heading: 'Case Studies',
        allFilter: 'All',
    },
} as const;

const CATEGORY_LABELS = {
    Fintech: { fr: 'Fintech', en: 'Fintech' },
    'E-Commerce': { fr: 'E-commerce', en: 'E-Commerce' },
    SaaS: { fr: 'SaaS', en: 'SaaS' },
    Mobile: { fr: 'Mobile', en: 'Mobile' },
    Web3: { fr: 'Web3', en: 'Web3' },
};

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({ projects, onProjectClick, labels }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
        const { language } = useTranslation();
        const baseCopy = CASE_STUDIES_COPY[language];
        const mergedLabels = { ...baseCopy, ...labels };

        const categories = useMemo(() => {
            const unique = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))) as string[];
            return [
                { label: mergedLabels.allFilter, value: null },
                ...unique.map((category) => {
                    const dict = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];
                    const label = dict ? dict[language] : category;
                    return { label, value: category };
                }),
            ];
        }, [language, mergedLabels.allFilter, projects]);

    const filteredProjects = selectedCategory 
        ? projects.filter((p) => p.category === selectedCategory)
        : projects;

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <Reveal>
                <h1 className="font-display font-bold text-6xl md:text-8xl text-white">{mergedLabels.heading}<span className="text-primary">.</span></h1>
            </Reveal>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map(({ label, value }) => (
                    <button 
                        key={label}
                        onClick={() => setSelectedCategory(value)}
                        className={`px-6 py-2 rounded-full border text-sm uppercase tracking-widest transition-all whitespace-nowrap ${
                            selectedCategory === value 
                            ? 'bg-white text-black border-white' 
                            : 'border-white/10 text-neutral-400 hover:border-white hover:text-white'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-40">
            {filteredProjects.map((project) => (
                <Reveal key={project.id} width="100%">
                    <div 
                        onClick={() => onProjectClick && onProjectClick(project.id)}
                        className="group cursor-pointer border-b border-white/5 pb-20 last:border-0"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            
                            {/* Project Visual */}
                            <div className="lg:col-span-7 order-2 lg:order-1">
                                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                                    <div className="absolute inset-0 bg-neutral-900/50 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                    <img 
                                        src={project.image} 
                                        alt={project.title} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-primary text-xs uppercase tracking-widest font-bold">{project.category}</span>
                                        <div className="h-[1px] w-10 bg-white/10"></div>
                                        <span className="text-neutral-500 text-xs uppercase tracking-widest">{project.client}</span>
                                    </div>
                                    
                                    <h2 className="text-5xl font-display font-bold text-white mb-8 group-hover:text-primary transition-colors">
                                        {getLocalizedValue(language, project.title, project.title_en)}
                                    </h2>
                                    
                                    <p className="text-xl text-neutral-300 font-light leading-relaxed mb-12">
                                        {getLocalizedValue(language, project.description, project.description_en)}
                                    </p>

                                    <div className="flex flex-wrap gap-3 mb-12">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 rounded text-xs text-neutral-400 uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex gap-8">
                                        {project.stats?.map((stat, i) => (
                                            <div key={i}>
                                                <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                                                <div className="text-xs text-neutral-500 uppercase">{getLocalizedValue(language, stat.label, stat.label_en)}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300">
                                        <ArrowUpRight size={24} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </Reveal>
            ))}
        </div>

      </div>
    </div>
  );
};