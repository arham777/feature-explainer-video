import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { enter, progress } from '../lib/motion';
import { color, font } from '../theme';
import { LogoMark } from './primitives';

/** Intro and outro: the logo, a big title and one line, each rising in turn. */
export function TitleCard({ title, line }: { title: string; line: string }): React.JSX.Element {
  const frame = useCurrentFrame();
  const logo = progress(frame, 0, 24);
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
      <div style={{ opacity: logo, transform: `scale(${0.8 + 0.2 * logo})` }}>
        <LogoMark size={120} tilt={-22 + Math.sin(frame / 18) * 4} />
      </div>
      <div style={{ ...enter(frame, 8, 18, 22), fontSize: 92, fontWeight: 600, color: color.ink, letterSpacing: '-0.045em' }}>
        {title}
      </div>
      <div style={{ ...enter(frame, 16, 18, 18), fontSize: 32, color: color.text2, letterSpacing: '-0.01em' }}>{line}</div>
    </AbsoluteFill>
  );
}
