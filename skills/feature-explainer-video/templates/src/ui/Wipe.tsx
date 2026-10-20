import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE_IN_OUT, tween } from '../lib/motion';
import { color, VIDEO } from '../theme';

const HALF = 9;
const TILT = 6;
/** Extra height so the tilted band still covers both corners. */
const OVERHANG = Math.tan((TILT * Math.PI) / 180) * (VIDEO.width / 2) + 60;
const BAND = VIDEO.height + OVERHANG * 2;

/**
 * An ink band with an accent leading edge that sweeps up over a cut: it
 * covers the frame at `at` and clears it HALF frames later. Use it for the
 * hard cut out of the hook, and between scenes in an ad.
 */
export function Wipe({ at }: { at: number }): React.JSX.Element | null {
  const frame = useCurrentFrame();
  if (frame < at - HALF || frame > at + HALF) return null;
  // 0 = below the frame, 1 = covering it, 2 = gone off the top.
  const p = tween(frame, [at - HALF, at, at + HALF], [0, 1, 2], EASE_IN_OUT);
  const top = VIDEO.height + OVERHANG - p * (VIDEO.height + OVERHANG * 2);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      <div
        style={{
          position: 'absolute',
          left: -200,
          right: -200,
          top,
          height: BAND,
          background: color.ink,
          transform: `rotate(-${TILT}deg)`,
        }}
      >
        <div style={{ height: 36, background: color.accent }} />
      </div>
    </AbsoluteFill>
  );
}
