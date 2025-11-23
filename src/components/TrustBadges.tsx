import { motion } from "motion/react";
import { Star, Shield, Award, CheckCircle, Trophy } from "lucide-react";

interface BadgeItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}

interface TrustBadgesProps {
  variant?: "horizontal" | "vertical" | "compact";
  showAll?: boolean;
  className?: string;
}

export function TrustBadges({ 
  variant = "horizontal", 
  showAll = true,
  className = "" 
}: TrustBadgesProps) {
  const badges: BadgeItem[] = [
    {
      icon: <Star className="h-5 w-5" fill="currentColor" />,
      title: "4.9/5",
      subtitle: "Note moyenne",
      color: "#FFD700",
    },
    {
      icon: <Award className="h-5 w-5" />,
      title: "50+",
      subtitle: "Projets rÃ©ussis",
      color: "#CCFF00",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "100%",
      subtitle: "Clients satisfaits",
      color: "#DAFF40",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "5 ans",
      subtitle: "D'expÃ©rience",
      color: "#00B38A",
    },
  ];

  const displayBadges = showAll ? badges : badges.slice(0, 3);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-4 flex-wrap ${className}`}>
        {displayBadges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800"
          >
            <div style={{ color: badge.color }}>
              {badge.icon}
            </div>
            <span className="text-sm text-white">{badge.title}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {displayBadges.map((badge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all group"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg"
              style={{ 
                backgroundColor: `${badge.color}20`,
                color: badge.color,
              }}
            >
              {badge.icon}
            </div>
            <div className="flex-1">
              <div className="text-white group-hover:text-mint transition-colors">
                {badge.title}
              </div>
              <div className="text-sm text-neutral-400">
                {badge.subtitle}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default: horizontal
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {displayBadges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="flex flex-col items-center gap-3 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all group"
        >
          <div
            className="flex items-center justify-center w-14 h-14 rounded-full"
            style={{ 
              backgroundColor: `${badge.color}20`,
              color: badge.color,
            }}
          >
            {badge.icon}
          </div>
          <div className="text-center">
            <div className="text-xl text-white group-hover:text-mint transition-colors mb-1">
              {badge.title}
            </div>
            <div className="text-sm text-neutral-400">
              {badge.subtitle}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Trustpilot-style badge
export function TrustpilotBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-[#00B67A]/10 border border-[#00B67A]/30 ${className}`}
    >
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 text-[#00B67A]"
            fill="#00B67A"
          />
        ))}
      </div>
      <div>
        <div className="text-sm text-white">Excellent</div>
        <div className="text-xs text-neutral-400">4.9 sur Trustpilot</div>
      </div>
    </motion.div>
  );
}

// Google Reviews badge
export function GoogleReviewsBadge({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30 ${className}`}
    >
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 text-yellow-400"
            fill="#FBBC04"
          />
        ))}
      </div>
      <div>
        <div className="text-sm text-white">5.0</div>
        <div className="text-xs text-neutral-400">Google Reviews</div>
      </div>
    </motion.div>
  );
}

// All badges together
export function AllTrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <TrustpilotBadge />
      <GoogleReviewsBadge />
      
      {/* Custom "Verified Professional" badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-mint/10 border border-mint/30"
      >
        <Shield className="h-5 w-5 text-mint" />
        <div>
          <div className="text-sm text-white">VÃ©rifiÃ©</div>
          <div className="text-xs text-neutral-400">Professionnel certifiÃ©</div>
        </div>
      </motion.div>

      {/* Award badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30"
      >
        <Trophy className="h-5 w-5 text-purple-400" />
        <div>
          <div className="text-sm text-white">Top Freelance</div>
          <div className="text-xs text-neutral-400">2024</div>
        </div>
      </motion.div>
    </div>
  );
}
