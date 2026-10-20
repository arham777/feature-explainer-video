import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { HomeScreen } from '../app/HomeScreen';
import { pop, progress } from '../lib/motion';
import { color } from '../theme';
import { spokenAt, type Beats } from '../timeline';
import { Headline } from '../ui/Headline';
import { Narration } from '../ui/Narration';
import { Phone } from '../ui/Phone';
import { Sfx } from '../ui/Sfx';

/** The answer: the phone rises, the safe-to-spend number counts up, the meters fill. */
export function HomeScene({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = pop(frame, 6, fps);
  const safeAt = spokenAt('home', 'safe to spend');
  return (
    <AbsoluteFill style={{ background: color.canvas, overflow: 'hidden' }}>
      <Headline
        words={[{ text: 'Every' }, { text: 'account.' }, { text: 'One place.', mark: true }]}
        at={4}
        top={150}
        size={104}
      />
      <AbsoluteFill style={{ transform: `scale(${1 + progress(frame, 20, 140) * 0.04})`, transformOrigin: '50% 40%' }}>
        <Phone rise={rise} tilt={1 - progress(frame, 6, 40)}>
          <HomeScreen count={progress(frame, 22, 44)} bars={progress(frame, 30, 40)} />
        </Phone>
      </AbsoluteFill>
      <Sfx name="whip" at={4} />
      <Sfx name="ding" at={safeAt + 20} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
