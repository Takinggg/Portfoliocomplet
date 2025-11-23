import { useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ServicesPage as RedesignServicesPage } from "../../redesign/components/pages/ServicesPage";
import { redesignServices } from "../../redesign/data";
import type { ServicePack } from "../../redesign/types";

interface ServicesRedesignPageProps {
  onNavigate?: (page: string) => void;
}

export default function ServicesRedesignPage({ onNavigate }: ServicesRedesignPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.startsWith("/en") ? "en" : "fr";

  const localizedServices: ServicePack[] = useMemo(() => {
    return redesignServices.map((service) => ({
      ...service,
      title: lang === "en" ? service.title_en || service.title : service.title,
      description: lang === "en" ? service.description_en || service.description : service.description,
      price: lang === "en" ? service.price_en || service.price : service.price,
      features: lang === "en" ? service.features_en || service.features : service.features,
    }));
  }, [lang]);

  const labels = useMemo(() => {
    if (lang === "en") {
      return {
        heading: "Service Menu",
        subheading: "Clear packages with a predictable scope for every stage of growth.",
        recommendedBadge: "Recommended",
        buttonLabel: "Select this pack",
        faqTitle: "Frequently Asked Questions",
        faqQuestions: [
          "How does payment work?",
          "Do you collaborate with agencies?",
          "Is maintenance included?",
        ],
      } as const;
    }

    return {
      heading: "Nos Offres",
      subheading: "Des solutions claires, sans coûts cachés, adaptées à la maturité de votre projet.",
      recommendedBadge: "Recommandé",
      buttonLabel: "Choisir ce pack",
      faqTitle: "Questions fréquentes",
      faqQuestions: [
        "Comment se passe le paiement ?",
        "Travaillez-vous avec des agences ?",
        "Assurez-vous la maintenance ?",
      ],
    } as const;
  }, [lang]);

  const handleSelectPack = useCallback(
    (packId: string) => {
      if (onNavigate) {
        onNavigate("booking");
        return;
      }
      const target = lang === "en" ? "/en/booking" : "/fr/booking";
      navigate(target);
    },
    [lang, navigate, onNavigate]
  );

  return (
    <RedesignServicesPage
      services={localizedServices}
      labels={labels}
      onSelectPack={handleSelectPack}
    />
  );
}
