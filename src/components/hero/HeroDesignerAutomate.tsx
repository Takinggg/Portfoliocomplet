import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Code2, Palette, Zap } from "lucide-react";
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
  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center py-20 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mint/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 text-sm text-mint"
        >
          <Sparkles className="h-4 w-4" />
          <span>Designer • Developer • Creator</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Je crée des expériences
            <span className="block mt-2 bg-gradient-to-r from-mint via-cyan-400 to-mint bg-clip-text text-transparent">
              numériques mémorables
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto">
            Design moderne, code performant et automatisation intelligente pour transformer vos idées en réalité digitale
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <FeatureCard
            icon={<Palette className="h-6 w-6" />}
            title="Design UI/UX"
            description="Interfaces élégantes et intuitives"
            color="from-pink-500/20 to-purple-500/20"
          />
          <FeatureCard
            icon={<Code2 className="h-6 w-6" />}
            title="Développement"
            description="Code propre et performant"
            color="from-cyan-500/20 to-mint/20"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Automatisation"
            description="Workflows optimisés et intelligents"
            color="from-yellow-500/20 to-orange-500/20"
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => onNavigate("projects")}
            className="bg-mint text-black hover:bg-mint/90 h-14 px-8 text-base rounded-2xl group"
          >
            Voir mes projets
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => onNavigate("contact")}
            className="border-2 border-mint/30 hover:border-mint/60 bg-transparent text-white h-14 px-8 rounded-2xl"
          >
            Me contacter
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 pt-8"
        >
          <StatItem label="Projets réalisés" value="50+" />
          <StatItem label="Clients satisfaits" value="30+" />
          <StatItem label="Années d'expérience" value="5+" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-mint/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-mint rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative p-6 rounded-3xl border border-white/10 bg-gradient-to-br ${color} backdrop-blur-sm overflow-hidden group`}
    >
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-mint mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-mint mb-1">{value}</div>
      <div className="text-sm text-neutral-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
