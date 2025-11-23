import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project, PageView } from '../types';
import { Reveal } from './Reveal';
import { useTranslation } from '../../utils/i18n/useTranslation';

// Reusing same mock data structure for Home Page preview for simplicity in this refactor, 
// normally would accept props but Home component structure needs deeper refactor to pass props down through Home -> Work. 
// For now, keeping static list consistent with App.tsx initial state for visual consistency.
const projects: Project[] = [
  {
    id: 1,
    title: "Velvet Finance",
    client: "Velvet Bank",
    category: "Fintech App",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    description: "Redefining banking for the new generation with radical simplicity.",
    tags: ["Mobile", "Strategy"],
    link: "#"
  },
  {
    id: 2,
    title: "Chronos",
    client: "Chronos Tech",
    category: "SaaS Dashboard",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    description: "A powerful analytics platform designed for high-velocity teams.",
    tags: ["Web App", "System"],
    link: "#"
  },
  {
    id: 3,
    title: "Maison Noire",
    client: "LVMH Group",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2670&auto=format&fit=crop",
    description: "Luxury fashion digital flagship with immersive product storytelling.",
    tags: ["Design", "WebGL"],
    link: "#"
  },
  {
    id: 4,
    title: "Aerolabs",
    client: "SpaceX",
    category: "Design System",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
    description: "Comprehensive interface guidelines for mission control software.",
    tags: ["Figma", "Documentation"],
    link: "#"
  }
];

interface WorkProps {
    onNavigate?: (page: PageView) => void;
}

const WORK_COPY = {
  fr: {
    titleLine1: 'Projets',
    titleLine2: 'sélectionnés',
    viewArchive: 'Voir les archives',
    badge: 'Étude de cas',
    mobileCta: 'Voir tous les projets',
  },
  en: {
    titleLine1: 'Selected',
    titleLine2: 'Works',
    viewArchive: 'View archive',
    badge: 'Case study',
    mobileCta: 'View all projects',
  },
} as const;

export const Work: React.FC<WorkProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const copy = WORK_COPY[language];
  const [highlightIndex, setHighlightIndex] = useState(0);

  return (
    <section id="work" className="py-32 bg-[#050505] relative z-20">
      <div className="container mx-auto px-6">
        
        <div className="flex items-end justify-between mb-24 border-b border-white/10 pb-8">
             <Reveal>
            <h2 className="font-display font-semibold text-6xl md:text-8xl text-white">{copy.titleLine1}<br/>{copy.titleLine2}<span className="text-primary">.</span></h2>
            </Reveal>
            <Reveal delay={200}>
                <button 
                    onClick={() => onNavigate && onNavigate('casestudies')}
                    className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300 group"
                >
              <span className="text-sm font-medium uppercase tracking-widest">{copy.viewArchive}</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                </button>
            </Reveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col divide-y divide-white/5 border-t border-b border-white/10">
            {projects.map((project, index) => (
              <Reveal key={project.id} width="100%">
                <button
                  type="button"
                  onMouseEnter={() => setHighlightIndex(index)}
                  onFocus={() => setHighlightIndex(index)}
                  onClick={() => onNavigate && onNavigate('casestudies')}
                  className={`w-full text-left py-10 transition-colors ${
                    highlightIndex === index ? 'bg-white/5' : 'bg-transparent'
                  }`}
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-neutral-500 text-sm">0{index + 1}</span>
                        <h3 className="text-4xl md:text-5xl font-display text-white">{project.title}</h3>
                      </div>
                      <p className="text-neutral-400 max-w-2xl">{project.description}</p>
                    </div>
                    <div className="flex flex-col items-start gap-3 text-xs uppercase tracking-widest text-white/70">
                      <span>{project.client}</span>
                      <span className="text-white/40">{project.category}</span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="hidden lg:flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 sticky top-32">
            <span className="text-xs font-mono uppercase tracking-[0.5em] text-white/50">{copy.badge}</span>
            <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/5">
              <img
                src={projects[highlightIndex].image}
                alt={projects[highlightIndex].title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-white/60">{projects[highlightIndex].client}</p>
              <h3 className="text-3xl font-display text-white mt-1">{projects[highlightIndex].title}</h3>
              <p className="text-neutral-400 mt-4">{projects[highlightIndex].description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {projects[highlightIndex].tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs uppercase tracking-widest text-white/70">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate && onNavigate('casestudies')}
              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:text-primary"
            >
              {copy.viewArchive}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        
        <div className="mt-24 md:hidden text-center">
             <button 
                onClick={() => onNavigate && onNavigate('casestudies')}
                className="px-8 py-4 border border-white/10 rounded-full text-white w-full hover:bg-white hover:text-black transition-all"
             >
               {copy.mobileCta}
             </button>
        </div>

      </div>
    </section>
  );
};