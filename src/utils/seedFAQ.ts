import { projectId, publicAnonKey } from "./supabase/info";
import { createClient } from "./supabase/client";

import type { FAQCategory } from "./types/shared";

export async function seedFAQ() {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("⚠️ Must be logged in to seed FAQ data");
      return;
    }

    const authHeader = `Bearer ${session.access_token}`;

    // Create categories first
    const categories = [
      {
        name: "Services",
        icon: "Sparkles",
        color: "text-purple-400"
      },
      {
        name: "Tarifs & Paiement",
        icon: "DollarSign",
        color: "text-green-400"
      },
      {
        name: "Processus & Délais",
        icon: "Clock",
        color: "text-blue-400"
      },
      {
        name: "Communication",
        icon: "MessageSquare",
        color: "text-orange-400"
      },
      {
        name: "Technique",
        icon: "Code",
        color: "text-pink-400"
      },
      {
        name: "Légal & Sécurité",
        icon: "Shield",
        color: "text-red-400"
      }
    ];

    console.log("📦 Creating FAQ categories...");
    const createdCategories: FAQCategory[] = [];

    for (const category of categories) {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(category),
        }
      );

      if (response.ok) {
        const data = await response.json();
        createdCategories.push(data.category);
        console.log(`✅ Created category: ${category.name}`);
      }
    }

    // Map category names to IDs
    const categoryMap: { [key: string]: string } = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Create questions with FR + EN translations
    const questions = [
      // ========================================
      // SERVICES (8 questions)
      // ========================================
      {
        question: "Quels services proposez-vous ?",
        question_en: "What services do you offer?",
        answer: "Je propose une gamme complète de services digitaux : développement web et mobile (React, Next.js, React Native), design UI/UX (Figma, prototypage), consulting technique, refonte de sites existants, et accompagnement sur-mesure pour vos projets digitaux. Chaque projet est unique et adapté à vos besoins spécifiques.",
        answer_en: "I offer a complete range of digital services: web and mobile development (React, Next.js, React Native), UI/UX design (Figma, prototyping), technical consulting, existing site redesign, and custom support for your digital projects. Each project is unique and tailored to your specific needs.",
        categoryId: categoryMap["Services"],
        keywords: ["services", "prestations", "développement", "design", "web", "mobile", "consulting"],
        keywords_en: ["services", "offerings", "development", "design", "web", "mobile", "consulting"],
        isPublished: true
      },
      {
        question: "Travaillez-vous avec des technologies spécifiques ?",
        question_en: "Do you work with specific technologies?",
        answer: "Je me spécialise dans l'écosystème JavaScript moderne : React, Next.js, TypeScript, Node.js, Tailwind CSS. Pour le mobile, j'utilise React Native. Côté backend, je travaille avec Supabase, Firebase, ou des API REST/GraphQL. Je choisis toujours la stack technique la plus adaptée à votre projet.",
        answer_en: "I specialize in the modern JavaScript ecosystem: React, Next.js, TypeScript, Node.js, Tailwind CSS. For mobile, I use React Native. On the backend, I work with Supabase, Firebase, or REST/GraphQL APIs. I always choose the tech stack best suited to your project.",
        categoryId: categoryMap["Services"],
        keywords: ["technologies", "stack", "react", "nextjs", "typescript", "supabase", "firebase"],
        keywords_en: ["technologies", "stack", "react", "nextjs", "typescript", "supabase", "firebase"],
        isPublished: true
      },
      {
        question: "Proposez-vous de la maintenance après livraison ?",
        question_en: "Do you offer maintenance after delivery?",
        answer: "Oui, absolument ! Je propose plusieurs formules de maintenance : support ponctuel, maintenance mensuelle, ou accompagnement long-terme. Cela inclut les mises à jour de sécurité, corrections de bugs, ajout de fonctionnalités, et optimisations de performance. La maintenance peut être discutée dès le devis initial.",
        answer_en: "Yes, absolutely! I offer several maintenance packages: on-demand support, monthly maintenance, or long-term support. This includes security updates, bug fixes, feature additions, and performance optimizations. Maintenance can be discussed from the initial quote.",
        categoryId: categoryMap["Services"],
        keywords: ["maintenance", "support", "suivi", "après-livraison", "mises à jour"],
        keywords_en: ["maintenance", "support", "follow-up", "post-delivery", "updates"],
        isPublished: true
      },
      {
        question: "Pouvez-vous reprendre un projet existant ?",
        question_en: "Can you take over an existing project?",
        answer: "Absolument ! Je peux intervenir sur un projet existant pour : corriger des bugs, ajouter des fonctionnalités, améliorer les performances, moderniser la stack technique, ou refondre complètement l'interface. Je commence toujours par un audit technique gratuit pour évaluer l'état du projet et proposer les meilleures solutions.",
        answer_en: "Absolutely! I can work on an existing project to: fix bugs, add features, improve performance, modernize the tech stack, or completely redesign the interface. I always start with a free technical audit to assess the project's state and propose the best solutions.",
        categoryId: categoryMap["Services"],
        keywords: ["reprise", "projet existant", "refonte", "amélioration", "audit", "legacy"],
        keywords_en: ["takeover", "existing project", "redesign", "improvement", "audit", "legacy"],
        isPublished: true
      },
      {
        question: "Travaillez-vous seul ou en équipe ?",
        question_en: "Do you work alone or in a team?",
        answer: "Je travaille principalement en solo pour garantir une qualité et cohérence maximales. Pour les projets de grande envergure, je collabore avec un réseau de freelances de confiance (designers, copywriters, spécialistes SEO). Vous avez un seul point de contact : moi. C'est simple et efficace.",
        answer_en: "I primarily work solo to ensure maximum quality and consistency. For larger projects, I collaborate with a trusted network of freelancers (designers, copywriters, SEO specialists). You have a single point of contact: me. It's simple and efficient.",
        categoryId: categoryMap["Services"],
        keywords: ["équipe", "solo", "freelance", "collaboration", "partenaires"],
        keywords_en: ["team", "solo", "freelance", "collaboration", "partners"],
        isPublished: true
      },
      {
        question: "Pouvez-vous créer une application mobile ?",
        question_en: "Can you create a mobile application?",
        answer: "Oui ! Je développe des applications mobiles cross-platform avec React Native, ce qui permet de créer une app iOS et Android avec une seule base de code. C'est plus rapide et économique qu'un développement natif. Si vous avez besoin de performances natives pures, je peux vous recommander des développeurs natifs partenaires.",
        answer_en: "Yes! I develop cross-platform mobile apps with React Native, which allows creating iOS and Android apps with a single codebase. It's faster and more cost-effective than native development. If you need pure native performance, I can recommend trusted native developer partners.",
        categoryId: categoryMap["Services"],
        keywords: ["mobile", "app", "react native", "ios", "android", "application"],
        keywords_en: ["mobile", "app", "react native", "ios", "android", "application"],
        isPublished: true
      },
      {
        question: "Proposez-vous des formations ?",
        question_en: "Do you offer training?",
        answer: "Oui ! À la fin de chaque projet, je propose une session de formation pour vous et votre équipe sur l'utilisation de la solution. Je peux également créer des formations sur-mesure pour vos équipes : React, Next.js, bonnes pratiques web, ou gestion de CMS. Format en présentiel ou distanciel.",
        answer_en: "Yes! At the end of each project, I offer a training session for you and your team on using the solution. I can also create custom training for your teams: React, Next.js, web best practices, or CMS management. In-person or remote format.",
        categoryId: categoryMap["Services"],
        keywords: ["formation", "apprentissage", "onboarding", "coaching", "accompagnement"],
        keywords_en: ["training", "learning", "onboarding", "coaching", "support"],
        isPublished: true
      },
      {
        question: "Faites-vous du design ou seulement du développement ?",
        question_en: "Do you do design or only development?",
        answer: "Je fais les deux ! Je propose un service complet design + développement : création de maquettes sur Figma, prototypage interactif, design system, puis développement front-end pixel-perfect. Vous pouvez aussi ne choisir que le développement si vous avez déjà des maquettes. Flexibilité totale selon vos besoins.",
        answer_en: "I do both! I offer a complete design + development service: creating mockups in Figma, interactive prototyping, design system, then pixel-perfect front-end development. You can also choose development only if you already have mockups. Total flexibility according to your needs.",
        categoryId: categoryMap["Services"],
        keywords: ["design", "figma", "maquettes", "ui ux", "prototypage", "front-end"],
        keywords_en: ["design", "figma", "mockups", "ui ux", "prototyping", "front-end"],
        isPublished: true
      },

      // ========================================
      // TARIFS & PAIEMENT (6 questions)
      // ========================================
      {
        question: "Comment sont calculés vos tarifs ?",
        question_en: "How are your rates calculated?",
        answer: "Mes tarifs sont calculés selon plusieurs critères : complexité du projet, technologies utilisées, délais souhaités, et fonctionnalités demandées. Je propose des tarifs au forfait pour les projets bien définis, ou en régie (TJM) pour les missions long-terme. Un devis détaillé et transparent vous est fourni après notre premier échange.",
        answer_en: "My rates are calculated based on several criteria: project complexity, technologies used, desired timeline, and requested features. I offer fixed-price rates for well-defined projects, or day rates (TJM) for long-term missions. A detailed and transparent quote is provided after our first discussion.",
        categoryId: categoryMap["Tarifs & Paiement"],
        keywords: ["tarifs", "prix", "coût", "devis", "facturation", "forfait", "tjm"],
        keywords_en: ["rates", "pricing", "cost", "quote", "billing", "fixed-price", "day-rate"],
        isPublished: true
      },
      {
        question: "Quels sont vos délais de paiement ?",
        question_en: "What are your payment terms?",
        answer: "Pour les projets au forfait : 30% d'acompte à la signature, 40% à mi-parcours, et 30% à la livraison finale. Pour les missions en régie, facturation mensuelle. J'accepte les virements bancaires et propose des facilités de paiement pour les projets de plus grande envergure. Chaque facture est due sous 30 jours.",
        answer_en: "For fixed-price projects: 30% deposit on signing, 40% mid-project, and 30% on final delivery. For day-rate missions, monthly billing. I accept bank transfers and offer payment facilities for larger projects. Each invoice is due within 30 days.",
        categoryId: categoryMap["Tarifs & Paiement"],
        keywords: ["paiement", "acompte", "facturation", "délai", "virement", "modalités"],
        keywords_en: ["payment", "deposit", "billing", "deadline", "wire-transfer", "terms"],
        isPublished: true
      },
      {
        question: "Proposez-vous des forfaits ou packages ?",
        question_en: "Do you offer packages or bundles?",
        answer: "Oui, je propose des packages pré-définis pour les besoins courants : site vitrine premium, application web MVP, refonte complète, ou pack design + développement. Ces packages offrent un excellent rapport qualité-prix. Pour les projets sur-mesure, je crée un devis personnalisé adapté à votre budget et objectifs.",
        answer_en: "Yes, I offer pre-defined packages for common needs: premium showcase website, MVP web application, complete redesign, or design + development pack. These packages offer excellent value for money. For custom projects, I create a personalized quote tailored to your budget and objectives.",
        categoryId: categoryMap["Tarifs & Paiement"],
        keywords: ["forfait", "package", "offre", "prix fixe", "formule"],
        keywords_en: ["package", "bundle", "offer", "fixed-price", "plan"],
        isPublished: true
      },
      {
        question: "Quel est votre tarif journalier (TJM) ?",
        question_en: "What is your day rate?",
        answer: "Mon TJM varie entre 400€ et 600€ selon la complexité de la mission et sa durée. Pour les missions longues (3+ mois), des tarifs préférentiels sont possibles. Le TJM inclut développement, design, tests, et documentation. Pour un devis précis adapté à votre projet, contactez-moi directement.",
        answer_en: "My day rate varies between €400 and €600 depending on the mission's complexity and duration. For long missions (3+ months), preferential rates are possible. The day rate includes development, design, testing, and documentation. For a precise quote tailored to your project, contact me directly.",
        categoryId: categoryMap["Tarifs & Paiement"],
        keywords: ["tjm", "tarif journalier", "jour homme", "prix journée", "taux"],
        keywords_en: ["day-rate", "daily-rate", "man-day", "daily-price", "rate"],
        isPublished: true
      },
      {
        question: "Les frais d'hébergement sont-ils inclus ?",
        question_en: "Are hosting fees included?",
        answer: "Non, l'hébergement et les services tiers (domaine, cloud, APIs externes) sont facturés séparément. Je vous aide à choisir les meilleures solutions selon votre budget : hébergement partagé (50-20€/mois), VPS (20-100€/mois), ou cloud premium (100-500€/mois). Je gère la configuration initiale incluse dans le projet.",
        answer_en: "No, hosting and third-party services (domain, cloud, external APIs) are billed separately. I help you choose the best solutions according to your budget: shared hosting (€5-20/month), VPS (€20-100/month), or premium cloud (€100-500/month). I handle the initial configuration included in the project.",
        categoryId: categoryMap["Tarifs & Paiement"],
        keywords: ["hébergement", "frais", "domaine", "serveur", "cloud", "hosting"],
        keywords_en: ["hosting", "fees", "domain", "server", "cloud", "hosting"],
        isPublished: true
      },
      {
        question: "Proposez-vous des réductions pour startups ou associations ?",
        question_en: "Do you offer discounts for startups or nonprofits?",
        answer: "Oui ! Je soutiens l'innovation et les projets à impact. Je propose des tarifs préférentiels pour les startups en early-stage, associations à but non lucratif, et projets éducatifs. Contactez-moi pour discuter de votre projet et voir comment je peux vous accompagner dans votre budget.",
        answer_en: "Yes! I support innovation and impact projects. I offer preferential rates for early-stage startups, nonprofit organizations, and educational projects. Contact me to discuss your project and see how I can support you within your budget.",
        categoryId: categoryMap["Tarifs & Paiement"],
        keywords: ["réduction", "startup", "association", "ong", "tarif préférentiel", "discount"],
        keywords_en: ["discount", "startup", "nonprofit", "ngo", "preferential-rate", "discount"],
        isPublished: true
      },

      // ========================================
      // PROCESSUS & DÉLAIS (6 questions)
      // ========================================
      {
        question: "Combien de temps dure un projet en moyenne ?",
        question_en: "How long does a project take on average?",
        answer: "Cela dépend de la complexité : un site vitrine prend 2-4 semaines, une application web 6-12 semaines, et une app mobile 8-16 semaines. Je fournis toujours un planning détaillé avec des jalons clairs. Les projets urgents peuvent être traités en mode accéléré avec un supplément.",
        answer_en: "It depends on the complexity: a showcase website takes 2-4 weeks, a web application 6-12 weeks, and a mobile app 8-16 weeks. I always provide a detailed schedule with clear milestones. Urgent projects can be handled in accelerated mode with a surcharge.",
        categoryId: categoryMap["Processus & Délais"],
        keywords: ["délai", "durée", "temps", "planning", "livraison", "combien de temps"],
        keywords_en: ["deadline", "duration", "time", "planning", "delivery", "how-long"],
        isPublished: true
      },
      {
        question: "Comment se déroule un projet avec vous ?",
        question_en: "How does a project work with you?",
        answer: "Le processus se déroule en 5 étapes : 1) Découverte et audit de vos besoins, 2) Proposition et devis détaillé, 3) Design et validation des maquettes, 4) Développement avec points d'étape réguliers, 5) Livraison, formation, et mise en ligne. Vous êtes impliqué à chaque étape avec des validations claires.",
        answer_en: "The process unfolds in 5 steps: 1) Discovery and audit of your needs, 2) Proposal and detailed quote, 3) Design and mockup validation, 4) Development with regular checkpoints, 5) Delivery, training, and going live. You're involved at every step with clear validations.",
        categoryId: categoryMap["Processus & Délais"],
        keywords: ["processus", "méthodologie", "déroulement", "étapes", "workflow"],
        keywords_en: ["process", "methodology", "workflow", "steps", "workflow"],
        isPublished: true
      },
      {
        question: "Combien de révisions sont incluses ?",
        question_en: "How many revisions are included?",
        answer: "Chaque phase du projet inclut 2-3 cycles de révisions : 2 révisions pour les maquettes design, 3 révisions pour le développement. Les révisions majeures sortant du scope initial peuvent faire l'objet d'un devis complémentaire. L'objectif est toujours votre satisfaction à 100%.",
        answer_en: "Each project phase includes 2-3 revision cycles: 2 revisions for design mockups, 3 revisions for development. Major revisions outside the initial scope may be subject to an additional quote. The goal is always your 100% satisfaction.",
        categoryId: categoryMap["Processus & Délais"],
        keywords: ["révisions", "modifications", "ajustements", "corrections", "itérations"],
        keywords_en: ["revisions", "modifications", "adjustments", "corrections", "iterations"],
        isPublished: true
      },
      {
        question: "Que se passe-t-il si le projet prend du retard ?",
        question_en: "What happens if the project is delayed?",
        answer: "Je m'engage sur les délais annoncés. Si un retard survient de mon côté, je vous préviens immédiatement et propose des solutions : heures supplémentaires, priorisation des features, ou compensation. Si le retard vient de validations clients tardives, nous ajustons le planning ensemble. Transparence et communication sont clés.",
        answer_en: "I commit to the announced deadlines. If a delay occurs on my side, I notify you immediately and propose solutions: overtime, feature prioritization, or compensation. If the delay comes from late client validations, we adjust the schedule together. Transparency and communication are key.",
        categoryId: categoryMap["Processus & Délais"],
        keywords: ["retard", "délai dépassé", "urgence", "planning", "imprévu"],
        keywords_en: ["delay", "overdue", "urgency", "planning", "unexpected"],
        isPublished: true
      },
      {
        question: "Puis-je voir l'avancement du projet en temps réel ?",
        question_en: "Can I see the project progress in real-time?",
        answer: "Oui ! Vous avez accès à un espace projet partagé (Notion, Trello, ou GitHub Projects) où vous pouvez suivre l'avancement en temps réel : tâches en cours, terminées, et à venir. Nous avons également des points hebdomadaires en visio pour faire le point. Vous êtes toujours dans la boucle.",
        answer_en: "Yes! You have access to a shared project space (Notion, Trello, or GitHub Projects) where you can track progress in real-time: tasks in progress, completed, and upcoming. We also have weekly video calls to review. You're always in the loop.",
        categoryId: categoryMap["Processus & Délais"],
        keywords: ["suivi", "avancement", "tracking", "dashboard", "visibilité", "transparence"],
        keywords_en: ["tracking", "progress", "tracking", "dashboard", "visibility", "transparency"],
        isPublished: true
      },
      {
        question: "Comment se déroule la livraison finale ?",
        question_en: "How does the final delivery work?",
        answer: "La livraison finale comprend : mise en ligne du projet, transfert de tous les fichiers sources, documentation technique complète, formation à l'utilisation, et guide de maintenance. Vous recevez également 30 jours de support post-livraison offert pour tout bug éventuel. Puis vous êtes 100% autonome.",
        answer_en: "The final delivery includes: project deployment, transfer of all source files, complete technical documentation, usage training, and maintenance guide. You also receive 30 days of free post-delivery support for any potential bugs. Then you're 100% autonomous.",
        categoryId: categoryMap["Processus & Délais"],
        keywords: ["livraison", "mise en ligne", "transfert", "documentation", "formation"],
        keywords_en: ["delivery", "deployment", "transfer", "documentation", "training"],
        isPublished: true
      },

      // ========================================
      // COMMUNICATION (5 questions)
      // ========================================
      {
        question: "Comment communiquons-nous pendant le projet ?",
        question_en: "How do we communicate during the project?",
        answer: "Je privilégie une communication fluide et régulière : réunions hebdomadaires en visio (Zoom, Meet), échanges par email pour les questions détaillées, et Slack/Discord pour les échanges rapides. Vous avez accès à un espace projet (Notion, Trello) pour suivre l'avancement en temps réel.",
        answer_en: "I favor fluid and regular communication: weekly video meetings (Zoom, Meet), email exchanges for detailed questions, and Slack/Discord for quick exchanges. You have access to a project space (Notion, Trello) to track progress in real-time.",
        categoryId: categoryMap["Communication"],
        keywords: ["communication", "contact", "réunion", "suivi", "échange", "slack"],
        keywords_en: ["communication", "contact", "meeting", "tracking", "exchange", "slack"],
        isPublished: true
      },
      {
        question: "Sous quels délais répondez-vous aux messages ?",
        question_en: "What is your response time for messages?",
        answer: "Je réponds aux emails sous 24h maximum (hors week-ends). Pour les urgences, un numéro de téléphone est fourni aux clients actifs. Pendant les projets, nous avons des points réguliers planifiés. Je suis très réactif et disponible tout au long de notre collaboration.",
        answer_en: "I respond to emails within 24 hours maximum (excluding weekends). For emergencies, a phone number is provided to active clients. During projects, we have regular scheduled check-ins. I'm very responsive and available throughout our collaboration.",
        categoryId: categoryMap["Communication"],
        keywords: ["délai réponse", "disponibilité", "réactivité", "temps de réponse"],
        keywords_en: ["response-time", "availability", "responsiveness", "turnaround"],
        isPublished: true
      },
      {
        question: "Travaillez-vous à distance ou en présentiel ?",
        question_en: "Do you work remotely or in-person?",
        answer: "Je travaille principalement à distance, ce qui me permet d'être flexible et efficace. Pour les clients en région parisienne, je peux me déplacer pour les kick-offs et réunions importantes. Le distanciel n'affecte en rien la qualité : communication par visio, partage d'écran, et outils collaboratifs font le job parfaitement.",
        answer_en: "I work primarily remotely, which allows me to be flexible and efficient. For clients in the Paris region, I can travel for kick-offs and important meetings. Remote work doesn't affect quality at all: video communication, screen sharing, and collaborative tools do the job perfectly.",
        categoryId: categoryMap["Communication"],
        keywords: ["distance", "remote", "présentiel", "déplacement", "visio", "télétravail"],
        keywords_en: ["remote", "remote", "in-person", "travel", "video", "telecommuting"],
        isPublished: true
      },
      {
        question: "Quelle est votre disponibilité horaire ?",
        question_en: "What are your working hours?",
        answer: "Je suis disponible du lundi au vendredi, 9h-18h pour les échanges synchrones. Je peux m'adapter à votre fuseau horaire si nécessaire. Pour le développement, je travaille souvent en soirée, ce qui me permet d'être ultra-réactif. Les urgences peuvent être traitées en week-end (moyennant supplément).",
        answer_en: "I'm available Monday to Friday, 9am-6pm for synchronous exchanges. I can adapt to your time zone if necessary. For development, I often work in the evening, which allows me to be ultra-responsive. Emergencies can be handled on weekends (with a surcharge).",
        categoryId: categoryMap["Communication"],
        keywords: ["horaires", "disponibilité", "timezone", "emploi du temps", "heures"],
        keywords_en: ["hours", "availability", "timezone", "schedule", "hours"],
        isPublished: true
      },
      {
        question: "Comment se passe le premier contact ?",
        question_en: "How does the first contact work?",
        answer: "Simple et rapide ! Vous me contactez via le formulaire ou par email. Je réponds sous 24h pour planifier un premier appel découverte de 30min (gratuit et sans engagement). On discute de votre projet, vos besoins, et votre budget. Ensuite, je vous envoie une proposition détaillée sous 48-72h. Transparent et efficace.",
        answer_en: "Simple and quick! You contact me via the form or email. I respond within 24 hours to schedule a first 30-minute discovery call (free and no commitment). We discuss your project, needs, and budget. Then I send you a detailed proposal within 48-72 hours. Transparent and efficient.",
        categoryId: categoryMap["Communication"],
        keywords: ["premier contact", "appel découverte", "rendez-vous", "consultation", "gratuit"],
        keywords_en: ["first-contact", "discovery-call", "appointment", "consultation", "free"],
        isPublished: true
      },

      // ========================================
      // TECHNIQUE (7 questions)
      // ========================================
      {
        question: "Mon site sera-t-il responsive et mobile-friendly ?",
        question_en: "Will my site be responsive and mobile-friendly?",
        answer: "Absolument ! Tous mes projets sont conçus en mobile-first : optimisés pour smartphones, tablettes, et desktop. Je teste sur tous les navigateurs (Chrome, Safari, Firefox) et appareils. Les performances sont optimisées avec Lighthouse score 90+ garantis. Votre site sera parfait sur tous les écrans.",
        answer_en: "Absolutely! All my projects are designed mobile-first: optimized for smartphones, tablets, and desktop. I test on all browsers (Chrome, Safari, Firefox) and devices. Performance is optimized with a guaranteed Lighthouse score of 90+. Your site will be perfect on all screens.",
        categoryId: categoryMap["Technique"],
        keywords: ["responsive", "mobile", "tablette", "adaptatif", "mobile-friendly"],
        keywords_en: ["responsive", "mobile", "tablet", "adaptive", "mobile-friendly"],
        isPublished: true
      },
      {
        question: "Le site sera-t-il optimisé pour le SEO ?",
        question_en: "Will the site be optimized for SEO?",
        answer: "Oui, j'intègre les bonnes pratiques SEO dès la conception : structure HTML sémantique, balises meta optimisées, sitemap XML, performance optimale, et markup Schema.org. Pour un accompagnement SEO complet (stratégie de contenu, netlinking), je peux vous recommander des experts partenaires.",
        answer_en: "Yes, I integrate SEO best practices from the start: semantic HTML structure, optimized meta tags, XML sitemap, optimal performance, and Schema.org markup. For complete SEO support (content strategy, link building), I can recommend partner experts.",
        categoryId: categoryMap["Technique"],
        keywords: ["seo", "référencement", "google", "optimisation", "visibilité"],
        keywords_en: ["seo", "search-engine-optimization", "google", "optimization", "visibility"],
        isPublished: true
      },
      {
        question: "Puis-je modifier le site moi-même après livraison ?",
        question_en: "Can I modify the site myself after delivery?",
        answer: "Tout dépend de la solution choisie : avec un CMS headless (Sanity, Strapi) ou un admin custom, vous pouvez modifier les contenus facilement. Je fournis une formation complète et une documentation détaillée. Pour les modifications techniques, je reste disponible en maintenance.",
        answer_en: "It depends on the chosen solution: with a headless CMS (Sanity, Strapi) or a custom admin, you can easily modify content. I provide complete training and detailed documentation. For technical modifications, I remain available for maintenance.",
        categoryId: categoryMap["Technique"],
        keywords: ["cms", "modification", "autonomie", "admin", "gestion contenu"],
        keywords_en: ["cms", "modification", "autonomy", "admin", "content-management"],
        isPublished: true
      },
      {
        question: "Quelles sont les performances garanties ?",
        question_en: "What performance is guaranteed?",
        answer: "Je vise l'excellence : Lighthouse score 90+ (Performance, Accessibilité, Best Practices, SEO), temps de chargement < 2s, optimisation des images (WebP, lazy loading), code splitting, et cache intelligent. Un site rapide améliore l'expérience utilisateur et votre SEO. Les performances sont testées et validées avant livraison.",
        answer_en: "I aim for excellence: Lighthouse score 90+ (Performance, Accessibility, Best Practices, SEO), loading time < 2s, image optimization (WebP, lazy loading), code splitting, and smart caching. A fast site improves user experience and your SEO. Performance is tested and validated before delivery.",
        categoryId: categoryMap["Technique"],
        keywords: ["performance", "vitesse", "lighthouse", "optimisation", "chargement", "speed"],
        keywords_en: ["performance", "speed", "lighthouse", "optimization", "loading", "speed"],
        isPublished: true
      },
      {
        question: "Mon site sera-t-il accessible (WCAG) ?",
        question_en: "Will my site be accessible (WCAG)?",
        answer: "Oui ! J'intègre les standards d'accessibilité WCAG 2.1 niveau AA : navigation au clavier, contraste des couleurs, textes alternatifs pour images, structure sémantique, et compatibilité screen readers. Un web accessible est un web pour tous. C'est inclus par défaut dans mes projets.",
        answer_en: "Yes! I integrate WCAG 2.1 Level AA accessibility standards: keyboard navigation, color contrast, alt text for images, semantic structure, and screen reader compatibility. An accessible web is a web for everyone. It's included by default in my projects.",
        categoryId: categoryMap["Technique"],
        keywords: ["accessibilité", "wcag", "handicap", "a11y", "inclusive", "screen reader"],
        keywords_en: ["accessibility", "wcag", "disability", "a11y", "inclusive", "screen-reader"],
        isPublished: true
      },
      {
        question: "Proposez-vous l'intégration d'APIs tierces ?",
        question_en: "Do you offer third-party API integration?",
        answer: "Absolument ! J'intègre tous types d'APIs : paiement (Stripe, PayPal), CRM (HubSpot, Salesforce), emailing (Mailchimp, SendGrid), analytics (Google Analytics, Mixpanel), réseaux sociaux, et APIs custom. Je gère l'authentification, les webhooks, et la gestion d'erreurs pour une intégration robuste.",
        answer_en: "Absolutely! I integrate all types of APIs: payment (Stripe, PayPal), CRM (HubSpot, Salesforce), emailing (Mailchimp, SendGrid), analytics (Google Analytics, Mixpanel), social media, and custom APIs. I handle authentication, webhooks, and error handling for robust integration.",
        categoryId: categoryMap["Technique"],
        keywords: ["api", "intégration", "stripe", "webhook", "services tiers", "connexion"],
        keywords_en: ["api", "integration", "stripe", "webhook", "third-party-services", "connection"],
        isPublished: true
      },
      {
        question: "Le code source sera-t-il documenté ?",
        question_en: "Will the source code be documented?",
        answer: "Oui, toujours ! Vous recevez : code commenté et propre, README détaillé avec instructions de setup, documentation des composants, guide de déploiement, et architecture du projet expliquée. Si vous avez une équipe technique, ils pourront reprendre le projet facilement. Code quality garantie.",
        answer_en: "Yes, always! You receive: clean, commented code, detailed README with setup instructions, component documentation, deployment guide, and explained project architecture. If you have a technical team, they can easily take over the project. Code quality guaranteed.",
        categoryId: categoryMap["Technique"],
        keywords: ["documentation", "code", "readme", "commentaires", "guide", "qualité"],
        keywords_en: ["documentation", "code", "readme", "comments", "guide", "quality"],
        isPublished: true
      },

      // ========================================
      // LÉGAL & SÉCURITÉ (5 questions)
      // ========================================
      {
        question: "Mes données et mon projet sont-ils sécurisés ?",
        question_en: "Are my data and project secure?",
        answer: "La sécurité est ma priorité : signature d'un NDA si nécessaire, hébergement sécurisé (SSL/HTTPS), backups réguliers, respect du RGPD, et code sécurisé (authentification, validation des données). Vos données ne sont jamais partagées. Je peux vous fournir un audit de sécurité sur demande.",
        answer_en: "Security is my priority: NDA signing if necessary, secure hosting (SSL/HTTPS), regular backups, GDPR compliance, and secure code (authentication, data validation). Your data is never shared. I can provide a security audit on request.",
        categoryId: categoryMap["Légal & Sécurité"],
        keywords: ["sécurité", "rgpd", "nda", "protection", "données", "confidentialité"],
        keywords_en: ["security", "gdpr", "nda", "protection", "data", "confidentiality"],
        isPublished: true
      },
      {
        question: "Qui possède les droits sur le code et le design ?",
        question_en: "Who owns the rights to the code and design?",
        answer: "À la livraison finale et au paiement intégral, vous devenez propriétaire à 100% du code source, design, et tous les assets du projet. Je conserve le droit de présenter le projet dans mon portfolio (sauf NDA). Un contrat clair précise tous les droits de propriété intellectuelle.",
        answer_en: "Upon final delivery and full payment, you become 100% owner of the source code, design, and all project assets. I retain the right to present the project in my portfolio (unless under NDA). A clear contract specifies all intellectual property rights.",
        categoryId: categoryMap["Légal & Sécurité"],
        keywords: ["droits", "propriété intellectuelle", "code source", "possession", "copyright"],
        keywords_en: ["rights", "intellectual-property", "source-code", "ownership", "copyright"],
        isPublished: true
      },
      {
        question: "Signons-nous un contrat ?",
        question_en: "Do we sign a contract?",
        answer: "Oui, systématiquement ! Avant tout projet, nous signons un contrat clair détaillant : scope du projet, livrables, délais, tarifs, conditions de paiement, propriété intellectuelle, et conditions d'annulation. Vous êtes protégé, je suis protégé. Tout est transparent et sécurisé juridiquement.",
        answer_en: "Yes, systematically! Before any project, we sign a clear contract detailing: project scope, deliverables, deadlines, rates, payment terms, intellectual property, and cancellation conditions. You're protected, I'm protected. Everything is transparent and legally secure.",
        categoryId: categoryMap["Légal & Sécurité"],
        keywords: ["contrat", "accord", "légal", "signature", "conditions", "cgv"],
        keywords_en: ["contract", "agreement", "legal", "signature", "terms", "tos"],
        isPublished: true
      },
      {
        question: "Êtes-vous assuré en responsabilité civile professionnelle ?",
        question_en: "Do you have professional liability insurance?",
        answer: "Oui ! Je dispose d'une assurance responsabilité civile professionnelle (RC Pro) qui couvre tous mes projets et clients. Vous êtes protégé en cas de dommages liés à mes prestations. Une attestation d'assurance peut vous être fournie sur demande. Sérénité garantie.",
        answer_en: "Yes! I have professional liability insurance (RC Pro) that covers all my projects and clients. You're protected in case of damages related to my services. An insurance certificate can be provided upon request. Peace of mind guaranteed.",
        categoryId: categoryMap["Légal & Sécurité"],
        keywords: ["assurance", "rc pro", "responsabilité civile", "protection", "garantie"],
        keywords_en: ["insurance", "liability", "professional-liability", "protection", "guarantee"],
        isPublished: true
      },
      {
        question: "Comment sont traitées les données personnelles (RGPD) ?",
        question_en: "How is personal data handled (GDPR)?",
        answer: "Je suis 100% conforme RGPD : politique de confidentialité claire, consentement explicite pour les cookies, droit d'accès et suppression des données, hébergement en Europe (OVH, Scaleway), et chiffrement des données sensibles. Je peux vous accompagner sur votre conformité RGPD si nécessaire.",
        answer_en: "I am 100% GDPR compliant: clear privacy policy, explicit cookie consent, right to access and delete data, European hosting (OVH, Scaleway), and encryption of sensitive data. I can support you with your GDPR compliance if needed.",
        categoryId: categoryMap["Légal & Sécurité"],
        keywords: ["rgpd", "données personnelles", "confidentialité", "cookies", "privacy", "dpo"],
        keywords_en: ["gdpr", "personal-data", "privacy", "cookies", "privacy", "dpo"],
        isPublished: true
      }
    ];

    console.log("📋 Creating FAQ questions with FR + EN translations...");
    let createdCount = 0;
    let errorCount = 0;

    for (const question of questions) {
      console.log(`🔄 Attempting to create question: "${question.question.substring(0, 40)}..."`);
      console.log(`   Category ID: ${question.categoryId}`);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(question),
        }
      );

      if (response.ok) {
        createdCount++;
        console.log(`✅ Created question: ${question.question.substring(0, 50)}... [FR + EN]`);
      } else {
        errorCount++;
        const errorText = await response.text();
        console.error(`❌ Failed to create question (${response.status}):`, errorText);
        console.error(`   Question data:`, JSON.stringify(question, null, 2));
      }
    }

    const totalQuestions = questions.length;
    const successRate = Math.round((createdCount / totalQuestions) * 100);

    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ${createdCount === totalQuestions ? '✅' : '⚠️'} FAQ MULTILINGUAL SEEDING ${createdCount === totalQuestions ? 'COMPLETED' : 'PARTIAL'}!                ${createdCount === totalQuestions ? ' ' : ''}  ║
