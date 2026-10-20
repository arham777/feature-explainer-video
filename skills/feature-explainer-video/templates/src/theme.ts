/**
 * The app's design tokens, copied from its CSS so the video wears the same
 * skin as the product. These values are the reference build's; replace every
 * one with the app's own (colors, tone pairs, radii, shadows, fonts).
 */
const text = '#15161a';
const card = '#ffffff';
const mix = (hue: string, pct: number, base = card): string =>
  `color-mix(in srgb, ${hue} ${pct}%, ${base})`;

export const color = {
  canvas: '#f4f3ef',
  card,
  ink: '#0e0f11',
  text,
  text2: '#62666e',
  text3: '#9aa0a8',
  line: mix(text, 7),
  fill: mix(text, 4),
  accent: '#0E7A54',
  accentSoft: '#e6f7f0',
  danger: '#e5484d',
  tone: {
    neutral: { ink: '#4b5563', fill: mix('#9aa0a8', 13) },
    brand: { ink: '#0A5C40', fill: mix('#0E7A54', 13) },
    attention: { ink: '#8a6206', fill: mix('#e8a93b', 13) },
  },
  mix,
} as const;

export type Tone = keyof typeof color.tone;

export const radius = { xs: 6, sm: 11, md: 15, lg: 20, xl: 26, pill: 999 } as const;

export const shadow = {
  ring: '0 0 0 1px rgba(15, 15, 15, 0.06)',
  float: '0 0 0 1px rgba(15, 15, 15, 0.07), 0 16px 40px -20px rgba(16, 18, 22, 0.24)',
  modal: '0 0 0 1px rgba(15, 15, 15, 0.06), 0 32px 80px -24px rgba(16, 18, 22, 0.35)',
} as const;

export const font = {
  display: '"Satoshi", "Geist", system-ui, sans-serif',
  sans: '"Geist", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
} as const;

/** The rendered video. */
export const VIDEO = { width: 1920, height: 1080, fps: 30 } as const;

/** The logical size the app shell is drawn at; Stage scales it up to VIDEO. */
export const STAGE = { width: 1440, height: 810 } as const;
