/**
 * Shared Type Definitions for Utils
 * Centralized types to replace 'any' across the codebase
 */

// ============================================================================
// Error Types
// ============================================================================

export interface ErrorWithMessage {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export type UnknownError = Error | ErrorWithMessage | { toString(): string };

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return {
      message: JSON.stringify(maybeError),
    };
  } catch {
    return {
      message: String(maybeError),
    };
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

// ============================================================================
// Test/Diagnostic Types
// ============================================================================

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
  error?: string;
  data?: unknown;
}

export interface DiagnosticResult {
  status: 'success' | 'error' | 'warning';
  component: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface DiagnosticResults {
  overall: 'success' | 'partial' | 'failed';
  timestamp: string;
  tests: DiagnosticResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

// ============================================================================
// Database Record Types
// ============================================================================

export interface DatabaseRecord {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project extends DatabaseRecord {
  name: string;
  name_en?: string;
  name_fr?: string;
  description: string;
  description_en?: string;
  description_fr?: string;
  imageUrl?: string;
  technologies: string[];
  category?: string;
  isPinned?: boolean;
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
}

export interface CaseStudyMetric {
  label: string;
  label_en?: string;
  label_fr?: string;
  value: string;
  icon?: string;
}

export interface CaseStudy extends DatabaseRecord {
  title: string;
  title_en?: string;
  title_fr?: string;
  slug: string;
  description?: string;
  client?: string;
  industry?: string;
  duration?: string;
  imageUrl?: string;
  challenge?: {
    title?: string;
    description?: string;
    painPoints?: string[];
  };
  solution?: {
    title?: string;
    description?: string;
    approach?: string[];
  };
  results?: {
    title?: string;
    description?: string;
    metrics?: CaseStudyMetric[];
  };
  technologies?: string[];
  process?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company?: string;
  };
  featured?: boolean;
}

export interface Resource extends DatabaseRecord {
  title: string;
  title_en?: string;
  title_fr?: string;
  description: string;
  description_en?: string;
  description_fr?: string;
  url: string;
  category: string;
  type: 'article' | 'video' | 'tool' | 'course' | 'book';
  tags?: string[];
  imageUrl?: string;
  featured?: boolean;
}

export interface FAQCategory extends DatabaseRecord {
  name: string;
  name_en?: string;
  name_fr?: string;
  icon?: string;
  order?: number;
}

export interface FAQQuestion extends DatabaseRecord {
  question: string;
  question_en?: string;
  question_fr?: string;
  answer: string;
  answer_en?: string;
  answer_fr?: string;
  category_id: string;
  order?: number;
}

export interface Client extends DatabaseRecord {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  website?: string;
  status?: 'lead' | 'active' | 'inactive';
  notes?: string;
}

export interface Subscriber extends DatabaseRecord {
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed';
  tags?: string[];
  subscribed_at?: string;
}

// ============================================================================
// Form/Validation Types
// ============================================================================

export interface FormErrors {
  [fieldName: string]: string | string[] | undefined;
}

export interface FieldError {
  message: string;
  path: string[];
}

export type ValidationErrors = Record<string, string>;

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// BeforeInstallPromptEvent (PWA)
// ============================================================================

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
}

export interface ConversionEvent {
  type: string;
  value?: number;
  source?: string;
  timestamp: string;
}

// ============================================================================
// KV Store Types
// ============================================================================

export type KVValue = string | number | boolean | object | null;

export interface KVStorageData {
  projects?: Project[];
  caseStudies?: CaseStudy[];
  resources?: Resource[];
  faqCategories?: FAQCategory[];
  faqQuestions?: FAQQuestion[];
  clients?: Client[];
  subscribers?: Subscriber[];
}

// ============================================================================
// Migration Types
// ============================================================================

export interface MigrationResult {
  success: boolean;
  message: string;
  changes?: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }>;
  migratedCount?: number;
  errors?: string[];
}

// ============================================================================
// Bilingual Types
// ============================================================================

export interface BilingualText {
  fr: string;
  en: string;
}

export interface BilingualContent<T> {
  fr: T;
  en: T;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isDatabaseRecord(value: unknown): value is DatabaseRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as DatabaseRecord).id === 'string'
  );
}

export function isProject(value: unknown): value is Project {
  return (
    isDatabaseRecord(value) &&
    'name' in value &&
    'description' in value &&
    'technologies' in value &&
    Array.isArray((value as Project).technologies)
  );
}

export function isCaseStudy(value: unknown): value is CaseStudy {
  return (
    isDatabaseRecord(value) &&
    'title' in value &&
    'slug' in value &&
    typeof (value as CaseStudy).slug === 'string'
  );
}

export function isResource(value: unknown): value is Resource {
  return (
    isDatabaseRecord(value) &&
    'title' in value &&
    'url' in value &&
    'category' in value &&
    'type' in value
  );
}
