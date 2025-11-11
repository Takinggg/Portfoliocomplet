import { z } from "zod";

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres"),
  
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+\d\s()-]{8,20}$/.test(val),
      "Numéro de téléphone invalide"
    ),
  
  company: z
    .string()
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères")
    .optional(),
  
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  
  budget: z
    .string()
    .optional(),
  
  timeline: z
    .string()
    .optional(),
  
  wantsAppointment: z
    .boolean()
    .optional(),
  
  acceptsTerms: z
    .boolean()
    .refine((val) => val === true, "Vous devez accepter les conditions")
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter Form Schema
export const newsletterFormSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .optional(),
  
  acceptsMarketing: z
    .boolean()
    .refine((val) => val === true, "Vous devez accepter de recevoir la newsletter")
});

export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

// Booking Form Schema
export const bookingFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide"),
  
  phone: z
    .string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
    .regex(/^[+\d\s()-]+$/, "Numéro de téléphone invalide"),
  
  company: z
    .string()
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères")
    .optional(),
  
  meetingType: z
    .enum(["discovery", "consulting", "demo", "follow-up"], {
      message: "Veuillez sélectionner un type de rendez-vous"
    }),
  
  date: z
    .string()
    .min(1, "Veuillez sélectionner une date"),
  
  time: z
    .string()
    .min(1, "Veuillez sélectionner une heure"),
  
  duration: z
    .enum(["30", "60", "90"], {
      message: "Veuillez sélectionner une durée"
    }),
  
  timezone: z
    .string()
    .default("Europe/Paris"),
  
  notes: z
    .string()
    .max(500, "Les notes ne peuvent pas dépasser 500 caractères")
    .optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

// Login Form Schema
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide"),
  
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères")
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Quote Request Schema
export const quoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide"),
  
  company: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"),
  
  projectType: z
    .enum(["website", "webapp", "ecommerce", "mobile", "api", "other"], {
      message: "Veuillez sélectionner un type de projet"
    }),
  
  budget: z
    .enum(["<5k", "5k-10k", "10k-25k", "25k-50k", ">50k"], {
      message: "Veuillez sélectionner une fourchette budgétaire"
    }),
  
  timeline: z
    .enum(["urgent", "1month", "3months", "6months", "flexible"], {
      message: "Veuillez sélectionner un délai"
    }),
  
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères"),
  
  features: z
    .array(z.string())
    .min(1, "Veuillez sélectionner au moins une fonctionnalité")
    .optional(),
  
  referral: z
    .string()
    .max(100, "La source de référence ne peut pas dépasser 100 caractères")
    .optional(),
});

export type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

// Form error types
export interface FormFieldError {
  message: string;
  type?: string;
}

export type FormErrors = Record<string, FormFieldError | undefined>;

// Helper function to get field error message
export function getFieldError(
  errors: FormErrors,
  fieldName: string
): string | undefined {
  const error = errors[fieldName];
  return error?.message;
}

// Helper function to check if field has error
export function hasFieldError(errors: FormErrors, fieldName: string): boolean {
  return !!errors[fieldName];
}

// Helper to format Zod errors for display
export function formatZodError(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
}
