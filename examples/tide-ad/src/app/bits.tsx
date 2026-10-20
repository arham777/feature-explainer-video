import type { CSSProperties, ReactNode } from 'react';
import { color, radius, shadow, type Tone } from '../theme';

/** Tide's logo: a violet tile with a white wave. */
export function TideMark({ size = 40 }: { size?: number }): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width={40} height={40} rx={12} fill={color.accent} />
      <path
        d="M8 23 C 12 17, 16 17, 20 23 S 28 29, 32 23"
        fill="none"
        stroke="#fff"
        strokeWidth={3.6}
        strokeLinecap="round"
      />
      <path d="M8 16 C 12 11, 16 11, 20 16 S 28 21, 32 16" fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={2.6} strokeLinecap="round" />
    </svg>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }): React.JSX.Element {
  return (
    <div style={{ background: color.card, borderRadius: radius.lg, boxShadow: shadow.ring, padding: 16, ...style }}>
      {children}
    </div>
  );
}

export function Dot({ tone, size = 34, children }: { tone: Tone; size?: number; children?: ReactNode }): React.JSX.Element {
  const t = color.tone[tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: t.fill,
        color: t.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

/** A thin rounded meter; `value` 0 to 1. */
export function Meter({ value, fill, height = 8 }: { value: number; fill: string; height?: number }): React.JSX.Element {
  return (
    <div style={{ height, borderRadius: 999, background: color.fill2, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(1, value) * 100}%`, height: '100%', borderRadius: 999, background: fill }} />
    </div>
  );
}

export function Label({ children }: { children: ReactNode }): React.JSX.Element {
  return <div style={{ fontSize: 13, fontWeight: 600, color: color.text2 }}>{children}</div>;
}
