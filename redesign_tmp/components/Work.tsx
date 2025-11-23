import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Project, PageView } from '../types';
import { Reveal } from './Reveal';

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

export const Work: React.FC<WorkProps> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="work" className="py-32 bg-[#050505] relative z-20" ref={containerRef}>
      
      {/* FLOATING CURSOR IMAGE */}
      <div 
        className="fixed top-0 left-0 w-[400px] h-[250px] pointer-events-none z-50 opacity-0 transition-opacity duration-300 overflow-hidden rounded-lg"
        style={{ 
            transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 125}px)`,
            opacity: activeIndex !== null ? 1 : 0
        }}
      >
        {projects.map((project, index) => (
             <img 
                key={project.id}
                src={project.image}
                alt={project.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    activeIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
             />
        ))}
      </div>

      <div className="container mx-auto px-6">
        
        <div className="flex items-end justify-between mb-24 border-b border-white/10 pb-8">
             <Reveal>
                <h2 className="font-display font-semibold text-6xl md:text-8xl text-white">Selected<br/>Works<span className="text-primary">.</span></h2>
            </Reveal>
            <Reveal delay={200}>
                <button 
                    onClick={() => onNavigate && onNavigate('casestudies')}
                    className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300 group"
                >
                    <span className="text-sm font-medium uppercase tracking-widest">View Archive</span>
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                </button>
            </Reveal>
        </div>

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <Reveal key={project.id} width="100%">
                <div 
                    className="group relative border-b border-white/10 py-12 cursor-pointer"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => onNavigate && onNavigate('casestudies')}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 mix-blend-difference">
                        <div className="flex items-baseline gap-8">
                            <span className="font-mono text-neutral-500 text-sm">0{index + 1}</span>
                            <h3 className="text-5xl md:text-7xl font-display font-medium text-white group-hover:translate-x-4 transition-transform duration-500">
                                {project.title}
                            </h3>
                        </div>
                        
                        <div className="flex items-center gap-8 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <div className="text-right hidden md:block">
                                <p className="text-white text-sm uppercase tracking-widest">{project.client}</p>
                                <p className="text-neutral-500 text-xs">{project.category}</p>
                            </div>
                             <span className="px-4 py-2 rounded-full border border-white/20 text-xs uppercase tracking-wider text-white">
                                Case Study
                            </span>
                        </div>
                    </div>
                </div>
            </Reveal>
          ))}
        </div>
        
        <div className="mt-24 md:hidden text-center">
             <button 
                onClick={() => onNavigate && onNavigate('casestudies')}
                className="px-8 py-4 border border-white/10 rounded-full text-white w-full hover:bg-white hover:text-black transition-all"
             >
                View All Projects
             </button>
        </div>

      </div>
    </section>
  );
};