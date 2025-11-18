import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Sparkles,
  MousePointerClick,
  Code2,
  Brain,
  Workflow,
  ArrowRight,
  Target,
  CheckCircle2,
  Zap,
  PenTool,
  Cpu,
  ChevronRight,
} from "lucide-react";
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

const workflowOrder = ["lead", "client", "project", "delivery"] as const;

type WorkflowNodeId = (typeof workflowOrder)[number];

interface HeroCopy {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  overlay: string;
  buttons: {
    primary: string;
    secondary: string;
  };
  stats: Array<{ label: string; value: string }>;
  interfaceSculptor: {
    panelLabel: string;
    title: string;
    description: string;
    chipLabel: string;
    status: string;
  };
  thinkingEngine: {
    panelLabel: string;
    title: string;
    description: string;
    placeholder: string;
    button: string;
    status: string;
    liveLabel: string;
    suggestions: string[];
    baseNodes: string[];
  };
  workflowMachine: {
    panelLabel: string;
    title: string;
    description: string;
    instructions: {
      drag: string;
      zoom: string;
    };
    zoomLabel: string;
    pathLabel: string;
    nodes: Record<WorkflowNodeId, { label: string; description: string }>;
  };
}

type HeroTranslationShape = {
  home?: {
    heroAutomate?: Partial<HeroCopy>;
  };
};

const defaultHeroCopy: HeroCopy = {
  badge: "Concept 1 · The Designer Automate",
  title: "I build intelligent experiences —",
  highlight: "Design that feels alive. Code that adapts. Automation that works for you.",
  description:
    "A triple-panel hero where UI design sculpts itself, AI responds in real-time, and workflows glow as they automate — all before we even start working together.",
  overlay: "I design better experiences. I automate what wastes your time. I build with AI.",
  buttons: {
    primary: "See the real projects",
    secondary: "Book a call",
  },
  stats: [
    { label: "Automation uptime", value: "24/7" },
    { label: "Average delivery", value: "8 days" },
    { label: "Retention", value: "+92%" },
  ],
  interfaceSculptor: {
    panelLabel: "The Interface Sculptor",
    title: "UX that feels alive",
    description:
      "Components pop into place as you hover. Layouts reorganize on scroll. Colors breathe with your cursor angle.",
    chipLabel: "Live prototype",
    status: "Auto-layout engaged",
  },
  thinkingEngine: {
    panelLabel: "The Thinking Engine",
    title: "AI that collaborates",
    description: "Type an idea, click anywhere, and the sphere spawns live suggestions that you can drag into your projects.",
    placeholder: "Prompt the engine...",
    button: "Inject",
    status: "listening...",
    liveLabel: "Live suggestions",
    baseNodes: ["UI", "Automation", "Business", "Growth"],
    suggestions: [
      "UI layout idea",
      "Conversion flow",
      "Onboarding tweak",
      "Business workflow",
      "Automation hook",
      "Pricing matrix",
      "CRM sync",
      "Product positioning",
      "Support escalation",
      "Growth experiment",
    ],
  },
  workflowMachine: {
    panelLabel: "The Workflow Machine",
    title: "Automation blueprint",
    description: "Hover nodes to play a flow. Drag to explore. Use the zoom to inspect each automation trigger.",
    instructions: {
      drag: "Drag & Explore",
      zoom: "Zoom controls",
    },
    zoomLabel: "Zoom {{value}}%",
    pathLabel: "• Path now playing: {{node}}",
    nodes: {
      lead: { label: "Lead", description: "Capture + qualify" },
      client: { label: "Client", description: "Hand-off & briefing" },
      project: { label: "Project", description: "Sprint + QA" },
      delivery: { label: "Delivery", description: "Assets + automation" },
    },
  },
};

