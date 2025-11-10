import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  Code, 
  DollarSign, 
  Clock, 
  MessageSquare,
  Shield,
  User,
  Palette,
  Zap,
  Calendar,
  LucideIcon
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useTranslation } from "../../utils/i18n/useTranslation";

// ============================================================================
// STATIC FAQ DATA - NO DATABASE
// ============================================================================

interface FAQCategory {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  color: string;
  order: number;
}

interface FAQQuestion {
  id: string;
  question: string;
  question_en: string;
  answer: string;
  answer_en: string;
  categoryId: string;
  order: number;
  keywords: string[];
  keywords_en: string[];
  isPublished: boolean;
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    name: "Général",
    name_en: "General",
    icon: "User",
    color: "text-blue-400",
    order: 1,
  },
  {
    id: "design",
    name: "Design",
    name_en: "Design",
    icon: "Palette",
    color: "text-purple-400",
    order: 2,
  },
  {
    id: "automation",
    name: "Automatisation & IA",
    name_en: "Automation & AI",
    icon: "Zap",
    color: "text-yellow-400",
    order: 3,
  },
  {
    id: "process",
    name: "Process client",
    name_en: "Client Process",
    icon: "Clock",
    color: "text-green-400",
    order: 4,
  },
  {
    id: "pricing",
    name: "Tarification & facturation",
    name_en: "Pricing & Invoicing",
    icon: "DollarSign",
    color: "text-emerald-400",
    order: 5,
  },
  {
    id: "contact",
    name: "Rendez-vous & contact",
    name_en: "Meetings & Contact",
    icon: "Calendar",
    color: "text-orange-400",
    order: 6,
  },
  {
    id: "security",
    name: "Technique & confidentialité",
    name_en: "Technical & Confidentiality",
    icon: "Shield",
    color: "text-red-400",
    order: 7,
  },
  {
    id: "misc",
    name: "Divers / Bonus",
    name_en: "Miscellaneous",
    icon: "Sparkles",
    color: "text-pink-400",
    order: 8,
  },
];