╚════════════════════════════════════════════════════════════╝

📊 Results:
  • ${createdCategories.length} categories created
  • ${createdCount}/${totalQuestions} questions created (${successRate}% success)
  ${errorCount > 0 ? `  ❌ ${errorCount} errors` : ''}
  
${createdCount === totalQuestions ? `📂 Breakdown:
  • Services: 8 questions
  • Tarifs & Paiement: 6 questions
  • Processus & Délais: 6 questions
  • Communication: 5 questions
  • Technique: 7 questions
  • Légal & Sécurité: 5 questions
  
🌐 Languages:
  • All questions include FR and EN translations
  • Keywords translated for both languages
  • FAQ page automatically switches based on language` : `
⚠️ ERREURS DÉTECTÉES
────────────────────────────────────────────────────────────
${errorCount} questions n'ont pas pu être créées.

🔍 Vérifiez les logs ci-dessus pour les détails.

💡 SOLUTION :
   1. Redéployer le serveur : 
      supabase functions deploy make-server-04919ac5
   
   2. Réessayer : Dashboard → FAQ → "Initialiser FAQ"
   
📋 Guide : /FAQ_ERREUR_400_FIX.txt
`}
    `);
    return { categories: createdCategories.length, questions: createdCount, errors: errorCount };
  } catch (error) {
    console.error("❌ Error seeding FAQ data:", error);
    throw error;
  }
}

// Make it available globally for testing in console
if (typeof window !== "undefined") {
  (window as any).seedFAQData = seedFAQData;
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🟣 FAQ MULTILINGUAL SEED - READY TO USE                  ║
╠════════════════════════════════════════════════════════════╣
║  📚 To initialize FAQ (37 bilingual questions):           ║
║     await window.seedFAQData()                             ║
║                                                            ║
║  ✨ Content:                                               ║
║     • 6 professional categories                           ║
║     • 37 detailed questions in FR + EN                    ║
║     • SEO-optimized keywords in both languages            ║
║                                                            ║
║  🎯 Access via Dashboard:                                 ║
║     Dashboard > Content > FAQ                             ║
║     → Purple-pink gradient button 🟣                      ║
║                                                            ║
║  🌐 Translation:                                           ║
║     • Each question has question_en + answer_en           ║
║     • Keywords translated (keywords_en)                   ║
║     • FAQ page auto-switches with language selector      ║
╚════════════════════════════════════════════════════════════╝
  `);
}
