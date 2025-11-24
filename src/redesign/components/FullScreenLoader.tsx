import React from "react";

interface FullScreenLoaderProps {
  message: string;
  subtext?: string;
  variant?: "static" | "overlay";
  isVisible?: boolean;
}

const baseWrapper = "flex flex-col items-center justify-center gap-6 text-white";

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message,
  subtext,
  variant = "static",
  isVisible = true,
}) => {
  const containerClasses =
    variant === "overlay"
      ? `fixed inset-0 z-[120] bg-[#050505] transition-opacity duration-500 ease-out ${
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`
      : "min-h-screen bg-[#050505]";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={`${baseWrapper} h-full`}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white/5" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm tracking-[0.4em] uppercase text-white/70">
            {message}
          </p>
          {subtext && (
            <p className="mt-3 text-xs text-white/40 tracking-[0.3em] uppercase">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
