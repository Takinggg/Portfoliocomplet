import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  FileText,
  Briefcase,
  BookOpen,
  Eye,
  Send,
  Sparkles,
  Calendar,
  TrendingUp,
  Mail,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner@2.0.3";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  link?: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverImage?: string;
}

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  thumbnail?: string;
}

type TemplateType = "project" | "blog" | "case-study" | "digest" | "announcement";

interface Template {
  id: TemplateType;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const templates: Template[] = [
  {
    id: "project",
    title: "Nouveau Projet",
    description: "Annoncez un nouveau projet à vos abonnés",
    icon: Briefcase,
    color: "#00FFC2",
  },
  {
    id: "blog",
    title: "Nouveau Article",
    description: "Partagez votre dernier article de blog",
    icon: BookOpen,
    color: "#3B82F6",
  },
  {
    id: "case-study",
    title: "Étude de Cas",
    description: "Présentez une nouvelle étude de cas",
    icon: FileText,
    color: "#8B5CF6",
  },
  {
    id: "digest",
    title: "Digest Mensuel",
    description: "Résumé de plusieurs contenus",
    icon: Layers,
    color: "#F59E0B",
  },
  {
    id: "announcement",
    title: "Annonce",
    description: "Message personnalisé avec un appel à l'action",
    icon: Sparkles,
    color: "#EC4899",
  },
];

export function NewsletterTemplatesTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [selectedCaseStudies, setSelectedCaseStudies] = useState<string[]>([]);
  
  const [customTitle, setCustomTitle] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    try {
      // Load projects
      const projectsData = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/projects`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      if (projectsData.ok) {
        const data = await projectsData.json();
        setProjects(data.projects || []);
        console.log("✅ Projets chargés:", data.projects?.length || 0);
      } else {
        console.error("❌ Erreur chargement projets:", projectsData.status);
      }

      // Load blogs using blogService
      try {
        const { fetchBlogPosts } = await import("../../utils/blogService");
        const { posts: loadedPosts, mode } = await fetchBlogPosts("fr");
        setBlogs(loadedPosts);
        console.log(`✅ Blogs chargés (${mode} mode):`, loadedPosts.length);
      } catch (error) {
        console.error("❌ Erreur chargement blogs:", error);
        setBlogs([]);
      }

      // Load case studies
      const caseStudiesData = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/case-studies`,
        {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }
      );
      if (caseStudiesData.ok) {
        const data = await caseStudiesData.json();
        setCaseStudies(data.caseStudies || []);
        console.log("✅ Études de cas chargées:", data.caseStudies?.length || 0);
      } else {
        console.error("❌ Erreur chargement études de cas:", caseStudiesData.status);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Erreur lors du chargement du contenu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    // Reset selections
    setSelectedProjects([]);
    setSelectedBlogs([]);
    setSelectedCaseStudies([]);
    setCustomTitle("");
    setCustomMessage("");
  };

