import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { useLanguage } from "../../utils/i18n/LanguageContext";

interface NewsletterBadgeProps {
  className?: string;
  showTrend?: boolean;
}

export function NewsletterBadge({ className = "", showTrend = false }: NewsletterBadgeProps) {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadSubscriberCount();
  }, []);

  const loadSubscriberCount = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04919ac5/newsletter/stats`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setCount(data.confirmedCount || 0);
      } else {
        console.error("Failed to load subscriber count - HTTP", response.status);
      }
    } catch (error) {
      // Silent error - server might not be deployed yet
      // Set to 0 on error instead of leaving in loading state
      setCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${className}`}>
        <div className="h-4 w-4 rounded-full bg-white/10 animate-pulse" />
        <span className="text-sm text-white/40">...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FFC2]/10 border border-[#00FFC2]/20 ${className}`}
    >
      <Users className="h-4 w-4 text-[#00FFC2]" />
      <span className="text-sm text-[#00FFC2]">
        {count.toLocaleString(language === 'en' ? 'en-US' : 'fr-FR')} {
          language === 'en' 
            ? (count === 1 ? "subscriber" : "subscribers")
            : (count === 1 ? "abonné" : "abonnés")
        }
      </span>
      {showTrend && count > 0 && (
        <TrendingUp className="h-3 w-3 text-[#00FFC2] opacity-60" />
      )}
    </motion.div>
  );
}
