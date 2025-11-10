// Configuration des informations freelance
// Informations de FOULON Maxence

export interface FreelanceInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  siret?: string;
  tva?: string;
  iban?: string;
  bic?: string;
  legalStatus?: string;
  legalEntity?: string;
  tvaApplicable: boolean;
  legalMentions?: {
    registration?: string;
    tva?: string;
    tvaExemption?: string;
    latePenalties?: string;
    penaltiesNote?: string;
  };
}

export interface CaseStudyMetric {
  label: string;
  label_en?: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export interface CaseStudyTestimonial {
  quote: string;
  quote_en?: string;
  author: string;
  role: string;
  role_en?: string;
  company: string;
  avatar?: string;
}

export interface CaseStudyStep {
  phase: string;
  phase_en?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  duration: string;
  duration_en?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  title_en?: string;
  client: string;
  category: string;
  category_en?: string;
  year: string;
  featured: boolean;
  thumbnail: string;
  
  // Hero Section
  tagline: string;
  tagline_en?: string;
  description: string;
  description_en?: string;
  tags: string[];
  tags_en?: string[];
  
  // Challenge Section
  challenge: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    painPoints: string[];
    painPoints_en?: string[];
  };
  
  // Solution Section
  solution: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    approach: string[];
    approach_en?: string[];
    technologies: string[];
  };
  
  // Results Section
  results: {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    metrics: CaseStudyMetric[];
  };
  
  // Testimonial
  testimonial: CaseStudyTestimonial;
  
  // Process
  process: CaseStudyStep[];
  
  // Visual Content
  images: string[];
  video?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export const freelanceInfo: FreelanceInfo = {
  name: "FOULON Maxence",
  email: "contact@maxence.design",
  phone: "+33 6 19 32 62 26",
  address: "33 Route Du Mans, 72650 La Milesse, France",
  siret: "937 638 492 00010",
  tva: "Non applicable", // Micro-entrepreneur
  
  // Informations bancaires
  iban: "FR76 2823 3000 0195 1140 4606 069",
  bic: "", // À remplir si nécessaire
  
  // Informations légales
  legalStatus: "Micro-entrepreneur",
  legalEntity: "Entreprise Individuelle - FOULON Maxence",
  tvaApplicable: false,
  
  // Mentions légales obligatoires
  legalMentions: {
    registration: "Micro entrepreneur enregistré sous le numéro 937 638 492 00010",
    tva: "Numéro de TVA Intracommunautaire : non applicable",
    tvaExemption: "TVA non applicable, article 293 B du CGI",
    latePenalties: "Le paiement est dû à la date d'échéance. Tout règlement effectué après expiration du délai donnera lieu, à titre de pénalité de retard, à la facturation d'un intérêt de retard égal à trois fois le taux d'intérêt légal en vigueur en France, à compter de la date d'exigibilité de cette présente facture jusqu'à la date de paiement effectif, ainsi qu'à une indemnité forfaitaire pour frais de recouvrement d'un montant de 40 €.",
    penaltiesNote: "Les pénalités de retard sont exigibles sans qu'un rappel soit nécessaire."
  }
};