  const toggleSelection = (
    type: "project" | "blog" | "case-study",
    id: string
  ) => {
    if (type === "project") {
      setSelectedProjects((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    } else if (type === "blog") {
      setSelectedBlogs((prev) =>
        prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
      );
    } else if (type === "case-study") {
      setSelectedCaseStudies((prev) =>
        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
      );
    }
  };

  const generateEmailContent = (): {
    subject: string;
    html: string;
    text: string;
  } => {
    const frontendUrl = "https://maxence.design";
    let subject = "";
    let htmlContent = "";
    let textContent = "";

    if (selectedTemplate === "project") {
      const project = projects.find((p) => p.id === selectedProjects[0]);
      if (project) {
        subject = `✨ Nouveau projet : ${project.title}`;
        htmlContent = `
          <h2 style="color: #00FFC2; margin-bottom: 20px;">Nouveau projet disponible !</h2>
          
          <div style="background: #F4F4F4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;" />` : ""}
            <h3 style="margin: 0 0 10px 0; color: #0C0C0C;">${project.title}</h3>
            <p style="color: #666; margin: 0 0 15px 0;">${project.description}</p>
            ${project.tags ? `<p style="font-size: 14px; color: #00FFC2;">${project.tags.join(" • ")}</p>` : ""}
          </div>
          
          <p>Je suis ravi de partager ce nouveau projet avec vous !</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}" style="display: inline-block; background: #00FFC2; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Découvrir le projet
            </a>
          </div>
        `;
        textContent = `Nouveau projet : ${project.title}\n\n${project.description}\n\nDécouvrir : ${frontendUrl}`;
      }
    } else if (selectedTemplate === "blog") {
      const blog = blogs.find((b) => b.id === selectedBlogs[0]);
      if (blog) {
        subject = `📚 Nouvel article : ${blog.title}`;
        htmlContent = `
          <h2 style="color: #3B82F6; margin-bottom: 20px;">Nouvel article de blog</h2>
          
          <div style="background: #F4F4F4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;" />` : ""}
            <p style="font-size: 12px; color: #00FFC2; text-transform: uppercase; margin: 0 0 10px 0;">${blog.category}</p>
            <h3 style="margin: 0 0 10px 0; color: #0C0C0C;">${blog.title}</h3>
            <p style="color: #666; margin: 0;">${blog.excerpt}</p>
          </div>
          
          <p>J'espère que cet article vous sera utile !</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/blog/${blog.slug}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Lire l'article
            </a>
          </div>
        `;
        textContent = `Nouvel article : ${blog.title}\n\n${blog.excerpt}\n\nLire : ${frontendUrl}/blog/${blog.slug}`;
      }
    } else if (selectedTemplate === "case-study") {
      const caseStudy = caseStudies.find((c) => c.id === selectedCaseStudies[0]);
      if (caseStudy) {
        subject = `💼 Étude de cas : ${caseStudy.title}`;
        htmlContent = `
          <h2 style="color: #8B5CF6; margin-bottom: 20px;">Nouvelle étude de cas</h2>
          
          <div style="background: #F4F4F4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${caseStudy.thumbnail ? `<img src="${caseStudy.thumbnail}" alt="${caseStudy.title}" style="width: 100%; border-radius: 8px; margin-bottom: 15px;" />` : ""}
            <p style="font-size: 12px; color: #8B5CF6; text-transform: uppercase; margin: 0 0 5px 0;">${caseStudy.category}</p>
            <h3 style="margin: 0 0 5px 0; color: #0C0C0C;">${caseStudy.title}</h3>
            <p style="color: #666; margin: 0 0 10px 0; font-style: italic;">${caseStudy.subtitle}</p>
            <p style="font-size: 14px; color: #00FFC2; margin: 0;">Client : ${caseStudy.client}</p>
          </div>
          
          <p>Découvrez comment j'ai aidé ${caseStudy.client} à atteindre ses objectifs.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/case-studies/${caseStudy.slug}" style="display: inline-block; background: #8B5CF6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Voir l'étude de cas
            </a>
          </div>
        `;
        textContent = `Étude de cas : ${caseStudy.title}\n\n${caseStudy.subtitle}\n\nClient : ${caseStudy.client}\n\nVoir : ${frontendUrl}/case-studies/${caseStudy.slug}`;
      }
    } else if (selectedTemplate === "digest") {
      subject = customTitle || "📬 Votre digest mensuel";
      
      let digestHTML = "";
      let digestText = customMessage ? `${customMessage}\n\n` : "";

      // Add selected projects
      if (selectedProjects.length > 0) {
        digestHTML += `<h3 style="color: #00FFC2; margin: 30px 0 15px 0;">🚀 Nouveaux Projets</h3>`;
        digestText += `🚀 Nouveaux Projets\n`;
        
        selectedProjects.forEach((id) => {
          const project = projects.find((p) => p.id === id);
          if (project) {
            digestHTML += `
              <div style="background: #F4F4F4; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 8px 0; color: #0C0C0C;">${project.title}</h4>
                <p style="margin: 0; color: #666; font-size: 14px;">${project.description}</p>
              </div>
            `;
            digestText += `- ${project.title}\n  ${project.description}\n\n`;
          }
        });
      }

      // Add selected blogs
      if (selectedBlogs.length > 0) {
        digestHTML += `<h3 style="color: #3B82F6; margin: 30px 0 15px 0;">📚 Nouveaux Articles</h3>`;
        digestText += `📚 Nouveaux Articles\n`;
        
        selectedBlogs.forEach((id) => {
          const blog = blogs.find((b) => b.id === id);
          if (blog) {
            digestHTML += `
              <div style="background: #F4F4F4; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <span style="font-size: 12px; color: #3B82F6; text-transform: uppercase;">${blog.category}</span>
                <h4 style="margin: 5px 0 8px 0; color: #0C0C0C;">${blog.title}</h4>
                <p style="margin: 0; color: #666; font-size: 14px;">${blog.excerpt}</p>
                <a href="${frontendUrl}/blog/${blog.slug}" style="color: #3B82F6; text-decoration: none; font-size: 14px; margin-top: 8px; display: inline-block;">Lire →</a>
              </div>
            `;
            digestText += `- ${blog.title}\n  ${blog.excerpt}\n  Lire : ${frontendUrl}/blog/${blog.slug}\n\n`;
          }
        });
      }

      // Add selected case studies
      if (selectedCaseStudies.length > 0) {
        digestHTML += `<h3 style="color: #8B5CF6; margin: 30px 0 15px 0;">💼 Études de Cas</h3>`;
        digestText += `💼 Études de Cas\n`;
        
        selectedCaseStudies.forEach((id) => {
          const caseStudy = caseStudies.find((c) => c.id === id);
          if (caseStudy) {
            digestHTML += `
              <div style="background: #F4F4F4; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <span style="font-size: 12px; color: #8B5CF6; text-transform: uppercase;">${caseStudy.category}</span>
                <h4 style="margin: 5px 0 5px 0; color: #0C0C0C;">${caseStudy.title}</h4>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; font-style: italic;">${caseStudy.subtitle}</p>
                <a href="${frontendUrl}/case-studies/${caseStudy.slug}" style="color: #8B5CF6; text-decoration: none; font-size: 14px; display: inline-block;">Voir l'étude →</a>
              </div>
            `;
            digestText += `- ${caseStudy.title}\n  ${caseStudy.subtitle}\n  Voir : ${frontendUrl}/case-studies/${caseStudy.slug}\n\n`;
          }
        });
      }

      htmlContent = `
        ${customMessage ? `<p style="font-size: 16px; margin-bottom: 20px;">${customMessage.replace(/\n/g, "<br>")}</p>` : ""}
        ${digestHTML}
        <div style="text-align: center; margin: 40px 0 20px 0;">
          <a href="${frontendUrl}" style="display: inline-block; background: #00FFC2; color: #0C0C0C; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Voir tout sur le site
          </a>
        </div>
      `;
      textContent = digestText + `\nVoir tout : ${frontendUrl}`;
    } else if (selectedTemplate === "announcement") {
      subject = customTitle || "📢 Annonce importante";
      htmlContent = `
        <h2 style="color: #EC4899; margin-bottom: 20px;">${customTitle || "Annonce"}</h2>
        <p style="font-size: 16px; line-height: 1.6;">${customMessage.replace(/\n/g, "<br>")}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}" style="display: inline-block; background: #EC4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
            En savoir plus
          </a>
        </div>
      `;
      textContent = `${customTitle || "Annonce"}\n\n${customMessage}\n\nEn savoir plus : ${frontendUrl}`;
    }

    return { subject, html: htmlContent, text: textContent };
  };

