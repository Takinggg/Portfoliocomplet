import { motion } from "motion/react";
import { useState } from "react";
import { Palette, Code2, Workflow } from "lucide-react";
import { useLanguage } from "../../utils/i18n/LanguageContext";

type EngineType = "ui" | "code" | "workflow";

interface TripleEngineMapping {
  ui: {
    component: string;
    description: string;
  };
  code: {
    snippet: string;
    language: string;
  };
  workflow: {
    action: string;
    trigger: string;
  };
}

const demoData: TripleEngineMapping = {
  ui: {
    component: "Button Component",
    description: "Interactive button with hover states and loading animation",
  },
  code: {
    snippet: `<Button 
  variant="primary"
  onClick={handleSubmit}
  loading={isLoading}
>
  Submit Form
</Button>`,
    language: "tsx",
  },
  workflow: {
    action: "Submit form → Validate → Save to DB → Send email",
    trigger: "User clicks button",
  },
};

export function TripleEngineDemo() {
  const [activeEngine, setActiveEngine] = useState<EngineType>("ui");
  const { language } = useLanguage();

  return (
    <div className="relative rounded-2xl border border-neutral-900 bg-neutral-950/50 overflow-hidden">
      {/* Header - Engine selector */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-800">
        <div>
          <h3 className="text-2xl font-bold mb-1">Triple Engine Concept</h3>
          <p className="text-sm text-neutral-400">
            {language === 'en' ? 'Hover on each block to see the interaction' : 'Hover sur chaque bloc pour voir l\'interaction'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          {/* UI Block */}
          <motion.div
            onHoverStart={() => setActiveEngine("ui")}
            className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
              activeEngine === "ui"
                ? "border-mint bg-mint/5 scale-105"
                : "border-neutral-800 bg-neutral-900/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeEngine === "ui"
                    ? "bg-mint text-black"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                <Palette className="h-5 w-5" />
              </div>
              <div className="font-bold">UI Design</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-mint">
                {demoData.ui.component}
              </div>
              <div className="text-xs text-neutral-400">
                {demoData.ui.description}
              </div>
            </div>

            {/* Visual mock */}
            <div className="mt-4 p-4 rounded-lg bg-neutral-950 border border-neutral-800">
              <div className="w-full h-10 rounded-lg bg-mint flex items-center justify-center text-black font-medium text-sm">
                Submit Form
              </div>
            </div>
          </motion.div>

          {/* Code Block */}
          <motion.div
            onHoverStart={() => setActiveEngine("code")}
            className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
              activeEngine === "code"
                ? "border-mint bg-mint/5 scale-105"
                : "border-neutral-800 bg-neutral-900/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeEngine === "code"
                    ? "bg-mint text-black"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                <Code2 className="h-5 w-5" />
              </div>
              <div className="font-bold">Code</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-mint">
                Component Implementation
              </div>
              <div className="text-xs text-neutral-400">
                {demoData.code.language.toUpperCase()}
              </div>
            </div>

            {/* Code snippet */}
            <div className="mt-4 p-4 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto">
              <pre>{demoData.code.snippet}</pre>
            </div>
          </motion.div>

          {/* Workflow Block */}
          <motion.div
            onHoverStart={() => setActiveEngine("workflow")}
            className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
              activeEngine === "workflow"
                ? "border-mint bg-mint/5 scale-105"
                : "border-neutral-800 bg-neutral-900/50"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  activeEngine === "workflow"
                    ? "bg-mint text-black"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                <Workflow className="h-5 w-5" />
              </div>
              <div className="font-bold">Workflow</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-mint">Automation</div>
              <div className="text-xs text-neutral-400">
                {demoData.workflow.trigger}
              </div>
            </div>

            {/* Workflow visual */}
            <div className="mt-4 space-y-2">
              {demoData.workflow.action.split("→").map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded bg-neutral-950 border border-neutral-800"
                >
                  <div className="w-6 h-6 rounded-full bg-mint/20 flex items-center justify-center text-xs text-mint font-bold">
                    {idx + 1}
                  </div>
                  <div className="text-xs text-neutral-400">{step.trim()}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Active engine description */}
        <motion.div
          key={activeEngine}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-mint/5 border border-mint/20"
        >
          <div className="text-sm text-neutral-300">
            {activeEngine === "ui" && (
              <>
                <strong className="text-mint">{language === 'en' ? 'User-centered design:' : 'Design centré utilisateur :'}</strong>{" "}
                {language === 'en' ? 'Intuitive interface with micro-interactions and clear visual states.' : 'Interface intuitive avec micro-interactions et états visuels clairs.'}
              </>
            )}
            {activeEngine === "code" && (
              <>
                <strong className="text-mint">{language === 'en' ? 'Clean and maintainable code:' : 'Code propre et maintenable :'}</strong>{" "}
                {language === 'en' ? 'Reusable, typed components optimized for performance.' : 'Composants réutilisables, typés et optimisés pour la performance.'}
              </>
            )}
            {activeEngine === "workflow" && (
              <>
                <strong className="text-mint">{language === 'en' ? 'Smart automation:' : 'Automatisation intelligente :'}</strong>{" "}
                {language === 'en' ? 'Every action triggers a workflow to save time and reduce errors.' : 'Chaque action déclenche un workflow pour économiser du temps et réduire les erreurs.'}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
