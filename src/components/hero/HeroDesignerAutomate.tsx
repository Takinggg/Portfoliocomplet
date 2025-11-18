import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Sparkles, ArrowRight, Code2, Palette, Zap, Workflow, Target, TrendingUp } from "lucide-react";
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      
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
              <span className="text-sm text-mint font-medium">{t('home.hero.badge')}</span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                {t('home.hero.title')}
                <span className="block mt-2 text-gradient-mint-animated">
                  {t('home.hero.highlight')}
                </span>
              </h1>
              <p className="text-xl text-neutral-400 leading-relaxed max-w-xl">
                {t('home.hero.description')}
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
                {t('home.hero.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => onNavigate("contact")}
                className="h-14 px-8 text-base font-semibold rounded-2xl border-2 border-white/10 hover:border-mint/50 hover:bg-white/5 transition-all"
              >
                {t('home.hero.cta.secondary')}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              <StatItem icon={<Target className="h-5 w-5" />} label={t('home.hero.stats.projects')} value="50+" />
              <StatItem icon={<TrendingUp className="h-5 w-5" />} label={t('home.hero.stats.satisfaction')} value="98%" />
              <StatItem icon={<Zap className="h-5 w-5" />} label={t('home.hero.stats.uptime')} value="99.9%" />
            </motion.div>
          </div>

          {/* Right Content - Professional Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="space-y-4">
              {/* Main expertise card */}
              <div className="glass-card-strong border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Palette className="h-7 w-7 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{t('home.hero.cards.design.title')}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                      {t('home.hero.cards.design.description')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Figma', 'Design Systems', 'Prototyping'].map((tech) => (
                        <span key={tech} className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg hover:border-purple-500/30 transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary cards grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card border-white/10 p-6 rounded-2xl hover:border-mint/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center mb-3">
                    <Code2 className="h-6 w-6 text-mint" />
                  </div>
                  <h4 className="text-lg font-bold mb-1">{t('home.hero.cards.dev.title')}</h4>
                  <p className="text-neutral-500 text-xs">
                    {t('home.hero.cards.dev.description')}
                  </p>
                </div>

                <div className="glass-card border-white/10 p-6 rounded-2xl hover:border-cyan-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                    <Workflow className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-bold mb-1">{t('home.hero.cards.automation.title')}</h4>
                  <p className="text-neutral-500 text-xs">
                    {t('home.hero.cards.automation.description')}
                  </p>
                </div>
              </div>

              {/* Performance indicator */}
              <div className="glass-card border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-mint rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-neutral-300">Performance</span>
                  </div>
                  <span className="text-xl font-bold text-mint">95%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-mint via-cyan-400 to-mint"
                    initial={{ width: 0 }}
                    animate={{ width: "95%" }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  />
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
