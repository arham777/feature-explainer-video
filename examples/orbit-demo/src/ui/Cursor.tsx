import { useCurrentFrame } from 'remotion';
import { progress, tween } from '../lib/motion';
import { color } from '../theme';

/** A point the pointer travels to, reached at frame `at`. `click` fires a press there. */
export interface CursorKey {
  at: number;
  x: number;
  y: number;
  click?: boolean;
}

const PRESS_FRAMES = 8;

/** Where the pointer is at `frame`, eased between keys. */
export function cursorPosition(keys: CursorKey[], frame: number): { x: number; y: number } {
  const frames = keys.map((k) => k.at);
  return { x: tween(frame, frames, keys.map((k) => k.x)), y: tween(frame, frames, keys.map((k) => k.y)) };
}

/** 0..1..0 press amount around each click, for buttons that should squash under it. */
export function pressAmount(keys: CursorKey[], frame: number, at: number): number {
  const key = keys.find((k) => k.at === at && k.click);
  if (!key) return 0;
  return tween(frame, [at, at + PRESS_FRAMES / 2, at + PRESS_FRAMES], [0, 1, 0]);
}

/**
 * The pointer: a macOS-style arrow that glides between keys, squashes on a
 * click and leaves a soft ripple behind.
 */
export function Cursor({ keys, appearAt = 0 }: { keys: CursorKey[]; appearAt?: number }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { x, y } = cursorPosition(keys, frame);
  const visible = progress(frame, appearAt, 10);
  const lastClick = [...keys].reverse().find((k) => k.click && frame >= k.at);
  const sinceClick = lastClick ? frame - lastClick.at : Infinity;
  const squash = sinceClick < PRESS_FRAMES ? tween(sinceClick, [0, PRESS_FRAMES / 2, PRESS_FRAMES], [1, 0.82, 1]) : 1;
  const ripple = sinceClick < 22 ? sinceClick / 22 : 1;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, opacity: visible }}>
      {lastClick && ripple < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: lastClick.x - 22,
            top: lastClick.y - 22,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: color.mix(color.accent, 22, 'transparent'),
            transform: `scale(${0.3 + ripple * 1.1})`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        width={26}
        height={30}
        viewBox="0 0 26 30"
        style={{
          position: 'absolute',
          left: x - 3,
          top: y - 2,
          transform: `scale(${squash})`,
          transformOrigin: '3px 2px',
          filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.28))',
        }}
      >
        <path
          d="M3 2 L3 24 L9 18.5 L13 27.5 L17 25.8 L13 17 L21 17 Z"
          fill="#111"
          stroke="#fff"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
