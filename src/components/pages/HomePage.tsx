import React from "react";
import { Button } from "../ui/button";
import { HeroDesignerAutomate } from "../hero/HeroDesignerAutomate";
import { ArrowRight, Workflow, LayoutDashboard, Sparkles, TrendingDown, Clock, Star, Zap, Users, Award, CheckCircle2, ArrowUpRight, Code2, Palette, Brain, Github, Linkedin, Twitter, Send, Play, ChevronDown, CheckCircle, BarChart3, Target, Rocket, Hexagon, Cpu, Database, Globe, Lock, Layers, MessageSquare, Calendar, Shield, Check, Upload, Phone, MessageCircle, Briefcase } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import confetti from "canvas-confetti";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { useLanguage } from "../../utils/i18n/LanguageContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { fetchWithCache } from "../../utils/apiCache";
import { toast } from "sonner";

type Page = "contact" | "projects" | "services" | "about" | "booking" | "project-detail";

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onProjectClick?: (projectId: string) => void;
}

// Project type from API
interface Project {
  id: string;
  title: string;
  title_fr?: string;
  title_en?: string;
  name?: string; // Legacy field
  description: string;
  description_fr?: string;
  description_en?: string;
  image: string;
  imageUrl?: string; // Legacy field
  isPinned: boolean;
  category: string;
  client?: string;
  clientName?: string; // Legacy field
  technologies: string[];
  status: "completed" | "in-progress" | "planning";
  budget?: number;
  startDate?: string;
  endDate?: string;
  url?: string;
  language?: "fr" | "en";
}

