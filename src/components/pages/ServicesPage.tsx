import { Button } from "../ui/button";
import { motion } from "motion/react";
import { 
  CheckCircle2,
  Target,
  Brain,
  Code2,
  Award,
  TrendingUp,
  Clock,
  Zap,
  Workflow,
  Palette,
  Bot,
  BarChart3,
  Sparkles,
  Boxes,
  Gauge
} from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { ServicePackageCard, ServicePackage } from "../services/ServicePackageCard";
import { ProcessTimeline } from "../services/ProcessTimeline";
import { MiniCaseStudies } from "../services/MiniCaseStudies";
import { ServiceDetailBlocks } from "../services/ServiceDetailBlocks";
import { TripleEngineDemo } from "../services/TripleEngineDemo";
import { ServicesFAQ } from "../services/ServicesFAQ";
import { StickyCTABar } from "../services/StickyCTABar";
import { ServiceContactForm } from "../services/ServiceContactForm";
import { useEffect } from "react";

type Page = "contact" | "booking";

interface ServicesPageProps {
  onNavigate: (page: Page) => void;
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { t } = useTranslation();

  // SEO Meta tags
  useEffect(() => {
    document.title = "Services — UI/UX Design, Automatisation & IA — Maxence";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "UI/UX design + automatisation : j'aide les startups et freelances à créer des interfaces performantes et des systèmes intelligents. Audit gratuit."
      );
    }
  }, []);
  
  // Service Packages
  const packages: ServicePackage[] = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Audit & Quick-Wins",
      description: "Pour identifier rapidement les points d'amélioration et démarrer avec 2 automatisations simples.",
      price: "300-500 €",
      duration: "3-5 jours",
      deliverables: [
        "Audit UX complet de votre produit",
        "2 automatisations rapides (emails, workflows)",
        "Plan d'action priorisé (1 page)",
        "Session de restitution (1h)",
      ],
      detailedDescription:
        "Le pack Starter est idéal pour les projets en démarrage ou pour tester une collaboration. Je réalise un audit approfondi de votre interface, identifie les points de friction et implémente 2 automatisations simples pour économiser du temps dès maintenant.",
      included: [
        "Support email pendant 7 jours",
        "Document de synthèse en PDF",
        "Recommandations priorisées",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "Product Experience",
      description: "Refonte d'une page ou d'un flow complet + automatisations avancées + dashboard de suivi.",
      price: "1 000-2 500 €",
      priceNote: "selon scope",
      duration: "1-2 semaines",
      recommended: true,
      deliverables: [
        "UI redesign complet d'1 page ou flow",
        "Prototype interactif haute-fidélité",
        "3 automatisations avancées (n8n, API, GPT)",
        "Dashboard Notion/Airtable pour suivi",
        "Design system basique (couleurs, typo, composants)",
        "Support 14 jours post-livraison",
      ],
      detailedDescription:
        "Le pack Pro est le plus populaire. Il combine un redesign complet d'une page ou d'un parcours utilisateur avec des automatisations intelligentes et un dashboard de suivi. Parfait pour les startups et PME qui veulent un résultat professionnel rapidement.",
      included: [
        "Fichier Figma source",
        "Export assets (SVG, PNG)",
        "Documentation technique",
        "1 itération de révision incluse",
      ],
    },
    {
      id: "scale",
      name: "Scale",
      tagline: "System Builder",
      description: "Design system complet, multi-pages, intégrations IA avancées et workflows complexes.",
      price: "4 000+ €",
      priceNote: "sur devis",
      duration: "3-4 semaines",
      deliverables: [
        "Design system complet et évolutif",
        "Refonte multi-pages (jusqu'à 5 pages)",
        "Intégrations IA avancées (GPT, APIs tierces)",
        "Workflows automatisés complexes (n8n, Make, Zapier)",
        "Dashboard analytique avancé",
        "Documentation complète",
        "Support 30 jours + maintenance",
      ],
      detailedDescription:
        "Le pack Scale est conçu pour les projets ambitieux nécessitant une architecture solide, un design system complet et des automatisations avancées. Idéal pour les scaleups, agences et projets SaaS.",
      included: [
        "Design system Figma + Storybook",
        "Code components (React/Vue)",
        "API documentation",
        "Formation équipe (2h)",
        "3 itérations de révision",
      ],
    },
  ];

  // Process steps
  const processSteps = [
    {
      step: "01",
      icon: Target,
      title: "Découverte & Objectifs",
      description:
        "Kick-off call pour comprendre votre vision, vos utilisateurs et vos contraintes.",
      deliverables: ["Brief validé", "User personas", "Objectifs mesurables"],
      duration: "1-2 jours",
    },
    {
      step: "02",
      icon: Brain,
      title: "Audit & Mapping",
      description:
        "Analyse de l'existant, identification des pain points et opportunités d'amélioration.",
      deliverables: [
        "Rapport d'audit",
        "User journey map",
        "Liste des quick-wins",
      ],
      duration: "2-3 jours",
    },
    {
      step: "03",
      icon: Palette,
      title: "Wireframes & Design System",
      description:
        "Création des maquettes, prototypes interactifs et fondations du design system.",
      deliverables: [
        "Wireframes",
        "Prototypes Figma",
        "Design system v1",
      ],
      duration: "3-5 jours",
    },
    {
      step: "04",
      icon: Code2,
      title: "Implémentation & Automatisation",
      description:
        "Intégration du design, setup des workflows et connexions API (n8n, GPT, etc.).",
      deliverables: [
        "UI intégrée",
        "Workflows actifs",
        "Dashboard configuré",
      ],
      duration: "5-7 jours",
    },
    {
      step: "05",
      icon: Award,
      title: "Mesure & Itération",
      description:
        "Suivi des performances, ajustements et support post-livraison.",
      deliverables: [
        "Analytics setup",
        "Rapport de performance",
        "Recommandations d'évolution",
      ],
      duration: "En continu",
    },
  ];

  // Mini case studies
  const caseStudies = [
    {
      id: "case-ecommerce",
      title: "Refonte checkout e-commerce",
      client: "Startup retail",
      category: "UI/UX + Automatisation",
      problem:
        "Taux d'abandon panier à 83%, process d'achat complexe avec 6 étapes, aucun suivi automatisé.",
      action:
        "Redesign complet du tunnel en 3 étapes, ajout d'indicateurs de progression, automatisation emails de relance.",
      result:
        "Taux d'abandon réduit à 52% (-31 points), +28% de conversions, ROI récupéré en 2 semaines.",
      metric: {
        value: "-31%",
        label: "Abandon panier",
      },
      tags: ["UI/UX", "Conversion", "Email automation"],
    },
    {
      id: "case-freelance",
      title: "Dashboard freelance automatisé",
      client: "Freelance designer",
      category: "Automatisation + Dashboard",
      problem:
        "15h/mois perdues sur administration : facturation, suivi clients, reporting.",
      action:
        "Dashboard Notion + workflows n8n : génération factures auto, emails de suivi, rapports hebdo.",
      result:
        "Économie de 15h/mois, facturation 100% automatisée, satisfaction client accrue grâce au suivi proactif.",
      metric: {
        value: "15h",
        label: "Économisées/mois",
      },
      tags: ["Notion", "n8n", "Productivité"],
    },
    {
      id: "case-saas",
      title: "Onboarding SaaS optimisé",
      client: "SaaS B2B",
      category: "UI/UX + IA",
      problem:
        "30% des nouveaux utilisateurs abandonnent à l'onboarding, aucune personnalisation.",
      action:
        "Redesign onboarding interactif en 4 étapes, intégration GPT pour recommandations personnalisées.",
      result:
        "Taux de complétion onboarding 100%, engagement +45%, rétention J30 améliorée de 22%.",
      metric: {
        value: "+45%",
        label: "Engagement",
      },
      tags: ["SaaS", "Onboarding", "IA/GPT"],
    },
  ];

  // Detailed services
  const detailedServices = [
    {
      id: "ui-ux-design",
      icon: Palette,
      title: "UI/UX Design",
      description:
        "Wireframes, maquettes haute-fidélité, prototypes interactifs et design systems évolutifs.",
      features: [
        "User research & personas",
        "Wireframing & user flows",
        "Prototypes cliquables (Figma)",
        "Design system & composants",
      ],
      usageExample:
        "Refonte complète d'une app SaaS : de l'audit UX au design system en 2 semaines.",
      duration: "5-10 jours",
      complexity: "modérée" as const,
    },
    {
      id: "micro-interactions",
      icon: Sparkles,
      title: "Micro-interactions & Motion Design",
      description:
        "Animations fluides, transitions élégantes et feedbacks visuels pour améliorer l'expérience.",
      features: [
        "Animations Framer Motion",
        "Transitions CSS/JS",
        "Hover states & loading states",
        "Feedbacks utilisateur",
      ],
      usageExample:
        "Ajout de micro-animations sur un site portfolio pour augmenter le temps passé de 40%.",
      duration: "2-4 jours",
      complexity: "simple" as const,
    },
    {
      id: "integration-front",
      icon: Code2,
      title: "Intégration Front-end",
      description:
        "Transformation des designs en interfaces fonctionnelles avec React, Framer ou Webflow.",
      features: [
        "React/TypeScript",
        "Framer / Webflow",
        "Responsive design",
        "Optimisation performance",
      ],
      usageExample:
        "Intégration d'un design system Figma en composants React réutilisables.",
      duration: "5-7 jours",
      complexity: "modérée" as const,
    },
    {
      id: "automation",
      icon: Workflow,
      title: "Automatisation (n8n, Make, Zapier)",
      description:
        "Workflows automatisés pour économiser du temps : emails, CRM, génération de contenus.",
      features: [
        "n8n / Make / Zapier",
        "Intégrations API",
        "Email automation",
        "Webhooks & cron jobs",
      ],
      usageExample:
        "Automatisation complète du process de lead capture vers CRM et emails de suivi.",
      duration: "3-5 jours",
      complexity: "modérée" as const,
    },
    {
      id: "ai-integration",
      icon: Bot,
      title: "IA & Prompts Engineering",
      description:
        "Intégration GPT pour génération de contenu, summarization, chatbots et assistants IA.",
      features: [
        "OpenAI GPT integration",
        "Prompt engineering",
        "Chatbots personnalisés",
        "Content generation",
      ],
      usageExample:
        "Chatbot GPT intégré pour support client avec réponses contextuelles basées sur la doc.",
      duration: "4-6 jours",
      complexity: "avancée" as const,
    },
    {
      id: "dashboards",
      icon: BarChart3,
      title: "Dashboards & Reporting",
      description:
        "Tableaux de bord personnalisés sur Notion, Airtable ou interfaces custom pour suivre vos KPIs.",
      features: [
        "Notion / Airtable",
        "Dashboards custom (React)",
        "Visualisation de données",
        "Rapports automatisés",
      ],
      usageExample:
        "Dashboard Notion synchronisé avec Stripe, Google Analytics et CRM pour suivi business temps réel.",
      duration: "3-5 jours",
      complexity: "modérée" as const,
    },
  ];

  // FAQ
  const faqs = [
    {
      question: "Quels outils utilisez-vous ?",
      answer:
        "Pour le design : Figma, Adobe Suite. Pour l'automatisation : n8n, Make, Zapier. Pour l'IA : OpenAI GPT, Anthropic Claude. Pour les dashboards : Notion, Airtable, Supabase. Pour l'intégration : React, TypeScript, Framer, Webflow.",
    },
    {
      question: "Travaillez-vous à l'international ?",
      answer:
        "Oui, je travaille en full-remote avec des clients partout dans le monde. Je parle français et anglais, et je m'adapte à votre fuseau horaire pour les calls de synchronisation.",
    },
    {
      question: "Quel est le délai moyen d'un projet ?",
      answer:
        "Cela dépend du scope : 3-5 jours pour le pack Starter, 1-2 semaines pour le pack Pro, et 3-4 semaines pour le pack Scale. Je peux m'adapter à des deadlines serrées si nécessaire.",
    },
    {
      question: "Proposez-vous un accompagnement après livraison ?",
      answer:
        "Oui, tous les packs incluent un support post-livraison : 7 jours pour Starter, 14 jours pour Pro, et 30 jours pour Scale. Je reste disponible pour répondre à vos questions et faire des ajustements mineurs.",
    },
    {
      question: "Comment se passe la facturation ?",
      answer:
        "Je fonctionne en forfait pour les packs ou au devis pour les projets custom. Un acompte de 30-50% est demandé au démarrage, le solde à la livraison. Paiement par virement ou Stripe.",
    },
    {
      question: "Gardez-vous les données confidentielles ?",
      answer:
        "Absolument. Je signe un NDA si nécessaire et toutes les données sont traitées de manière confidentielle. Je respecte le RGPD et les bonnes pratiques de sécurité.",
    },
    {
      question: "Puis-je voir des exemples de votre travail ?",
      answer:
        "Oui, consultez ma page Projets pour voir des études de cas détaillées. Certains projets ne peuvent pas être montrés publiquement pour des raisons de confidentialité, mais je peux partager des exemples en privé lors d'un call.",
    },
    {
      question: "Quelle est votre stack technique préférée ?",
      answer:
        "React + TypeScript + Tailwind CSS pour le front, Supabase ou Firebase pour le backend, n8n pour l'automatisation, et Figma pour le design. Mais je m'adapte à votre stack existante.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0, 255, 194, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 194, 0.03) 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
            }}
          ></div>
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
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-8">
              <span className="text-sm text-mint font-medium">
                Design. IA. Automatisation.
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]">
              <span className="block text-white">
                Des expériences
              </span>
              <span className="block text-gradient-mint-animated">
                qui fonctionnent
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              J'allie UI/UX design et systèmes intelligents pour créer des
              produits clairs, évolutifs et économes en temps.
            </p>

            {/* Cover image from cahier des charges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 rounded-2xl overflow-hidden border border-neutral-800"
            >
              <img
                src="/mnt/data/6ec5a395-84af-423e-90f9-cdcf669ddbf2.png"
                alt="Services illustration"
                className="w-full h-auto"
                onError={(e) => {
                  // Fallback si l'image n'existe pas
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("booking")}
                className="bg-mint text-black hover:bg-mint/90 h-14 px-10 rounded-full text-lg"
              >
                Demander un audit gratuit — 15 min
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("projects-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-neutral-800 hover:border-mint/20 hover:bg-neutral-950 h-14 px-10 rounded-full text-lg"
              >
                Voir mes réalisations
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why it works - Value proposition */}
      <section className="py-24 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pourquoi ça marche
            </h2>
            <p className="text-xl text-neutral-400">
              Une approche complète qui allie design, tech et résultats
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Design centré",
                description:
                  "Interfaces pensées pour vos utilisateurs, testées et validées avant implémentation.",
                metric: "+15%",
                metricLabel: "taux de conversion moyen",
              },
              {
                icon: Workflow,
                title: "Systèmes actionnables",
                description:
                  "Automatisations et workflows qui économisent du temps et réduisent les erreurs humaines.",
                metric: "-20h",
                metricLabel: "par mois automatisé",
              },
              {
                icon: TrendingUp,
                title: "Résultats mesurables",
                description:
                  "Analytics, dashboards et KPIs pour suivre l'impact réel de chaque amélioration.",
                metric: "ROI",
                metricLabel: "récupéré en 2-4 semaines",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 p-8 hover:border-mint/20 transition-all duration-300 text-center">
                  <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-mint/10 border border-mint/20 mb-6">
                      <item.icon className="h-8 w-8 text-mint" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-mint transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-neutral-400 mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-6 border-t border-neutral-800">
                      <div className="text-3xl font-bold text-mint mb-1">
                        {item.metric}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {item.metricLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-32 px-6" id="packages">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">Offres & Packs</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Choisissez votre pack
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Trois formules claires pour répondre à vos besoins, du quick-win au
              projet complet
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <ServicePackageCard
                key={pkg.id}
                package={pkg}
                index={index}
                onAuditClick={() => onNavigate("booking")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">Méthodologie</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Comment je travaille
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Un process en 5 étapes éprouvé pour des résultats prévisibles et de
              qualité
            </p>
          </motion.div>

          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      {/* Mini Case Studies */}
      <section className="py-32 px-6" id="case-studies">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">Résultats</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Études de cas rapides
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Problème → Action → Résultat
            </p>
          </motion.div>

          <MiniCaseStudies
            cases={caseStudies}
            onViewMore={(caseId) => {
              console.log("View case:", caseId);
              // TODO: Navigate to full case study
            }}
          />
        </div>
      </section>

      {/* Detailed Services */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">
                Services détaillés
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ce que je propose
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              6 services modulaires pour construire votre produit parfait
            </p>
          </motion.div>

          <ServiceDetailBlocks services={detailedServices} />
        </div>
      </section>

      {/* Triple Engine Demo */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">
                Démonstration interactive
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              UI × Code × Workflow
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              L'approche hybride qui fait la différence
            </p>
          </motion.div>

          <TripleEngineDemo />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">FAQ</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Questions fréquentes
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Tout ce que vous devez savoir avant de démarrer
            </p>
          </motion.div>

          <ServicesFAQ faqs={faqs} />
        </div>
      </section>

      {/* Pricing & Model explanation */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">Tarifs</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Modèle tarifaire transparent
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center">
                      <Boxes className="h-6 w-6 text-mint" />
                    </div>
                    <h3 className="text-2xl font-bold">Forfaits fixes</h3>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    Les packs Starter, Pro et Scale ont des prix fixes et des
                    livrables clairement définis. Vous savez exactement ce que vous
                    obtenez et combien ça coûte.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center">
                      <Gauge className="h-6 w-6 text-mint" />
                    </div>
                    <h3 className="text-2xl font-bold">Devis sur mesure</h3>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    Pour les projets plus complexes ou spécifiques, je propose un
                    devis personnalisé après un audit gratuit de 15 minutes pour
                    bien comprendre vos besoins.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-neutral-800">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Acompte</div>
                    <div className="text-xl font-bold text-mint">30-50%</div>
                    <div className="text-xs text-neutral-500">au démarrage</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Solde</div>
                    <div className="text-xl font-bold text-mint">50-70%</div>
                    <div className="text-xs text-neutral-500">à la livraison</div>
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 mb-1">Paiement</div>
                    <div className="text-xl font-bold text-mint">
                      Virement / Stripe
                    </div>
                    <div className="text-xs text-neutral-500">
                      facture professionnelle
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32 px-6 bg-neutral-950/30 border-t border-neutral-900" id="contact-form">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 backdrop-blur-sm mb-6">
              <span className="text-sm text-mint font-medium">Contact</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Démarrons votre projet
            </h2>
            <p className="text-xl text-neutral-400">
              Décrivez votre besoin, je vous réponds sous 24h avec un plan d'action
            </p>
          </motion.div>

          <div className="rounded-2xl border border-neutral-900 bg-neutral-950/50 p-8">
            <ServiceContactForm
              onSuccess={() => {
                console.log("Form submitted successfully");
              }}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Prêt à transformer votre produit ?
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
              Commencez par un audit gratuit de 15 minutes. Sans engagement, sans
              obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("booking")}
                className="bg-mint text-black hover:bg-mint/90 h-14 px-10 rounded-full text-lg"
              >
                Réserver mon audit gratuit
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document
                    .getElementById("contact-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-neutral-800 hover:border-mint/20 hover:bg-neutral-950 h-14 px-10 rounded-full text-lg"
              >
                Envoyer un brief détaillé
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust elements footer */}
      <section className="py-16 px-6 bg-neutral-950/50 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-mint mb-2">100%</div>
              <div className="text-sm text-neutral-400">
                Satisfaction clients
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">&lt; 24h</div>
              <div className="text-sm text-neutral-400">Temps de réponse</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">RGPD</div>
              <div className="text-sm text-neutral-400">
                Conformité garantie
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">NDA</div>
              <div className="text-sm text-neutral-400">
                Sur demande
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <StickyCTABar
        onAuditClick={() => onNavigate("booking")}
        onContactClick={() => {
          document
            .getElementById("contact-form")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

