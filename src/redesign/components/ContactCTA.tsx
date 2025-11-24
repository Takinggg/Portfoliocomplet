import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { useTranslation } from "../../utils/i18n/useTranslation";

interface CTAAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

interface ContactCTAProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  align?: "left" | "center";
  className?: string;
  helperText?: string;
}

const CTA_HELPER_TEXT = {
  fr: "Réponse sous 24h, sans engagement",
  en: "Reply within 24h, no commitment",
} as const;

const baseButtonClasses =
  "w-full rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] transition-all duration-200 flex items-center justify-center gap-3";

const renderAction = (action: CTAAction, variant: "primary" | "secondary") => {
  const sharedProps = {
    className:
      `${baseButtonClasses} ` +
      (variant === "primary"
        ? "bg-white text-black hover:bg-primary hover:text-black"
        : "border border-white/20 text-white hover:border-white/60 hover:bg-white/5"),
  };

  if (action.href) {
    return (
      <a href={action.href} {...sharedProps}>
        <span>{action.label}</span>
        {action.icon ?? <ArrowRight size={16} />}
      </a>
    );
  }

  return (
    <button type="button" onClick={action.onClick} {...sharedProps}>
      <span>{action.label}</span>
      {action.icon ?? <ArrowRight size={16} />}
    </button>
  );
};

export const ContactCTA: React.FC<ContactCTAProps> = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  align = "center",
  className = "",
  helperText,
}) => {
  const { language } = useTranslation();
  const resolvedHelper = helperText ?? CTA_HELPER_TEXT[language];
  const layoutClasses =
    align === "center"
      ? "items-center text-center"
      : "md:flex-row md:items-center md:justify-between text-left";

  const textAlignment = align === "center" ? "text-center" : "text-left";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#050505] px-8 py-12 md:px-14 md:py-16 ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_top,_#CCFF00_0%,_transparent_45%),radial-gradient(circle_at_bottom,_#7C45FF_0%,_transparent_35%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className={`relative flex flex-col gap-10 ${layoutClasses}`}>
        <Reveal width="100%">
          <div className={`space-y-4 ${textAlignment} max-w-3xl`}>
            {eyebrow && (
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.4em] text-white/60">
                <Sparkles size={14} className="text-primary" />
                {eyebrow}
              </div>
            )}
            <h2 className="font-display heading-display font-semibold text-white leading-[1.08]">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-white/70 leading-relaxed">{description}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={200} width="100%">
          <div
            className={`w-full md:w-auto flex flex-col gap-4 ${
              align === "center" ? "max-w-lg w-full" : "max-w-sm self-start md:self-auto"
            }`}
          >
            {renderAction(primaryAction, "primary")}
            {secondaryAction && renderAction(secondaryAction, "secondary")}
            {resolvedHelper && (
              <p className="text-xs text-white/40 uppercase tracking-[0.4em] text-center md:text-left">
                {resolvedHelper}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};