// Animated Counter
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Floating Particles Background
function ParticlesBackground() {
  const particles = Array.from({ length: 50 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-mint rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            opacity: Math.random() * 0.5,
          }}
          animate={{
            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
            opacity: [null, Math.random() * 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Light Beams
function LightBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-mint/20 to-transparent"
          style={{
            left: `${20 + i * 30}%`,
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scaleY: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}

// Dots Grid with perspective
function GridDots() {
  const rows = 12;
  const cols = 20;
  const dots = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push({ row, col });
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-30">
      <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(60deg)",
          }}
          animate={{
            rotateZ: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {dots.map(({ row, col }, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-mint/20 rounded-full"
              style={{
                left: `${(col / cols) * 100}%`,
                top: `${(row / rows) * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (row + col) * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// Aurora Effect
function AuroraEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, 
              transparent 0%, 
              rgba(0, 255, 194, 0.05) 25%, 
              rgba(0, 255, 194, 0.1) 50%, 
              rgba(0, 255, 194, 0.05) 75%, 
              transparent 100%
            )
          `,
        }}
        animate={{
          x: ["-100%", "100%"],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Interactive Code & Design Showcase
function AutomationWorkflow() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState<'design' | 'code' | 'preview'>('design');
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  // Code typing animation
  const codeSnippets = {
    design: `// Figma to Code\nconst Design = () => (\n  <motion.div\n    initial={{ opacity: 0 }}\n    animate={{ opacity: 1 }}\n  >\n    Pixel Perfect\n  </motion.div>\n);`,
    code: `// Automation Magic\nconst automate = async () => {\n  await buildSite();\n  await optimize();\n  await deploy();\n  return 'Live!';\n};`,
    preview: `// Live Preview\nfunction Website() {\n  return (\n    <Hero>\n      <h1>Ready!</h1>\n    </Hero>\n  );\n}`
  };

  const [displayedCode, setDisplayedCode] = useState('');
  const fullCode = codeSnippets[activeTab];

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedCode('');
    
    const interval = setInterval(() => {
      if (currentIndex <= fullCode.length) {
        setDisplayedCode(fullCode.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [activeTab, fullCode]);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
      className="relative w-full h-full perspective-1000"
    >
      <div className="relative rounded-3xl border border-mint/20 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden h-full transform-gpu shadow-2xl">
        
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-mint/30 rounded-full"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                y: [null, (Math.random() - 0.5) * 200 + '%'],
                x: [null, (Math.random() - 0.5) * 200 + '%'],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="relative border-b border-mint/10 bg-neutral-900/50 backdrop-blur-xl">
          <div className="flex items-center p-4 gap-2">
            {/* macOS dots */}
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 flex-1">
              {(['design', 'code', 'preview'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-4 py-2 rounded-lg transition-all"
                >
                  <motion.div
                    animate={{
                      backgroundColor: activeTab === tab ? 'rgba(0, 255, 194, 0.1)' : 'transparent',
                      color: activeTab === tab ? '#00FFC2' : '#888',
                    }}
                    className="flex items-center gap-2 relative z-10"
                  >
                    {tab === 'design' && <Palette className="h-4 w-4" />}
                    {tab === 'code' && <Code2 className="h-4 w-4" />}
                    {tab === 'preview' && <Globe className="h-4 w-4" />}
                    <span className="text-sm capitalize">{tab}</span>
                  </motion.div>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border border-mint/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-mint"
              />
              <span className="text-xs text-mint">Live</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 h-[calc(100%-80px)]">
          <div className="grid grid-cols-2 gap-6 h-full">
            {/* Left: Code Editor */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-mint/10 bg-neutral-950/80 overflow-hidden"
            >
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-mint/10 bg-neutral-900/50">
                <div className="flex items-center gap-2">
                  <Code2 className="h-3 w-3 text-mint/50" />
                  <span className="text-xs text-neutral-500">{activeTab}.tsx</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                      className="w-1 h-1 rounded-full bg-mint/50"
                    />
                  ))}
                </div>
              </div>

              {/* Code Content */}
              <div className="p-4 font-mono text-sm h-[calc(100%-40px)] overflow-auto">
                <pre className="text-neutral-400">
                  {displayedCode.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-neutral-700 select-none w-6 text-right">{i + 1}</span>
                      <code className="flex-1">
                        {line.includes('//') ? (
                          <>
                            <span className="text-neutral-600">{line.split('//')[0]}</span>
                            <span className="text-mint/50">// {line.split('//')[1]}</span>
                          </>
                        ) : (
                          <span className={
                            line.includes('const') || line.includes('function') || line.includes('await') || line.includes('return') 
                              ? 'text-mint' 
                              : line.includes('=>') || line.includes('async')
                              ? 'text-mint'
                              : line.includes('motion') || line.includes('Hero')
                              ? 'text-mint'
                              : 'text-neutral-400'
                          }>
                            {line}
                          </span>
                        )}
                      </code>
                    </div>
                  ))}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-mint ml-1"
                  />
                </pre>
              </div>
            </motion.div>

            {/* Right: Live Preview */}
            <motion.div
              key={`preview-${activeTab}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-mint/10 bg-neutral-900/30 overflow-hidden"
            >
              {/* Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-mint/10 bg-neutral-900/50">
                <Lock className="h-3 w-3 text-mint/50" />
                <div className="flex-1 px-3 py-1 rounded-md bg-neutral-800/50 border border-mint/10">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                    className="h-1.5 bg-gradient-to-r from-mint/30 via-mint/50 to-mint/30 rounded-full"
                  />
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 h-[calc(100%-40px)] flex items-center justify-center">
                {activeTab === 'design' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4 w-full"
                  >
                    {/* Color palette */}
                    <div className="flex gap-2">
                      {['#00FFC2', '#0C0C0C', '#F4F4F4'].map((color, i) => (
                        <motion.div
                          key={color}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1, type: "spring" }}
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          className="w-12 h-12 rounded-xl border-2 border-white/10 cursor-pointer"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {/* Design elements */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-3 p-4 rounded-xl bg-neutral-950/50 border border-mint/10"
                    >
                      <div className="h-3 bg-mint/20 rounded-full w-2/3"></div>
                      <div className="h-2 bg-neutral-700 rounded-full w-1/2"></div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="h-16 rounded-lg bg-gradient-to-br from-mint/10 to-transparent border border-mint/20"
                          />
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === 'code' && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full space-y-4"
                  >
                    {/* Build process */}
                    {['Analyzing...', 'Building...', 'Optimizing...', 'Deploying...'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-neutral-950/50 border border-mint/10"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Cpu className="h-4 w-4 text-mint" />
                        </motion.div>
                        <span className="text-sm text-neutral-400">{step}</span>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: i * 0.3, duration: 1 }}
                          className="ml-auto h-1 bg-mint/30 rounded-full w-20"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'preview' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <div className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-neutral-950 to-neutral-900 border border-mint/20">
                      {/* Hero section */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-3"
                      >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/20">
                          <Sparkles className="h-3 w-3 text-mint" />
                          <span className="text-xs text-mint">Live</span>
                        </div>
                        <div className="h-4 bg-mint/20 rounded-full w-3/4 mx-auto"></div>
                        <div className="h-2 bg-neutral-700 rounded-full w-1/2 mx-auto"></div>
                      </motion.div>

                      {/* Cards */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        {[1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                            whileHover={{ scale: 1.05, y: -3 }}
                            className="p-3 rounded-lg bg-neutral-900/50 border border-mint/10 cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mint/20 to-transparent border border-mint/20 mb-2"></div>
                            <div className="h-1.5 bg-neutral-700 rounded-full w-full"></div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Glowing edges */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-mint/0 via-mint/10 to-mint/0 blur-2xl pointer-events-none"
        />
      </div>

      {/* Floating Metrics */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 px-6 py-4 rounded-2xl border border-mint/30 bg-neutral-950/95 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center">
            <Workflow className="h-7 w-7 text-mint" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-1">Automatisation</div>
            <div className="text-2xl font-bold text-mint">100%</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -2, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl border border-mint/30 bg-neutral-950/95 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center">
            <Zap className="h-7 w-7 text-mint" />
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-1">Design → Live</div>
            <div className="text-2xl font-bold text-white">2min</div>
          </div>
        </div>
      </motion.div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-mint/5 rounded-3xl blur-3xl -z-10 animate-pulse-glow"></div>
    </motion.div>
  );
}

// Bento Card Stat type
interface BentoCardStat {
  label: string;
  value: string | number;
}

// Bento Card Props
interface BentoCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  stats: BentoCardStat[];
  delay?: number;
  size?: "sm" | "md" | "lg";
}

// Bento Grid Cards
function BentoCard({ icon: Icon, title, description, stats, delay = 0, size = "md" }: BentoCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative group cursor-pointer ${
        size === "lg" ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="relative h-full rounded-3xl border border-neutral-900 bg-neutral-950/50 hover:border-mint/20 hover:bg-neutral-950 transition-all duration-500 overflow-hidden p-8">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-mint/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="relative z-10">
          {/* Icon with 3D effect */}
          <motion.div
            whileHover={{ rotateY: 180, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center mb-6 transform-gpu"
          >
            <Icon className="h-8 w-8 text-mint" />
          </motion.div>

          <h3 className="text-2xl font-bold mb-3 group-hover:text-mint transition-colors">
            {title}
          </h3>

          <p className="text-neutral-400 mb-6 leading-relaxed">
            {description}
          </p>

          {stats && (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat: BentoCardStat, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: delay + 0.3 + i * 0.1 }}
                  className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800"
                >
                  <div className="text-2xl font-bold text-mint mb-1">{stat.value}</div>
                  <div className="text-xs text-neutral-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.2, rotate: 45 }}
          >
            <ArrowUpRight className="h-6 w-6 text-mint" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Hexagon Grid Pattern
function HexagonPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
            <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" fill="none" stroke="#00FFC2" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
}

// Mouse Follow Spotlight
function SpotlightEffect() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 192);
      mouseY.set(e.clientY - 192);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-30 w-96 h-96 rounded-full blur-3xl"
      style={{
        x,
        y,
        background: "radial-gradient(circle, rgba(0, 255, 194, 0.15) 0%, transparent 70%)",
      }}
    />
  );
}

// Animated Workflow Component
function AnimatedWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { icon: Target, label: "Lead", color: "from-blue-500 to-cyan-500" },
    { icon: Palette, label: "Interface", color: "from-purple-500 to-pink-500" },
    { icon: CheckCircle2, label: "Validation", color: "from-green-500 to-emerald-500" },
    { icon: LayoutDashboard, label: "Dashboard", color: "from-orange-500 to-yellow-500" },
    { icon: Zap, label: "Automatisation", color: "from-mint to-cyan-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative w-full h-[500px] flex items-center justify-center"
    >
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 194, 0.3))' }}>
        <motion.path
          d="M 100,250 Q 200,100 300,250 T 500,250"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffc2" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00ffc2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00ffc2" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Workflow steps */}
      <div className="relative w-full h-full">
        {steps.map((step, index) => {
          const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isActive = index === activeStep;
          const Icon = step.icon;

          return (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2"
              style={{
                x: x - 40,
                y: y - 40,
              }}
              animate={{
                scale: isActive ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-[2px] ${isActive ? 'shadow-[0_0_30px_rgba(0,255,194,0.5)]' : ''}`}>
                <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
                  <Icon className={`w-8 h-8 ${isActive ? 'text-mint' : 'text-neutral-400'} transition-colors`} />
                </div>
              </div>
              
              {/* Label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0.5 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-neutral-300"
              >
                {step.label}
              </motion.div>

              {/* Active pulse */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-mint"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Center badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-mint/20 to-transparent border border-mint/30 flex items-center justify-center backdrop-blur-xl">
          <Workflow className="w-10 h-10 text-mint" />
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-mint/50"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

export default function HomePage({ onNavigate, onProjectClick }: HomePageProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [pinnedProjects, setPinnedProjects] = useState<Project[]>([]);

  // Fetch pinned projects with cache
  useEffect(() => {
    const fetchPinnedProjects = async () => {
      try {
        const data = await fetchWithCache(
          `pinned_projects_${language}`,
          async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects?lang=${language}`,
              {
                headers: {
                  Authorization: `Bearer ${publicAnonKey}`,
                },
                signal: controller.signal,
              }
            );
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              return { projects: [] };
            }
            
            return response.json();
          },
          5 * 60 * 1000 // 5 minutes cache
        );
        
        const pinned = (data.projects || [])
          .filter((p: Project) => p.isPinned)
          .slice(0, 3);
        setPinnedProjects(pinned);
      } catch (error) {
        setPinnedProjects([]);
      }
    };
    fetchPinnedProjects();
  }, [language]);

  // Handler for project click (memoized)
  const handleProjectClick = useCallback((projectId: string) => {
    if (onProjectClick) {
      onProjectClick(projectId);
    }
  }, [onProjectClick]);

  return (
    <div className="w-full bg-[#0C0C0C] text-white overflow-hidden">
      <SpotlightEffect />
      
      {/* HERO - Ultra Complex 3D */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0C0C0C] via-[#0a0a0a] to-[#0C0C0C]"></div>
          
          {/* Animated grid lines */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 255, 194, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
            }}
          />
          
          {/* Diagonal lines overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="diagonal-lines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(0, 255, 194, 0.05)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
            </svg>
          </div>

          {/* Radial gradients - multiple layers */}
          <motion.div
            className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0, 255, 194, 0.15) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0, 255, 194, 0.12) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0, 255, 194, 0.08) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Concentric circles for depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mint/5"
                style={{
                  width: `${i * 300}px`,
                  height: `${i * 300}px`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>

          {/* Vignette effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0C0C0C]"></div>
        </div>
        
        <AuroraEffect />
        <GridDots />
        <LightBeams />
        <ParticlesBackground />

        <div className="max-w-[1600px] mx-auto w-full relative z-10 pt-32 pb-20">
          <HeroDesignerAutomate onNavigate={onNavigate} />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <span className="text-xs text-neutral-500 group-hover:text-mint transition-colors">{t('home.hero.scrollDown')}</span>
            <div className="w-6 h-10 rounded-full border-2 border-neutral-800 group-hover:border-mint/50 flex items-start justify-center p-2 transition-colors">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-mint rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mint/5 to-transparent"></div>
        
        <div className="max-w-[1600px] mx-auto relative z-10">
          {/* 1. INTRO / ACCROCHE - VERSION SIMPLIFIÉE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32 relative"
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Texte impactant */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/30 bg-mint/10 mb-8"
                >
                  <Sparkles className="h-4 w-4 text-mint" />
                  <span className="text-sm text-mint font-medium">Design × Code × Automatisation</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
                >
                  Je transforme vos idées en{" "}
                  <span className="text-gradient-mint bg-gradient-to-r from-mint via-cyan-400 to-mint bg-clip-text text-transparent">
                    systèmes intelligents
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-neutral-400 mb-8 leading-relaxed"
                >
                  Design élégant, code performant et automatisation intelligente. 
                  Des solutions web qui font la différence pour votre business.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  onClick={() => document.querySelector('#system-visualization')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-mint text-[#0C0C0C] font-semibold text-lg hover:bg-mint/90 transition-all group shadow-lg shadow-mint/20"
                >
                  <span>Découvrir comment</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </div>

              {/* Right - Stats Cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: "50+", label: "Projets livrés", icon: Target, color: "mint" },
                  { value: "98%", label: "Satisfaction", icon: TrendingUp, color: "purple" },
                  { value: "99.9%", label: "Uptime", icon: Zap, color: "cyan" },
                  { value: "2h/j", label: "Économisés", icon: Clock, color: "green" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass-card border-white/10 p-6 rounded-2xl hover:border-mint/30 transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                    </div>
                    <div className="text-3xl font-bold mb-1 text-gradient-mint">{stat.value}</div>
                    <div className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* 2. VISUALISATION DU SYSTÈME */}
          <div id="system-visualization" className="mb-40">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.ecosystem.title')}
              </h3>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                {t('home.ecosystem.subtitle')}
              </p>
            </motion.div>

            {/* Flux interactif */}
            <div className="relative w-full max-w-6xl mx-auto" style={{ height: '800px' }}>
              {/* Cercles pulsants de fond */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-mint/10"
                  style={{ 
                    width: `${i * 250}px`, 
                    height: `${i * 250}px`,
                    top: '50%',
                    left: '50%',
                    marginLeft: `${-(i * 125)}px`,
                    marginTop: `${-(i * 125)}px`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}

              {/* SVG pour les lignes - 800x800 centré */}
              <svg 
                className="absolute pointer-events-none z-10"
                width="800"
                height="800"
                viewBox="0 0 800 800"
                style={{
                  top: '50%',
                  left: '50%',
                  marginLeft: '-400px',
                  marginTop: '-400px',
                }}
              >
                {/* Ligne 0° - HAUT - COULEUR UNIE */}
                <g>
                  <line x1="400" y1="330" x2="400" y2="80" stroke="rgba(0, 255, 194, 0.6)" strokeWidth="3" strokeLinecap="round" />
                  <circle r="4" fill="#00FFC2" opacity="0.9" filter="drop-shadow(0 0 4px rgba(0, 255, 194, 0.8))">
                    <animate attributeName="cx" values="400;400;400" dur="4s" repeatCount="indefinite" begin="0s" />
                    <animate attributeName="cy" values="330;80;330" dur="4s" repeatCount="indefinite" begin="0s" />
                  </circle>
                </g>
                
                {/* Ligne 60° - HAUT-DROITE - COULEUR UNIE */}
                <g>
                  <line x1="460.6" y1="365" x2="677" y2="223.9" stroke="rgba(0, 255, 194, 0.6)" strokeWidth="3" strokeLinecap="round" />
                  <circle r="4" fill="#00FFC2" opacity="0.9" filter="drop-shadow(0 0 4px rgba(0, 255, 194, 0.8))">
                    <animate attributeName="cx" values="460.6;677;460.6" dur="4s" repeatCount="indefinite" begin="0.4s" />
                    <animate attributeName="cy" values="365;223.9;365" dur="4s" repeatCount="indefinite" begin="0.4s" />
                  </circle>
                </g>
                
                {/* Ligne 120° - BAS-DROITE - COULEUR UNIE */}
                <g>
                  <line x1="460.6" y1="435" x2="677" y2="576.1" stroke="rgba(0, 255, 194, 0.6)" strokeWidth="3" strokeLinecap="round" />
                  <circle r="4" fill="#00FFC2" opacity="0.9" filter="drop-shadow(0 0 4px rgba(0, 255, 194, 0.8))">
                    <animate attributeName="cx" values="460.6;677;460.6" dur="4s" repeatCount="indefinite" begin="0.8s" />
                    <animate attributeName="cy" values="435;576.1;435" dur="4s" repeatCount="indefinite" begin="0.8s" />
                  </circle>
                </g>
                
                {/* Ligne 180° - BAS - COULEUR UNIE */}
                <g>
                  <line x1="400" y1="470" x2="400" y2="720" stroke="rgba(0, 255, 194, 0.6)" strokeWidth="3" strokeLinecap="round" />
                  <circle r="4" fill="#00FFC2" opacity="0.9" filter="drop-shadow(0 0 4px rgba(0, 255, 194, 0.8))">
                    <animate attributeName="cx" values="400;400;400" dur="4s" repeatCount="indefinite" begin="1.2s" />
                    <animate attributeName="cy" values="470;720;470" dur="4s" repeatCount="indefinite" begin="1.2s" />
                  </circle>
                </g>
                
                {/* Ligne 240° - BAS-GAUCHE - COULEUR UNIE */}
                <g>
                  <line x1="339.4" y1="435" x2="123" y2="576.1" stroke="rgba(0, 255, 194, 0.6)" strokeWidth="3" strokeLinecap="round" />
                  <circle r="4" fill="#00FFC2" opacity="0.9" filter="drop-shadow(0 0 4px rgba(0, 255, 194, 0.8))">
                    <animate attributeName="cx" values="339.4;123;339.4" dur="4s" repeatCount="indefinite" begin="1.6s" />
                    <animate attributeName="cy" values="435;576.1;435" dur="4s" repeatCount="indefinite" begin="1.6s" />
                  </circle>
                </g>
                
                {/* Ligne 300° - HAUT-GAUCHE - COULEUR UNIE */}
                <g>
                  <line x1="339.4" y1="365" x2="123" y2="223.9" stroke="rgba(0, 255, 194, 0.6)" strokeWidth="3" strokeLinecap="round" />
                  <circle r="4" fill="#00FFC2" opacity="0.9" filter="drop-shadow(0 0 4px rgba(0, 255, 194, 0.8))">
                    <animate attributeName="cx" values="339.4;123;339.4" dur="4s" repeatCount="indefinite" begin="2s" />
                    <animate attributeName="cy" values="365;223.9;365" dur="4s" repeatCount="indefinite" begin="2s" />
                  </circle>
                </g>
              </svg>

              {/* Centre - CRM Hub */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1 }}
                className="absolute z-30 cursor-pointer"
                style={{
                  top: '50%',
                  left: '50%',
                  marginLeft: '-80px',
                  marginTop: '-80px',
                }}
              >
                <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-mint/30 to-mint/10 border-2 border-mint/50 backdrop-blur-xl flex flex-col items-center justify-center group">
                  <Database className="h-12 w-12 text-mint mb-2" />
                  <span className="text-sm font-medium text-white">{t('home.ecosystem.hub')}</span>
                  <div className="absolute inset-0 bg-mint/20 rounded-3xl blur-2xl -z-10 group-hover:blur-3xl transition-all"></div>
                </div>
              </motion.div>

              {/* Satellites - 6 points autour en cercle parfait */}
              {[
                { icon: Globe, label: t('home.ecosystem.satellites.website'), angle: 0, delay: 0.4, color: "from-blue-500/20" },
                { icon: Sparkles, label: t('home.ecosystem.satellites.ai'), angle: 60, delay: 0.5, color: "from-purple-500/20" },
                { icon: Send, label: t('home.ecosystem.satellites.email'), angle: 120, delay: 0.6, color: "from-pink-500/20" },
                { icon: BarChart3, label: t('home.ecosystem.satellites.analytics'), angle: 180, delay: 0.7, color: "from-orange-500/20" },
                { icon: Zap, label: t('home.ecosystem.satellites.billing'), angle: 240, delay: 0.8, color: "from-yellow-500/20" },
                { icon: Layers, label: t('home.ecosystem.satellites.dashboard'), angle: 300, delay: 0.9, color: "from-green-500/20" },
              ].map((item, i) => {
                const radius = 320;
                const angleRad = ((item.angle - 90) * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay }}
                    whileHover={{ scale: 1.15, y: -5 }}
                    className="absolute cursor-pointer group/sat z-20"
                    style={{
                      top: '50%',
                      left: '50%',
                      marginLeft: `${x - 64}px`,
                      marginTop: `${y - 64}px`,
                    }}
                  >
                    <div className={`relative w-32 h-32 rounded-2xl bg-neutral-950/90 border border-neutral-800 group-hover/sat:border-mint/40 backdrop-blur-xl flex flex-col items-center justify-center transition-all shadow-xl overflow-hidden`}>
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover/sat:opacity-100 transition-opacity`}></div>
                      
                      <item.icon className="h-8 w-8 text-mint/70 group-hover/sat:text-mint mb-2 transition-colors relative z-10" />
                      <span className="text-xs text-neutral-400 group-hover/sat:text-white transition-colors text-center px-2 relative z-10">{item.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 3. BLOCS D'EXPERTISE - 4 PILIERS */}
          <div className="mb-40">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.expertise.title')}
              </h3>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                {t('home.expertise.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Palette,
                  title: t('home.expertise.pillars.design.title'),
                  subtitle: t('home.expertise.pillars.design.subtitle'),
                  description: t('home.expertise.pillars.design.description'),
                  color: "from-mint/20 to-mint/5",
                },
                {
                  icon: Code2,
                  title: t('home.expertise.pillars.development.title'),
                  subtitle: t('home.expertise.pillars.development.subtitle'),
                  description: t('home.expertise.pillars.development.description'),
                  color: "from-blue-500/20 to-blue-500/5",
                },
                {
                  icon: Brain,
                  title: t('home.expertise.pillars.ai.title'),
                  subtitle: t('home.expertise.pillars.ai.subtitle'),
                  description: t('home.expertise.pillars.ai.description'),
                  color: "from-purple-500/20 to-purple-500/5",
                },
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, rotateY: 5, scale: 1.02 }}
                  className="group cursor-pointer perspective-1000"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative h-full rounded-3xl border border-neutral-900 bg-neutral-950/80 hover:border-mint/30 backdrop-blur-xl p-8 transition-all duration-500 overflow-hidden">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-mint/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>

                    <div className="relative z-10">
                      {/* Icon 3D */}
                      <motion.div
                        whileHover={{ rotateY: 360, scale: 1.2 }}
                        transition={{ duration: 0.8 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint/30 to-mint/10 border border-mint/30 flex items-center justify-center mb-6"
                      >
                        <pillar.icon className="h-8 w-8 text-mint" />
                      </motion.div>

                      <h4 className="text-2xl font-bold mb-2 group-hover:text-mint transition-colors">
                        {pillar.title}
                      </h4>
                      
                      <p className="text-sm text-mint/70 mb-4 italic">
                        {pillar.subtitle}
                      </p>

                      <p className="text-neutral-400 leading-relaxed">
                        {pillar.description}
                      </p>

                      {/* Arrow indicator */}
                      <motion.div
                        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.2, rotate: 45 }}
                      >
                        <ArrowUpRight className="h-5 w-5 text-mint" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 4. CAS D'USAGE CONCRETS */}
          <div className="mb-40">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.results.title')}
              </h3>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                {t('home.results.subtitle')}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  type: t('home.results.cases.ecommerce.type') || 'E-commerce',
                  icon: Rocket,
                  problem: t('home.results.cases.ecommerce.problem') || 'Gestion manuelle des commandes et suivi client chronophage',
                  solution: t('home.results.cases.ecommerce.solution') || 'Automatisation des commandes, CRM et emails',
                  result: t('home.results.cases.ecommerce.result') || '+40%',
                  resultLabel: t('home.results.cases.ecommerce.resultLabel') || 'de productivité',
                  flow: t('home.results.cases.ecommerce.flow') || ["Commande", "CRM", "Email", "Facturation"],
                  gradient: "from-cyan-500/10 via-mint/10 to-cyan-500/10",
                  iconBg: "from-cyan-500/20 to-mint/10"
                },
                {
                  type: t('home.results.cases.freelance.type') || 'Freelance / Coach',
                  icon: Users,
                  problem: t('home.results.cases.freelance.problem') || 'Perte de temps dans la gestion administrative quotidienne',
                  solution: t('home.results.cases.freelance.solution') || 'Formulaire → CRM → Facturation automatique',
                  result: t('home.results.cases.freelance.result') || '2h/jour',
                  resultLabel: t('home.results.cases.freelance.resultLabel') || 'économisées',
                  flow: t('home.results.cases.freelance.flow') || ["Lead", "Qualification", "Devis", "Paiement"],
                  gradient: "from-violet-500/10 via-purple-500/10 to-violet-500/10",
                  iconBg: "from-violet-500/20 to-purple-500/10"
                },
                {
                  type: t('home.results.cases.saas.type') || 'Start-up SaaS',
                  icon: Target,
                  problem: t('home.results.cases.saas.problem') || 'Données éparpillées, pas de vision globale de la croissance',
                  solution: t('home.results.cases.saas.solution') || 'Onboarding + tracking + dashboards automatiques',
                  result: t('home.results.cases.saas.result') || 'x2',
                  resultLabel: t('home.results.cases.saas.resultLabel') || 'croissance',
                  flow: t('home.results.cases.saas.flow') || ["Sign-up", "Onboard", "Track", "Analytics"],
                  gradient: "from-emerald-500/10 via-mint/10 to-emerald-500/10",
                  iconBg: "from-emerald-500/20 to-mint/10"
                },
              ].map((cas, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative group cursor-pointer"
                >
                  <motion.div 
                    whileHover={{ y: -12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative h-full rounded-3xl border border-neutral-900 bg-gradient-to-br from-neutral-950 to-neutral-900/50 hover:border-mint/40 backdrop-blur-xl overflow-hidden"
                  >
                    {/* Animated gradient overlay */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${cas.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    
                    {/* Content wrapper */}
                    <div className="relative p-8">
                      {/* Header avec badge de type */}
                      <div className="flex items-center justify-between mb-8">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${cas.iconBg} border border-neutral-800 group-hover:border-mint/30 transition-all shadow-lg`}>
                          <cas.icon className="h-8 w-8 text-mint" />
                        </div>
                        <div className="px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm">
                          <span className="text-xs font-medium text-neutral-400">{cas.type}</span>
                        </div>
                      </div>

                      {/* AVANT - Problème */}
                      <div className="mb-6 p-6 rounded-2xl bg-neutral-900/40 border border-red-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="mt-0.5 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                              {language === 'en' ? 'Before' : 'Avant'}
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed">{cas.problem}</p>
                          </div>
                        </div>
                      </div>

                      {/* Flèche de transformation */}
                      <div className="flex justify-center my-6">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="p-2 rounded-full bg-gradient-to-b from-mint/20 to-mint/5 border border-mint/30"
                        >
                          <ArrowRight className="h-5 w-5 text-mint rotate-90" />
                        </motion.div>
                      </div>

                      {/* APRÈS - Solution */}
                      <div className="mb-8 p-6 rounded-2xl bg-neutral-900/40 border border-mint/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-mint/50 to-transparent"></div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="mt-0.5 p-1.5 rounded-lg bg-mint/10 border border-mint/20">
                            <Zap className="h-4 w-4 text-mint" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-mint uppercase tracking-wider mb-2">
                              {language === 'en' ? 'After' : 'Après'}
                            </div>
                            <p className="text-sm text-white leading-relaxed font-medium">{cas.solution}</p>
                          </div>
                        </div>
                      </div>

                      {/* Résultat massif */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-mint/20 via-mint/30 to-mint/20 blur-xl"></div>
                        <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-mint/10 via-mint/5 to-transparent border-2 border-mint/30 backdrop-blur-sm">
                          <motion.div
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="mb-2"
                          >
                            <div className="text-6xl font-black text-mint mb-3 tracking-tight">
                              {cas.result}
                            </div>
                            <div className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
                              {cas.resultLabel}
                            </div>
                          </motion.div>
                          
                          {/* Checkmark badge */}
                          <div className="absolute -top-4 -right-4">
                            <motion.div
                              animate={{ rotate: [0, 10, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="w-10 h-10 rounded-full bg-mint flex items-center justify-center shadow-lg shadow-mint/50"
                            >
                              <CheckCircle className="h-6 w-6 text-black" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced glow on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-mint/5 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* 5. SCHÉMA DE PROCESSUS */}
          <div className="mb-40">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                {t('home.process.title')}
              </h3>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                {t('home.process.subtitle')}
              </p>
            </motion.div>

            {/* Timeline horizontale */}
            <div className="relative max-w-7xl mx-auto">
              {/* Progress line avec glow - hidden on mobile */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-neutral-900 rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-mint via-cyan-400 to-mint rounded-full shadow-[0_0_20px_rgba(0,255,194,0.5)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                />
              </div>

              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                {[
                  {
                    number: t('home.process.steps.discovery.number'),
                    title: t('home.process.steps.discovery.title'),
                    description: t('home.process.steps.discovery.description'),
                    icon: Target,
                  },
                  {
                    number: t('home.process.steps.design.number'),
                    title: t('home.process.steps.design.title'),
                    description: t('home.process.steps.design.description'),
                    icon: Palette,
                  },
                  {
                    number: t('home.process.steps.development.number'),
                    title: t('home.process.steps.development.title'),
                    description: t('home.process.steps.development.description'),
                    icon: Code2,
                  },
                  {
                    number: t('home.process.steps.launch.number'),
                    title: t('home.process.steps.launch.title'),
                    description: t('home.process.steps.launch.description'),
                    icon: Rocket,
                  },
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative group"
                  >
                    {/* Floating icon badge */}
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="relative w-full h-full rounded-2xl bg-neutral-900 border-2 border-mint/30 flex items-center justify-center shadow-lg shadow-mint/20"
                      >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-mint/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                        
                        {/* Icon */}
                        <step.icon className="h-10 w-10 text-mint relative z-10" />
                      </motion.div>

                      {/* Step number overlay - outside to avoid overflow issues */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neutral-950 border-2 border-mint flex items-center justify-center shadow-lg z-20">
                        <span className="text-xs font-bold text-mint">{i + 1}</span>
                      </div>

                      {/* Connection dot on timeline - hidden on mobile */}
                      <motion.div
                        className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-mint shadow-lg shadow-mint/50 z-20"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + 0.4 }}
                      />
                    </div>

                    {/* Content card */}
                    <motion.div 
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-mint/20 backdrop-blur-sm overflow-hidden transition-all"
                    >
                      {/* Top border accent */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-mint/50 to-transparent" />
                      
                      {/* Background glow on hover */}
                      <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Content */}
                      <div className="relative text-center">
                        <h4 className="font-bold mb-3 text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Bottom decoration */}
                        <div className="mt-5 flex justify-center gap-1.5">
                          {[...Array(3)].map((_, idx) => (
                            <motion.div
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full bg-mint"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                delay: idx * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Arrow between steps (except last one) */}
                    {i < 3 && (
                      <motion.div
                        className="hidden md:block absolute top-12 -right-4 z-30"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + 0.6 }}
                      >
                        <ArrowRight className="h-6 w-6 text-mint" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. CTA FINAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] border border-neutral-900 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-12 md:p-20 text-center overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-mint/10 via-transparent to-mint/5"></div>
            <motion.div
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-mint/20 rounded-full blur-[150px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
              }}
            ></motion.div>

            <div className="relative z-10">
              {/* Floating stats cards */}
              <div className="hidden lg:block">
                {/* Top left - Success rate */}
                <motion.div
                  initial={{ opacity: 0, x: -50, y: -50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="absolute -top-8 -left-8 bg-neutral-900/80 backdrop-blur-xl border border-mint/20 rounded-2xl p-4 shadow-lg shadow-mint/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-mint" />
                    </div>
                    <div>
                      <div className="font-bold text-white">100%</div>
                      <div className="text-xs text-neutral-400">Success Rate</div>
                    </div>
                  </div>
                </motion.div>

                {/* Top right - Projects delivered */}
                <motion.div
                  initial={{ opacity: 0, x: 50, y: -50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="absolute -top-8 -right-8 bg-neutral-900/80 backdrop-blur-xl border border-mint/20 rounded-2xl p-4 shadow-lg shadow-mint/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                      <Rocket className="h-6 w-6 text-mint" />
                    </div>
                    <div>
                      <div className="font-bold text-white">50+</div>
                      <div className="text-xs text-neutral-400">Projets livrés</div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom left - Fast delivery */}
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="absolute -bottom-8 -left-8 bg-neutral-900/80 backdrop-blur-xl border border-mint/20 rounded-2xl p-4 shadow-lg shadow-mint/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-mint" />
                    </div>
                    <div>
                      <div className="font-bold text-white">2-4 sem</div>
                      <div className="text-xs text-neutral-400">Livraison rapide</div>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom right - Support */}
                <motion.div
                  initial={{ opacity: 0, x: 50, y: 50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="absolute -bottom-8 -right-8 bg-neutral-900/80 backdrop-blur-xl border border-mint/20 rounded-2xl p-4 shadow-lg shadow-mint/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-mint" />
                    </div>
                    <div>
                      <div className="font-bold text-white">24/7</div>
                      <div className="text-xs text-neutral-400">Support client</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Animated floating icons */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                  { Icon: Code2, delay: 0, x: "10%", y: "20%" },
                  { Icon: Palette, delay: 0.2, x: "85%", y: "15%" },
                  { Icon: Database, delay: 0.4, x: "15%", y: "75%" },
                  { Icon: Globe, delay: 0.6, x: "80%", y: "80%" },
                ].map(({ Icon, delay, x, y }, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-16 rounded-2xl bg-neutral-900/30 border border-mint/10 flex items-center justify-center"
                    style={{ left: x, top: y }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      delay,
                      y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    <Icon className="h-8 w-8 text-mint/40" />
                  </motion.div>
                ))}
              </div>

              {/* Main content */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-mint/30 bg-mint/10 text-mint text-sm mb-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                  <span>{t('home.cta.badge')}</span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                >
                  {t('home.cta.title')}
                  <br />
                  <span className="text-gradient-mint-animated">{t('home.cta.titleHighlight')}</span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
                >
                  {t('home.cta.subtitle')}
                </motion.p>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap items-center justify-center gap-6 mb-10"
                >
                  {[
                    { icon: Shield, text: "Paiement sécurisé" },
                    { icon: Award, text: "Garantie qualité" },
                    { icon: Clock, text: "Délais respectés" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 text-sm text-neutral-400"
                    >
                      <item.icon className="h-4 w-4 text-mint" />
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    onClick={() => onNavigate("contact")}
                    className="bg-mint text-black hover:bg-mint/90 h-16 px-10 text-lg rounded-2xl group relative overflow-hidden shadow-lg shadow-mint/20"
                  >
                    <span className="relative z-10 flex items-center">
                      {t('home.cta.button')}
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>

                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={() => onNavigate("services")}
                    className="border-2 border-neutral-800 hover:border-mint/30 bg-neutral-950/50 hover:bg-neutral-950 h-16 px-10 text-lg rounded-2xl backdrop-blur-xl group"
                  >
                    {t('home.cta.secondary')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {/* Bottom stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                >
                  {[
                    { value: "100%", label: "Clients satisfaits" },
                    { value: "50+", label: "Projets livrés" },
                    { value: "2-4 sem", label: "Délai moyen" },
                    { value: "24/7", label: "Support disponible" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 rounded-xl bg-neutral-900/30 border border-mint/10 backdrop-blur-sm"
                    >
                      <div className="font-bold text-mint mb-1">{stat.value}</div>
                      <div className="text-xs text-neutral-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {pinnedProjects.length > 0 && (
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-mint/10 border border-mint/20 rounded-full px-6 py-3 mb-6"
              >
                <Briefcase className="h-5 w-5 text-mint" />
                <span className="text-mint uppercase tracking-wider">{t('home.pinnedProjects.title')}</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl mb-6">
                {t('home.pinnedProjects.subtitle')}
              </h2>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                {t('home.pinnedProjects.viewAll')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {pinnedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                  onClick={() => handleProjectClick(project.id)}
                  className="group relative bg-neutral-950/50 border border-neutral-800 rounded-3xl overflow-hidden backdrop-blur-xl cursor-pointer"
                >
                  {/* Project Image */}
                  {project.imageUrl && (
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    </div>
                  )}
                  
                  {/* Project Content */}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      {project.category && (
                        <span className="text-xs uppercase tracking-wider text-mint/80 bg-mint/10 border border-mint/20 rounded-full px-3 py-1">
                          {project.category === 'web' && 'Développement Web'}
                          {project.category === 'mobile' && 'Application Mobile'}
                          {project.category === 'design' && 'Design UI/UX'}
                          {project.category === 'consulting' && 'Consulting'}
                          {project.category === 'other' && 'Autre'}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl mb-3 group-hover:text-mint transition-colors">
                      {project.name}
                    </h3>
                    
                    <p className="text-neutral-400 mb-6 line-clamp-2">
                      {project.description || t('projects.card.completedProject')}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-500">
                        {project.clientName}
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-mint opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 border-2 border-mint/0 group-hover:border-mint/20 rounded-3xl transition-all duration-500" />
                </motion.div>
              ))}
            </div>

            {/* CTA to Projects Page */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Button
                size="lg"
                onClick={() => onNavigate("projects")}
                className="bg-neutral-900 hover:bg-neutral-800 border-2 border-neutral-800 hover:border-mint/30 h-14 px-8 rounded-2xl group"
              >
                {language === 'en' ? 'View all projects' : 'Voir tous les projets'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Bloc Contact Ultra Moderne */}
      <ContactSection onNavigate={onNavigate} />
    </div>
  );
}

// Contact Section Component
function ContactSection({ onNavigate }: HomePageProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [selectedNeed, setSelectedNeed] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message || selectedReasons.length === 0) {
      toast.error(language === 'en' ? 'Please fill in all fields and select at least one interest' : 'Veuillez remplir tous les champs et sélectionner au moins un intérêt');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send lead to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/leads`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: "",
            message: formData.message,
            source: "homepage_contact",
            status: "new",
            interests: selectedReasons,
            createdAt: new Date().toISOString()
          }),
        }
      );

      if (response.ok) {
        // Success animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00FFC2", "#0C0C0C", "#F4F4F4"],
        });

        toast.success(language === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès !');
        setFormSubmitted(true);
        
        // Send confirmation email (optional, don't wait)
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/emails/lead-confirmation`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${publicAnonKey}`,
              },
              body: JSON.stringify({
                email: formData.email,
                name: formData.name,
                message: formData.message,
              }),
            }
          );
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }
        
        setTimeout(() => {
          setMessageDialogOpen(false);
          setFormSubmitted(false);
          setFormData({ name: "", email: "", message: "" });
          setSelectedReasons([]);
          setSelectedNeed("");
        }, 3000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(language === 'en' ? 'Error sending message. Please try again.' : 'Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedReasons, language]);

  const handleInputChange = useCallback((field: keyof typeof formData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }, 
  []);

  const needPlaceholders: Record<string, string> = language === 'en' ? {
    design: "Describe your vision, brand identity, and design needs",
    automation: "Tell me more about the processes you want to automate",
    website: "Tell me about your web project: goals, features, target audience",
    crm: "Explain your needs in lead, client, project, and invoice management",
    other: "Describe your need in detail",
  } : {
    design: "Décrivez votre vision, votre identité de marque, et vos besoins en design",
    automation: "Dites-m'en plus sur les processus que vous souhaitez automatiser",
    website: "Parlez-moi de votre projet web : objectifs, fonctionnalités, audience cible",
    crm: "Expliquez vos besoins en gestion de leads, clients, projets et facturation",
    other: "Décrivez votre besoin en détail",
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-gradient-to-b from-[#0C0C0C] via-neutral-950 to-[#0C0C0C]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 255, 194, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Floating animated elements background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated circles */}
          {[
            { size: 300, x: "10%", y: "5%", delay: 0 },
            { size: 200, x: "85%", y: "10%", delay: 0.5 },
            { size: 250, x: "15%", y: "80%", delay: 1 },
            { size: 180, x: "80%", y: "75%", delay: 1.5 },
          ].map((circle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-mint/5 blur-3xl"
              style={{
                width: circle.size,
                height: circle.size,
                left: circle.x,
                top: circle.y,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                delay: circle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Floating icons */}
          {[
            { Icon: MessageSquare, x: "8%", y: "15%", delay: 0.2 },
            { Icon: Calendar, x: "90%", y: "20%", delay: 0.4 },
            { Icon: Phone, x: "12%", y: "70%", delay: 0.6 },
          ].map(({ Icon, x, y, delay }, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: x, top: y }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                delay,
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-900/50 border border-mint/20 flex items-center justify-center backdrop-blur-sm">
                <Icon className="h-6 w-6 text-mint/60" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* 1. Introduction humaine */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 relative"
        >
          {/* Avatar / Photo avec cercles concentriques */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center relative"
          >
            {/* Cercles concentriques animés */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-24 h-24 rounded-full border-2 border-mint/20"
                animate={{
                  scale: [1 + i * 0.3, 1.5 + i * 0.3],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-mint/30 to-mint/10 border-2 border-mint/50 flex items-center justify-center backdrop-blur-xl group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-4xl"
              >
                Hello
              </motion.div>
              <div className="absolute inset-0 bg-mint/20 rounded-full blur-xl -z-10 group-hover:blur-2xl transition-all"></div>
            </div>
          </motion.div>

          {/* Badge "Disponible maintenant" */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/30 mb-6"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-mint"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-mint">Disponible pour de nouveaux projets</span>
          </motion.div>

          {/* Titre principal */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            {language === 'en' ? (
              <>Let's talk about <span className="text-gradient-mint-animated">your project</span></>
            ) : (
              <>Parlons de <span className="text-gradient-mint-animated">votre projet</span></>
            )}
          </motion.h2>

          {/* Sous-texte */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-6"
          >
            {language === 'en' ? (
              <>Tell me about your needs, ideas, or goals — I'll respond within <span className="text-mint font-medium">24h</span></>
            ) : (
              <>Expliquez-moi vos besoins, vos idées ou vos objectifs — je vous réponds sous <span className="text-mint font-medium">24h</span></>
            )}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-8 mb-6"
          >
            {[
              { icon: Clock, value: "< 24h", label: language === 'en' ? "Response time" : "Temps de réponse" },
              { icon: Users, value: "50+", label: language === 'en' ? "Happy clients" : "Clients satisfaits" },
              { icon: Star, value: "5.0", label: language === 'en' ? "Average rating" : "Note moyenne" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800"
              >
                <stat.icon className="h-5 w-5 text-mint" />
                <div className="text-left">
                  <div className="font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-neutral-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA alternatif */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            onClick={() => onNavigate("booking")}
            whileHover={{ scale: 1.02 }}
            className="text-neutral-500 hover:text-mint transition-colors inline-flex items-center gap-2 group"
          >
            <Calendar className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="underline-offset-4 group-hover:underline">
              {language === 'en' ? "I'd rather book a call" : "Je préfère réserver un appel"}
            </span>
          </motion.button>
        </motion.div>

        {/* 2. Choix du mode de contact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto relative"
        >
          {/* Option 1: Envoyer un message */}
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="relative p-10 rounded-3xl bg-neutral-950/50 border-2 border-neutral-800 hover:border-mint/40 backdrop-blur-xl cursor-pointer group transition-all overflow-hidden"
              >
                {/* Animated gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-mint/5 via-mint/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Animated glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-mint/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="relative z-10">
                  {/* Icon with animated ring */}
                  <div className="relative w-20 h-20 mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-mint/30"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="w-full h-full rounded-2xl bg-mint/10 border-2 border-mint/30 flex items-center justify-center group-hover:bg-mint/20 transition-colors">
                      <MessageSquare className="h-9 w-9 text-mint" />
                    </div>
                  </div>
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/10 border border-mint/30 mb-4">
                    <Zap className="h-3 w-3 text-mint" />
                    <span className="text-xs text-mint">{language === 'en' ? 'Fast response' : 'Réponse rapide'}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{language === 'en' ? 'Send a message' : 'Envoyer un message'}</h3>
                  <p className="text-neutral-400 mb-6">
                    {language === 'en' 
                      ? 'Describe your project in a few lines. Response guaranteed within 24h.'
                      : 'Décrivez votre projet en quelques lignes. Réponse garantie sous 24h.'}
                  </p>
                  
                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    {(language === 'en' 
                      ? ["Quick form", "No commitment", "100% free"]
                      : ["Formulaire rapide", "Sans engagement", "100% gratuit"]
                    ).map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-neutral-500"
                      >
                        <CheckCircle className="h-4 w-4 text-mint flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-mint group-hover:gap-3 transition-all">
                    <span>{language === 'en' ? 'Get started' : 'Commencer'}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-neutral-950 border-neutral-800">
              {!formSubmitted ? (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {language === 'en' ? 'Send me a message' : 'Envoyez-moi un message'}
                    </DialogTitle>
                    <DialogDescription>
                      {language === 'en' 
                        ? "I'll respond within 24h. All fields are required."
                        : 'Je vous répondrai dans les 24h. Tous les champs sont requis.'}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{language === 'en' ? 'Name / Company' : 'Nom / Entreprise'}</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange('name')}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Interests - Multiple checkboxes */}
                    <div className="space-y-3">
                      <Label className="text-white">{t("contact.form.interestedIn")}</Label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          "contact.form.reasons.0",
                          "contact.form.reasons.1",
                          "contact.form.reasons.2",
                          "contact.form.reasons.3",
                          "contact.form.reasons.4",
                          "contact.form.reasons.5"
                        ].map((reasonKey, index) => {
                          const reason = t(reasonKey);
                          const isSelected = selectedReasons.includes(reason);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedReasons(selectedReasons.filter(r => r !== reason));
                                } else {
                                  setSelectedReasons([...selectedReasons, reason]);
                                }
                              }}
                              className={`
                                flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer text-left
                                ${isSelected 
                                  ? 'bg-mint/10 border-2 border-mint' 
                                  : 'bg-neutral-900/50 border border-neutral-800 hover:border-mint/20'
                                }
                              `}
                            >
                              <div className={`
                                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                ${isSelected ? 'border-mint' : 'border-neutral-600'}
                              `}>
                                {isSelected && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-mint" />
                                )}
                              </div>
                              <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-neutral-400'}`}>
                                {reason}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{language === 'en' ? 'Your message' : 'Votre message'}</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange('message')}
                        placeholder={language === 'en' ? "Describe your project in detail..." : "Décrivez votre projet en détail..."}
                        className="min-h-[150px]"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                      <Upload className="h-5 w-5 text-mint flex-shrink-0" />
                      <div className="text-sm">
                        <p className="text-neutral-400">
                          {language === 'en' ? (
                            <>Need to share a brief or files? <span className="text-mint cursor-pointer hover:underline">Click here</span></>
                          ) : (
                            <>Besoin de partager un brief ou des fichiers ? <span className="text-mint cursor-pointer hover:underline">Cliquez ici</span></>
                          )}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || formSubmitted}
                      className="w-full bg-mint text-black hover:bg-mint/90 h-14 text-lg rounded-xl group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          language === 'en' ? 'Sending...' : 'Envoi en cours...'
                        ) : formSubmitted ? (
                          language === 'en' ? 'Sent!' : 'Envoyé !'
                        ) : (
                          <>
                            {language === 'en' ? 'Send message' : 'Envoyer le message'}
                            <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </Button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-20 h-20 rounded-full bg-mint/20 border-2 border-mint flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="h-10 w-10 text-mint" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-3">Message bien reçu ! 🎉</h3>
                  <p className="text-neutral-400 mb-6">
                    Merci <span className="text-mint font-medium">{formData.name}</span>, je vous répondrai sous 24h.
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={() => onNavigate("projects")}
                    className="border-mint/30 hover:bg-mint/10"
                  >
                    Découvrir mes projets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>

          {/* Option 2: Prendre un rendez-vous */}
          <motion.div
            whileHover={{ scale: 1.03, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("booking")}
            className="relative p-10 rounded-3xl bg-neutral-950/50 border-2 border-neutral-800 hover:border-mint/40 backdrop-blur-xl cursor-pointer group transition-all overflow-hidden"
          >
            {/* Animated gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-mint/5 via-mint/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Animated glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-mint/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            <div className="relative z-10">
              {/* Icon with animated ring */}
              <div className="relative w-20 h-20 mb-6">
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-mint/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <div className="w-full h-full rounded-2xl bg-mint/10 border-2 border-mint/30 flex items-center justify-center group-hover:bg-mint/20 transition-colors">
                  <Calendar className="h-9 w-9 text-mint" />
                </div>
              </div>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint/10 border border-mint/30 mb-4">
                <Clock className="h-3 w-3 text-mint" />
                <span className="text-xs text-mint">30 minutes</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{language === 'en' ? 'Book an appointment' : 'Prendre un rendez-vous'}</h3>
              <p className="text-neutral-400 mb-6">
                {language === 'en' 
                  ? 'Book a slot in my calendar. 30 min discovery call.'
                  : 'Réservez un créneau dans mon agenda. Appel découverte de 30 min.'}
              </p>
              
              {/* Features list */}
              <div className="space-y-2 mb-6">
                {(language === 'en' 
                  ? ["Available slots", "Video or phone", "100% free"]
                  : ["Créneaux disponibles", "Visio ou téléphone", "100% gratuit"]
                ).map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-neutral-500"
                  >
                    <CheckCircle className="h-4 w-4 text-mint flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-mint group-hover:gap-3 transition-all">
                <span>{language === 'en' ? 'View calendar' : 'Voir le calendrier'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 3. Bloc de confiance - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="relative mb-20"
        >
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85 }}
            className="text-center text-2xl font-bold mb-12"
          >
            {language === 'en' ? (
              <>Why <span className="text-mint">trust me?</span></>
            ) : (
              <>Pourquoi me faire <span className="text-mint">confiance ?</span></>
            )}
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { 
                icon: Clock, 
                title: language === 'en' ? "Response within 24h" : "Réponse sous 24h", 
                desc: language === 'en' ? "Guaranteed promise" : "Promesse garantie",
                gradient: "from-mint/20 to-mint/5"
              },
              { 
                icon: Shield, 
                title: language === 'en' ? "Guaranteed confidentiality" : "Confidentialité garantie", 
                desc: language === 'en' ? "Your data is protected" : "Vos données sont protégées",
                gradient: "from-cyan-500/20 to-cyan-500/5"
              },
              { 
                icon: MessageCircle, 
                title: language === 'en' ? "Human exchanges" : "Échanges humains", 
                desc: language === 'en' ? "No bots, only human" : "Pas de robots, que de l'humain",
                gradient: "from-mint/20 to-mint/5"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm group hover:border-mint/30 transition-all overflow-hidden"
              >
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Icon with animated ring */}
                <div className="relative mb-6">
                  {/* Pulsing rings */}
                  <motion.div
                    className="absolute inset-0 w-16 h-16 rounded-xl border-2 border-mint/30"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  
                  <div className="relative w-16 h-16 rounded-xl bg-mint/10 border-2 border-mint/30 flex items-center justify-center group-hover:bg-mint/20 transition-colors">
                    <item.icon className="h-8 w-8 text-mint" />
                  </div>
                </div>

                <div className="relative z-10">
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-neutral-400 mb-4">{item.desc}</p>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + i * 0.1, type: "spring" }}
                    className="inline-flex"
                  >
                    <div className="w-8 h-8 rounded-full bg-mint/20 border-2 border-mint flex items-center justify-center">
                      <Check className="h-4 w-4 text-mint" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. Alternatives rapides - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
          className="text-center relative"
        >
          {/* Decorative line */}
          <div className="flex items-center gap-4 mb-8 max-w-md mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-neutral-800" />
            <span className="text-neutral-500 text-sm">
              {language === 'en' ? 'Or contact me directly' : 'Ou contactez-moi directement'}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-neutral-800" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Phone, label: "WhatsApp", color: "from-green-500/20 to-green-500/5" },
              { icon: Linkedin, label: "LinkedIn", color: "from-blue-500/20 to-blue-500/5" },
              { icon: Twitter, label: "Twitter", color: "from-cyan-500/20 to-cyan-500/5" },
            ].map((social, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.3 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-900/80 border border-neutral-800 hover:border-mint/40 backdrop-blur-sm transition-all group overflow-hidden"
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <social.icon className="h-5 w-5 text-mint relative z-10" />
                <span className="text-sm relative z-10">{social.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.6, type: "spring" }}
            className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-mint" />
            </motion.div>
            <span className="text-xs text-neutral-400">
              {language === 'en' ? 'All channels are active' : 'Tous les canaux sont actifs'}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

