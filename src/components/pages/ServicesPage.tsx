import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Workflow, 
  LayoutDashboard, 
  Sparkles, 
  Target,
  Brain,
  Code2,
  Award,
  ArrowRight,
  TrendingDown,
  Clock,
  Zap
} from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";

type Page = "contact" | "booking";

interface ServicesPageProps {
  onNavigate: (page: Page) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Workflow,
      title: t('services.list.webDesign.title'),
      description: t('services.list.webDesign.description'),
      features: [
        t('services.list.webDesign.features.0'),
        t('services.list.webDesign.features.1'),
        t('services.list.webDesign.features.2'),
        t('services.list.webDesign.features.3'),
        t('services.list.webDesign.features.4'),
      ],
    },
    {
      icon: LayoutDashboard,
      title: t('services.list.webDev.title'),
      description: t('services.list.webDev.description'),
      features: [
        t('services.list.webDev.features.0'),
        t('services.list.webDev.features.1'),
        t('services.list.webDev.features.2'),
        t('services.list.webDev.features.3'),
        t('services.list.webDev.features.4'),
      ],
    },
    {
      icon: Sparkles,
      title: t('services.list.ecommerce.title'),
      description: t('services.list.ecommerce.description'),
      features: [
        t('services.list.ecommerce.features.0'),
        t('services.list.ecommerce.features.1'),
        t('services.list.ecommerce.features.2'),
        t('services.list.ecommerce.features.3'),
        t('services.list.ecommerce.features.4'),
      ],
    },
  ];

  const process = [
    {
      icon: Target,
      step: "01",
      title: t('home.process.steps.audit.title'),
      description: t('home.process.steps.audit.description')
    },
    {
      icon: Brain,
      step: "02",
      title: t('home.process.steps.design.title'),
      description: t('home.process.steps.design.description')
    },
    {
      icon: Code2,
      step: "03",
      title: t('home.process.steps.implementation.title'),
      description: t('home.process.steps.implementation.description')
    },
    {
      icon: Award,
      step: "04",
      title: t('home.process.steps.monitoring.title'),
      description: t('home.process.steps.monitoring.description')
    },
  ];

  const benefits = [
    {
      icon: TrendingDown,
      value: "83%",
      label: t('home.results.cases.ecommerce.resultLabel'),
      description: t('home.results.cases.ecommerce.problem')
    },
    {
      icon: Clock,
      value: "15h",
      label: t('home.results.cases.freelance.result'),
      description: t('home.results.cases.freelance.resultLabel')
    },
    {
      icon: Zap,
      value: "100%",
      label: t('home.results.cases.saas.resultLabel'),
      description: t('home.results.cases.saas.solution')
    },
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

        {/* Floating Orb */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-mint rounded-full blur-[120px] opacity-15"
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
              <span className="text-sm text-mint font-medium">{t('nav.services')}</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]">
              <span className="block text-white">{t('services.hero.title')}</span>
              <span className="block text-gradient-mint-animated">{t('services.hero.subtitle')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t('services.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 hover:border-mint/20 hover:bg-neutral-950 transition-all duration-300 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-8">
                    {/* Icon Block */}
                    <div className="mb-8">
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="h-10 w-10 text-mint" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 group-hover:text-mint transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-neutral-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">{t('home.process.title')}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.process.subtitle')}
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {t('services.pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6 hover:border-mint/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-mint font-mono">{step.step}</div>
                      <div className="w-10 h-10 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center">
                        <step.icon className="h-5 w-5 text-mint" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-mint transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits - Big Numbers */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.results.title')}
            </h2>
            <p className="text-xl text-neutral-400">
              {t('home.results.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative rounded-2xl border border-neutral-900 bg-neutral-950/50 p-8 hover:border-mint/20 transition-all duration-300 text-center h-full">
                  <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-mint/10 border border-mint/20 mb-6">
                      <benefit.icon className="h-8 w-8 text-mint" />
                    </div>
                    
                    <div className="text-6xl font-bold text-mint mb-2">
                      {benefit.value}
                    </div>
                    
                    <div className="text-lg font-medium text-white mb-2">
                      {benefit.label}
                    </div>

                    <div className="text-sm text-neutral-400">
                      {benefit.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
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
            {[
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
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-neutral-900 bg-neutral-950/50 hover:border-mint/20 transition-all h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-mint/10 border border-mint/20 rounded-xl mb-4">
                      <item.icon className="h-6 w-6 text-mint" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-neutral-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigate("contact")}
                className="bg-mint text-black hover:bg-mint/90 h-14 px-10 rounded-full text-lg"
              >
                {t('about.cta.button')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate("booking")}
                className="border-neutral-800 hover:border-mint/20 hover:bg-neutral-950 h-14 px-10 rounded-full text-lg"
              >
                {t('nav.cta')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
