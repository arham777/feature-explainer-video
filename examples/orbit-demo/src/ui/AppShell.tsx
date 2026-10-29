import { CalendarBlank, CheckSquare, House, UsersThree } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { SIDEBAR_W } from '../geometry';
import type { Person } from '../mock-data';
import { color, radius, STAGE } from '../theme';
import { Avatar, LogoMark } from './primitives';

const NAV = [
  { label: 'Home', Icon: House },
  { label: 'Tasks', Icon: CheckSquare },
  { label: 'Calendar', Icon: CalendarBlank },
  { label: 'Team', Icon: UsersThree },
] as const;

/** Orbit's frame: a quiet sidebar and the page beside it, with Tasks selected. */
export function AppShell({ viewer, children }: { viewer: Person; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ position: 'absolute', width: STAGE.width, height: STAGE.height, background: color.canvas }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_W,
          background: color.sidebar,
          padding: '28px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 26px' }}>
          <LogoMark />
          <span style={{ fontSize: 19, fontWeight: 600, color: color.ink, letterSpacing: '-0.02em' }}>Orbit</span>
        </div>
        {NAV.map(({ label, Icon }) => {
          const active = label === 'Tasks';
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: radius.sm,
                background: active ? color.card : 'transparent',
                boxShadow: active ? '0 1px 2px rgba(17,17,19,0.06)' : 'none',
                color: active ? color.ink : color.text2,
                fontSize: 15,
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon size={19} weight={active ? 'fill' : 'regular'} />
              {label}
            </div>
          );
        })}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px' }}>
          <Avatar person={viewer} size={32} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: color.text }}>{viewer.name}</span>
            <span style={{ fontSize: 12.5, color: color.text2 }}>Product team</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
