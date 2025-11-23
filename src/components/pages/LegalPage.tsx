import { useMemo } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Scale, FileText } from "lucide-react";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { ContactCTA } from "../../redesign/components/ContactCTA";

const SECTION_ALIASES: Record<string, LegalContentKey> = {
  privacy: "privacy",
  confidentialite: "privacy",
  "politique-de-confidentialite": "privacy",
  terms: "terms",
  conditions: "terms",
  "conditions-generales": "terms",
  imprint: "imprint",
  "mentions-legales": "imprint",
  legal: "imprint",
};

type LegalContentKey = "privacy" | "terms" | "imprint";

type Locale = "fr" | "en";

interface ContentBlock {
  title: string;
  body: string[];
  bullets?: string[];
}

interface LocalizedContent {
  eyebrow: string;
  title: string;
  description: string;
  icon: "shield" | "scale" | "file";
  lastUpdated: string;
  sections: ContentBlock[];
}

const LEGAL_CONTENT: Record<LegalContentKey, Record<Locale, LocalizedContent>> = {
  privacy: {
    fr: {
      eyebrow: "Protection des données",
      title: "Politique de confidentialité",
      description:
        "Cette page décrit comment je collecte, protège et utilise les données personnelles partagées via le site, les formulaires et les outils connectés.",
      icon: "shield",
      lastUpdated: "Dernière mise à jour : 23 novembre 2025",
      sections: [
        {
          title: "1. Données collectées",
          body: [
            "Les informations sont collectées lorsque vous remplissez un formulaire (contact, devis, téléchargement), planifiez un rendez-vous ou utilisez un outil interactif.",
            "Ces données incluent votre nom, votre email, les informations sur votre société ainsi que les éléments décrivant votre projet.",
          ],
          bullets: [
            "Données d'identité : nom, prénom, entreprise",
            "Données de contact : email professionnel, téléphone",
            "Détails de projet : objectifs, budget cible, échéances",
          ],
        },
        {
          title: "2. Usage des données",
          body: [
            "Les données servent uniquement à répondre à votre demande, préparer une proposition personnalisée ou assurer le suivi du projet.",
            "Aucune donnée n'est vendue ni partagée avec des tiers sans votre accord explicite.",
          ],
        },
        {
          title: "3. Conservation & sécurité",
          body: [
            "Les informations sont stockées sur Supabase (hébergé en UE) et protégées par un chiffrement côté serveur.",
            "Vous pouvez demander la suppression ou l'export de vos données à tout moment en écrivant à contact@maxence.design.",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Data protection",
      title: "Privacy policy",
      description:
        "This page explains how personal information shared through the website, booking calendar, or interactive tools is collected, protected, and used.",
      icon: "shield",
      lastUpdated: "Last updated: November 23, 2025",
      sections: [
        {
          title: "1. Data collected",
          body: [
            "Information is collected when you submit a form (contact, quote, download), schedule a call, or interact with embedded tools.",
            "Typical data points include your name, company details, email address, and the context of your project.",
          ],
          bullets: [
            "Identity data: first name, last name, company",
            "Contact data: professional email, phone",
            "Project data: goals, target budget, timeline",
          ],
        },
        {
          title: "2. Purpose of processing",
          body: [
            "Data is only used to reply to your request, build a tailored proposal, or ensure project follow-up.",
            "No information is sold or transferred to third parties without explicit consent.",
          ],
        },
        {
          title: "3. Storage & security",
          body: [
            "All submissions are stored in Supabase (EU region) with server-side encryption and role-based access.",
            "You may request deletion or export of your data at any time via contact@maxence.design.",
          ],
        },
      ],
    },
  },
  terms: {
    fr: {
      eyebrow: "Conditions contractuelles",
      title: "Conditions générales d'utilisation",
      description:
        "Ces conditions définissent le cadre de collaboration, les responsabilités de chaque partie et les engagements liés aux prestations proposées.",
      icon: "scale",
      lastUpdated: "Dernière mise à jour : 23 novembre 2025",
      sections: [
        {
          title: "1. Champ d'application",
          body: [
            "Les prestations couvrent la conception UX/UI, le développement front/back, l'intégration d'IA et l'automatisation de workflows.",
            "Chaque mission fait l'objet d'un devis détaillant périmètre, livrables, planning et modalités de paiement.",
          ],
        },
        {
          title: "2. Engagements",
          body: [
            "Je m'engage à livrer des livrables testés, documentés et alignés avec les standards techniques définis en amont.",
            "Le client s'engage à fournir les accès, contenus et validations nécessaires dans les délais convenus.",
          ],
        },
        {
          title: "3. Facturation & propriété",
          body: [
            "Un acompte de 40% est requis pour lancer la mission (sauf accord spécifique).",
            "La propriété intellectuelle est transférée à la réception du paiement final, hors outils ou librairies tierces.",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Contract terms",
      title: "Terms of service",
      description:
        "These terms outline the collaboration framework, responsibilities, and commitments attached to each delivered service.",
      icon: "scale",
      lastUpdated: "Last updated: November 23, 2025",
      sections: [
        {
          title: "1. Scope",
          body: [
            "Engagements cover UX/UI design, front-end & back-end development, AI integration, and workflow automation.",
            "Each project is backed by a written statement including scope, deliverables, schedule, and billing structure.",
          ],
        },
        {
          title: "2. Mutual commitments",
          body: [
            "I commit to delivering tested, documented assets that follow the agreed technical standards.",
            "Clients commit to sharing assets, accesses, and feedback within the agreed timeline to avoid delays.",
          ],
        },
        {
          title: "3. Billing & ownership",
          body: [
            "A 40% deposit is required to schedule the work (unless stated otherwise).",
            "Intellectual property is transferred once the final invoice is paid, excluding third-party tools or libraries.",
          ],
        },
      ],
    },
  },
  imprint: {
    fr: {
      eyebrow: "Mentions légales",
      title: "Informations éditeur",
      description:
        "Conformément aux articles 6-III et 19 de la loi pour la Confiance dans l'Économie Numérique (LCEN).",
      icon: "file",
      lastUpdated: "Dernière mise à jour : 23 novembre 2025",
      sections: [
        {
          title: "Éditeur du site",
          body: [
            "Maxence Foulon - Studio indépendant Maxence Design",
            "Siège : La Milesse, France — contact: contact@maxence.design",
            "SIRET : 924 517 209 00024",
          ],
        },
        {
          title: "Hébergement",
          body: [
            "Supabase (stockage de données) — 970 Toa Payoh N, #07-04, Singapore",
            "Netlify (hébergement applicatif) — Netlify, Inc., 2325 3rd Street, Suite 215, San Francisco, CA 94107, USA",
          ],
        },
        {
          title: "Propriété intellectuelle",
          body: [
            "L'ensemble des contenus (textes, visuels, code) est protégé par le droit d'auteur.",
            "Toute reproduction partielle ou totale nécessite une autorisation écrite préalable.",
          ],
        },
      ],
    },
    en: {
      eyebrow: "Legal notice",
      title: "Publisher information",
      description:
        "Published in accordance with EU digital service regulations and French LCEN requirements.",
      icon: "file",
      lastUpdated: "Last updated: November 23, 2025",
      sections: [
        {
          title: "Publisher",
          body: [
            "Maxence Foulon — Independent studio Maxence Design",
            "Headquarters: La Milesse, France — contact: contact@maxence.design",
            "SIRET: 924 517 209 00024",
          ],
        },
        {
          title: "Hosting",
          body: [
            "Supabase (data layer) — 970 Toa Payoh N, #07-04, Singapore",
            "Netlify (application hosting) — Netlify, Inc., 2325 3rd Street, Suite 215, San Francisco, CA 94107, USA",
          ],
        },
        {
          title: "Intellectual property",
          body: [
            "All assets (copy, visuals, source code) are protected by copyright.",
            "Any reproduction, even partial, requires prior written consent.",
          ],
        },
      ],
    },
  },
};

interface LegalPageProps {
  section?: string;
  onNavigate?: (page: string) => void;
}

const iconMap = {
  shield: <ShieldCheck className="w-12 h-12 text-primary" />,
  scale: <Scale className="w-12 h-12 text-primary" />,
  file: <FileText className="w-12 h-12 text-primary" />,
};

export default function LegalPage({ section, onNavigate }: LegalPageProps) {
  const { language } = useTranslation();
  const normalizedKey = useMemo<LegalContentKey>(() => {
    if (!section) return "privacy";
    const key = section.toLowerCase();
    return SECTION_ALIASES[key] ?? "privacy";
  }, [section]);

  const locale: Locale = language === "en" ? "en" : "fr";
  const content = LEGAL_CONTENT[normalizedKey][locale];

  return (
    <div className="bg-[#050505] text-white">
      <div className="container mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-neutral-400 mb-6">
            {iconMap[content.icon]}
            <span>{content.eyebrow}</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] mb-6">
            {content.title}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mb-4">{content.description}</p>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">{content.lastUpdated}</p>
        </motion.div>

        <div className="mt-16 space-y-10">
          {content.sections.map((block, index) => (
            <motion.section
              key={block.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/5 bg-white/5 p-8 md:p-10"
            >
              <div className="flex items-baseline justify-between gap-6 mb-6">
                <h2 className="text-2xl font-display text-white">{block.title}</h2>
                <span className="text-xs font-mono text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="space-y-4 text-white/70 text-base leading-relaxed">
                {block.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {block.bullets && (
                <ul className="mt-5 space-y-2 text-white/80 text-sm marker:text-primary list-disc list-inside">
                  {block.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>

        <div className="mt-20">
          <ContactCTA
            align="left"
            eyebrow={locale === "en" ? "Need a custom clause?" : "Besoin d'un accompagnement dédié ?"}
            title={
              locale === "en"
                ? "Still have compliance questions?"
                : "Des questions complémentaires sur la conformité ?"
            }
            description={
              locale === "en"
                ? "Schedule a call or send your brief. I'll review your constraints (RGPD, GDPR, CNIL) and adapt the collaboration setup."
                : "Planifiez un échange ou envoyez votre brief. Je vérifie vos contraintes (RGPD, CNIL) et j'adapte la collaboration en conséquence."
            }
            primaryAction={{
              label: locale === "en" ? "Contact" : "Me contacter",
              onClick: () => onNavigate?.("contact"),
            }}
            secondaryAction={{
              label: locale === "en" ? "Book a slot" : "Réserver un créneau",
              onClick: () => onNavigate?.("booking"),
            }}
            helperText={locale === "en" ? "Answer within 24h" : "Réponse sous 24h"}
          />
        </div>
      </div>
    </div>
  );
}
