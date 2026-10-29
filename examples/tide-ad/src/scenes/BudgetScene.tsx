import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { BudgetScreen } from '../app/BudgetScreen';
import { pop, progress, tween } from '../lib/motion';
import { NUDGE } from '../mock-data';
import { color } from '../theme';
import { spokenAt, type Beats } from '../timeline';
import { Headline } from '../ui/Headline';
import { Narration } from '../ui/Narration';
import { Phone, onCanvas } from '../ui/Phone';
import { Sfx } from '../ui/Sfx';

/** The budget fills toward its limit, and the nudge drops in before it is gone. */
export function BudgetScene({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nudgeAt = spokenAt('budget', 'nudges');
  const fill = tween(frame, [12, nudgeAt - 4], [NUDGE.from, NUDGE.to]);
  const nudge = pop(frame, nudgeAt, fps);
  // Push in on the top of the phone, where the notification lands.
  const focus = onCanvas(195, 120);
  const zoom = 1 + progress(frame, nudgeAt - 6, 26) * 0.14;
  return (
    <AbsoluteFill style={{ background: color.canvas, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${focus.x}px ${focus.y}px` }}>
        <Phone>
          <BudgetScreen fill={fill} nudge={nudge} />
        </Phone>
      </AbsoluteFill>
      <Headline
        words={[{ text: 'A' }, { text: 'nudge,' }, { text: 'not' }, { text: 'a' }, { text: 'surprise.', mark: true }]}
        at={4}
        top={150}
        size={104}
      />
      <Sfx name="whip" at={4} />
      <Sfx name="ding" at={nudgeAt} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