function mergeHeroCopy(base: HeroCopy, override?: Partial<HeroCopy>): HeroCopy {
  if (!override) {
    return base;
  }

  return {
    ...base,
    ...override,
    buttons: {
      ...base.buttons,
      ...override.buttons,
    },
    stats: override.stats ?? base.stats,
    interfaceSculptor: {
      ...base.interfaceSculptor,
      ...override.interfaceSculptor,
    },
    thinkingEngine: {
      ...base.thinkingEngine,
      ...override.thinkingEngine,
    },
    workflowMachine: {
      ...base.workflowMachine,
      ...override.workflowMachine,
      instructions: {
        ...base.workflowMachine.instructions,
        ...(override.workflowMachine?.instructions ?? {}),
      },
      nodes: {
        ...base.workflowMachine.nodes,
        ...(override.workflowMachine?.nodes ?? {}),
      },
    },
  };
}

function formatTemplate(template: string, replacements: Record<string, string | number>) {
  return Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value)),
    template
  );
}

export function HeroDesignerAutomate({ onNavigate }: HeroDesignerAutomateProps) {
  const { t } = useTranslation();

  const heroCopy = useMemo(() => {
    const localized = (t as unknown as HeroTranslationShape).home?.heroAutomate;
    return mergeHeroCopy(defaultHeroCopy, localized);
  }, [t]);

  const workflowLegend = useMemo(
    () => workflowOrder.map((id) => heroCopy.workflowMachine.nodes[id].label).join(" → "),
    [heroCopy]
  );

  return (
    <div className="relative w-full space-y-12">
      <div className="space-y-5 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 text-sm text-mint/80"
        >
          <Sparkles className="h-4 w-4" />
          {heroCopy.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          {heroCopy.title}
          <span className="block text-gradient-mint-animated">{heroCopy.highlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg text-neutral-400"
        >
          {heroCopy.description}
        </motion.p>
      </div>

      <div className="relative">
        <div className="grid gap-6 lg:grid-cols-3">
          <InterfaceSculptorPanel copy={heroCopy.interfaceSculptor} />
          <ThinkingEnginePanel copy={heroCopy.thinkingEngine} />
          <WorkflowMachinePanel copy={heroCopy.workflowMachine} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:flex pointer-events-none absolute inset-x-10 top-1/2 -translate-y-1/2 justify-center"
        >
          <div className="px-10 py-6 rounded-3xl border border-mint/40 bg-black/30 backdrop-blur-xl shadow-[0_0_60px_rgba(0,255,194,0.15)]">
            <p className="text-center text-2xl font-semibold tracking-tight text-white">{heroCopy.overlay}</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col md:flex-row items-center gap-4 md:gap-6"
      >
        <Button
          size="lg"
          onClick={() => onNavigate("projects")}
          className="bg-mint text-black hover:bg-mint/90 h-14 px-8 text-base rounded-2xl"
        >
          {heroCopy.buttons.primary}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant="ghost"
          onClick={() => onNavigate("contact")}
          className="border-2 border-mint/30 hover:border-mint/60 bg-transparent text-white h-14 px-8 rounded-2xl"
        >
          {heroCopy.buttons.secondary}
        </Button>
        <div className="flex-1 w-full md:w-auto flex items-center justify-center gap-6 text-left">
          {heroCopy.stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </div>
      </motion.div>

      <div className="hidden lg:flex items-center gap-3 text-sm text-neutral-400 justify-center">
        <ChevronRight className="h-4 w-4 text-mint" />
        {workflowLegend}
      </div>
    </div>
  );
}

function StatBlock({ stat }: { stat: { label: string; value: string } }) {
  return (
    <div className="text-left">
      <div className="text-xs uppercase tracking-widest text-neutral-500">{stat.label}</div>
      <div className="text-2xl font-semibold text-mint">{stat.value}</div>
    </div>
  );
}

interface InterfaceSculptorPanelProps {
  copy: HeroCopy["interfaceSculptor"];
}

function InterfaceSculptorPanel({ copy }: InterfaceSculptorPanelProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastShuffle = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const [mouseAngle, setMouseAngle] = useState(0);
  const [components, setComponents] = useState(() => generateComponents(copy.chipLabel));

  useEffect(() => {
    setComponents(generateComponents(copy.chipLabel));
  }, [copy.chipLabel]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const interval = setInterval(() => setComponents(generateComponents(copy.chipLabel)), 3800);
    return () => clearInterval(interval);
  }, [copy.chipLabel, shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !panelRef.current) return;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        if (!panelRef.current) return;
        const rect = panelRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        setMouseAngle(angle);

        const now = Date.now();
        if (now - lastShuffle.current > 600) {
          lastShuffle.current = now;
          setComponents(generateComponents(copy.chipLabel));
        }
      });
    },
    [copy.chipLabel, shouldReduceMotion]
  );

  return (
    <motion.div
      ref={panelRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-[420px] rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(${mouseAngle}deg, rgba(0,255,194,0.08), transparent)`
      }}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400">
        <span>{copy.panelLabel}</span>
        <MousePointerClick className="h-4 w-4 text-mint/70" />
      </div>
      <div className="mt-4 text-3xl font-semibold">{copy.title}</div>
      <p className="text-sm text-neutral-500 mt-2 max-w-sm">{copy.description}</p>

      <div className="relative mt-6 h-[260px] rounded-2xl bg-black/50 border border-white/5 overflow-hidden">
        <AnimatePresence>
          {components.map((component) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className={`absolute rounded-xl border ${
                component.accent ? "border-white/30 bg-white/10" : "border-white/10 bg-white/5"
              } backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]`}
              style={{
                left: `${component.x}%`,
                top: `${component.y}%`,
                width: component.width,
                height: component.height,
              }}
            >
              {component.type === "card" && (
                <div className="h-full w-full p-4 flex flex-col gap-3">
                  <div className="h-3 rounded-full bg-white/20 w-3/4" />
                  <div className="h-2 rounded-full bg-white/10 w-1/2" />
                  <div className="flex gap-2 mt-auto">
                    <div className="flex-1 h-8 rounded-xl bg-mint/40" />
                    <div className="w-12 h-8 rounded-xl border border-white/10" />
                  </div>
                </div>
              )}
              {component.type === "chip" && (
                <div className="h-full w-full flex items-center justify-center text-xs uppercase tracking-wide text-neutral-200">
                  {component.label}
                </div>
              )}
              {component.type === "image" && (
                <div className="h-full w-full bg-gradient-to-br from-mint/20 via-transparent to-transparent" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs text-neutral-400">
        <Sparkles className="h-4 w-4 text-mint" />
        {copy.status}
      </div>
    </motion.div>
  );
}

function generateComponents(chipLabel: string) {
  const base = [
    { id: "hero", type: "card" as const, width: "48%", height: "44%", accent: true },
    { id: "sidebar", type: "card" as const, width: "38%", height: "60%", accent: false },
    { id: "cta", type: "card" as const, width: "40%", height: "30%", accent: true },
    { id: "chip", type: "chip" as const, width: "28%", height: "14%", accent: false, label: chipLabel },
    { id: "img", type: "image" as const, width: "32%", height: "36%", accent: true },
  ];

  return base.map((item) => ({
    ...item,
    x: 8 + Math.random() * 50,
    y: 5 + Math.random() * 50,
  }));
}

function buildSuggestionRow(current: string, pool: string[]) {
  if (!pool.length) return [];
  const others = pool.filter((item) => item !== current);
  return [current, ...others.slice(0, 2)];
}

interface ThinkingEnginePanelProps {
  copy: HeroCopy["thinkingEngine"];
}

function ThinkingEnginePanel({ copy }: ThinkingEnginePanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const pulseTimeout = useRef<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [nodes, setNodes] = useState<string[]>(copy.baseNodes);
  const [suggestion, setSuggestion] = useState(() => copy.suggestions[0] ?? "");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setNodes(copy.baseNodes);
  }, [copy.baseNodes]);

  useEffect(() => {
    setSuggestion(copy.suggestions[0] ?? "");
  }, [copy.suggestions]);

  const triggerPulse = useCallback(() => {
    if (shouldReduceMotion) return;
    setPulse(true);
    if (pulseTimeout.current) {
      clearTimeout(pulseTimeout.current);
      pulseTimeout.current = null;
    }
    pulseTimeout.current = window.setTimeout(() => setPulse(false), 600);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (copy.suggestions.length < 2) return;
    const duration = shouldReduceMotion ? 6000 : 3200;
    const interval = setInterval(() => {
      setSuggestion((prev) => {
        const pool = copy.suggestions;
        const next = pool[Math.floor(Math.random() * pool.length)];
        if (!next) return prev;
        if (next === prev) {
          const index = pool.indexOf(prev);
          return pool[(index + 1) % pool.length];
        }
        return next;
      });
      triggerPulse();
    }, duration);
    return () => clearInterval(interval);
  }, [copy.suggestions, shouldReduceMotion, triggerPulse]);

  useEffect(() => {
    return () => {
      if (pulseTimeout.current) {
        clearTimeout(pulseTimeout.current);
      }
    };
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!inputValue.trim()) return;
      setNodes((prev) => (prev.length > 6 ? prev.slice(1) : prev).concat(inputValue.trim()));
      setInputValue("");
      triggerPulse();
    },
    [inputValue, triggerPulse]
  );

  const orbitNodes = useMemo(() => nodes.slice(-6), [nodes]);

  return (
    <motion.div className="relative min-h-[420px] rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-900/20 via-transparent to-neutral-900/40 p-6 overflow-hidden">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400">
        <span>{copy.panelLabel}</span>
        <Code2 className="h-4 w-4 text-purple-300" />
      </div>
      <div className="mt-4 text-3xl font-semibold">{copy.title}</div>
      <p className="text-sm text-neutral-400 mt-2 max-w-sm">{copy.description}</p>

      <div className="relative mt-4 flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={copy.placeholder}
              className="w-full bg-transparent text-sm text-white focus:outline-none"
            />
          </div>
          <Button type="submit" className="rounded-2xl bg-purple-500 hover:bg-purple-400">
            {copy.button}
          </Button>
        </form>

        <div className="relative h-[240px] flex items-center justify-center">
          <motion.div
            onClick={() => {
              setPulse(true);
              setTimeout(() => setPulse(false), 400);
            }}
            className="relative w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/30 via-transparent to-mint/30 border border-white/10 cursor-pointer"
            animate={{
              boxShadow: pulse
                ? "0 0 60px rgba(168,85,247,0.65)"
                : "0 0 20px rgba(168,85,247,0.35)",
            }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="absolute inset-4 rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Brain className="h-6 w-6 text-purple-200 mb-2" />
              <span className="text-xs text-neutral-300">{copy.status}</span>
            </div>

            {orbitNodes.map((node, index) => {
              const angle = (index / orbitNodes.length) * Math.PI * 2;
              const radius = 110;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={`${node}-${index}`}
                  className="absolute px-3 py-1.5 rounded-full border border-white/20 bg-black/60 text-xs text-white"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                >
                  {node}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-black/40 p-4"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400">
            <Cpu className="h-4 w-4 text-mint" />
            {copy.liveLabel}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {buildSuggestionRow(suggestion, copy.suggestions).map((label, index) => (
              <motion.div
                key={`${label}-${index}`}
                className={`px-3 py-1 rounded-full text-xs border ${
                  suggestion === label ? "border-mint/60 text-mint" : "border-white/10 text-white/70"
                }`}
                animate={suggestion === label ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: !shouldReduceMotion && suggestion === label ? Infinity : 0 }}
              >
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface WorkflowMachinePanelProps {
  copy: HeroCopy["workflowMachine"];
}

function WorkflowMachinePanel({ copy }: WorkflowMachinePanelProps) {
  const dragAreaRef = useRef<HTMLDivElement | null>(null);
  const [activeNode, setActiveNode] = useState<WorkflowNodeId>("lead");
  const [zoom, setZoom] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const duration = shouldReduceMotion ? 8000 : 4000;
    const interval = setInterval(() => {
      setActiveNode((prev) => {
        const index = workflowOrder.indexOf(prev);
        return workflowOrder[(index + 1) % workflowOrder.length];
      });
    }, duration);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const activePath = useMemo(() => {
    const index = workflowOrder.indexOf(activeNode);
    return workflowOrder.slice(0, index + 1);
  }, [activeNode]);

  const nodes = useMemo(
    () => [
      { id: "lead" as WorkflowNodeId, x: 15, y: 25 },
      { id: "client" as WorkflowNodeId, x: 55, y: 15 },
      { id: "project" as WorkflowNodeId, x: 70, y: 55 },
      { id: "delivery" as WorkflowNodeId, x: 30, y: 65 },
    ],
    []
  );

  const edges: Array<[WorkflowNodeId, WorkflowNodeId]> = [
    ["lead", "client"],
    ["client", "project"],
    ["project", "delivery"],
  ];

  return (
    <motion.div className="relative min-h-[420px] rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-neutral-900/40 p-6 overflow-hidden">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-400">
        <span>{copy.panelLabel}</span>
        <Workflow className="h-4 w-4 text-cyan-200" />
      </div>
      <div className="mt-4 text-3xl font-semibold">{copy.title}</div>
      <p className="text-sm text-neutral-400 mt-2 max-w-sm">{copy.description}</p>

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
          <MousePointerClick className="h-3 w-3 text-mint" />
          {copy.instructions.drag}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
          <PenTool className="h-3 w-3 text-mint" />
          {copy.instructions.zoom}
        </div>
      </div>

      <div className="relative mt-4 h-[260px] rounded-2xl border border-white/5 bg-black/40 overflow-hidden" ref={dragAreaRef}>
        <motion.div
          className="absolute inset-0"
          drag
          dragConstraints={dragAreaRef}
          style={{ scale: zoom }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,194,0.06),_transparent_60%)]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <svg className="absolute inset-0 w-full h-full">
            {edges.map(([from, to]) => {
              const start = nodes.find((node) => node.id === from)!;
              const end = nodes.find((node) => node.id === to)!;
              const isActive = activePath.includes(from) && activePath.includes(to);
              return (
                <motion.line
                  key={`${from}-${to}`}
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke={isActive ? "#00ffc2" : "rgba(255,255,255,0.15)"}
                  strokeWidth={isActive ? 4 : 2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          {nodes.map((node, index) => {
            const isActive = activeNode === node.id;
            const Icon = index === 0 ? Target : index === nodes.length - 1 ? CheckCircle2 : Zap;
            return (
              <motion.button
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl px-4 py-3 border backdrop-blur-lg"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  borderColor: isActive ? "rgba(0,255,194,0.8)" : "rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(0,0,0,0.6)",
                }}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setActiveNode(node.id)}
                onFocus={() => setActiveNode(node.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isActive ? "text-mint" : "text-white/60"}`} />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">{copy.nodes[node.id].label}</div>
                    <div className="text-[10px] uppercase tracking-wide text-neutral-400">
                      {copy.nodes[node.id].description}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <button
            onClick={() => setZoom((value) => Math.max(0.8, +(value - 0.1).toFixed(2)))}
            className="w-8 h-8 rounded-full border border-white/10 text-white/70 hover:border-mint/40"
          >
            −
          </button>
          <button
            onClick={() => setZoom((value) => Math.min(1.3, +(value + 0.1).toFixed(2)))}
            className="w-8 h-8 rounded-full border border-white/10 text-white/70 hover:border-mint/40"
          >
            +
          </button>
          <span className="text-xs text-neutral-400">
            {formatTemplate(copy.zoomLabel, { value: Math.round(zoom * 100) })}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-neutral-400">
        <ChevronRight className="h-4 w-4 text-mint" />
        {workflowOrder.map((id) => copy.nodes[id].label).join(" → ")}
        <span className="text-mint">
          {formatTemplate(copy.pathLabel, { node: copy.nodes[activeNode].label })}
        </span>
      </div>
    </motion.div>
  );
}