const FAQ_QUESTIONS: FAQQuestion[] = [
  // ==================== GÉNÉRAL ====================
  {
    id: "general_1",
    question: "Qui êtes-vous ?",
    question_en: "Who are you?",
    answer: "Je m'appelle Maxence, freelance spécialisé en design, automatisation et IA. J'aide les entreprises à créer des systèmes intelligents et des interfaces performantes.",
    answer_en: "I'm Maxence, a freelance designer and automation specialist. I help companies build smart systems and efficient interfaces.",
    categoryId: "general",
    order: 1,
    keywords: ["maxence", "freelance", "design", "automatisation", "ia", "qui"],
    keywords_en: ["maxence", "freelance", "design", "automation", "ai", "who"],
    isPublished: true,
  },
  {
    id: "general_2",
    question: "Avec qui travaillez-vous ?",
    question_en: "Who do you work with?",
    answer: "Je collabore avec des startups, PME et indépendants qui souhaitent professionnaliser leur image et optimiser leurs process.",
    answer_en: "I collaborate with startups, SMEs, and independent creators.",
    categoryId: "general",
    order: 2,
    keywords: ["clients", "startups", "pme", "indépendants", "collaboration"],
    keywords_en: ["clients", "startups", "sme", "independent", "collaboration"],
    isPublished: true,
  },
  {
    id: "general_3",
    question: "Où êtes-vous basé ?",
    question_en: "Where are you based?",
    answer: "Je travaille en full remote, depuis la France.",
    answer_en: "I work fully remote from France.",
    categoryId: "general",
    order: 3,
    keywords: ["localisation", "france", "remote", "télétravail", "où"],
    keywords_en: ["location", "france", "remote", "where", "based"],
    isPublished: true,
  },
  {
    id: "general_4",
    question: "Travaillez-vous à l'international ?",
    question_en: "Do you work internationally?",
    answer: "Oui, j'accompagne des clients dans plusieurs pays (Europe, États-Unis, Asie).",
    answer_en: "Yes, I work with clients from Europe, the U.S., and Asia.",
    categoryId: "general",
    order: 4,
    keywords: ["international", "europe", "usa", "asie", "monde"],
    keywords_en: ["international", "europe", "usa", "asia", "world"],
    isPublished: true,
  },
  {
    id: "general_5",
    question: "Quelle est votre langue de travail ?",
    question_en: "What languages do you work in?",
    answer: "Je travaille en français et en anglais.",
    answer_en: "French and English.",
    categoryId: "general",
    order: 5,
    keywords: ["langue", "français", "anglais", "bilingue"],
    keywords_en: ["language", "french", "english", "bilingual"],
    isPublished: true,
  },

  // ==================== DESIGN ====================
  {
    id: "design_1",
    question: "Quels types de design proposez-vous ?",
    question_en: "What kind of design services do you offer?",
    answer: "Web design, UI/UX design, maquettes complètes de site, et création de dashboards personnalisés.",
    answer_en: "Web design, UI/UX design, full site mockups, and custom dashboard creation.",
    categoryId: "design",
    order: 1,
    keywords: ["design", "web", "ui", "ux", "maquettes", "dashboard"],
    keywords_en: ["design", "web", "ui", "ux", "mockups", "dashboard"],
    isPublished: true,
  },
  {
    id: "design_2",
    question: "Utilisez-vous Figma pour vos projets ?",
    question_en: "Do you use Figma?",
    answer: "Oui, Figma est mon outil principal. Je l'utilise aussi avec Figma AI pour accélérer la conception.",
    answer_en: "Yes, Figma (and Figma AI) is my main design tool.",
    categoryId: "design",
    order: 2,
    keywords: ["figma", "outil", "design", "prototype", "ai"],
    keywords_en: ["figma", "tool", "design", "prototype", "ai"],
    isPublished: true,
  },
  {
    id: "design_3",
    question: "Pouvez-vous refaire entièrement un site existant ?",
    question_en: "Can you redesign an existing website?",
    answer: "Oui, je peux effectuer une refonte complète, que ce soit sur le plan visuel ou structurel.",
    answer_en: "Absolutely — I can fully redesign and optimize your current site.",
    categoryId: "design",
    order: 3,
    keywords: ["refonte", "redesign", "existant", "amélioration", "rénovation"],
    keywords_en: ["redesign", "existing", "improve", "renovation", "optimize"],
    isPublished: true,
  },
  {
    id: "design_4",
    question: "Proposez-vous des identités visuelles complètes ?",
    question_en: "Do you create full visual identities?",
    answer: "Oui, je peux concevoir un système visuel complet : couleurs, typographie, logo et composants.",
    answer_en: "Yes, including colors, typography, logos, and components.",
    categoryId: "design",
    order: 4,
    keywords: ["identité", "branding", "logo", "charte", "graphique"],
    keywords_en: ["identity", "branding", "logo", "charter", "visual"],
    isPublished: true,
  },
  {
    id: "design_5",
    question: "Offrez-vous des prototypes interactifs ?",
    question_en: "Do you provide interactive prototypes?",
    answer: "Oui, chaque projet est livré avec un prototype cliquable pour valider les interactions avant développement.",
    answer_en: "Yes, every project includes a clickable prototype before development.",
    categoryId: "design",
    order: 5,
    keywords: ["prototype", "interactif", "cliquable", "maquette", "test"],
    keywords_en: ["prototype", "interactive", "clickable", "mockup", "test"],
    isPublished: true,
  },

  // ==================== AUTOMATION & AI ====================
  {
    id: "automation_1",
    question: "Qu'est-ce que l'automatisation d'entreprise ?",
    question_en: "What is business automation?",
    answer: "C'est la mise en place de processus qui se déclenchent automatiquement (envoi d'emails, génération de factures, synchronisation de données, etc.).",
    answer_en: "It's about creating workflows that run automatically (emails, invoices, data sync, etc.).",
    categoryId: "automation",
    order: 1,
    keywords: ["automatisation", "workflow", "process", "automatique"],
    keywords_en: ["automation", "workflow", "process", "automatic"],
    isPublished: true,
  },
  {
    id: "automation_2",
    question: "Quels outils d'automatisation utilisez-vous ?",
    question_en: "What tools do you use for automation?",
    answer: "J'utilise principalement n8n, Zapier et des solutions maison codées directement dans vos systèmes.",
    answer_en: "Mainly n8n, Zapier, and custom-coded automations.",
    categoryId: "automation",
    order: 2,
    keywords: ["n8n", "zapier", "outils", "automation", "workflow"],
    keywords_en: ["n8n", "zapier", "tools", "automation", "workflow"],
    isPublished: true,
  },
  {
    id: "automation_3",
    question: "Proposez-vous des intégrations IA ?",
    question_en: "Do you integrate AI?",
    answer: "Oui, j'intègre des modèles d'IA pour améliorer la productivité : génération de contenu, réponses automatiques, analyse de données, etc.",
    answer_en: "Yes, I use AI for productivity: content generation, analysis, smart notifications.",
    categoryId: "automation",
    order: 3,
    keywords: ["ia", "intelligence artificielle", "ai", "chatgpt", "automatisation"],
    keywords_en: ["ai", "artificial intelligence", "chatgpt", "automation"],
    isPublished: true,
  },
  {
    id: "automation_4",
    question: "Pouvez-vous créer un système entièrement personnalisé sans no-code ?",
    question_en: "Can you build custom systems from scratch (no no-code)?",
    answer: "Oui, je code les systèmes à la main si nécessaire, notamment pour les dashboards internes.",
    answer_en: "Yes, I develop everything directly when necessary.",
    categoryId: "automation",
    order: 4,
    keywords: ["code", "personnalisé", "sur mesure", "développement", "custom"],
    keywords_en: ["code", "custom", "tailored", "development", "scratch"],
    isPublished: true,
  },
  {
    id: "automation_5",
    question: "L'IA remplace-t-elle le design humain ?",
    question_en: "Does AI replace human design?",
    answer: "Non, elle l'accélère. L'IA m'aide à prototyper et tester plus vite, mais le design final reste 100 % humain.",
    answer_en: "No, it speeds it up — design decisions remain human.",
    categoryId: "automation",
    order: 5,
    keywords: ["ia", "humain", "design", "remplacement", "automatisation"],
    keywords_en: ["ai", "human", "design", "replacement", "automation"],
    isPublished: true,
  },

  // ==================== PROCESS CLIENT ====================
  {
    id: "process_1",
    question: "Comment se déroule un projet typique ?",
    question_en: "What's your typical workflow?",
    answer: "Étape 1 : Appel découverte → Étape 2 : Proposition → Étape 3 : Design / Développement → Étape 4 : Livraison & suivi.",
    answer_en: "Step 1: Discovery call → Step 2: Proposal → Step 3: Design/Build → Step 4: Delivery & follow-up.",
    categoryId: "process",
    order: 1,
    keywords: ["process", "étapes", "workflow", "déroulement", "projet"],
    keywords_en: ["process", "steps", "workflow", "stages", "project"],
    isPublished: true,
  },
  {
    id: "process_2",
    question: "Combien de temps dure un projet en moyenne ?",
    question_en: "How long does a project take?",
    answer: "Entre 1 à 4 semaines selon la complexité.",
    answer_en: "Between 1 and 4 weeks depending on complexity.",
    categoryId: "process",
    order: 2,
    keywords: ["délai", "temps", "durée", "semaines", "planning"],
    keywords_en: ["timeline", "time", "duration", "weeks", "planning"],
    isPublished: true,
  },
  {
    id: "process_3",
    question: "Comment se fait la communication pendant le projet ?",
    question_en: "How do you communicate during a project?",
    answer: "Principalement par e-mail ou via un espace client dédié (dashboard).",
    answer_en: "Mainly via email or the client dashboard.",
    categoryId: "process",
    order: 3,
    keywords: ["communication", "email", "dashboard", "suivi", "contact"],
    keywords_en: ["communication", "email", "dashboard", "tracking", "contact"],
    isPublished: true,
  },
  {
    id: "process_4",
    question: "Proposez-vous des suivis après livraison ?",
    question_en: "Do you offer post-delivery support?",
    answer: "Oui, un suivi de 30 jours est inclus pour ajuster et corriger si besoin.",
    answer_en: "Yes, a 30-day follow-up is included.",
    categoryId: "process",
    order: 4,
    keywords: ["suivi", "support", "après", "livraison", "garantie"],
    keywords_en: ["support", "follow-up", "after", "delivery", "warranty"],
    isPublished: true,
  },
  {
    id: "process_5",
    question: "Puis-je demander des ajustements après livraison ?",
    question_en: "Can I request revisions?",
    answer: "Oui, chaque projet comprend plusieurs itérations prévues dès le départ.",
    answer_en: "Yes, multiple iterations are included.",
    categoryId: "process",
    order: 5,
    keywords: ["ajustements", "révisions", "modifications", "itérations"],
    keywords_en: ["adjustments", "revisions", "modifications", "iterations"],
    isPublished: true,
  },

  // ==================== PRICING ====================
  {
    id: "pricing_1",
    question: "Comment sont calculés vos tarifs ?",
    question_en: "How do you price projects?",
    answer: "Les tarifs dépendent du périmètre, de la complexité et du délai. Chaque projet est chiffré sur mesure.",
    answer_en: "Based on scope, complexity, and deadlines.",
    categoryId: "pricing",
    order: 1,
    keywords: ["tarifs", "prix", "coût", "calcul", "budget"],
    keywords_en: ["pricing", "price", "cost", "calculation", "budget"],
    isPublished: true,
  },
  {
    id: "pricing_2",
    question: "Travaillez-vous à l'heure ou au forfait ?",
    question_en: "Do you charge hourly or per project?",
    answer: "Les deux sont possibles selon la nature du projet.",
    answer_en: "Both options are available.",
    categoryId: "pricing",
    order: 2,
    keywords: ["heure", "forfait", "tjm", "tarif", "facturation"],
    keywords_en: ["hourly", "fixed", "rate", "pricing", "billing"],
    isPublished: true,
  },
  {
    id: "pricing_3",
    question: "Demandez-vous un acompte ?",
    question_en: "Do you require a deposit?",
    answer: "Oui, 30 à 50 % à la signature, le reste à la livraison.",
    answer_en: "Yes, usually 30–50% upfront.",
    categoryId: "pricing",
    order: 3,
    keywords: ["acompte", "avance", "paiement", "dépôt"],
    keywords_en: ["deposit", "advance", "payment", "upfront"],
    isPublished: true,
  },
  {
    id: "pricing_4",
    question: "Fournissez-vous des factures officielles ?",
    question_en: "Do you provide official invoices?",
    answer: "Oui, toutes les prestations sont facturées de manière conforme.",
    answer_en: "Yes, all invoices are compliant.",
    categoryId: "pricing",
    order: 4,
    keywords: ["facture", "facturation", "officielle", "conforme"],
    keywords_en: ["invoice", "billing", "official", "compliant"],
    isPublished: true,
  },
  {
    id: "pricing_5",
    question: "Acceptez-vous les paiements internationaux ?",
    question_en: "Do you accept international payments?",
    answer: "Oui, via virement ou plateformes sécurisées (Stripe, PayPal).",
    answer_en: "Yes, via bank transfer, Stripe, or PayPal.",
    categoryId: "pricing",
    order: 5,
    keywords: ["paiement", "international", "stripe", "paypal", "virement"],
    keywords_en: ["payment", "international", "stripe", "paypal", "transfer"],
    isPublished: true,
  },

  // ==================== CONTACT ====================
  {
    id: "contact_1",
    question: "Comment vous contacter ?",
    question_en: "How can I contact you?",
    answer: "Via le formulaire de contact ou en réservant un créneau directement sur mon calendrier.",
    answer_en: "Via the contact form or by booking a slot in the calendar.",
    categoryId: "contact",
    order: 1,
    keywords: ["contact", "formulaire", "email", "calendrier", "réservation"],
    keywords_en: ["contact", "form", "email", "calendar", "booking"],
    isPublished: true,
  },
  {
    id: "contact_2",
    question: "Proposez-vous des appels gratuits ?",
    question_en: "Do you offer free calls?",
    answer: "Oui, un premier échange de 20 minutes est offert.",
    answer_en: "Yes, a free 20-minute call to discuss your project.",
    categoryId: "contact",
    order: 2,
    keywords: ["appel", "gratuit", "consultation", "découverte"],
    keywords_en: ["call", "free", "consultation", "discovery"],
    isPublished: true,
  },
  {
    id: "contact_3",
    question: "Quels sont vos horaires de disponibilité ?",
    question_en: "What are your working hours?",
    answer: "Du lundi au vendredi, 9h–18h (CET).",
    answer_en: "Monday to Friday, 9AM–6PM (CET).",
    categoryId: "contact",
    order: 3,
    keywords: ["horaires", "disponibilité", "heures", "ouverture"],
    keywords_en: ["hours", "availability", "schedule", "opening"],
    isPublished: true,
  },
  {
    id: "contact_4",
    question: "Puis-je vous contacter sur WhatsApp ou LinkedIn ?",
    question_en: "Can I contact you on WhatsApp or LinkedIn?",
    answer: "Oui, les liens directs sont disponibles dans la section contact.",
    answer_en: "Yes, both are available on the contact page.",
    categoryId: "contact",
    order: 4,
    keywords: ["whatsapp", "linkedin", "réseaux", "social"],
    keywords_en: ["whatsapp", "linkedin", "social", "networks"],
    isPublished: true,
  },
  {
    id: "contact_5",
    question: "Combien de temps prenez-vous pour répondre ?",
    question_en: "How fast do you reply?",
    answer: "En général, sous 24h ouvrées.",
    answer_en: "Usually within 24 working hours.",
    categoryId: "contact",
    order: 5,
    keywords: ["réponse", "délai", "temps", "rapidité"],
    keywords_en: ["response", "time", "delay", "speed"],
    isPublished: true,
  },

  // ==================== SECURITY ====================
  {
    id: "security_1",
    question: "Mes données sont-elles sécurisées ?",
    question_en: "Are my data secure?",
    answer: "Oui, toutes les informations échangées sont confidentielles et stockées de manière sécurisée.",
    answer_en: "Yes, all communications and data are protected.",
    categoryId: "security",
    order: 1,
    keywords: ["sécurité", "données", "confidentialité", "protection"],
    keywords_en: ["security", "data", "confidentiality", "protection"],
    isPublished: true,
  },
  {
    id: "security_2",
    question: "Utilisez-vous des services externes pour héberger mes données ?",
    question_en: "Do you use third-party services?",
    answer: "Oui, uniquement des solutions fiables (Vercel, Supabase, Notion API, etc.).",
    answer_en: "Only trusted ones (Vercel, Supabase, Notion API).",
    categoryId: "security",
    order: 2,
    keywords: ["hébergement", "services", "vercel", "supabase", "données"],
    keywords_en: ["hosting", "services", "vercel", "supabase", "data"],
    isPublished: true,
  },
  {
    id: "security_3",
    question: "Faites-vous signer un contrat avant chaque mission ?",
    question_en: "Do you sign contracts before projects?",
    answer: "Oui, chaque collaboration commence par une proposition et un contrat clair.",
    answer_en: "Always — clarity first.",
    categoryId: "security",
    order: 3,
    keywords: ["contrat", "juridique", "accord", "signature"],
    keywords_en: ["contract", "legal", "agreement", "signature"],
    isPublished: true,
  },
  {
    id: "security_4",
    question: "Pouvez-vous travailler en marque blanche ?",
    question_en: "Do you work white-label?",
    answer: "Oui, je peux collaborer sous votre marque ou celle de votre client.",
    answer_en: "Yes, I can work under your brand.",
    categoryId: "security",
    order: 4,
    keywords: ["marque blanche", "white label", "sous-traitance"],
    keywords_en: ["white label", "branding", "subcontracting"],
    isPublished: true,
  },
  {
    id: "security_5",
    question: "Proposez-vous des NDA ?",
    question_en: "Can you sign an NDA?",
    answer: "Bien sûr, je signe des accords de confidentialité sur demande.",
    answer_en: "Of course.",
    categoryId: "security",
    order: 5,
    keywords: ["nda", "confidentialité", "accord", "secret"],
    keywords_en: ["nda", "confidentiality", "agreement", "secret"],
    isPublished: true,
  },

  // ==================== MISC ====================
  {
    id: "misc_1",
    question: "Proposez-vous des formations ou ateliers ?",
    question_en: "Do you offer training or workshops?",
    answer: "Oui, sur Figma, automatisation et IA appliquée au business.",
    answer_en: "Yes, on Figma, automation, and AI for businesses.",
    categoryId: "misc",
    order: 1,
    keywords: ["formation", "atelier", "workshop", "apprentissage"],
    keywords_en: ["training", "workshop", "learning", "education"],
    isPublished: true,
  },
  {
    id: "misc_2",
    question: "Quels sont vos prochains projets ?",
    question_en: "What are your upcoming projects?",
    answer: "Lancer une plateforme complète dédiée à la création de systèmes automatisés et IA pour freelances et entreprises.",
    answer_en: "A platform dedicated to building automated and AI-driven systems for freelancers and companies.",
    categoryId: "misc",
    order: 2,
    keywords: ["projets", "futur", "plateforme", "développement"],
    keywords_en: ["projects", "future", "platform", "development"],
    isPublished: true,
  },
];

