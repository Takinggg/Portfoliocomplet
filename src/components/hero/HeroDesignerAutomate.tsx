import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { Sparkles, ArrowRight, Code2, Palette, Zap, Workflow, Target, TrendingUp, Clock, CheckCircle2, Database, Layout, Server, Shield, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "../../utils/i18n/useTranslation";

type HeroNavTarget =
  | "contact"
  | "projects"
  | "services"
  | "about"
  | "booking"
  | "project-detail";

interface HeroDesignerAutomateProps {
  onNavigate: (page: HeroNavTarget) => void;
}

export function HeroDesignerAutomate({ onNavigate }: HeroDesignerAutomateProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse follow effect for the background
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-12 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT COLUMN: Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 text-left"
        >
          {/* Availability Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:border-mint/30 transition-colors cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint"></span>
            </span>
            <span className="text-sm font-medium text-neutral-300">Available for new projects</span>
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              {t('home.hero.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint via-white to-mint bg-300% animate-gradient">
                {t('home.hero.highlight')}
              </span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-xl">
              {t('home.hero.description')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate("contact")}
              className="bg-mint text-[#0C0C0C] hover:bg-mint/90 h-14 px-8 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:shadow-[0_0_30px_rgba(0,255,194,0.5)] transition-all duration-300"
            >
              {t('home.hero.cta.secondary')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate("projects")}
              className="h-14 px-8 text-base font-medium rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white backdrop-blur-sm transition-all"
            >
              {t('home.hero.cta.primary')}
            </Button>
          </div>

          {/* Trust / Stats Row */}
          <div className="pt-8 border-t border-white/5">
            <p className="text-sm text-neutral-500 mb-4 font-medium uppercase tracking-wider">Trusted by innovative companies</p>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-2 text-neutral-400">
                <CheckCircle2 className="h-5 w-5 text-mint" />
                <span className="font-semibold text-white">50+</span> Projects
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <CheckCircle2 className="h-5 w-5 text-mint" />
                <span className="font-semibold text-white">98%</span> Satisfaction
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <CheckCircle2 className="h-5 w-5 text-mint" />
                <span className="font-semibold text-white">2h/j</span> Saved
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Visual Composition */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative hidden lg:block h-[600px] w-full perspective-1000"
        >
          {/* Floating Elements Container */}
          <motion.div 
            className="relative w-full h-full transform-style-3d"
            animate={{ 
              rotateY: mousePosition.x * 5,
              rotateX: mousePosition.y * -5
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          >
            {/* 1. Back Layer - Code Editor */}
            <motion.div 
              className="absolute top-10 right-10 w-[400px] h-[300px] rounded-xl bg-[#1E1E1E] border border-white/10 shadow-2xl p-4 z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="text-purple-400">const <span className="text-yellow-300">App</span> = () ={'>'} {'{'}</div>
                <div className="pl-4 text-blue-300">return (</div>
                <div className="pl-8 text-green-300">{'<Hero'}</div>
                <div className="pl-12 text-cyan-300">title="Future"</div>
                <div className="pl-12 text-cyan-300">animate={'{true}'}</div>
                <div className="pl-8 text-green-300">{'/>'}</div>
                <div className="pl-4 text-blue-300">);</div>
                <div className="text-purple-400">{'}'};</div>
              </div>
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-mint/20 blur-3xl -z-10" />
            </motion.div>

            {/* 2. Middle Layer - UI Card */}
            <motion.div 
              className="absolute top-[150px] left-[50px] w-[380px] h-auto min-h-[240px] rounded-xl bg-[#0C0C0C] border border-white/10 shadow-2xl p-6 z-20"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-mint" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Growth</div>
                    <div className="text-xs text-neutral-400">+24% this week</div>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-mint/10 text-mint text-xs font-bold">+12.5%</div>
              </div>
              <div className="h-24 w-full flex items-end gap-2 mb-4">
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    className="flex-1 bg-gradient-to-t from-mint/10 to-mint rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 1 + i * 0.1 }}
                  />
                ))}
              </div>
              
              {/* Additional Info Row */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                <div className="text-center">
                  <div className="text-xs text-neutral-500">Users</div>
                  <div className="text-sm font-bold text-white">12.5k</div>
                </div>
                <div className="text-center border-l border-white/5">
                  <div className="text-xs text-neutral-500">Revenue</div>
                  <div className="text-sm font-bold text-white">$45k</div>
                </div>
                <div className="text-center border-l border-white/5">
                  <div className="text-xs text-neutral-500">Conv.</div>
                  <div className="text-sm font-bold text-white">3.2%</div>
                </div>
              </div>
            </motion.div>

            {/* 3. Front Layer - Automation Node */}
            <motion.div 
              className="absolute bottom-[50px] right-[80px] w-[280px] h-[100px] rounded-xl bg-white/5 backdrop-blur-md border border-mint/30 shadow-2xl p-4 z-30 flex items-center gap-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="w-12 h-12 rounded-lg bg-mint flex items-center justify-center shadow-lg shadow-mint/20">
                <Zap className="h-6 w-6 text-black" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Automation Active</div>
                <div className="text-xs text-mint flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                  Processing data...
                </div>
              </div>
            </motion.div>

            {/* Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
              <motion.path 
                d="M 350 150 L 240 270" 
                stroke="#00FFC2" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path 
                d="M 240 270 L 400 450" 
                stroke="#00FFC2" 
                strokeWidth="2" 
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Tech Stack Marquee */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/80 to-transparent flex items-end pb-6 overflow-hidden pointer-events-none">
        <div className="flex gap-16 animate-scroll w-max pl-16">
          {[...[ReactIcon, TSIcon, TailwindIcon, SupabaseIcon, FigmaIcon, StripeIcon, NodeIcon], ...[ReactIcon, TSIcon, TailwindIcon, SupabaseIcon, FigmaIcon, StripeIcon, NodeIcon], ...[ReactIcon, TSIcon, TailwindIcon, SupabaseIcon, FigmaIcon, StripeIcon, NodeIcon]].map((Icon, i) => (
            <div key={i} className="text-neutral-600 hover:text-mint transition-colors duration-300">
              <Icon className="h-8 w-8 opacity-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple Icon Components for the marquee
const ReactIcon = (props: any) => <Code2 {...props} />; // Placeholder
const TSIcon = (props: any) => <Layout {...props} />; // Placeholder
const TailwindIcon = (props: any) => <Palette {...props} />; // Placeholder
const SupabaseIcon = (props: any) => <Database {...props} />; // Placeholder
const FigmaIcon = (props: any) => <Target {...props} />; // Placeholder
const StripeIcon = (props: any) => <Shield {...props} />; // Placeholder
const NodeIcon = (props: any) => <Server {...props} />; // Placeholder
