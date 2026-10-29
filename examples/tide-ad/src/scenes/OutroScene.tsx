import { Bank, Sparkle } from '@phosphor-icons/react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { TideMark } from '../app/bits';
import { EASE_OUT, pop, progress, tween } from '../lib/motion';
import { color, font, radius } from '../theme';
import { spokenAt, type Beats } from '../timeline';
import { Headline } from '../ui/Headline';
import { Narration } from '../ui/Narration';
import { Sfx } from '../ui/Sfx';

const MARK = 240;

/** The logo lands in a swelling accent disc, the name rises, then the promise and two facts. */
export function OutroScene({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tagAt = spokenAt('outro', 'Know where');
  const mark = pop(frame, 16, fps);
  const word = progress(frame, 26, 16, EASE_OUT);
  const chips = progress(frame, tagAt + 30, 14);

  return (
    <AbsoluteFill style={{ background: color.canvas, fontFamily: font.sans }}>
      <div style={{ position: 'absolute', left: 540, top: 720 }}>
        <div
          style={{
            position: 'absolute',
            width: 440,
            height: 440,
            left: -220,
            top: -220,
            borderRadius: '50%',
            background: color.accent,
            transform: `scale(${tween(frame, [2, 10, 26], [0, 0.2, 1.1])})`,
            opacity: 1 - progress(frame, 22, 14),
          }}
        />
        <div style={{ position: 'absolute', left: -MARK / 2, top: -MARK / 2, transform: `scale(${0.6 + mark * 0.4})`, opacity: Math.min(1, mark) }}>
          <TideMark size={MARK} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 880,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 130,
          fontWeight: 800,
          letterSpacing: -5,
          color: color.ink,
          opacity: word,
          transform: `translateY(${(1 - word) * 40}px)`,
        }}
      >
        Tide
      </div>
      <Headline
        words={[{ text: 'Know' }, { text: 'where' }, { text: 'it' }, { text: 'goes.', mark: true }]}
        at={tagAt}
        top={1130}
        size={92}
      />
      <div
        style={{
          position: 'absolute',
          top: 1420,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          opacity: chips,
          transform: `translateY(${(1 - chips) * 20}px)`,
        }}
      >
        {[
          { Icon: Sparkle, label: 'Free to start' },
          { Icon: Bank, label: 'All your accounts' },
        ].map(({ Icon, label }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 76,
              padding: '0 32px',
              borderRadius: radius.pill,
              background: color.card,
              boxShadow: '0 0 0 1px rgba(16,19,38,0.06)',
              color: color.ink,
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            <Icon size={32} weight="bold" color={color.accent} />
            {label}
          </div>
        ))}
      </div>
      <Sfx name="pop" at={2} />
      <Sfx name="whip" at={tagAt} />
      <Narration beats={beats} subtitles={false} />
    </AbsoluteFill>
  );
}
