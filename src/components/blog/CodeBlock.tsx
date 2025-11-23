import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import Prism from "prismjs";
// âœ… CSS import removed to fix Vite build - using inline Tailwind styles instead

// Import language support
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language = "javascript",
  filename,
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const { copyToClipboard } = await import("../../utils/clipboardHelper");
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Highlight code using Prism
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.javascript,
    language
  );

  const lines = code.split("\n");

  return (
    <div className="relative group my-6">
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between bg-[#1E1E1E] border border-white/10 border-b-0 rounded-t-lg px-4 py-2">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm text-white/80">{filename}</span>
            )}
            {language && !filename && (
              <span className="text-xs text-white/40 uppercase">
                {language}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-[#CCFF00]" />
                <span className="text-xs text-[#CCFF00]">CopiÃ© !</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1 text-white/60" />
                <span className="text-xs text-white/60">Copier</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Code Block */}
      <div
        className={`relative bg-[#1E1E1E] border border-white/10 overflow-x-auto ${
          filename || language ? "rounded-b-lg" : "rounded-lg"
        }`}
      >
        <pre className="p-4 text-sm leading-relaxed">
          {showLineNumbers ? (
            <div className="flex">
              {/* Line Numbers */}
              <div className="select-none pr-4 text-white/30 text-right min-w-[3rem]">
                {lines.map((_, index) => (
                  <div
                    key={index}
                    className={`${
                      highlightLines.includes(index + 1)
                        ? "text-[#CCFF00]"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code */}
              <code
                className={`language-${language} flex-1`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </div>
          ) : (
            <code
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}
        </pre>

        {/* Copy button (fallback if no header) */}
        {!filename && !language && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 h-8 px-3 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1 text-[#CCFF00]" />
                <span className="text-xs text-[#CCFF00]">CopiÃ©</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1 text-white/60" />
                <span className="text-xs text-white/60">Copier</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Inline code component
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-sm text-[#CCFF00]">
      {children}
    </code>
  );
}
