import { motion } from "motion/react";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "../../utils/i18n/useTranslation";

type HeroNavigatePage = "contact" | "projects" | "services" | "booking";

type HeroSectionProps = {
  onNavigate: (page: HeroNavigatePage) => void;
};

const blueprintColors = [
  "from-[#00FFC2]/20 via-transparent to-transparent",
  "from-[#52E5FF]/20 via-transparent to-transparent",
  "from-[#C792FF]/20 via-transparent to-transparent",
];

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const { t } = useTranslation();

  const statCards = [
    { value: "30+", label: t("home.hero.stats.projects") },
    { value: "25+", label: t("home.hero.stats.clients") },
    { value: "15h", label: t("home.hero.stats.saved") },
  ];

  const blueprint = [
    {
      title: t("home.process.steps.audit.title"),
      description: t("home.process.steps.audit.description"),
      icon: Sparkles,
    },
    {
      title: t("home.process.steps.design.title"),
      description: t("home.process.steps.design.description"),
      icon: Workflow,
    },
    {
      title: t("home.process.steps.implementation.title"),
      description: t("home.process.steps.implementation.description"),
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#050505] via-[#080B0C] to-[#050505]">
      {/* Background accents */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#00FFC2]/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-[#52E5FF]/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 lg:flex-row lg:items-center">
        {/* Left column */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-mint"
          >
            <Sparkles className="h-4 w-4" />
            {t("home.hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-8 text-5xl font-semibold text-white md:text-6xl lg:text-7xl"
          >
            <span className="block text-white">{t("home.hero.titleLine1")}</span>
            <span className="block text-white">{t("home.hero.titleLine2")}</span>
            <span className="block bg-gradient-to-r from-[#00FFC2] via-[#66FFE9] to-[#00FFC2] bg-clip-text text-transparent">
              {t("home.hero.titleLine3")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-lg text-neutral-400 md:text-xl"
          >
            {t("home.hero.subtitle")}{" "}
            <span className="text-white">{t("home.hero.subtitleHighlight1")}</span> & {" "}
            <span className="text-white">{t("home.hero.subtitleHighlight2")}</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-14 rounded-2xl bg-mint px-6 text-base font-semibold text-black shadow-[0_20px_60px_rgba(0,255,194,0.35)] transition hover:translate-y-0.5"
              onClick={() => onNavigate("contact")}
            >
              {t("home.hero.cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-14 rounded-2xl border border-white/10 px-6 text-base text-white hover:border-mint/40"
              onClick={() => onNavigate("projects")}
            >
              <PlayCircle className="mr-2 h-4 w-4 text-mint" />
              {t("home.hero.viewWork")}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-white/5 pt-8"
          >
            {statCards.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex-1"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 via-white/[0.02] to-white/10 p-8">
            <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="space-y-10 pt-6">
              {blueprint.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                  <span className="text-sm font-semibold text-neutral-500">0{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-xl bg-gradient-to-r ${blueprintColors[index % blueprintColors.length]} p-2`}></div>
                      <step.icon className="h-5 w-5 text-mint" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-neutral-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-neutral-400">
              <p>{t("home.hero.metrics.timeSaved")}: <span className="text-white">+320h</span></p>
              <p>{t("home.hero.metrics.gainedPerWeek")}: <span className="text-white">12h</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
