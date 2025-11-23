import React from 'react';
import { Reveal } from './Reveal';
import { Search, PenTool, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    id: "01",
    icon: Search,
    title: "Discovery",
    subtitle: "Audit & Stratégie",
    description: "Nous définissons ensemble les fondations. Analyse profonde de l'existant et définition des KPIs.",
    tags: ["Audit Technique", "User Journey", "Scope"]
  },
  {
    id: "02",
    icon: PenTool,
    title: "Design",
    subtitle: "UI/UX & Architecture",
    description: "Création de maquettes interactives et de systèmes de design scalables. L'esthétique rencontre la fonction.",
    tags: ["Figma", "Design System", "Prototyping"]
  },
  {
    id: "03",
    icon: Code2,
    title: "Development",
    subtitle: "Code & Intégration",
    description: "Développement Front-End moderne (React/Next.js). Code propre, performant et optimisé SEO.",
    tags: ["React 19", "Supabase", "Motion"]
  },
  {
    id: "04",
    icon: Rocket,
    title: "Delivery",
    subtitle: "Scale & Growth",
    description: "Déploiement, tests E2E et formation. Nous vous donnons les clés pour gérer votre croissance.",
    tags: ["CI/CD", "Analytics", "Training"]
  }
];

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-32 bg-[#050505]">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <Reveal>
                <h2 className="font-display font-semibold text-5xl md:text-7xl text-white leading-tight">
                    La Méthode<span className="text-primary">.</span>
                </h2>
            </Reveal>
            <Reveal delay={200}>
                <p className="text-neutral-400 max-w-md font-light leading-relaxed text-lg">
                    4 étapes clés pour transformer une vision complexe en une réalité digitale performante.
                </p>
            </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {steps.map((step, index) => (
                <Reveal key={index} delay={index * 100} className="h-full">
                    <div className="group h-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-[#0F0F0F]">
                        
                        {/* Blueprint Grid Background */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                        {/* Decorative Number Background */}
                        <div className="absolute -right-4 -top-4 text-[120px] font-display font-bold text-white/5 group-hover:text-white/10 transition-colors leading-none select-none">
                            {step.id}
                        </div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:bg-primary group-hover:text-black group-hover:scale-110 transition-all duration-300">
                                <step.icon size={20} />
                            </div>

                            <div className="mb-6">
                                <h3 className="text-3xl font-display font-bold text-white mb-1">{step.title}</h3>
                                <span className="text-primary text-sm uppercase tracking-widest font-medium">{step.subtitle}</span>
                            </div>

                            <p className="text-neutral-400 leading-relaxed mb-8 border-l-2 border-white/10 pl-4 group-hover:border-primary/50 transition-colors">
                                {step.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {step.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-neutral-400 group-hover:text-white transition-colors">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>

      </div>
    </section>
  );
};