/**
 * Tide's design tokens. Tide is a made-up product, so these stand in for what
 * the skill would copy out of a real app's theme.
 */
const text = '#101326';
const card = '#ffffff';
const mix = (hue: string, pct: number, base = card): string =>
  `color-mix(in srgb, ${hue} ${pct}%, ${base})`;

const accent = '#6c4dff';

export const color = {
  canvas: '#f3f4f8',
  card,
  ink: '#101326',
  text,
  text2: '#5d6178',
  text3: '#9a9db0',
  fill: mix(text, 5),
  fill2: mix(text, 9),
  accent,
  accentSoft: mix(accent, 12),
  success: '#13a06a',
  warn: '#f06a3a',
  danger: '#e5484d',
  night: { bg: '#0c0e1b', surface: '#181b2e', text: '#eef0fa', muted: '#8e93b0' },
  tone: {
    violet: { ink: '#5236e0', fill: mix(accent, 14) },
    teal: { ink: '#0d8a72', fill: mix('#16b293', 15) },
    coral: { ink: '#c4472a', fill: mix('#f06a3a', 15) },
    blue: { ink: '#2763d8', fill: mix('#3b82f6', 14) },
  },
  mix,
} as const;

export type Tone = keyof typeof color.tone;

export const radius = { sm: 12, md: 16, lg: 22, pill: 999 } as const;

export const shadow = {
  ring: '0 0 0 1px rgba(16, 19, 38, 0.05)',
  float: '0 0 0 1px rgba(16, 19, 38, 0.05), 0 24px 50px -20px rgba(16, 19, 38, 0.3)',
} as const;

export const font = {
  sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
} as const;

/** 9:16 for Reels, Shorts, TikTok and stories. */
export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

/** Unused in an ad (no Stage); kept so shared pieces type-check. */
export const STAGE = { width: 1080, height: 1920 } as const;
