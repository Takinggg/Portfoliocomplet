import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { 
  Workflow,
  Sparkles,
  LayoutDashboard,
  Code2,
  Target,
  Zap,
  Award,
  Heart,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";

type Page = "contact";

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const { t } = useTranslation();
  const skills = [
    {
      category: t('about.skills.automation'),
      icon: Workflow,
      items: ["n8n", "Make (Integromat)", "Zapier", "Webhooks", "API Integration"]
    },
    {
      category: t('about.skills.nocode'),
      icon: LayoutDashboard,
      items: ["Notion", "Airtable", "Webflow", "Framer", "Figma"]
    },
    {
      category: t('about.skills.ai'),
      icon: Sparkles,
      items: ["OpenAI GPT-4", "Claude", "Chatbots", "Automation AI", "Prompts Engineering"]
    },
    {
      category: t('about.skills.development'),
      icon: Code2,
      items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Supabase"]
    },
  ];

  const values = [
    {
      icon: Target,
      title: t('about.values.roi.title'),
      description: t('about.values.roi.description')
    },
    {
      icon: Zap,
      title: t('about.values.speed.title'),
      description: t('about.values.speed.description')
    },
    {
      icon: Award,
      title: t('about.values.autonomy.title'),
      description: t('about.values.autonomy.description')
    },
  ];

  const stats = [
    { value: "30+", label: t('about.stats.projectsCompleted'), icon: TrendingUp },
    { value: "25+", label: t('about.stats.clientsSatisfied'), icon: Users },
    { value: "15h", label: t('about.stats.timeSavedPerWeek'), icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 194, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}></div>
        </div>

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-mint rounded-full blur-[120px] opacity-15"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-8">
              <span className="text-sm text-mint font-medium">{t('about.hero.badge')}</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]">
              <span className="block text-white">{t('about.hero.title')}</span>
              <span className="block text-gradient-mint-animated">{t('about.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('about.hero.subtitle')}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-mint mb-2">{stat.value}</div>
                  <div className="text-sm text-neutral-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-neutral-900 bg-neutral-950/50 p-12 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-mint/10 to-transparent"></div>
                
                {/* Icon Grid */}
                <div className="relative grid grid-cols-2 gap-6">
                  {[Workflow, Sparkles, LayoutDashboard, Code2].map((Icon, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="aspect-square rounded-2xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center"
                    >
                      <Icon className="h-12 w-12 text-mint" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                {t('about.skills.title')}
              </h2>
              <div className="space-y-4 text-lg text-neutral-400 leading-relaxed">
                <p>
                  {t('about.story.content')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">Expertise</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {t('about.skills.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6 hover:border-mint/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-mint/5 opacity-0 hover:opacity-100 transition-opacity rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center mb-4">
                      <skill.icon className="h-6 w-6 text-mint" />
                    </div>
                    <h3 className="text-lg font-bold mb-4">{skill.category}</h3>
                    <ul className="space-y-2">
                      {skill.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-neutral-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('about.values.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-neutral-900 bg-neutral-950/50 hover:border-mint/20 transition-all h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-mint/10 border border-mint/20 rounded-xl mb-6">
                      <value.icon className="h-8 w-8 text-mint" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
              {t('about.cta.subtitle')}
            </p>
            <Button 
              size="lg" 
              onClick={() => onNavigate("contact")}
              className="bg-mint text-black hover:bg-mint/90 h-14 px-10 rounded-full text-lg"
            >
              {t('about.cta.button')}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