  const getPreviewHTML = () => {
    const { subject, html } = generateEmailContent();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #0C0C0C;
              margin: 0;
              padding: 0;
              background-color: #F4F4F4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #0C0C0C 0%, #1a1a1a 100%);
              color: #00FFC2;
              padding: 40px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: white;
              padding: 40px 30px;
              border-radius: 0 0 8px 8px;
            }
            .footer {
              background: #0C0C0C;
              color: #00FFC2;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .unsubscribe {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #999;
            }
            .unsubscribe a {
              color: #00FFC2;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ ${subject}</h1>
            </div>
            <div class="content">
              ${html}
              
              <div class="unsubscribe">
                <p>Vous recevez cet email car vous êtes inscrit à notre newsletter.</p>
                <p><a href="{{unsubscribe_url}}">Se désabonner</a></p>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2025 Portfolio Freelance - Tous droits réservés</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleUseTemplate = () => {
    console.log("🚀 Bouton 'Utiliser ce template' cliqué");
    
    const { subject, html, text } = generateEmailContent();
    
    console.log("📧 Contenu généré:");
    console.log("  Subject:", subject);
    console.log("  HTML length:", html?.length || 0);
    console.log("  Text length:", text?.length || 0);
    
    if (!subject || !html) {
      console.error("❌ Contenu invalide - subject ou html vide");
      toast.error("Veuillez sélectionner au moins un élément");
      return;
    }

    // Store in localStorage to pass to campaign tab
    localStorage.setItem("newsletter_draft_subject", subject);
    localStorage.setItem("newsletter_draft_html", html);
    localStorage.setItem("newsletter_draft_text", text);
    
    console.log("✅ Données sauvegardées dans localStorage");
    console.log("  Keys:", Object.keys(localStorage).filter(k => k.startsWith("newsletter_draft")));
    
    toast.success("Template chargé ! Allez dans l'onglet 'Envoyer une campagne'");
    
    // Trigger custom event to notify campaign tab
    window.dispatchEvent(new CustomEvent("newsletter-template-selected"));
    console.log("📢 Événement 'newsletter-template-selected' déclenché");
  };

  const canGenerate = () => {
    if (selectedTemplate === "project") return selectedProjects.length === 1;
    if (selectedTemplate === "blog") return selectedBlogs.length === 1;
    if (selectedTemplate === "case-study") return selectedCaseStudies.length === 1;
    if (selectedTemplate === "digest") {
      return selectedProjects.length > 0 || selectedBlogs.length > 0 || selectedCaseStudies.length > 0;
    }
    if (selectedTemplate === "announcement") return customTitle && customMessage;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white mb-2">Templates d'Emails</h2>
        <p className="text-white/60">
          Créez rapidement des emails avec vos contenus
        </p>
      </div>

      {!selectedTemplate ? (
        /* Template Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="bg-white/5 border-white/10 p-6 cursor-pointer hover:border-[#00FFC2]/50 transition-all"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: template.color }} />
                  </div>
                  <h3 className="text-white mb-2">{template.title}</h3>
                  <p className="text-sm text-white/60">{template.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Template Editor */
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setSelectedTemplate(null)}
            className="border-white/10 text-white/60 hover:text-white"
          >
            ← Retour aux templates
          </Button>

          {/* Template Title */}
          <Card className="bg-white/5 border-white/10 p-6">
            <div className="flex items-center gap-4">
              {(() => {
                const template = templates.find((t) => t.id === selectedTemplate);
                const Icon = template?.icon;
                return (
                  <>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${template?.color}20` }}
                    >
                      {Icon && <Icon className="h-6 w-6" style={{ color: template?.color }} />}
                    </div>
                    <div>
                      <h3 className="text-white">{template?.title}</h3>
                      <p className="text-sm text-white/60">{template?.description}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </Card>

          {/* Custom Fields for Digest & Announcement */}
          {(selectedTemplate === "digest" || selectedTemplate === "announcement") && (
            <Card className="bg-white/5 border-white/10 p-6 space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">
                  Titre de l'email *
                </label>
                <Input
                  placeholder="Ex: 📬 Votre digest mensuel"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              {selectedTemplate === "announcement" && (
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Message *
                  </label>
                  <textarea
                    placeholder="Votre message d'annonce..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full min-h-[150px] bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white resize-none"
                  />
                </div>
              )}
              {selectedTemplate === "digest" && (
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Introduction (optionnel)
                  </label>
                  <textarea
                    placeholder="Message d'introduction pour votre digest..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white resize-none"
                  />
                </div>
              )}
            </Card>
          )}

          {/* Content Selection */}
          {selectedTemplate !== "announcement" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Projects */}
              {(selectedTemplate === "project" || selectedTemplate === "digest") && (
                <Card className="bg-white/5 border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-[#00FFC2]" />
                    <h3 className="text-white">Projets</h3>
                    <Badge variant="outline" className="ml-auto">
                      {selectedProjects.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                      <p className="text-sm text-white/40">Chargement...</p>
                    ) : projects.length === 0 ? (
                      <p className="text-sm text-white/40">Aucun projet</p>
                    ) : (
                      projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            if (selectedTemplate === "project") {
                              setSelectedProjects([project.id]);
                            } else {
                              toggleSelection("project", project.id);
                            }
                          }}
                        >
                          {selectedTemplate === "digest" && (
                            <Checkbox
                              checked={selectedProjects.includes(project.id)}
                              onCheckedChange={() => toggleSelection("project", project.id)}
                              className="mt-1"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{project.title}</p>
                            <p className="text-xs text-white/40 truncate">{project.description}</p>
                          </div>
                          {selectedTemplate === "project" && selectedProjects.includes(project.id) && (
                            <CheckCircle2 className="h-4 w-4 text-[#00FFC2] flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}

              {/* Blogs */}
              {(selectedTemplate === "blog" || selectedTemplate === "digest") && (
                <Card className="bg-white/5 border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-[#3B82F6]" />
                    <h3 className="text-white">Articles</h3>
                    <Badge variant="outline" className="ml-auto">
                      {selectedBlogs.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                      <p className="text-sm text-white/40">Chargement...</p>
                    ) : blogs.length === 0 ? (
                      <p className="text-sm text-white/40">Aucun article</p>
                    ) : (
                      blogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            if (selectedTemplate === "blog") {
                              setSelectedBlogs([blog.id]);
                            } else {
                              toggleSelection("blog", blog.id);
                            }
                          }}
                        >
                          {selectedTemplate === "digest" && (
                            <Checkbox
                              checked={selectedBlogs.includes(blog.id)}
                              onCheckedChange={() => toggleSelection("blog", blog.id)}
                              className="mt-1"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#3B82F6] mb-1">{blog.category}</p>
                            <p className="text-sm text-white truncate">{blog.title}</p>
                          </div>
                          {selectedTemplate === "blog" && selectedBlogs.includes(blog.id) && (
                            <CheckCircle2 className="h-4 w-4 text-[#3B82F6] flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}

              {/* Case Studies */}
              {(selectedTemplate === "case-study" || selectedTemplate === "digest") && (
                <Card className="bg-white/5 border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-[#8B5CF6]" />
                    <h3 className="text-white">Études de Cas</h3>
                    <Badge variant="outline" className="ml-auto">
                      {selectedCaseStudies.length}
                    </Badge>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                      <p className="text-sm text-white/40">Chargement...</p>
                    ) : caseStudies.length === 0 ? (
                      <p className="text-sm text-white/40">Aucune étude</p>
                    ) : (
                      caseStudies.map((caseStudy) => (
                        <div
                          key={caseStudy.id}
                          className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => {
                            if (selectedTemplate === "case-study") {
                              setSelectedCaseStudies([caseStudy.id]);
                            } else {
                              toggleSelection("case-study", caseStudy.id);
                            }
                          }}
                        >
                          {selectedTemplate === "digest" && (
                            <Checkbox
                              checked={selectedCaseStudies.includes(caseStudy.id)}
                              onCheckedChange={() => toggleSelection("case-study", caseStudy.id)}
                              className="mt-1"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#8B5CF6] mb-1">{caseStudy.category}</p>
                            <p className="text-sm text-white truncate">{caseStudy.title}</p>
                          </div>
                          {selectedTemplate === "case-study" && selectedCaseStudies.includes(caseStudy.id) && (
                            <CheckCircle2 className="h-4 w-4 text-[#8B5CF6] flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!canGenerate()}
              className="border-[#00FFC2]/30 text-[#00FFC2] hover:bg-[#00FFC2]/10"
            >
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button
              onClick={() => {
                console.log("🔵 BOUTON CLIQUÉ !");
                console.log("  selectedTemplate:", selectedTemplate);
                console.log("  selectedProjects:", selectedProjects);
                console.log("  selectedBlogs:", selectedBlogs);
                console.log("  selectedCaseStudies:", selectedCaseStudies);
                console.log("  canGenerate():", canGenerate());
                handleUseTemplate();
                setShowSuccessDialog(true);
              }}
              disabled={!canGenerate()}
              className="bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Utiliser ce template
            </Button>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl bg-[#0C0C0C] border-white/10 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Aperçu de l'email</DialogTitle>
            <DialogDescription className="text-white/60">
              Voici comment votre email apparaîtra aux abonnés
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div
              className="bg-white rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: getPreviewHTML() }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-[#0C0C0C] border-white/10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#00FFC2]/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-[#00FFC2]" />
              </div>
              <DialogTitle className="text-white text-xl">
                Template sauvegardé !
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/60 text-base">
              Votre template est prêt à être envoyé
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Instructions */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#00FFC2]" />
                Prochaines étapes
              </h4>
              <ol className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFC2] font-semibold">1.</span>
                  <span>Rendez-vous dans l'onglet <strong className="text-white">"Envoyer une campagne"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFC2] font-semibold">2.</span>
                  <span>Personnalisez le contenu si nécessaire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFC2] font-semibold">3.</span>
                  <span>Prévisualisez l'email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00FFC2] font-semibold">4.</span>
                  <span>Envoyez à vos abonnés !</span>
                </li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Trigger navigation to campaign tab
                  window.dispatchEvent(new CustomEvent("newsletter-switch-to-campaign"));
                }}
                className="flex-1 bg-[#00FFC2] text-[#0C0C0C] hover:bg-[#00FFC2]/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Aller à l'envoi
              </Button>
              <Button
                onClick={() => setShowSuccessDialog(false)}
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              >
                Rester ici
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
