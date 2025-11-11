import { Github, Linkedin, Twitter, Mail, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { NewsletterForm } from "../newsletter/NewsletterForm";
import { useTranslation } from "../../utils/i18n/useTranslation";
import { useLanguage } from "../../utils/i18n/LanguageContext";
import { TrustBadges } from "../TrustBadges";

type Page = "home" | "projects" | "services" | "about" | "contact" | "faq";

interface FooterProps {
  onNavigate?: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const { language } = useLanguage();

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
              <p className="text-neutral-400 leading-relaxed mb-6 max-w-sm">
                {t("footer.description")}
              </p>
              
              {/* Newsletter Form */}
              <div className="mt-6">
                <div className="mb-3">
                  <p className="text-sm text-white mb-1">
                    {language === 'en' ? 'Monthly Newsletter' : 'Newsletter mensuelle'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {language === 'en' 
                      ? 'Tips, case studies, and exclusive news' 
                      : 'Conseils, études de cas et nouvelles exclusives'}
                  </p>
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
              <div className="text-sm font-medium text-white mb-6">Services</div>
              <ul className="space-y-4">
                {["Automatisation", "Dashboard Design", "IA Integration", "Consulting"].map((service) => (
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
              <div className="text-sm font-medium text-white mb-6">Contact</div>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:contact@maxence.dev" className="text-sm text-neutral-400 hover:text-mint transition-colors">
                    contact@maxence.dev
                  </a>
                </li>
                <li>
                  <span className="text-sm text-neutral-400">
                    Paris, France
                  </span>
                </li>
                <li>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-mint animate-pulse"></div>
                    <span className="text-sm text-neutral-400">Disponible</span>
                  </div>
                </li>
              </ul>
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
            © {currentYear} Maxence. {t("footer.rights")}.
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
          {(language === 'en' 
            ? ["Legal Notice", "Privacy Policy", "Terms of Service"]
            : ["Mentions légales", "Politique de confidentialité", "CGV"]
          ).map((link) => (
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
