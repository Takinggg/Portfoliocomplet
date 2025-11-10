/**
 * Screen Reader Announcer
 * Composant pour annoncer des messages aux lecteurs d'écran
 */

import { useEffect, useState } from "react";

interface AnnouncerProps {
  message?: string;
  politeness?: "polite" | "assertive";
}

export function ScreenReaderAnnouncer({ message, politeness = "polite" }: AnnouncerProps) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (message) {
      // Clear puis set pour forcer l'annonce même si message identique
      setAnnouncement("");
      setTimeout(() => setAnnouncement(message), 100);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

// Hook pour utiliser le announcer
export function useAnnouncer() {
  const [message, setMessage] = useState<string>("");

  const announce = (text: string, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => setMessage(text), delay);
    } else {
      setMessage(text);
    }
  };

  return { message, announce };
}
