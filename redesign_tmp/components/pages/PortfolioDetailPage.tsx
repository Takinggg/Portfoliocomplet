import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Reveal } from '../Reveal';
import { Project } from '../../types';

// Mock Data for the selected item (in a real app, you'd fetch this by ID)
const itemDetails: Project = {
    id: 1,
    title: "Abstract UI System",
    category: "Art Direction",
    client: "Studio Alpha",
    year: "2024",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    description: "Une exploration visuelle des frontières entre l'interface utilisateur et l'art abstrait. Ce projet vise à déconstruire les grilles conventionnelles pour créer une expérience numérique fluide et organique.",
    link: "#",
    tags: ["UI/UX", "Art Direction"],
    gallery: [
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2600&auto=format&fit=crop"
    ]
};

interface PortfolioDetailPageProps {
    id: number;
    onBack: () => void;
}

export const PortfolioDetailPage: React.FC<PortfolioDetailPageProps> = ({ id, onBack }) => {
  // In a real app, use `id` to fetch data. Using mock `itemDetails` for now.

  return (
    <div className="bg-background min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 w-full z-40 px-6 py-6 pointer-events-none">
          <div className="container mx-auto flex justify-between">
            <button 
                onClick={onBack}
                className="pointer-events-auto flex items-center gap-3 text-white mix-blend-difference hover:text-primary transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                <span className="uppercase tracking-widest text-xs font-bold">Back to Archive</span>
            </button>
          </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[80vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
            src={itemDetails.image} 
            alt={itemDetails.title} 
            className="w-full h-full object-cover parallax-img"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black via-black/50 to-transparent pt-32">
             <div className="container mx-auto">
                <Reveal>
                    <h1 className="font-display font-bold text-[8vw] leading-[0.9] text-white uppercase mb-4">
                        {itemDetails.title}
                    </h1>
                </Reveal>
                <div className="flex flex-wrap gap-6 text-sm font-mono text-neutral-300">
                    <span className="px-3 py-1 border border-white/20 rounded-full">{itemDetails.category}</span>
                    <span className="px-3 py-1 border border-white/20 rounded-full">{itemDetails.year}</span>
                    <span className="px-3 py-1 border border-white/20 rounded-full">{itemDetails.client}</span>
                </div>
             </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-12">
                    <Reveal>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">The Challenge</h3>
                        <p className="text-xl text-white font-light leading-relaxed">
                            {itemDetails.description}
                        </p>
                    </Reveal>
                    
                    <Reveal delay={200}>
                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">Role</h4>
                                <p className="text-white">Art Direction</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">Agency</h4>
                                <p className="text-white">Freelance</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">Timeline</h4>
                                <p className="text-white">4 Weeks</p>
                            </div>
                             <div>
                                <h4 className="text-xs text-neutral-500 uppercase mb-1">Deliverables</h4>
                                <p className="text-white">UI Kit, 3D Assets</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Main Content & Gallery */}
            <div className="lg:col-span-8 space-y-24">
                <Reveal delay={100}>
                    <p className="text-3xl md:text-5xl font-display font-medium text-white leading-tight">
                        "Un design qui ne se contente pas d'être beau, mais qui raconte une histoire à travers chaque pixel, chaque interaction et chaque mouvement."
                    </p>
                </Reveal>

                {itemDetails.gallery?.map((img, index) => (
                    <Reveal key={index} width="100%">
                        <div className="relative group overflow-hidden rounded-lg">
                            <img 
                                src={img} 
                                alt={`Gallery ${index}`} 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                             <div className="absolute bottom-4 right-4 text-xs font-mono text-white/50 bg-black/50 px-2 py-1 rounded">
                                FIG {index + 1}.0
                            </div>
                        </div>
                    </Reveal>
                ))}

                <Reveal>
                    <div className="bg-[#111] p-12 rounded-2xl border border-white/5 text-center">
                        <h3 className="font-display text-2xl text-white mb-4">Technology Stack</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['React', 'WebGL', 'Three.js', 'Tailwind', 'Blender'].map(tech => (
                                <span key={tech} className="px-4 py-2 bg-white/5 rounded text-neutral-400 text-sm">{tech}</span>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
      </div>

      {/* Next Project Footer */}
      <div className="border-t border-white/10 bg-[#0A0A0A] py-32 group cursor-pointer relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 block group-hover:text-primary transition-colors">Next Project</span>
            <h2 className="text-[6vw] font-display font-bold text-white uppercase leading-none group-hover:scale-105 transition-transform duration-500 origin-center">
                Neon City
            </h2>
             <div className="mt-8 flex justify-center">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-300">
                    <ArrowRight size={24} />
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};