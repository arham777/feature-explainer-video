/**
 * The app's design tokens, copied from its CSS so the video wears the same
 * skin as the product. These values are the Orbit demo's; replace every one
 * with the app's own (colors, tone pairs, radii, shadows, fonts).
 */
const text = '#18181b';
const card = '#ffffff';
const mix = (hue: string, pct: number, base = card): string =>
  `color-mix(in srgb, ${hue} ${pct}%, ${base})`;

const accent = '#3b5bfd';

export const color = {
  canvas: '#f5f5f3',
  sidebar: '#efefec',
  card,
  ink: '#111113',
  text,
  text2: '#6b6b74',
  text3: '#a3a3ab',
  fill: mix(text, 4),
  fill2: mix(text, 8),
  accent,
  accentSoft: mix(accent, 10),
  danger: '#e5484d',
  tone: {
    blue: { ink: '#2f45c9', fill: mix(accent, 14) },
    green: { ink: '#1d7a46', fill: mix('#22a35a', 14) },
    amber: { ink: '#8a5a06', fill: mix('#e8a93b', 18) },
    rose: { ink: '#b4304d', fill: mix('#e5486d', 14) },
  },
  mix,
} as const;

export type Tone = keyof typeof color.tone;

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;

export const shadow = {
  ring: '0 0 0 1px rgba(17, 17, 19, 0.06)',
  float: '0 0 0 1px rgba(17, 17, 19, 0.06), 0 18px 44px -18px rgba(17, 17, 19, 0.28)',
  modal: '0 0 0 1px rgba(17, 17, 19, 0.06), 0 36px 90px -24px rgba(17, 17, 19, 0.4)',
} as const;

export const font = {
  sans: '"Geist", system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, monospace',
} as const;

/** The rendered video. */
export const VIDEO = { width: 1920, height: 1080, fps: 30 } as const;

/** The logical size the app shell is drawn at; Stage scales it up to VIDEO. */
export const STAGE = { width: 1440, height: 810 } as const;
