import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { 
  Briefcase, 
  FileText, 
  Star, 
  MessageSquare, 
  Book, 
  HelpCircle 
} from "lucide-react";
import { ProjectsTab } from "./ProjectsTab";
import { BlogTab } from "./BlogTab";
import { CaseStudiesTab } from "./CaseStudiesTab";
import { TestimonialsTab } from "./TestimonialsTab";
import { ResourcesTab } from "./ResourcesTab";
import { FAQTab } from "./FAQTab";

type ContentSection = "projects" | "blog" | "case-studies" | "testimonials" | "resources" | "faq";

export function ContentTab() {
  const [activeSection, setActiveSection] = useState<ContentSection>("projects");

  const sections = [
    { id: "projects" as ContentSection, label: "Projets Portfolio", icon: Briefcase, color: "cyan" },
    { id: "blog" as ContentSection, label: "Blog", icon: FileText, color: "purple" },
    { id: "case-studies" as ContentSection, label: "Études de Cas", icon: Star, color: "yellow" },
    { id: "testimonials" as ContentSection, label: "Témoignages", icon: MessageSquare, color: "green" },
    { id: "resources" as ContentSection, label: "Ressources", icon: Book, color: "blue" },
    { id: "faq" as ContentSection, label: "FAQ", icon: HelpCircle, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex items-center gap-2 flex-wrap">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={
                isActive
                  ? `bg-${section.color}-500 text-white hover:bg-${section.color}-600 font-semibold`
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }
            >
              <Icon className="w-4 h-4 mr-2" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {/* Content Area */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === "projects" && (
          <ProjectsTab />
        )}

        {activeSection === "blog" && (
          <BlogTab />
        )}

        {activeSection === "case-studies" && (
          <CaseStudiesTab />
        )}

        {activeSection === "testimonials" && (
          <TestimonialsTab />
        )}

        {activeSection === "resources" && (
          <ResourcesTab />
        )}

        {activeSection === "faq" && (
          <FAQTab />
        )}
      </motion.div>
    </div>
  );
}
