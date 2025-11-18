import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Sparkles, ArrowRight, Code2, Palette, Zap, Workflow, Target, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      
      {/* Gradient Mesh Background */}
      <motion.div 
        className="absolute inset-0 gradient-mesh pointer-events-none"
        style={{ opacity }}
      />
      
      {/* Floating Orbs - Neutral */}
      <motion.div
        className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main Content */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20"
        style={{ y }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-mint-10"
            >
              <Sparkles className="h-4 w-4 text-mint" />
              <span className="text-sm text-mint font-medium">UI/UX Engineer • Designer • Développeur</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Transformez vos idées en
                <span className="block mt-2 text-gradient-mint-animated">
                  expériences digitales
                </span>
              </h1>
              <p className="text-xl text-neutral-400 leading-relaxed max-w-xl">
                Design élégant, code performant et automatisation intelligente. 
                Je créé des solutions web qui font la différence.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={() => onNavigate("projects")}
                className="bg-mint text-[#0C0C0C] hover:bg-mint/90 h-14 px-8 text-base font-semibold rounded-2xl glow-mint-hover group shadow-lg"
              >
                Voir mes projets
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => onNavigate("contact")}
                className="h-14 px-8 text-base font-semibold rounded-2xl border-2 border-white/10 hover:border-mint/50 hover:bg-white/5 transition-all"
              >
                Me contacter
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <StatItem icon={<Target className="h-5 w-5" />} label="Projets livrés" value="50+" />
              <StatItem icon={<TrendingUp className="h-5 w-5" />} label="Satisfaction" value="98%" />
              <StatItem icon={<Zap className="h-5 w-5" />} label="Uptime" value="99.9%" />
            </motion.div>
          </div>

          {/* Right Content - Bento Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large Card - UI/UX Design Priority */}
              <div className="col-span-2 glass-card-strong border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">UI/UX Engineer & Design</h3>
                  <p className="text-neutral-400 text-sm">
                    Figma, Design Systems, Prototyping, User Research
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Figma', 'Design Systems', 'Prototyping'].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Small Cards */}
              <div className="glass-card border-white/10 p-6 rounded-3xl hover:border-mint/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-mint/20 border border-mint/30 flex items-center justify-center mb-4">
                  <Code2 className="h-5 w-5 text-mint" />
                </div>
                <h3 className="text-lg font-bold mb-2">Développement</h3>
                <p className="text-neutral-400 text-xs">
                  React, TypeScript, Supabase
                </p>
              </div>

              <div className="glass-card border-white/10 p-6 rounded-3xl hover:border-cyan-500/30 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Workflow className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Automatisation</h3>
                <p className="text-neutral-400 text-xs">
                  Optimisation des workflows
                </p>
              </div>

              {/* Progress Bar Card */}
              <div className="col-span-2 glass-card border-white/10 p-6 rounded-3xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Performance</span>
                    <span className="text-mint font-semibold">95%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-mint to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-mint/30 flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1.5 h-1.5 bg-mint rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-mint/10 border border-mint/20 text-mint">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-xs text-neutral-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}
