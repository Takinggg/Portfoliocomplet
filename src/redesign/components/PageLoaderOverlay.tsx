import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FullScreenLoader } from "./FullScreenLoader";

type SupportedLang = "fr" | "en";

const ROUTE_MESSAGES: Record<SupportedLang, { primary: string; secondary: string }> = {
  fr: {
    primary: "Chargement de la page",
    secondary: "Merci de patienter une seconde",
  },
  en: {
    primary: "Loading the experience",
    secondary: "One moment please",
  },
};

const INITIAL_DURATION = 1000;
const SUBSEQUENT_DURATION = 550;

export function PageLoaderOverlay() {
  const location = useLocation();
  const lang: SupportedLang = location.pathname.startsWith("/en") ? "en" : "fr";
  const [visible, setVisible] = useState(true);
  const [initialCycle, setInitialCycle] = useState(true);

  useEffect(() => {
    setVisible(true);
    const duration = initialCycle ? INITIAL_DURATION : SUBSEQUENT_DURATION;
    const timer = window.setTimeout(() => {
      setVisible(false);
      setInitialCycle(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, initialCycle]);

  const labels = ROUTE_MESSAGES[lang];

  return (
    <FullScreenLoader
      message={labels.primary}
      subtext={labels.secondary}
      variant="overlay"
      isVisible={visible}
    />
  );
}
