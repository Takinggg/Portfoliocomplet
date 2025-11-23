import React from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle, Database, Layout, Cpu, Quote, Smartphone, Cloud, Server, Globe, Zap, Layers } from 'lucide-react';
import { Reveal } from '../Reveal';

// Mock Data for the selected case study
const studyData = {
    id: 1,
    title: "Velvet Finance",
    subtitle: "Reinventing Banking for Gen Z",
    client: "Velvet Bank",
    timeline: "3 Months",
    role: "Lead Product Designer & Frontend Dev",
    challenge: "Velvet Bank wanted to disrupt the traditional banking market with a mobile-first experience. The challenge was to build a secure, real-time banking infrastructure while maintaining a playful, gamified user interface that appeals to Gen Z.",
    solution: "We engineered a headless architecture separating the core banking logic from the UI layer. This allowed us to iterate rapidly on the frontend without compromising security. We used React Native Reanimated for 60fps interactions and Supabase for real-time transaction updates.",
    stats: [
        { label: "Active Users", value: "50,000+", change: "+120% MoM" },
        { label: "App Store Rating", value: "4.9", change: "Top 5 Finance" },
        { label: "Transaction Vol", value: "$2M+", change: "Daily processed" },
        { label: "Load Time", value: "0.8s", change: "Global avg" },
    ],
    techStack: [
        { name: "React Native", category: "Mobile Framework" },
        { name: "Supabase", category: "Backend / Auth" },
        { name: "Next.js", category: "Admin Panel" },
        { name: "Reanimated", category: "Animation Engine" },
        { name: "TypeScript", category: "Language" },
        { name: "Tailwind", category: "Styling" },
        { name: "Vercel", category: "Deployment" }
    ],
    feedback: {
        quote: "The new architecture cut our load times in half. Maxence didn't just write code, he re-engineered our entire business logic to be scalable for the next 5 years.",
        author: "Sarah Jenkins",
        role: "CTO @ Velvet Bank"
    }
};

interface CaseStudyDetailPageProps {
    id: number;
    onBack: () => void;
}

