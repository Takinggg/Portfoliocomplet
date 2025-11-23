import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { NewsletterForm } from "../newsletter/NewsletterForm";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { TrustBadges } from "../TrustBadges";

type Page = "home" | "projects" | "services" | "about" | "contact" | "faq";

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const footerTexts = (t as any)?.footer ?? {};
  const ctaTexts = footerTexts.cta ?? {};
  const metrics = footerTexts.metrics ?? [];
  const trustTexts = footerTexts.trust ?? {};

  const navLinks = [
    { label: t("nav.services"), page: "services" as Page },
    { label: t("nav.projects"), page: "projects" as Page },
    { label: t("nav.faq"), page: "faq" as Page },
    { label: t("nav.about"), page: "about" as Page },
    { label: t("nav.contact"), page: "contact" as Page },
  ];

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Github, label: "GitHub", href: "#" },
  ];

  return (
    <footer className="relative border-t border-neutral-900 bg-[#0C0C0C]">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-mint/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-r from-[#0D1F1B] via-[#0B1517] to-[#0F0C18] px-8 py-10 mb-16"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-10 w-72 h-72 bg-mint/20 blur-[120px]"></div>
            <div className="absolute -bottom-12 -left-6 w-60 h-60 bg-cyan-500/10 blur-[100px]"></div>
          </div>
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {ctaTexts.badge && (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.2em] text-mint">
                  {ctaTexts.badge}
                </span>
              )}
              <h3 className="mt-4 text-3xl font-semibold text-white lg:text-4xl">
                {ctaTexts.title}
              </h3>
              <p className="mt-3 text-base text-neutral-300 lg:text-lg">
                {ctaTexts.subtitle}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => onNavigate?.("contact")}
                className="inline-flex items-center justify-center rounded-2xl bg-mint px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_40px_rgba(204, 255, 0,0.35)] transition hover:scale-[1.02]"
              >
                {ctaTexts.primary}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate?.("services")}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-mint/40"
              >
                {ctaTexts.secondary}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Left - Brand */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-bold text-white">Maxence</span>
                <span className="text-2xl font-bold text-mint">.</span>
              </div>
              {footerTexts.tagline && (
                <p className="text-sm uppercase tracking-[0.28em] text-neutral-500 mb-4">
                  {footerTexts.tagline}
                </p>
              )}
              <p className="text-neutral-400 leading-relaxed mb-6 max-w-sm">
                {t("footer.description")}
              </p>

              {metrics.length > 0 && (
                <div className="mb-8 grid grid-cols-2 gap-4">
                  {metrics.map((metric: { label: string; value: string }) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur"
                    >
                      <div className="text-2xl font-semibold text-white">{metric.value}</div>
                      <p className="text-xs text-neutral-500 leading-snug">{metric.label}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Newsletter Form */}
              <div className="mt-6">
                <div className="mb-3">
                  <p className="text-sm text-white mb-1">{t("footer.newsletter")}</p>
                  <p className="text-xs text-neutral-500">{t("footer.newsletterSubtitle")}</p>
                </div>
                <NewsletterForm variant="minimal" />
              </div>
            </motion.div>
          </div>

          {/* Right - Links Grid */}
          <div className="lg:col-span-8 grid sm:grid-cols-3 gap-8">
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-sm font-medium text-white mb-6">{t("footer.navigation")}</div>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => onNavigate?.(link.page)}
                      className="text-sm text-neutral-400 hover:text-mint transition-colors group flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm font-medium text-white mb-6">{t("footer.sections.services")}</div>
              <ul className="space-y-4">
                {(footerTexts.servicesList || []).map((service: string) => (
                  <li key={service}>
                    <span className="text-sm text-neutral-400 hover:text-mint transition-colors cursor-pointer">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm font-medium text-white mb-6">{t("footer.sections.contact")}</div>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:contact@maxence.dev" className="text-sm text-neutral-400 hover:text-mint transition-colors">
                    {footerTexts.contactInfo?.email}
                  </a>
                </li>
                <li>
                  <span className="text-sm text-neutral-400">
                    {footerTexts.contactInfo?.location}
                  </span>
                </li>
                <li>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-mint animate-pulse"></div>
                    <span className="text-sm text-neutral-400">{footerTexts.contactInfo?.availability ?? t("footer.available")}</span>
                  </div>
                </li>
                {footerTexts.contactInfo?.response && (
                  <li>
                    <span className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                      {footerTexts.contactInfo.response}
                    </span>
                  </li>
                )}
              </ul>
              <button
                onClick={() => onNavigate?.("contact")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-mint/40"
              >
                <Mail className="h-4 w-4" />
                contact@maxence.dev
              </button>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="mb-4 flex flex-col gap-1 text-center">
            {trustTexts.title && (
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-neutral-500">
                {trustTexts.title}
              </p>
            )}
            {trustTexts.subtitle && (
              <p className="text-base text-neutral-400">{trustTexts.subtitle}</p>
            )}
          </div>
          <TrustBadges variant="compact" showAll={true} />
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-neutral-900"
        >
          <div className="text-sm text-neutral-500">
            Â© {currentYear} Maxence. {t("footer.rights")}.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-mint hover:border-mint/30 hover:bg-neutral-800 transition-all group"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-neutral-900"
        >
          {[
            footerTexts.legalLinks?.legalNotice,
            footerTexts.legalLinks?.privacy,
            footerTexts.legalLinks?.terms,
          ].filter(Boolean).map((link: string) => (
            <button
              key={link}
              className="text-xs text-neutral-500 hover:text-mint transition-colors"
            >
              {link}
            </button>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
