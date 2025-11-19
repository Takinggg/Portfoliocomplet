import { motion } from "motion/react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "../../utils/i18n/LanguageContext";

interface MiniCaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  problem: string;
  action: string;
  result: string;
  metric?: {
    value: string;
    label: string;
  };
  tags: string[];
  image?: string;
}

interface MiniCaseStudiesProps {
  cases: MiniCaseStudy[];
  onViewMore?: (caseId: string) => void;
}

export function MiniCaseStudies({ cases, onViewMore }: MiniCaseStudiesProps) {
  const { language } = useLanguage();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {cases.map((caseStudy, index) => (
        <motion.div
          key={caseStudy.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 overflow-hidden hover:border-mint/20 transition-all duration-300">
            {/* Image or placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-mint/10 to-neutral-900 overflow-hidden">
              {caseStudy.image ? (
                <img
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl font-bold text-mint/20">
                    {caseStudy.title.charAt(0)}
                  </div>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
              
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-mint/20 backdrop-blur-sm text-xs font-medium text-mint border border-mint/30">
                  {caseStudy.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Client & Title */}
              <div className="mb-4">
                <div className="text-xs text-neutral-500 mb-1">{caseStudy.client}</div>
                <h3 className="text-xl font-bold group-hover:text-mint transition-colors">
                  {caseStudy.title}
                </h3>
              </div>

              {/* Problem → Action → Result */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-xs font-semibold text-red-400 mb-1">
                    ❌ {language === 'en' ? 'Problem' : 'Problème'}
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {caseStudy.problem}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-blue-400 mb-1">
                    🔧 {language === 'en' ? 'Action' : 'Action'}
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {caseStudy.action}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-mint mb-1">
                    ✅ {language === 'en' ? 'Result' : 'Résultat'}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                    {caseStudy.result}
                  </p>
                </div>
              </div>

              {/* Metric (if provided) */}
              {caseStudy.metric && (
                <div className="mb-4 p-4 rounded-xl bg-mint/5 border border-mint/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-mint">
                        {caseStudy.metric.value}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {caseStudy.metric.label}
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-mint" />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {caseStudy.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-md bg-neutral-900 text-xs text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {onViewMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewMore(caseStudy.id)}
                  className="w-full text-mint hover:text-mint hover:bg-mint/5 group/btn"
                >
                  {language === 'en' ? 'View full case study' : 'Voir l\'étude complète'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
