import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { enter, pop, progress, tween } from '../lib/motion';
import { color, font } from '../theme';
import { LogoMark } from './primitives';

/**
 * Intro and outro: an accent disc swells out of the cut, the logo pops into
 * it as it clears, then the title and one line rise in turn.
 */
export function TitleCard({ title, line }: { title: string; line: string }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = pop(frame, 14, fps);
  return (
    <AbsoluteFill
      style={{
        background: color.canvas,
        fontFamily: font.sans,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div
          style={{
            position: 'absolute',
            left: -140,
            top: -140,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: color.accent,
            transform: `scale(${tween(frame, [0, 8, 24], [0, 0.25, 1.1])})`,
            opacity: 1 - progress(frame, 18, 14),
          }}
        />
        <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, logo), transform: `scale(${0.6 + 0.4 * logo})` }}>
          <LogoMark size={120} tilt={-22 + Math.sin(frame / 18) * 4} />
        </div>
      </div>
      <div style={{ ...enter(frame, 22, 18, 22), fontSize: 92, fontWeight: 600, color: color.ink, letterSpacing: '-0.045em' }}>
        {title}
      </div>
      <div style={{ ...enter(frame, 30, 18, 18), fontSize: 32, color: color.text2, letterSpacing: '-0.01em' }}>{line}</div>
    </AbsoluteFill>
  );
}
