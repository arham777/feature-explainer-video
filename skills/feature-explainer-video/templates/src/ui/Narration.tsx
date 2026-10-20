import { Audio } from '@remotion/media';
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { progress } from '../lib/motion';
import { color, font } from '../theme';
import { LEAD, audioFrames, type Beats } from '../timeline';
import { VOICE_LINES } from '../voiceover/lines';

/** Splits a line into sentence-sized subtitle chunks. */
function chunks(text: string): string[] {
  return text.match(/[^.?!]+[.?!]+/g)?.map((s) => s.trim()) ?? [text];
}

/** One subtitle at a time, each held for its share of the spoken clip. */
function Subtitle({ text, frames }: { text: string; frames: number }): React.JSX.Element | null {
  const frame = useCurrentFrame() - LEAD;
  const parts = chunks(text);
  const total = parts.reduce((s, p) => s + p.length, 0);
  let start = 0;
  for (const part of parts) {
    const length = (part.length / total) * frames;
    if (frame < start + length || part === parts[parts.length - 1]) {
      const fadeIn = progress(frame, start, 6);
      const fadeOut = 1 - progress(frame, frames + 4, 8);
      const opacity = Math.min(fadeIn, fadeOut);
      if (opacity <= 0) return null;
      return (
        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46 }}>
          <div
            style={{
              maxWidth: 1300,
              padding: '12px 26px',
              borderRadius: 18,
              background: 'rgba(14, 15, 17, 0.82)',
              color: '#fff',
              fontFamily: font.sans,
              fontSize: 31,
              fontWeight: 500,
              lineHeight: 1.35,
              textAlign: 'center',
              letterSpacing: '-0.01em',
              opacity,
              transform: `translateY(${(1 - fadeIn) * 8}px)`,
              boxShadow: `0 10px 30px -12px ${color.ink}`,
            }}
          >
            {part}
          </div>
        </AbsoluteFill>
      );
    }
    start += length;
  }
  return null;
}

/** Voice and subtitles for every beat of a chapter, each in its own window. */
export function Narration({ beats, subtitles = true }: { beats: Beats; subtitles?: boolean }): React.JSX.Element {
  return (
    <>
      {Object.values(beats).map((beat) => {
        const line = VOICE_LINES.find((l) => l.id === beat.id);
        if (!line) throw new Error(`No voice line for beat "${beat.id}"`);
        return (
          <Sequence key={beat.id} from={beat.start} durationInFrames={beat.length} name={`vo:${beat.id}`}>
            <Sequence from={LEAD} layout="none">
              <Audio src={staticFile(`voiceover/${beat.id}.wav`)} />
            </Sequence>
            {subtitles ? <Subtitle text={line.text} frames={audioFrames(beat.id)} /> : null}
          </Sequence>
        );
      })}
    </>
  );
}
