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
    <div ref={containerRef} className="relative w-full min-h-screen flex items-center">
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
        className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20"
        style={{ y }}
      >
        <div className="text-center space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-mint-10"
          >
            <Sparkles className="h-4 w-4 text-mint" />
            <span className="text-sm text-mint font-medium">{t('home.hero.badge')}</span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              {t('home.hero.title')}
              <span className="block mt-2 text-gradient-mint-animated">
                {t('home.hero.highlight')}
              </span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              {t('home.hero.description')}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-8 justify-center pt-4"
          >
            <StatItem icon={<Target className="h-5 w-5" />} label={t('home.hero.stats.projects')} value="50+" />
            <StatItem icon={<TrendingUp className="h-5 w-5" />} label={t('home.hero.stats.satisfaction')} value="98%" />
            <StatItem icon={<Zap className="h-5 w-5" />} label={t('home.hero.stats.uptime')} value="99.9%" />
          </motion.div>
        </div>
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