// Icon mapping helper
const getIconComponent = (iconName?: string): LucideIcon => {
  const iconMap: { [key: string]: LucideIcon } = {
    User,
    Palette,
    Zap,
    Clock,
    DollarSign,
    Calendar,
    Shield,
    Sparkles,
    HelpCircle,
  };
  
  return iconMap[iconName || "HelpCircle"] || HelpCircle;
};

export function FAQPage() {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Get category name based on language
  const getCategoryName = (category: FAQCategory) => {
    return language === "en" ? category.name_en : category.name;
  };

  // Get question text based on language
  const getQuestionText = (question: FAQQuestion) => {
    return language === "en" ? question.question_en : question.question;
  };

  // Get answer text based on language
  const getAnswerText = (question: FAQQuestion) => {
    return language === "en" ? question.answer_en : question.answer;
  };

  // Get keywords based on language
  const getKeywords = (question: FAQQuestion) => {
    return language === "en" ? question.keywords_en : question.keywords;
  };

  // Filter questions by search and category
  const filteredQuestions = useMemo(() => {
    let filtered = FAQ_QUESTIONS.filter(q => q.isPublished);

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(q => q.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => {
        const questionText = getQuestionText(q).toLowerCase();
        const answerText = getAnswerText(q).toLowerCase();
        const keywords = getKeywords(q).join(" ").toLowerCase();
        
        return (
          questionText.includes(query) ||
          answerText.includes(query) ||
          keywords.includes(query)
        );
      });
    }

    return filtered.sort((a, b) => a.order - b.order);
  }, [searchQuery, selectedCategory, language]);

  // Group questions by category for display
  const questionsByCategory = useMemo(() => {
    const grouped: { [key: string]: FAQQuestion[] } = {};
    
    filteredQuestions.forEach(question => {
      if (!grouped[question.categoryId]) {
        grouped[question.categoryId] = [];
      }
      grouped[question.categoryId].push(question);
    });

    return grouped;
  }, [filteredQuestions]);

  // Get sorted categories (only those with questions)
  const visibleCategories = useMemo(() => {
    return FAQ_CATEGORIES
      .filter(cat => questionsByCategory[cat.id]?.length > 0)
      .sort((a, b) => a.order - b.order);
  }, [questionsByCategory]);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F4F4F4]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FFC2]/5 to-transparent pointer-events-none" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFC2]/10 rounded-full blur-3xl"
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

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-[#00FFC2]/10 text-[#00FFC2] border-[#00FFC2]/20">
              <HelpCircle className="w-3 h-3 mr-2" />
              {t("faq.badge")}
            </Badge>
            
            <h1 className="mb-6">
              {t("faq.title")}
            </h1>
            
            <p className="text-xl text-[#F4F4F4]/70 mb-8 max-w-2xl mx-auto">
              {t("faq.subtitle")}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F4F4F4]/40 w-5 h-5" />
              <Input
                type="text"
                placeholder={t("faq.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-[#F4F4F4]/5 border-[#F4F4F4]/10 text-[#F4F4F4] placeholder:text-[#F4F4F4]/40 focus:border-[#00FFC2]/50 focus:ring-[#00FFC2]/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
            {/* All Categories Pill */}
            <motion.button
              onClick={() => setSelectedCategory(null)}
              className="group relative px-4 py-2 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={`relative z-10 flex items-center gap-2 transition-colors ${
                selectedCategory === null
                  ? "text-[#00FFC2]"
                  : "text-[#F4F4F4]/50 group-hover:text-[#F4F4F4]"
              }`}>
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">{t("faq.allCategories")}</span>
              </span>
              
              {/* Active indicator */}
              {selectedCategory === null && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Hover background */}
              {selectedCategory !== null && (
                <div className="absolute inset-0 bg-[#F4F4F4]/0 group-hover:bg-[#F4F4F4]/5 rounded-full transition-colors" />
              )}
            </motion.button>

            {/* Category Pills */}
            {FAQ_CATEGORIES.map((category) => {
              const Icon = getIconComponent(category.icon);
              const count = FAQ_QUESTIONS.filter(
                q => q.categoryId === category.id && q.isPublished
              ).length;

              if (count === 0) return null;

              const isActive = selectedCategory === category.id;

              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group relative px-4 py-2 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`relative z-10 flex items-center gap-2 transition-colors ${
                    isActive
                      ? "text-[#00FFC2]"
                      : "text-[#F4F4F4]/50 group-hover:text-[#F4F4F4]"
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{getCategoryName(category)}</span>
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-[#00FFC2]/10 border border-[#00FFC2]/30 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-[#F4F4F4]/0 group-hover:bg-[#F4F4F4]/5 rounded-full transition-colors" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {filteredQuestions.length === 0 ? (
            <Card className="bg-[#F4F4F4]/5 border-[#F4F4F4]/10">
              <CardContent className="p-12 text-center">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-[#F4F4F4]/20" />
                <h3 className="mb-2">{t("faq.noResults")}</h3>
                <p className="text-[#F4F4F4]/60">
                  {t("faq.tryDifferentSearch")}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 border-[#00FFC2]/20 text-[#00FFC2] hover:bg-[#00FFC2]/10"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  {t("faq.resetFilters")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {visibleCategories.map((category) => {
                const questions = questionsByCategory[category.id] || [];
                if (questions.length === 0) return null;

                const Icon = getIconComponent(category.icon);

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <h2 className="text-2xl">{getCategoryName(category)}</h2>
                      <Badge className="bg-[#00FFC2]/10 text-[#00FFC2]">
                        {questions.length}
                      </Badge>
                    </div>

                    <Accordion
                      type="multiple"
                      value={openItems}
                      onValueChange={setOpenItems}
                      className="space-y-3"
                    >
                      {questions.map((question) => (
                        <AccordionItem
                          key={question.id}
                          value={question.id}
                          className="bg-[#F4F4F4]/5 border-[#F4F4F4]/10 rounded-lg px-6 data-[state=open]:bg-[#F4F4F4]/10 transition-colors"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="pr-4">{getQuestionText(question)}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-[#F4F4F4]/70 pt-2 pb-4">
                            {getAnswerText(question)}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-[#00FFC2]/10 to-[#00FFC2]/5 border-[#00FFC2]/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFC2]/5 to-transparent" />
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 className="mb-4">{t("faq.stillHaveQuestions")}</h2>
              <p className="text-[#F4F4F4]/70 mb-8 max-w-2xl mx-auto">
                {t("faq.contactDescription")}
              </p>
              <Button
                size="lg"
                className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
                onClick={() => window.location.href = "/contact"}
              >
                {t("faq.contactButton")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default FAQPage;
