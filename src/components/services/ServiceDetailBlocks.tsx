import { motion } from "motion/react";
import { Clock, CheckCircle2, LucideIcon } from "lucide-react";

interface ServiceDetail {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  usageExample: string;
  duration: string;
  complexity: "simple" | "modérée" | "avancée";
}

interface ServiceDetailBlocksProps {
  services: ServiceDetail[];
}

const complexityColors = {
  simple: "text-green-400 bg-green-400/10 border-green-400/20",
  modérée: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  avancée: "text-red-400 bg-red-400/10 border-red-400/20",
};

export function ServiceDetailBlocks({ services }: ServiceDetailBlocksProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="relative h-full rounded-2xl border border-neutral-900 bg-neutral-950/50 p-6 hover:border-mint/20 transition-all duration-300">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-mint/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-mint/20 to-mint/5 border border-mint/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <service.icon className="h-8 w-8 text-mint" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2 group-hover:text-mint transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-400">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Usage example */}
              <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 mb-4">
                <div className="text-xs font-semibold text-mint mb-1">
                  Exemple d'usage :
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {service.usageExample}
                </p>
              </div>

              {/* Footer: Duration & Complexity */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration}</span>
                </div>
                {service.complexity === 'simple' && (
                  <div className="px-2 py-1 rounded-md text-xs font-medium border text-green-400 bg-green-400/10 border-green-400/20">
                    {service.complexity}
                  </div>
                )}
                {service.complexity === 'modérée' && (
                  <div className="px-2 py-1 rounded-md text-xs font-medium border text-yellow-400 bg-yellow-400/10 border-yellow-400/20">
                    {service.complexity}
                  </div>
                )}
                {service.complexity === 'avancée' && (
                  <div className="px-2 py-1 rounded-md text-xs font-medium border text-red-400 bg-red-400/10 border-red-400/20">
                    {service.complexity}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
