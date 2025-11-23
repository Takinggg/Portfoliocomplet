import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { List, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  // Extract headings from HTML content
  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    
    const headingElements = tempDiv.querySelectorAll("h1, h2, h3, h4");
    const extractedHeadings: Heading[] = [];
    
    headingElements.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id; // Ensure heading has an id
      
      extractedHeadings.push({
        id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.substring(1)),
      });
    });
    
    setHeadings(extractedHeadings);
  }, [content]);

  // Track active heading based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className={`sticky top-24 ${className}`}
    >
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="h-4 w-4 text-[#CCFF00]" />
            <h3 className="text-white">Table des matiÃ¨res</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-8 w-8 p-0 hover:bg-white/5"
          >
            <ChevronRight
              className={`h-4 w-4 text-white/60 transition-transform ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </Button>
        </div>

        {isOpen && (
          <ScrollArea className="max-h-[calc(100vh-200px)]">
            <nav>
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <motion.li
                    key={heading.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      paddingLeft: `${(heading.level - 1) * 12}px`,
                    }}
                  >
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-left text-sm py-1.5 px-3 rounded transition-all ${
                        activeId === heading.id
                          ? "bg-[#CCFF00]/20 text-[#CCFF00] border-l-2 border-[#CCFF00]"
                          : "text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                      }`}
                    >
                      {heading.text}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        )}
      </div>

      {/* Reading Progress */}
      <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="text-xs text-white/40 mb-2">Progression de lecture</div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#CCFF00] to-[#DAFF40]"
            initial={{ width: "0%" }}
            animate={{
              width: activeId
                ? `${
                    ((headings.findIndex((h) => h.id === activeId) + 1) /
                      headings.length) *
                    100
                  }%`
                : "0%",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.aside>
  );
}
