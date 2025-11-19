import { motion } from "motion/react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { ServicePackageModal } from "./ServicePackageModal";

export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  priceNote?: string;
  deliverables: string[];
  duration: string;
  recommended?: boolean;
  detailedDescription?: string;
  included?: string[];
  notIncluded?: string[];
}

interface ServicePackageCardProps {
  package: ServicePackage;
  index: number;
  onAuditClick: () => void;
}

export function ServicePackageCard({ package: pkg, index, onAuditClick }: ServicePackageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group relative"
      >
        <div className={`relative h-full rounded-2xl border ${
          pkg.recommended 
            ? 'border-mint bg-mint/5' 
            : 'border-neutral-900 bg-neutral-950/50'
        } hover:border-mint/40 transition-all duration-300 overflow-hidden`}>
          
          {/* Glow effect */}
          {pkg.recommended && (
            <div className="absolute inset-0 bg-gradient-to-br from-mint/10 to-transparent"></div>
          )}
          
          <div className="relative p-8">
            {/* Header */}
            <div className="mb-6">
              {pkg.recommended && (
                <Badge className="mb-4 bg-mint text-black border-0">
                  Recommandé
                </Badge>
              )}
              <h3 className="text-3xl font-bold mb-2 group-hover:text-mint transition-colors">
                {pkg.name}
              </h3>
              <p className="text-sm text-mint font-medium mb-4">
                {pkg.tagline}
              </p>
              <p className="text-neutral-400 leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">{pkg.price}</span>
                {pkg.priceNote && (
                  <span className="text-sm text-neutral-400">{pkg.priceNote}</span>
                )}
              </div>
              <div className="text-sm text-neutral-500 mt-2">
                Durée estimée : {pkg.duration}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-3 mb-8">
              {pkg.deliverables.map((deliverable, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">{deliverable}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="w-full border-neutral-800 hover:border-mint/40 hover:bg-mint/5 group/btn"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={onAuditClick}
                className={pkg.recommended 
                  ? "w-full bg-mint text-black hover:bg-mint/90"
                  : "w-full bg-neutral-900 hover:bg-neutral-800"
                }
              >
                Réserver un audit
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <ServicePackageModal
        package={pkg}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuditClick={onAuditClick}
      />
    </>
  );
}
