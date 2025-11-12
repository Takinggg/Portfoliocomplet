import { lazy, Suspense } from "react";
import { colors } from "../../styles/designSystem";

// Dashboard minimaliste uniquement
const MinimalistDashboard = lazy(() => import("./MinimalistDashboard"));

interface ModernDashboardProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export default function ModernDashboard({ onLogout, onNavigate }: ModernDashboardProps) {
  // Loading fallback
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00FFC2]/20 border-t-[#00FFC2] rounded-full animate-spin" />
        <p className="text-white/60 text-sm">Chargement...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <MinimalistDashboard onLogout={onLogout} />
    </Suspense>
  );
}
