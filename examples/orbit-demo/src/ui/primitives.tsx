import { Check } from '@phosphor-icons/react';
import type { Person } from '../mock-data';
import { CHECK_SIZE } from '../geometry';
import { color, font } from '../theme';

export function Avatar({ person, size = 28 }: { person: Person; size?: number }): React.JSX.Element {
  const tone = color.tone[person.tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: tone.fill,
        color: tone.ink,
        fontSize: size * 0.38,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      {person.initials}
    </div>
  );
}

/** A round tick box. `checked` runs 0 to 1, so the fill and tick can grow in. */
export function CheckCircle({ checked, hover = 0 }: { checked: number; hover?: number }): React.JSX.Element {
  return (
    <div
      style={{
        width: CHECK_SIZE,
        height: CHECK_SIZE,
        borderRadius: '50%',
        flexShrink: 0,
        position: 'relative',
        boxShadow: `inset 0 0 0 ${1.5 + hover * 0.5}px ${color.mix(color.text, 24 + hover * 30)}`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color.accent,
          transform: `scale(${checked})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Check size={13} weight="bold" color="#fff" style={{ opacity: checked }} />
      </div>
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: 999,
        background: color.fill,
        color: color.text2,
        fontFamily: font.mono,
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Orbit's logo: a planet with a tilted ring. The ring's back half is drawn
 * under the planet and its front half over it, so it reads as passing behind.
 */
export function LogoMark({ size = 28, tilt = -22 }: { size?: number; tilt?: number }): React.JSX.Element {
  const ring = { fill: 'none', stroke: color.accent, strokeWidth: 2.2, strokeLinecap: 'round' } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <g transform={`rotate(${tilt} 16 16)`}>
        <path d="M 2.5 16 A 13.5 4.6 0 0 1 29.5 16" {...ring} />
        <circle cx={16} cy={16} r={7.5} fill={color.ink} />
        <path d="M 2.5 16 A 13.5 4.6 0 0 0 29.5 16" {...ring} />
      </g>
    </svg>
  );
}
