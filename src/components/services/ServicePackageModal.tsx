import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle2, X, ArrowRight } from "lucide-react";
import { ServicePackage } from "./ServicePackageCard";
import { motion } from "motion/react";

interface ServicePackageModalProps {
  package: ServicePackage;
  isOpen: boolean;
  onClose: () => void;
  onAuditClick: () => void;
}

export function ServicePackageModal({
  package: pkg,
  isOpen,
  onClose,
  onAuditClick,
}: ServicePackageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white">
            {pkg.name}
          </DialogTitle>
          <DialogDescription className="text-mint font-medium">
            {pkg.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Description détaillée */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Description complète
            </h3>
            <p className="text-neutral-400 leading-relaxed">
              {pkg.detailedDescription || pkg.description}
            </p>
          </div>

          {/* Prix et durée */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div>
              <div className="text-sm text-neutral-400">Prix</div>
              <div className="text-2xl font-bold text-mint">{pkg.price}</div>
              {pkg.priceNote && (
                <div className="text-xs text-neutral-500">{pkg.priceNote}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-400">Durée</div>
              <div className="text-lg font-semibold text-white">{pkg.duration}</div>
            </div>
          </div>

          {/* Livrables */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Livrables inclus
            </h3>
            <div className="space-y-2">
              {pkg.deliverables.map((deliverable, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-neutral-900/50"
                >
                  <CheckCircle2 className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">{deliverable}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Inclus / Non inclus (si fourni) */}
          {pkg.included && pkg.included.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Également inclus
              </h3>
              <div className="space-y-2">
                {pkg.included.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-neutral-400">
                    <CheckCircle2 className="h-4 w-4 text-mint/60 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pkg.notIncluded && pkg.notIncluded.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Non inclus
              </h3>
              <div className="space-y-2">
                {pkg.notIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-neutral-500">
                    <X className="h-4 w-4 text-neutral-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-6 border-t border-neutral-800">
            <Button
              onClick={() => {
                onClose();
                onAuditClick();
              }}
              className="w-full bg-mint text-black hover:bg-mint/90 h-12"
            >
              Réserver un audit gratuit — 15 min
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
