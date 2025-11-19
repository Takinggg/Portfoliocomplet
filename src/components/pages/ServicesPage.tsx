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
  Gauge,
  User
} from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { useLanguage } from "../../utils/i18n/LanguageContext";
import { ServicePackageCard, ServicePackage } from "../services/ServicePackageCard";
import { ProcessTimeline } from "../services/ProcessTimeline";
import { MiniCaseStudies } from "../services/MiniCaseStudies";
import { ServiceDetailBlocks } from "../services/ServiceDetailBlocks";
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
  const { language } = useLanguage();

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

  // FAQ - Utilisation des vraies FAQs de FAQPage
  const FAQ_CATEGORIES = [
    { id: "general", name: "Général", name_en: "General", icon: User, color: "text-blue-400", order: 1 },
    { id: "design", name: "Design", name_en: "Design", icon: Palette, color: "text-purple-400", order: 2 },
    { id: "automation", name: "Automatisation & IA", name_en: "Automation & AI", icon: Zap, color: "text-yellow-400", order: 3 },
    { id: "process", name: "Process client", name_en: "Client Process", icon: Clock, color: "text-green-400", order: 4 },
    { id: "pricing", name: "Tarification & facturation", name_en: "Pricing & Invoicing", icon: CheckCircle2, color: "text-emerald-400", order: 5 },
  ];

  const FAQ_QUESTIONS = [
    // ==================== GÉNÉRAL ====================
    { id: "general_1", question: "Qui êtes-vous ?", question_en: "Who are you?", answer: "Je m'appelle Maxence, freelance spécialisé en design, automatisation et IA. J'aide les entreprises à créer des systèmes intelligents et des interfaces performantes.", answer_en: "I'm Maxence, a freelance designer and automation specialist. I help companies build smart systems and efficient interfaces.", categoryId: "general", order: 1, isPublished: true },
    { id: "general_2", question: "Avec qui travaillez-vous ?", question_en: "Who do you work with?", answer: "Je collabore avec des startups, PME et indépendants qui souhaitent professionnaliser leur image et optimiser leurs process.", answer_en: "I collaborate with startups, SMEs, and independent creators.", categoryId: "general", order: 2, isPublished: true },
    { id: "general_3", question: "Où êtes-vous basé ?", question_en: "Where are you based?", answer: "Je travaille en full remote, depuis la France.", answer_en: "I work fully remote from France.", categoryId: "general", order: 3, isPublished: true },
    { id: "general_4", question: "Travaillez-vous à l'international ?", question_en: "Do you work internationally?", answer: "Oui, j'accompagne des clients dans plusieurs pays (Europe, États-Unis, Asie).", answer_en: "Yes, I work with clients from Europe, the U.S., and Asia.", categoryId: "general", order: 4, isPublished: true },
    { id: "general_5", question: "Quelle est votre langue de travail ?", question_en: "What languages do you work in?", answer: "Je travaille en français et en anglais.", answer_en: "French and English.", categoryId: "general", order: 5, isPublished: true },
    
    // ==================== DESIGN ====================
    { id: "design_1", question: "Quels types de design proposez-vous ?", question_en: "What kind of design services do you offer?", answer: "Web design, UI/UX design, maquettes complètes de site, et création de dashboards personnalisés.", answer_en: "Web design, UI/UX design, full site mockups, and custom dashboard creation.", categoryId: "design", order: 1, isPublished: true },
    { id: "design_2", question: "Utilisez-vous Figma pour vos projets ?", question_en: "Do you use Figma?", answer: "Oui, Figma est mon outil principal. Je l'utilise aussi avec Figma AI pour accélérer la conception.", answer_en: "Yes, Figma (and Figma AI) is my main design tool.", categoryId: "design", order: 2, isPublished: true },
    { id: "design_3", question: "Pouvez-vous refaire entièrement un site existant ?", question_en: "Can you redesign an existing website?", answer: "Oui, je peux effectuer une refonte complète, que ce soit sur le plan visuel ou structurel.", answer_en: "Absolutely — I can fully redesign and optimize your current site.", categoryId: "design", order: 3, isPublished: true },
    { id: "design_4", question: "Proposez-vous des identités visuelles complètes ?", question_en: "Do you create full visual identities?", answer: "Oui, je peux concevoir un système visuel complet : couleurs, typographie, logo et composants.", answer_en: "Yes, including colors, typography, logos, and components.", categoryId: "design", order: 4, isPublished: true },
    { id: "design_5", question: "Offrez-vous des prototypes interactifs ?", question_en: "Do you provide interactive prototypes?", answer: "Oui, chaque projet est livré avec un prototype cliquable pour valider les interactions avant développement.", answer_en: "Yes, every project includes a clickable prototype before development.", categoryId: "design", order: 5, isPublished: true },
    
    // ==================== AUTOMATION & AI ====================
    { id: "automation_1", question: "Qu'est-ce que l'automatisation d'entreprise ?", question_en: "What is business automation?", answer: "C'est la mise en place de processus qui se déclenchent automatiquement (envoi d'emails, génération de factures, synchronisation de données, etc.).", answer_en: "It's about creating workflows that run automatically (emails, invoices, data sync, etc.).", categoryId: "automation", order: 1, isPublished: true },
    { id: "automation_2", question: "Quels outils d'automatisation utilisez-vous ?", question_en: "What tools do you use for automation?", answer: "J'utilise principalement n8n, Zapier et des solutions maison codées directement dans vos systèmes.", answer_en: "Mainly n8n, Zapier, and custom-coded automations.", categoryId: "automation", order: 2, isPublished: true },
    { id: "automation_3", question: "Proposez-vous des intégrations IA ?", question_en: "Do you integrate AI?", answer: "Oui, j'intègre des modèles d'IA pour améliorer la productivité : génération de contenu, réponses automatiques, analyse de données, etc.", answer_en: "Yes, I use AI for productivity: content generation, analysis, smart notifications.", categoryId: "automation", order: 3, isPublished: true },
    { id: "automation_4", question: "Pouvez-vous créer un système entièrement personnalisé sans no-code ?", question_en: "Can you build custom systems from scratch (no no-code)?", answer: "Oui, je code les systèmes à la main si nécessaire, notamment pour les dashboards internes.", answer_en: "Yes, I develop everything directly when necessary.", categoryId: "automation", order: 4, isPublished: true },
    { id: "automation_5", question: "L'IA remplace-t-elle le design humain ?", question_en: "Does AI replace human design?", answer: "Non, elle l'accélère. L'IA m'aide à prototyper et tester plus vite, mais le design final reste 100 % humain.", answer_en: "No, it speeds it up — design decisions remain human.", categoryId: "automation", order: 5, isPublished: true },
    
    // ==================== PROCESS CLIENT ====================
    { id: "process_1", question: "Comment se déroule un projet typique ?", question_en: "What's your typical workflow?", answer: "Étape 1 : Appel découverte → Étape 2 : Proposition → Étape 3 : Design / Développement → Étape 4 : Livraison & suivi.", answer_en: "Step 1: Discovery call → Step 2: Proposal → Step 3: Design/Build → Step 4: Delivery & follow-up.", categoryId: "process", order: 1, isPublished: true },
    { id: "process_2", question: "Quelle est la durée typique d'un projet ?", question_en: "How long does a project take?", answer: "Cela dépend du pack : quelques jours pour un Starter, 1-2 semaines pour du Pro, et 3-4 semaines pour un Scale.", answer_en: "It depends: a few days for Starter, 1-2 weeks for Pro, 3-4 weeks for Scale.", categoryId: "process", order: 2, isPublished: true },
    { id: "process_3", question: "Proposez-vous des révisions ?", question_en: "Do you offer revisions?", answer: "Oui, chaque pack inclut des révisions (1 à 3 itérations selon le niveau).", answer_en: "Yes, each package includes revisions (1-3 rounds depending on the level).", categoryId: "process", order: 3, isPublished: true },
    
    // ==================== TARIFICATION ====================
    { id: "pricing_1", question: "Quels sont vos tarifs ?", question_en: "What are your rates?", answer: "Les tarifs varient selon le projet. Contactez-moi pour un devis personnalisé adapté à vos besoins.", answer_en: "Rates vary by project. Contact me for a custom quote tailored to your needs.", categoryId: "pricing", order: 1, isPublished: true },
    { id: "pricing_2", question: "Comment se passe le paiement ?", question_en: "How does payment work?", answer: "Paiement en 2 fois : un acompte au démarrage, et le solde à la livraison. Virement bancaire ou Stripe acceptés.", answer_en: "Payment in 2 installments: deposit upfront, balance upon delivery. Bank transfer or Stripe accepted.", categoryId: "pricing", order: 2, isPublished: true },
    { id: "pricing_3", question: "Offrez-vous une garantie ?", question_en: "Do you offer a guarantee?", answer: "Oui, un support post-livraison est inclus pour corrections et ajustements (7 à 30 jours selon le pack).", answer_en: "Yes, post-delivery support is included for fixes and adjustments (7-30 days depending on package).", categoryId: "pricing", order: 3, isPublished: true },
  ];

  const faqs = t.language === 'en' 
    ? FAQ_QUESTIONS.map(q => ({ question: q.question_en, answer: q.answer_en, category: q.categoryId }))
    : FAQ_QUESTIONS.map(q => ({ question: q.question, answer: q.answer, category: q.categoryId }));

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
              5 services modulaires pour construire votre produit parfait
            </p>
          </motion.div>

          <ServiceDetailBlocks services={detailedServices} />
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

