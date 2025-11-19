import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ProcessStep {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
  deliverables: string[];
  duration: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="hidden lg:block absolute left-0 right-0 top-24 h-0.5 bg-gradient-to-r from-transparent via-mint/20 to-transparent"></div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6 hover:border-mint/20 transition-all duration-300">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

              <div className="relative z-10">
                {/* Step number and icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-mono text-mint font-bold">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6 text-mint" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-mint transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Deliverables */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-mint mb-2">
                    Livrables :
                  </div>
                  <ul className="space-y-1">
                    {step.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="text-xs text-neutral-500 flex items-start gap-2">
                        <span className="text-mint mt-1">•</span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Duration */}
                <div className="text-xs text-neutral-500 font-mono">
                  ⏱️ {step.duration}
                </div>
              </div>

              {/* Connection line indicator */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-24 w-8 h-0.5 bg-mint/20"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
