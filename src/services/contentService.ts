import { createClient } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";

const supabase = createClient();

export interface Project {
  id: string;
  title_fr: string;
  title_en?: string;
  description_fr: string;
  description_en?: string;
  slug_fr?: string;
  slug_en?: string;
  technologies: string[];
  category: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  images: string[];
  coverImage: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  clientName_fr?: string;
  clientName_en?: string;
  duration?: string;
  year?: number;
  tags_fr?: string[];
  tags_en?: string[];
  challenges_fr?: string[];
  challenges_en?: string[];
  features_fr?: string[];
  features_en?: string[];
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title_fr: string;
  title_en: string;
  slug_fr: string;
  slug_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  coverImage: string;
  category_fr: string;
  category_en: string;
  tags_fr: string[];
  tags_en: string[];
  status: "draft" | "published";
  readTime_fr?: number;
  readTime_en?: number;
  seo_description_fr?: string;
  seo_description_en?: string;
  seo_keywords_fr?: string[];
  seo_keywords_en?: string[];
  views?: number;
  viewsByLang?: { fr: number; en: number };
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  coverImage: string;
  images: string[];
  testimonial?: string;
  year: number;
  duration: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  message: string;
  rating?: number;
  avatar?: string;
  approved: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "video" | "link" | "download";
  url: string;
  thumbnail?: string;
  category?: string;
  downloadCount?: number;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  createdAt: string;
}

class ContentService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        "Content-Type": "application/json"
      }
    });
  }

  // ============================================
  // PROJECTS
  // ============================================
  async getProjects(): Promise<Project[]> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`
    );
    const data = await response.json();
    return data.success ? (data.projects || []) : [];
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
      {
        method: "POST",
        body: JSON.stringify(project)
      }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates)
      }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.project;
  }

  async deleteProject(id: string): Promise<void> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects/${id}`,
      { method: "DELETE" }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  }

  // ============================================
  // BLOG POSTS
  // ============================================
  async getBlogPosts(status?: "draft" | "published" | "all"): Promise<BlogPost[]> {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts${status ? `?status=${status}` : '?status=all'}`;
    const response = await this.fetchWithAuth(url);
    const data = await response.json();
    return data.success ? (data.posts || []) : [];
  }

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts`,
      {
        method: "POST",
        body: JSON.stringify(post)
      }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.post;
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates)
      }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.post;
  }

  async deleteBlogPost(id: string): Promise<void> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/blog/posts/${id}`,
      { method: "DELETE" }
    );
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  }

  // ============================================
  // CASE STUDIES
  // ============================================
  async getCaseStudies(): Promise<CaseStudy[]> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`
    );
    const data = await response.json();
    return data.success ? (data.caseStudies || []) : [];
  }

  // ============================================
  // TESTIMONIALS
  // ============================================
  async getTestimonials(): Promise<Testimonial[]> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/testimonials/admin`
    );
    const data = await response.json();
    return data.success ? (data.testimonials || []) : [];
  }

  // ============================================
  // RESOURCES
  // ============================================
  async getResources(): Promise<Resource[]> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/resources`
    );
    const data = await response.json();
    return data.success ? (data.resources || []) : [];
  }

  // ============================================
  // FAQ
  // ============================================
  async getFAQ(): Promise<FAQ[]> {
    const response = await this.fetchWithAuth(
      `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/faq`
    );
    const data = await response.json();
    return data.success ? (data.questions || []) : [];
  }
}

export const contentService = new ContentService();
