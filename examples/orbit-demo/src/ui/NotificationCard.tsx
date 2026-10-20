import { Bell } from '@phosphor-icons/react';
import { NOTIFICATION } from '../geometry';
import type { Person, Task } from '../mock-data';
import { color, radius, shadow } from '../theme';
import { Avatar } from './primitives';

/** "Sam assigned you ..." sliding in from the right. `appear` is a spring 0 to 1. */
export function NotificationCard({ appear, from, task }: { appear: number; from: Person; task: Task }): React.JSX.Element | null {
  if (appear <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: NOTIFICATION.x,
        top: NOTIFICATION.y,
        width: NOTIFICATION.w,
        padding: '16px 18px',
        borderRadius: radius.lg,
        background: color.card,
        boxShadow: shadow.float,
        display: 'flex',
        gap: 14,
        opacity: Math.min(appear * 1.5, 1),
        transform: `translateX(${(1 - appear) * 60}px)`,
      }}
    >
      <Avatar person={from} size={36} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 14.5, color: color.text, lineHeight: 1.4 }}>
          <b style={{ fontWeight: 600 }}>{from.name}</b> assigned you <b style={{ fontWeight: 600 }}>{task.title}</b>
        </span>
        <span style={{ fontSize: 13, color: color.text2 }}>Due Friday · just now</span>
      </div>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: color.accentSoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Bell size={16} weight="fill" color={color.accent} />
      </div>
    </div>
  );
}
