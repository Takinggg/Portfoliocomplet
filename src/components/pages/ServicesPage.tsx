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

  // Translations
  const text = {
    hero: {
      badge: language === 'en' ? 'Design. AI. Automation.' : 'Design. IA. Automatisation.',
      title1: language === 'en' ? 'Experiences' : 'Des expÃ©riences',
      title2: language === 'en' ? 'that work' : 'qui fonctionnent',
      subtitle: language === 'en' 
        ? 'I combine UI/UX design with intelligent systems to create clear, scalable, and time-efficient products.'
        : 'J\'allie UI/UX design et systÃ¨mes intelligents pour crÃ©er des produits clairs, Ã©volutifs et Ã©conomes en temps.',
      cta1: language === 'en' ? 'Request free audit â€” 15 min' : 'Demander un audit gratuit â€” 15 min',
      cta2: language === 'en' ? 'View my work' : 'Voir mes rÃ©alisations',
    },
    sections: {
      services: language === 'en' ? 'Detailed Services' : 'Services dÃ©taillÃ©s',
      servicesTitle: language === 'en' ? 'What I do' : 'Ce que je propose',
      servicesSubtitle: language === 'en' ? '5 modular services to build your perfect product' : '5 services modulaires pour construire votre produit parfait',
      faq: 'FAQ',
      faqTitle: language === 'en' ? 'Frequently asked questions' : 'Questions frÃ©quentes',
      faqSubtitle: language === 'en' ? 'Everything you need to know before getting started' : 'Tout ce que vous devez savoir avant de dÃ©marrer',
      contact: 'Contact',
      contactTitle: language === 'en' ? 'Let\'s start your project' : 'DÃ©marrons votre projet',
      contactSubtitle: language === 'en' ? 'Describe your needs, I\'ll respond within 24h with an action plan' : 'DÃ©crivez votre besoin, je vous rÃ©ponds sous 24h avec un plan d\'action',
      finalCta: language === 'en' ? 'Ready to transform your product?' : 'PrÃªt Ã  transformer votre produit ?',
      finalCtaSubtitle: language === 'en' ? 'Start with a free 15-minute audit. No commitment, no obligation.' : 'Commencez par un audit gratuit de 15 minutes. Sans engagement, sans obligation.',
      bookAudit: language === 'en' ? 'Book my free audit' : 'RÃ©server mon audit gratuit',
      sendBrief: language === 'en' ? 'Send a detailed brief' : 'Envoyer un brief dÃ©taillÃ©',
      whyItWorks: language === 'en' ? 'Why it works' : 'Pourquoi Ã§a marche',
      whyItWorksSubtitle: language === 'en' ? 'A complete approach that combines design, tech, and results' : 'Une approche complÃ¨te qui allie design, tech et rÃ©sultats',
      methodology: language === 'en' ? 'Methodology' : 'MÃ©thodologie',
      howIWork: language === 'en' ? 'How I work' : 'Comment je travaille',
      howIWorkSubtitle: language === 'en' ? 'A proven 5-step process for predictable, quality results' : 'Un process en 5 Ã©tapes Ã©prouvÃ© pour des rÃ©sultats prÃ©visibles et de qualitÃ©',
      results: language === 'en' ? 'Results' : 'RÃ©sultats',
      caseStudiesTitle: language === 'en' ? 'Quick case studies' : 'Ã‰tudes de cas rapides',
      caseStudiesSubtitle: language === 'en' ? 'Problem â†’ Action â†’ Result' : 'ProblÃ¨me â†’ Action â†’ RÃ©sultat',
    },
    whyItWorks: {
      card1: {
        title: language === 'en' ? 'User-centered design' : 'Design centrÃ©',
        description: language === 'en'
          ? 'Interfaces designed for your users, tested and validated before implementation.'
          : 'Interfaces pensÃ©es pour vos utilisateurs, testÃ©es et validÃ©es avant implÃ©mentation.',
        metric: '+15%',
        metricLabel: language === 'en' ? 'average conversion rate' : 'taux de conversion moyen',
      },
      card2: {
        title: language === 'en' ? 'Actionable systems' : 'SystÃ¨mes actionnables',
        description: language === 'en'
          ? 'Automations and workflows that save time and reduce human errors.'
          : 'Automatisations et workflows qui Ã©conomisent du temps et rÃ©duisent les erreurs humaines.',
        metric: '-20h',
        metricLabel: language === 'en' ? 'per month automated' : 'par mois automatisÃ©',
      },
      card3: {
        title: language === 'en' ? 'Measurable results' : 'RÃ©sultats mesurables',
        description: language === 'en'
          ? 'Analytics, dashboards, and KPIs to track the real impact of every improvement.'
          : 'Analytics, dashboards et KPIs pour suivre l\'impact rÃ©el de chaque amÃ©lioration.',
        metric: 'ROI',
        metricLabel: language === 'en' ? 'recovered in 2-4 weeks' : 'rÃ©cupÃ©rÃ© en 2-4 semaines',
      },
    },
    trust: {
      satisfaction: language === 'en' ? 'Client satisfaction' : 'Satisfaction clients',
      responseTime: language === 'en' ? 'Response time' : 'Temps de rÃ©ponse',
      compliance: language === 'en' ? 'Compliance guaranteed' : 'ConformitÃ© garantie',
      nda: language === 'en' ? 'On request' : 'Sur demande',
    },
  };

  // SEO Meta tags
  useEffect(() => {
    document.title = language === 'en'
      ? "Services â€” UI/UX Design, Automation & AI â€” Maxence"
      : "Services â€” UI/UX Design, Automatisation & IA â€” Maxence";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        language === 'en'
          ? "UI/UX design + automation: I help startups and freelancers create high-performance interfaces and intelligent systems. Free audit."
          : "UI/UX design + automatisation : j'aide les startups et freelances Ã  crÃ©er des interfaces performantes et des systÃ¨mes intelligents. Audit gratuit."
      );
    }
  }, [language]);
  
  // Service Packages
  const packages: ServicePackage[] = [
    {
      id: "starter",
      name: "Starter",
      tagline: "Audit & Quick-Wins",
      description: "Pour identifier rapidement les points d'amÃ©lioration et dÃ©marrer avec 2 automatisations simples.",
      price: "300-500 â‚¬",
      duration: "3-5 jours",
      deliverables: [
        "Audit UX complet de votre produit",
        "2 automatisations rapides (emails, workflows)",
        "Plan d'action priorisÃ© (1 page)",
        "Session de restitution (1h)",
      ],
      detailedDescription:
        "Le pack Starter est idÃ©al pour les projets en dÃ©marrage ou pour tester une collaboration. Je rÃ©alise un audit approfondi de votre interface, identifie les points de friction et implÃ©mente 2 automatisations simples pour Ã©conomiser du temps dÃ¨s maintenant.",
      included: [
        "Support email pendant 7 jours",
        "Document de synthÃ¨se en PDF",
        "Recommandations priorisÃ©es",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "Product Experience",
      description: "Refonte d'une page ou d'un flow complet + automatisations avancÃ©es + dashboard de suivi.",
      price: "1 000-2 500 â‚¬",
      priceNote: "selon scope",
      duration: "1-2 semaines",
      recommended: true,
      deliverables: [
        "UI redesign complet d'1 page ou flow",
        "Prototype interactif haute-fidÃ©litÃ©",
        "3 automatisations avancÃ©es (n8n, API, GPT)",
        "Dashboard Notion/Airtable pour suivi",
        "Design system basique (couleurs, typo, composants)",
        "Support 14 jours post-livraison",
      ],
      detailedDescription:
        "Le pack Pro est le plus populaire. Il combine un redesign complet d'une page ou d'un parcours utilisateur avec des automatisations intelligentes et un dashboard de suivi. Parfait pour les startups et PME qui veulent un rÃ©sultat professionnel rapidement.",
      included: [
        "Fichier Figma source",
        "Export assets (SVG, PNG)",
        "Documentation technique",
        "1 itÃ©ration de rÃ©vision incluse",
      ],
    },
    {
      id: "scale",
      name: "Scale",
      tagline: "System Builder",
      description: "Design system complet, multi-pages, intÃ©grations IA avancÃ©es et workflows complexes.",
      price: "4 000+ â‚¬",
      priceNote: "sur devis",
      duration: "3-4 semaines",
      deliverables: [
        "Design system complet et Ã©volutif",
        "Refonte multi-pages (jusqu'Ã  5 pages)",
        "IntÃ©grations IA avancÃ©es (GPT, APIs tierces)",
        "Workflows automatisÃ©s complexes (n8n, Make, Zapier)",
        "Dashboard analytique avancÃ©",
        "Documentation complÃ¨te",
        "Support 30 jours + maintenance",
      ],
      detailedDescription:
        "Le pack Scale est conÃ§u pour les projets ambitieux nÃ©cessitant une architecture solide, un design system complet et des automatisations avancÃ©es. IdÃ©al pour les scaleups, agences et projets SaaS.",
      included: [
        "Design system Figma + Storybook",
        "Code components (React/Vue)",
        "API documentation",
        "Formation Ã©quipe (2h)",
        "3 itÃ©rations de rÃ©vision",
      ],
    },
  ];

  // Process steps
  const processSteps = [
    {
      step: "01",
      icon: Target,
      title: language === 'en' ? 'Discovery & Goals' : 'DÃ©couverte & Objectifs',
      description: language === 'en'
        ? 'Kick-off call to understand your vision, users, and constraints.'
        : 'Kick-off call pour comprendre votre vision, vos utilisateurs et vos contraintes.',
      deliverables: language === 'en'
        ? ['Validated brief', 'User personas', 'Measurable objectives']
        : ['Brief validÃ©', 'User personas', 'Objectifs mesurables'],
      duration: language === 'en' ? '1-2 days' : '1-2 jours',
    },
    {
      step: "02",
      icon: Brain,
      title: language === 'en' ? 'Audit & Mapping' : 'Audit & Mapping',
      description: language === 'en'
        ? 'Analysis of existing situation, identification of pain points and improvement opportunities.'
        : 'Analyse de l\'existant, identification des pain points et opportunitÃ©s d\'amÃ©lioration.',
      deliverables: language === 'en'
        ? ['Audit report', 'User journey map', 'Quick-wins list']
        : ['Rapport d\'audit', 'User journey map', 'Liste des quick-wins'],
      duration: language === 'en' ? '2-3 days' : '2-3 jours',
    },
    {
      step: "03",
      icon: Palette,
      title: language === 'en' ? 'Wireframes & Design System' : 'Wireframes & Design System',
      description: language === 'en'
        ? 'Creation of mockups, interactive prototypes, and design system foundations.'
        : 'CrÃ©ation des maquettes, prototypes interactifs et fondations du design system.',
      deliverables: language === 'en'
        ? ['Wireframes', 'Figma prototypes', 'Design system v1']
        : ['Wireframes', 'Prototypes Figma', 'Design system v1'],
      duration: language === 'en' ? '3-5 days' : '3-5 jours',
    },
    {
      step: "04",
      icon: Code2,
      title: language === 'en' ? 'Implementation & Automation' : 'ImplÃ©mentation & Automatisation',
      description: language === 'en'
        ? 'Design integration, workflows setup, and API connections (n8n, GPT, etc.).'
        : 'IntÃ©gration du design, setup des workflows et connexions API (n8n, GPT, etc.).',
      deliverables: language === 'en'
        ? ['Integrated UI', 'Active workflows', 'Configured dashboard']
        : ['UI intÃ©grÃ©e', 'Workflows actifs', 'Dashboard configurÃ©'],
      duration: language === 'en' ? '5-7 days' : '5-7 jours',
    },
    {
      step: "05",
      icon: Award,
      title: language === 'en' ? 'Measure & Iterate' : 'Mesure & ItÃ©ration',
      description: language === 'en'
        ? 'Performance tracking, adjustments, and post-delivery support.'
        : 'Suivi des performances, ajustements et support post-livraison.',
      deliverables: language === 'en'
        ? ['Analytics setup', 'Performance report', 'Evolution recommendations']
        : ['Analytics setup', 'Rapport de performance', 'Recommandations d\'Ã©volution'],
      duration: language === 'en' ? 'Ongoing' : 'En continu',
    },
  ];

  // Mini case studies
  const caseStudies = [
    {
      id: "case-ecommerce",
      title: language === 'en' ? 'E-commerce checkout redesign' : 'Refonte checkout e-commerce',
      client: language === 'en' ? 'Retail startup' : 'Startup retail',
      category: language === 'en' ? 'UI/UX + Automation' : 'UI/UX + Automatisation',
      problem: language === 'en'
        ? '83% cart abandonment rate, complex 6-step purchase process, no automated follow-up.'
        : 'Taux d\'abandon panier Ã  83%, process d\'achat complexe avec 6 Ã©tapes, aucun suivi automatisÃ©.',
      action: language === 'en'
        ? 'Complete funnel redesign in 3 steps, added progress indicators, automated reminder emails.'
        : 'Redesign complet du tunnel en 3 Ã©tapes, ajout d\'indicateurs de progression, automatisation emails de relance.',
      result: language === 'en'
        ? 'Abandonment reduced to 52% (-31 points), +28% conversions, ROI recovered in 2 weeks.'
        : 'Taux d\'abandon rÃ©duit Ã  52% (-31 points), +28% de conversions, ROI rÃ©cupÃ©rÃ© en 2 semaines.',
      metric: {
        value: "-31%",
        label: language === 'en' ? 'Cart abandonment' : 'Abandon panier',
      },
      tags: ["UI/UX", "Conversion", "Email automation"],
    },
    {
      id: "case-freelance",
      title: language === 'en' ? 'Automated freelance dashboard' : 'Dashboard freelance automatisÃ©',
      client: language === 'en' ? 'Freelance designer' : 'Freelance designer',
      category: language === 'en' ? 'Automation + Dashboard' : 'Automatisation + Dashboard',
      problem: language === 'en'
        ? '15h/month lost on admin: invoicing, client tracking, reporting.'
        : '15h/mois perdues sur administration : facturation, suivi clients, reporting.',
      action: language === 'en'
        ? 'Notion dashboard + n8n workflows: auto invoice generation, follow-up emails, weekly reports.'
        : 'Dashboard Notion + workflows n8n : gÃ©nÃ©ration factures auto, emails de suivi, rapports hebdo.',
      result: language === 'en'
        ? '15h/month saved, 100% automated invoicing, improved client satisfaction through proactive tracking.'
        : 'Ã‰conomie de 15h/mois, facturation 100% automatisÃ©e, satisfaction client accrue grÃ¢ce au suivi proactif.',
      metric: {
        value: "15h",
        label: language === 'en' ? 'Saved/month' : 'Ã‰conomisÃ©es/mois',
      },
      tags: language === 'en' ? ['Notion', 'n8n', 'Productivity'] : ['Notion', 'n8n', 'ProductivitÃ©'],
    },
    {
      id: "case-saas",
      title: language === 'en' ? 'Optimized SaaS onboarding' : 'Onboarding SaaS optimisÃ©',
      client: language === 'en' ? 'B2B SaaS' : 'SaaS B2B',
      category: language === 'en' ? 'UI/UX + AI' : 'UI/UX + IA',
      problem: language === 'en'
        ? '30% of new users abandon during onboarding, no personalization.'
        : '30% des nouveaux utilisateurs abandonnent Ã  l\'onboarding, aucune personnalisation.',
      action: language === 'en'
        ? 'Interactive 4-step onboarding redesign, GPT integration for personalized recommendations.'
        : 'Redesign onboarding interactif en 4 Ã©tapes, intÃ©gration GPT pour recommandations personnalisÃ©es.',
      result: language === 'en'
        ? '100% onboarding completion rate, +45% engagement, 22% improved D30 retention.'
        : 'Taux de complÃ©tion onboarding 100%, engagement +45%, rÃ©tention J30 amÃ©liorÃ©e de 22%.',
      metric: {
        value: "+45%",
        label: language === 'en' ? 'Engagement' : 'Engagement',
      },
      tags: language === 'en' ? ['SaaS', 'Onboarding', 'AI/GPT'] : ['SaaS', 'Onboarding', 'IA/GPT'],
    },
  ];

  // Detailed services
  const detailedServices = [
    {
      id: "ui-ux-design",
      icon: Palette,
      title: "UI/UX Design",
      description: language === 'en'
        ? 'Wireframes, high-fidelity mockups, interactive prototypes, and scalable design systems.'
        : 'Wireframes, maquettes haute-fidÃ©litÃ©, prototypes interactifs et design systems Ã©volutifs.',
      features: language === 'en'
        ? ['User research & personas', 'Wireframing & user flows', 'Clickable prototypes (Figma)', 'Design system & components']
        : ['User research & personas', 'Wireframing & user flows', 'Prototypes cliquables (Figma)', 'Design system & composants'],
      usageExample: language === 'en'
        ? 'Complete redesign of a SaaS app: from UX audit to design system in 2 weeks.'
        : 'Refonte complÃ¨te d\'une app SaaS : de l\'audit UX au design system en 2 semaines.',
      duration: language === 'en' ? '5-10 days' : '5-10 jours',
      complexity: (language === 'en' ? 'moderate' : 'modÃ©rÃ©e') as const,
    },
    {
      id: "integration-front",
      icon: Code2,
      title: language === 'en' ? 'Front-end Integration' : 'IntÃ©gration Front-end',
      description: language === 'en'
        ? 'Transform designs into functional interfaces with React, Framer, or Webflow.'
        : 'Transformation des designs en interfaces fonctionnelles avec React, Framer ou Webflow.',
      features: language === 'en'
        ? ['React/TypeScript', 'Framer / Webflow', 'Responsive design', 'Performance optimization']
        : ['React/TypeScript', 'Framer / Webflow', 'Responsive design', 'Optimisation performance'],
      usageExample: language === 'en'
        ? 'Integration of a Figma design system into reusable React components.'
        : 'IntÃ©gration d\'un design system Figma en composants React rÃ©utilisables.',
      duration: language === 'en' ? '5-7 days' : '5-7 jours',
      complexity: (language === 'en' ? 'moderate' : 'modÃ©rÃ©e') as const,
    },
    {
      id: "automation",
      icon: Workflow,
      title: language === 'en' ? 'Automation (n8n, Make, Zapier)' : 'Automatisation (n8n, Make, Zapier)',
      description: language === 'en'
        ? 'Automated workflows to save time: emails, CRM, content generation.'
        : 'Workflows automatisÃ©s pour Ã©conomiser du temps : emails, CRM, gÃ©nÃ©ration de contenus.',
      features: language === 'en'
        ? ['n8n / Make / Zapier', 'API integrations', 'Email automation', 'Webhooks & cron jobs']
        : ['n8n / Make / Zapier', 'IntÃ©grations API', 'Email automation', 'Webhooks & cron jobs'],
      usageExample: language === 'en'
        ? 'Complete automation of lead capture to CRM and follow-up emails.'
        : 'Automatisation complÃ¨te du process de lead capture vers CRM et emails de suivi.',
      duration: language === 'en' ? '3-5 days' : '3-5 jours',
      complexity: (language === 'en' ? 'moderate' : 'modÃ©rÃ©e') as const,
    },
    {
      id: "ai-integration",
      icon: Bot,
      title: language === 'en' ? 'AI & Prompt Engineering' : 'IA & Prompts Engineering',
      description: language === 'en'
        ? 'GPT integration for content generation, summarization, chatbots, and AI assistants.'
        : 'IntÃ©gration GPT pour gÃ©nÃ©ration de contenu, summarization, chatbots et assistants IA.',
      features: language === 'en'
        ? ['OpenAI GPT integration', 'Prompt engineering', 'Custom chatbots', 'Content generation']
        : ['OpenAI GPT integration', 'Prompt engineering', 'Chatbots personnalisÃ©s', 'Content generation'],
      usageExample: language === 'en'
        ? 'GPT chatbot integrated for customer support with contextual responses based on documentation.'
        : 'Chatbot GPT intÃ©grÃ© pour support client avec rÃ©ponses contextuelles basÃ©es sur la doc.',
      duration: language === 'en' ? '4-6 days' : '4-6 jours',
      complexity: (language === 'en' ? 'advanced' : 'avancÃ©e') as const,
    },
    {
      id: "dashboards",
      icon: BarChart3,
      title: language === 'en' ? 'Dashboards & Reporting' : 'Dashboards & Reporting',
      description: language === 'en'
        ? 'Custom dashboards on Notion, Airtable, or custom interfaces to track your KPIs.'
        : 'Tableaux de bord personnalisÃ©s sur Notion, Airtable ou interfaces custom pour suivre vos KPIs.',
      features: language === 'en'
        ? ['Notion / Airtable', 'Custom dashboards (React)', 'Data visualization', 'Automated reports']
        : ['Notion / Airtable', 'Dashboards custom (React)', 'Visualisation de donnÃ©es', 'Rapports automatisÃ©s'],
      usageExample: language === 'en'
        ? 'Notion dashboard synced with Stripe, Google Analytics, and CRM for real-time business tracking.'
        : 'Dashboard Notion synchronisÃ© avec Stripe, Google Analytics et CRM pour suivi business temps rÃ©el.',
      duration: language === 'en' ? '3-5 days' : '3-5 jours',
      complexity: (language === 'en' ? 'moderate' : 'modÃ©rÃ©e') as const,
    },
  ];

  // FAQ - Utilisation des vraies FAQs de FAQPage
  const FAQ_CATEGORIES = [
    { id: "general", name: "GÃ©nÃ©ral", name_en: "General", icon: User, color: "text-blue-400", order: 1 },
    { id: "design", name: "Design", name_en: "Design", icon: Palette, color: "text-purple-400", order: 2 },
    { id: "automation", name: "Automatisation & IA", name_en: "Automation & AI", icon: Zap, color: "text-yellow-400", order: 3 },
    { id: "process", name: "Process client", name_en: "Client Process", icon: Clock, color: "text-green-400", order: 4 },
    { id: "pricing", name: "Tarification & facturation", name_en: "Pricing & Invoicing", icon: CheckCircle2, color: "text-emerald-400", order: 5 },
  ];

  const FAQ_QUESTIONS = [
    // ==================== GÃ‰NÃ‰RAL ====================
    { id: "general_1", question: "Qui Ãªtes-vous ?", question_en: "Who are you?", answer: "Je m'appelle Maxence, freelance spÃ©cialisÃ© en design, automatisation et IA. J'aide les entreprises Ã  crÃ©er des systÃ¨mes intelligents et des interfaces performantes.", answer_en: "I'm Maxence, a freelance designer and automation specialist. I help companies build smart systems and efficient interfaces.", categoryId: "general", order: 1, isPublished: true },
    { id: "general_2", question: "Avec qui travaillez-vous ?", question_en: "Who do you work with?", answer: "Je collabore avec des startups, PME et indÃ©pendants qui souhaitent professionnaliser leur image et optimiser leurs process.", answer_en: "I collaborate with startups, SMEs, and independent creators.", categoryId: "general", order: 2, isPublished: true },
    { id: "general_3", question: "OÃ¹ Ãªtes-vous basÃ© ?", question_en: "Where are you based?", answer: "Je travaille en full remote, depuis la France.", answer_en: "I work fully remote from France.", categoryId: "general", order: 3, isPublished: true },
    { id: "general_4", question: "Travaillez-vous Ã  l'international ?", question_en: "Do you work internationally?", answer: "Oui, j'accompagne des clients dans plusieurs pays (Europe, Ã‰tats-Unis, Asie).", answer_en: "Yes, I work with clients from Europe, the U.S., and Asia.", categoryId: "general", order: 4, isPublished: true },
    { id: "general_5", question: "Quelle est votre langue de travail ?", question_en: "What languages do you work in?", answer: "Je travaille en franÃ§ais et en anglais.", answer_en: "French and English.", categoryId: "general", order: 5, isPublished: true },
    
    // ==================== DESIGN ====================
    { id: "design_1", question: "Quels types de design proposez-vous ?", question_en: "What kind of design services do you offer?", answer: "Web design, UI/UX design, maquettes complÃ¨tes de site, et crÃ©ation de dashboards personnalisÃ©s.", answer_en: "Web design, UI/UX design, full site mockups, and custom dashboard creation.", categoryId: "design", order: 1, isPublished: true },
    { id: "design_2", question: "Utilisez-vous Figma pour vos projets ?", question_en: "Do you use Figma?", answer: "Oui, Figma est mon outil principal. Je l'utilise aussi avec Figma AI pour accÃ©lÃ©rer la conception.", answer_en: "Yes, Figma (and Figma AI) is my main design tool.", categoryId: "design", order: 2, isPublished: true },
    { id: "design_3", question: "Pouvez-vous refaire entiÃ¨rement un site existant ?", question_en: "Can you redesign an existing website?", answer: "Oui, je peux effectuer une refonte complÃ¨te, que ce soit sur le plan visuel ou structurel.", answer_en: "Absolutely â€” I can fully redesign and optimize your current site.", categoryId: "design", order: 3, isPublished: true },
    { id: "design_4", question: "Proposez-vous des identitÃ©s visuelles complÃ¨tes ?", question_en: "Do you create full visual identities?", answer: "Oui, je peux concevoir un systÃ¨me visuel complet : couleurs, typographie, logo et composants.", answer_en: "Yes, including colors, typography, logos, and components.", categoryId: "design", order: 4, isPublished: true },
    { id: "design_5", question: "Offrez-vous des prototypes interactifs ?", question_en: "Do you provide interactive prototypes?", answer: "Oui, chaque projet est livrÃ© avec un prototype cliquable pour valider les interactions avant dÃ©veloppement.", answer_en: "Yes, every project includes a clickable prototype before development.", categoryId: "design", order: 5, isPublished: true },
    
    // ==================== AUTOMATION & AI ====================
    { id: "automation_1", question: "Qu'est-ce que l'automatisation d'entreprise ?", question_en: "What is business automation?", answer: "C'est la mise en place de processus qui se dÃ©clenchent automatiquement (envoi d'emails, gÃ©nÃ©ration de factures, synchronisation de donnÃ©es, etc.).", answer_en: "It's about creating workflows that run automatically (emails, invoices, data sync, etc.).", categoryId: "automation", order: 1, isPublished: true },
    { id: "automation_2", question: "Quels outils d'automatisation utilisez-vous ?", question_en: "What tools do you use for automation?", answer: "J'utilise principalement n8n, Zapier et des solutions maison codÃ©es directement dans vos systÃ¨mes.", answer_en: "Mainly n8n, Zapier, and custom-coded automations.", categoryId: "automation", order: 2, isPublished: true },
    { id: "automation_3", question: "Proposez-vous des intÃ©grations IA ?", question_en: "Do you integrate AI?", answer: "Oui, j'intÃ¨gre des modÃ¨les d'IA pour amÃ©liorer la productivitÃ© : gÃ©nÃ©ration de contenu, rÃ©ponses automatiques, analyse de donnÃ©es, etc.", answer_en: "Yes, I use AI for productivity: content generation, analysis, smart notifications.", categoryId: "automation", order: 3, isPublished: true },
    { id: "automation_4", question: "Pouvez-vous crÃ©er un systÃ¨me entiÃ¨rement personnalisÃ© sans no-code ?", question_en: "Can you build custom systems from scratch (no no-code)?", answer: "Oui, je code les systÃ¨mes Ã  la main si nÃ©cessaire, notamment pour les dashboards internes.", answer_en: "Yes, I develop everything directly when necessary.", categoryId: "automation", order: 4, isPublished: true },
    { id: "automation_5", question: "L'IA remplace-t-elle le design humain ?", question_en: "Does AI replace human design?", answer: "Non, elle l'accÃ©lÃ¨re. L'IA m'aide Ã  prototyper et tester plus vite, mais le design final reste 100 % humain.", answer_en: "No, it speeds it up â€” design decisions remain human.", categoryId: "automation", order: 5, isPublished: true },
    
    // ==================== PROCESS CLIENT ====================
    { id: "process_1", question: "Comment se dÃ©roule un projet typique ?", question_en: "What's your typical workflow?", answer: "Ã‰tape 1 : Appel dÃ©couverte â†’ Ã‰tape 2 : Proposition â†’ Ã‰tape 3 : Design / DÃ©veloppement â†’ Ã‰tape 4 : Livraison & suivi.", answer_en: "Step 1: Discovery call â†’ Step 2: Proposal â†’ Step 3: Design/Build â†’ Step 4: Delivery & follow-up.", categoryId: "process", order: 1, isPublished: true },
    { id: "process_2", question: "Quelle est la durÃ©e typique d'un projet ?", question_en: "How long does a project take?", answer: "Cela dÃ©pend du pack : quelques jours pour un Starter, 1-2 semaines pour du Pro, et 3-4 semaines pour un Scale.", answer_en: "It depends: a few days for Starter, 1-2 weeks for Pro, 3-4 weeks for Scale.", categoryId: "process", order: 2, isPublished: true },
    { id: "process_3", question: "Proposez-vous des rÃ©visions ?", question_en: "Do you offer revisions?", answer: "Oui, chaque pack inclut des rÃ©visions (1 Ã  3 itÃ©rations selon le niveau).", answer_en: "Yes, each package includes revisions (1-3 rounds depending on the level).", categoryId: "process", order: 3, isPublished: true },
    
    // ==================== TARIFICATION ====================
    { id: "pricing_1", question: "Quels sont vos tarifs ?", question_en: "What are your rates?", answer: "Les tarifs varient selon le projet. Contactez-moi pour un devis personnalisÃ© adaptÃ© Ã  vos besoins.", answer_en: "Rates vary by project. Contact me for a custom quote tailored to your needs.", categoryId: "pricing", order: 1, isPublished: true },
    { id: "pricing_2", question: "Comment se passe le paiement ?", question_en: "How does payment work?", answer: "Paiement en 2 fois : un acompte au dÃ©marrage, et le solde Ã  la livraison. Virement bancaire ou Stripe acceptÃ©s.", answer_en: "Payment in 2 installments: deposit upfront, balance upon delivery. Bank transfer or Stripe accepted.", categoryId: "pricing", order: 2, isPublished: true },
    { id: "pricing_3", question: "Offrez-vous une garantie ?", question_en: "Do you offer a guarantee?", answer: "Oui, un support post-livraison est inclus pour corrections et ajustements (7 Ã  30 jours selon le pack).", answer_en: "Yes, post-delivery support is included for fixes and adjustments (7-30 days depending on package).", categoryId: "pricing", order: 3, isPublished: true },
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
              linear-gradient(rgba(204, 255, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(204, 255, 0, 0.03) 1px, transparent 1px)
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
                {text.hero.badge}
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95]">
              <span className="block text-white">
                {text.hero.title1}
              </span>
              <span className="block text-gradient-mint-animated">
                {text.hero.title2}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              {text.hero.subtitle}
              produits clairs, Ã©volutifs et Ã©conomes en temps.
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
                {text.hero.cta1}
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
                {text.hero.cta2}
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
              {text.sections.whyItWorks}
            </h2>
            <p className="text-xl text-neutral-400">
              {text.sections.whyItWorksSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: text.whyItWorks.card1.title,
                description: text.whyItWorks.card1.description,
                metric: text.whyItWorks.card1.metric,
                metricLabel: text.whyItWorks.card1.metricLabel,
              },
              {
                icon: Workflow,
                title: text.whyItWorks.card2.title,
                description: text.whyItWorks.card2.description,
                metric: text.whyItWorks.card2.metric,
                metricLabel: text.whyItWorks.card2.metricLabel,
              },
              {
                icon: TrendingUp,
                title: text.whyItWorks.card3.title,
                description: text.whyItWorks.card3.description,
                metric: text.whyItWorks.card3.metric,
                metricLabel: text.whyItWorks.card3.metricLabel,
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
              <span className="text-sm text-mint font-medium">{text.sections.methodology}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {text.sections.howIWork}
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {text.sections.howIWorkSubtitle}
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
              <span className="text-sm text-mint font-medium">{text.sections.results}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {text.sections.caseStudiesTitle}
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {text.sections.caseStudiesSubtitle}
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
                {text.sections.services}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {text.sections.servicesTitle}
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {text.sections.servicesSubtitle}
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
              <span className="text-sm text-mint font-medium">{text.sections.faq}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {text.sections.faqTitle}
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              {text.sections.faqSubtitle}
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
              <span className="text-sm text-mint font-medium">{text.sections.contact}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {text.sections.contactTitle}
            </h2>
            <p className="text-xl text-neutral-400">
              {text.sections.contactSubtitle}
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
              {text.sections.finalCta}
            </h2>
            <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
              {text.sections.finalCtaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("booking")}
                className="bg-mint text-black hover:bg-mint/90 h-14 px-10 rounded-full text-lg"
              >
                {text.sections.bookAudit}
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
                {text.sections.sendBrief}
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
                {text.trust.satisfaction}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">&lt; 24h</div>
              <div className="text-sm text-neutral-400">{text.trust.responseTime}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">{language === 'en' ? 'GDPR' : 'RGPD'}</div>
              <div className="text-sm text-neutral-400">
                {text.trust.compliance}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-mint mb-2">NDA</div>
              <div className="text-sm text-neutral-400">
                {text.trust.nda}
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

