import { motion } from "motion/react";

// Global Loading Spinner - Logo animé minimaliste
export function LoadingSpinner({ 
  size = "default",
  fullScreen = false 
}: { 
  size?: "small" | "default" | "large";
  fullScreen?: boolean;
}) {
  const sizes = {
    small: 32,
    default: 48,
    large: 64
  };

  const spinnerSize = sizes[size];

  const spinner = (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        {/* Outer ring - pulsing */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-mint/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Spinning ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-mint border-r-mint"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            className="w-2 h-2 bg-mint rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <motion.p
            className="text-sm text-neutral-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Chargement...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return spinner;
}

// Inline loading state (pour remplacer du contenu)
export function LoadingState({ 
  message = "Chargement...",
  className = ""
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <LoadingSpinner size="large" />
      <motion.p
        className="mt-6 text-neutral-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}

// Mini spinner pour boutons
export function ButtonSpinner() {
  return (
    <motion.div
      className="w-4 h-4 border-2 border-transparent border-t-current border-r-current rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

// Progress bar loading (type YouTube)
export function LoadingBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-50">
      <motion.div
        className="h-full bg-mint shadow-lg shadow-mint/50"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