export const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({ id, onBack }) => {
  return (
    <div className="bg-background min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-700 font-sans text-white">
      
      {/* HEADER NAV */}
      <div className="fixed top-0 left-0 w-full z-40 px-6 py-6 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center">
            <button 
                onClick={onBack}
                className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
                <span className="uppercase tracking-widest text-xs font-bold font-mono">Back to Index</span>
            </button>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-mono text-green-500 uppercase">Case Study #{id.toString().padStart(2, '0')}</span>
            </div>
          </div>
      </div>

      <div className="container mx-auto px-6 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <div className="mb-24">
            <Reveal>
                <div className="flex flex-col md:flex-row gap-8 md:items-end justify-between border-b border-white/10 pb-12 mb-12">
                    <div>
                        <h4 className="text-primary font-mono text-sm uppercase tracking-widest mb-4">{studyData.client}</h4>
                        <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight mb-4">
                            {studyData.title}
                        </h1>
                        <p className="text-xl text-neutral-400 font-light max-w-2xl">
                            {studyData.subtitle}
                        </p>
                    </div>
                    <a href="#" className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-sm uppercase hover:bg-primary transition-colors">
                        Live Project <ArrowUpRight size={18} />
                    </a>
                </div>
            </Reveal>

            {/* METADATA GRID */}
            <Reveal delay={100}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-[#0A0A0A] p-8 rounded-xl border border-white/5">
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Role</div>
                        <div className="text-white font-medium">{studyData.role}</div>
                    </div>
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Timeline</div>
                        <div className="text-white font-medium">{studyData.timeline}</div>
                    </div>
                     <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Platform</div>
                        <div className="flex gap-2">
                             <span className="text-white font-medium">iOS</span>
                             <span className="text-neutral-600">/</span>
                             <span className="text-white font-medium">Android</span>
                        </div>
                    </div>
                     <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Deliverables</div>
                        <div className="text-white font-medium">Mobile App, Design System</div>
                    </div>
                </div>
            </Reveal>
        </div>

        {/* STATS IMPACT */}
        <section className="mb-32">
            <Reveal>
                <h3 className="text-2xl font-display font-medium text-white mb-8">Business Impact</h3>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {studyData.stats.map((stat, i) => (
                    <Reveal key={i} delay={i * 100}>
                        <div className="bg-[#0F0F0F] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-white/20 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Layout size={64} />
                            </div>
                            <div className="relative z-10">
                                <div className="text-4xl font-display font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-neutral-400 font-medium mb-1">{stat.label}</div>
                                <div className="text-xs text-green-500 font-mono bg-green-500/10 inline-block px-2 py-1 rounded">
                                    {stat.change}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>

        {/* NARRATIVE & ARCHITECTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-20">
                <Reveal>
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Cpu size={20} /></div>
                            <h2 className="text-2xl font-display font-bold text-white">The Challenge</h2>
                        </div>
                        <p className="text-lg text-neutral-300 leading-relaxed font-light">
                            {studyData.challenge}
                        </p>
                    </section>
                </Reveal>

                <Reveal>
                     <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg"><CheckCircle size={20} /></div>
                            <h2 className="text-2xl font-display font-bold text-white">The Solution</h2>
                        </div>
                        <p className="text-lg text-neutral-300 leading-relaxed font-light mb-8">
                            {studyData.solution}
                        </p>
                        <ul className="space-y-4">
                            {['Implemented Optimistic UI for instant feedback', 'Encrypted local storage for biometric auth', 'Server-side rendering for marketing pages'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-neutral-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5"></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </Reveal>
            </div>

            {/* Right Architecture & Stack */}
            <div className="lg:col-span-5">
                <div className="sticky top-32">
                    
                    {/* SYSTEM ARCHITECTURE DIAGRAM */}
                    <Reveal delay={200}>
                        <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden shadow-2xl mb-8 relative group">
                            
                            {/* Header */}
                            <div className="bg-[#0F0F0F] px-5 py-3 border-b border-white/5 flex items-center justify-between z-20 relative">
                                <div className="flex items-center gap-2">
                                    <Layers size={14} className="text-neutral-500" />
                                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Architecture Map</span>
                                </div>
                                <div className="flex gap-3 text-[10px] font-mono text-neutral-600">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ONLINE</span>
                                    <span>LATENCY: 12ms</span>
                                </div>
                            </div>
                            
                            <div className="p-8 relative min-h-[460px] flex flex-col items-center justify-center gap-12">
                                {/* Background Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none"></div>

                                {/* Styles for animations */}
                                <style>
                                    {`
                                    @keyframes data-drop {
                                        0% { transform: translateY(-100%); opacity: 0; }
                                        50% { opacity: 1; }
                                        100% { transform: translateY(200%); opacity: 0; }
                                    }
                                    .animate-drop { animation: data-drop 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                                    .animate-drop-delay { animation: data-drop 2s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s; }
                                    `}
                                </style>

                                {/* Connecting Lines (Vertical) */}
                                <div className="absolute inset-0 flex justify-center pointer-events-none">
                                    <div className="w-[1px] h-full bg-white/5 relative overflow-hidden">
                                        {/* Invisible structural line, data drops are in nodes */}
                                    </div>
                                </div>

                                {/* Node 1: Client */}
                                <div className="relative group/node z-10 w-full flex justify-center">
                                    <div className="absolute top-full left-1/2 w-[1px] h-12 bg-white/10 -translate-x-1/2 overflow-hidden">
                                        <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/0 to-blue-500 animate-drop"></div>
                                    </div>
                                    <div className="bg-[#151515] border border-white/10 p-4 rounded-xl flex items-center gap-4 w-72 shadow-lg hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] transition-all duration-300 relative">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase mb-0.5">Presentation Layer</div>
                                            <div className="text-sm font-bold text-white">Mobile Application</div>
                                            <div className="text-[10px] text-neutral-400">React Native / TypeScript</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Node 2: Edge */}
                                <div className="relative group/node z-10 w-full flex justify-center">
                                    <div className="absolute top-full left-1/2 w-[1px] h-12 bg-white/10 -translate-x-1/2 overflow-hidden">
                                        <div className="w-full h-1/2 bg-gradient-to-b from-purple-500/0 to-purple-500 animate-drop-delay"></div>
                                    </div>
                                    <div className="bg-[#151515] border border-white/10 p-4 rounded-xl flex items-center gap-4 w-72 shadow-lg hover:border-purple-500/50 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] transition-all duration-300 relative">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                                            <Cloud size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase mb-0.5">Edge Network</div>
                                            <div className="text-sm font-bold text-white">API Gateway</div>
                                            <div className="text-[10px] text-neutral-400">Next.js Middleware / Vercel</div>
                                        </div>
                                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 hidden md:block">
                                            <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] text-purple-400 font-mono whitespace-nowrap">
                                                gRPC / HTTPS
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Node 3: Database */}
                                <div className="relative group/node z-10 w-full flex justify-center">
                                    <div className="bg-[#151515] border border-white/10 p-4 rounded-xl flex items-center gap-4 w-72 shadow-lg hover:border-green-500/50 hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)] transition-all duration-300 relative">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase mb-0.5">Persistence Layer</div>
                                            <div className="text-sm font-bold text-white">PostgreSQL DB</div>
                                            <div className="text-[10px] text-neutral-400">Supabase Managed</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Reveal>

                    {/* TECH STACK LIST */}
                    <Reveal delay={250}>
                        <div className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 mb-8">
                             <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">Full Tech Stack</h4>
                             <div className="flex flex-wrap gap-2">
                                {studyData.techStack.map((tech, i) => (
                                    <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 hover:border-white/20 rounded text-xs text-neutral-300 hover:text-white transition-colors cursor-default">
                                        {tech.name}
                                    </div>
                                ))}
                             </div>
                        </div>
                    </Reveal>

                    {/* CLIENT VERDICT */}
                    <Reveal delay={300}>
                        <div className="bg-[#0F0F0F] border border-white/5 p-8 rounded-xl relative group">
                            {/* Left Accent Line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors duration-300 rounded-l-xl"></div>
                            
                            <Quote size={28} className="text-neutral-600 mb-6 group-hover:text-white transition-colors" />
                            
                            <p className="text-neutral-300 font-light italic leading-relaxed mb-8 text-lg">
                                "{studyData.feedback.quote}"
                            </p>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    SJ
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{studyData.feedback.author}</div>
                                    <div className="text-xs text-neutral-500 font-mono uppercase tracking-wide">{studyData.feedback.role}</div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>

        </div>

        {/* VISUAL GALLERY */}
        <section className="mt-32 space-y-8">
             <Reveal width="100%">
                 <h3 className="text-2xl font-display font-medium text-white mb-8">Interface Gallery</h3>
             </Reveal>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Reveal width="100%">
                     <div className="bg-[#111] rounded-xl overflow-hidden border border-white/5 aspect-[4/3] relative group">
                         <div className="absolute inset-0 bg-neutral-800/50 animate-pulse"></div>
                         {/* Placeholder for real image */}
                         <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-xs">
                             [ UI SCREENSHOT 01 ]
                         </div>
                     </div>
                 </Reveal>
                  <Reveal width="100%" delay={100}>
                     <div className="bg-[#111] rounded-xl overflow-hidden border border-white/5 aspect-[4/3] relative group">
                         <div className="absolute inset-0 bg-neutral-800/50 animate-pulse"></div>
                         <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-xs">
                             [ UI SCREENSHOT 02 ]
                         </div>
                     </div>
                 </Reveal>
             </div>
        </section>

      </div>

    </div>
  );
};