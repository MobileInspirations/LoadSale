/**
 * Shared design tokens for LoadDrop futuristic AI aesthetic.
 * Used by web (Tailwind CSS variables) and mobile (theme object).
 */
export const colors = {
  surface: {
    base: "#0A0F1C",
    muted: "#111827",
    elevated: "#1F2937",
  },
  accent: {
    cyan: "#06B6D4",
    purple: "#8B5CF6",
    emerald: "#10B981",
    amber: "#F59E0B",
  },
  light: {
    surface: "#F9FAFB",
    surfaceMuted: "#F3F4F6",
    surfaceElevated: "#FFFFFF",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  "2xl": 32,
} as const;

export const typography = {
  fontSans: "Inter",
  fontMono: "JetBrains Mono",
} as const;
