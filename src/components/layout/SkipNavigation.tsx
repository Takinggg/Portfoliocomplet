import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export function SkipNavigation() {
  const [isVisible, setIsVisible] = useState(false);

  const skipToMain = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      <motion.a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToMain();
        }}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 bg-mint text-black px-6 py-3 rounded-xl font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-mint/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        Aller au contenu principal
      </motion.a>
    </AnimatePresence>
  );
}
