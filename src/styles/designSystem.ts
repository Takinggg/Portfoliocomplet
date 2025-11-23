// Centralized design tokens for the dashboard UI
// Keep simple constants so the rest of the codebase can import without Tailwind types.

export const colors = {
  // Brand from landing page (dark + neon cyan)
  background: "#0C0C0C",
  surface: "#121312",
  surfaceSubtle: "#181a1b",
  panel: "rgba(255,255,255,0.04)",
  panelElevated: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  borderHover: "rgba(255,255,255,0.15)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.60)",
  accent: "#CCFF00",
  accentMuted: "rgba(204,255,0,0.15)",
  accentTextOn: "#0C0C0C",
  // Optional secondary hue for highlights
  secondary: "#7c3aed",
  // Header gradient
  gradientFrom: "#0C0C0C",
  gradientTo: "#1a1a1a",
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const shadows = {
  soft: "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,0,0,0.35)",
};

export const ds = { colors, radius, spacing, shadows };
