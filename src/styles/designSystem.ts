// Centralized design tokens for the dashboard UI
// Keep simple constants so the rest of the codebase can import without Tailwind types.

export const colors = {
  background: "#0C0C0C",
  surface: "#111418",
  surfaceSubtle: "#171a1f",
  border: "rgba(255,255,255,0.1)",
  borderHover: "rgba(255,255,255,0.15)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.6)",
  accent: "#00FFC2",
  accentMuted: "rgba(0,255,194,0.15)",
  accentTextOn: "#0C0C0C",
  secondary: "#7c3aed",
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
