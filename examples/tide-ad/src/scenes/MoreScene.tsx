import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { GoalCard, SplitCard, SubscriptionCard } from '../app/FeatureCards';
import { pop, progress } from '../lib/motion';
import { color, radius, VIDEO } from '../theme';
import { spokenAt, type Beats } from '../timeline';
import { Headline } from '../ui/Headline';
import { Narration } from '../ui/Narration';
import { Sfx } from '../ui/Sfx';

const SCALE = 2.25;
const CARD_WIDTH = 360 * SCALE;

/**
 * One card in the deck. It flies in from the right, then each newer card
 * pushes it up and back, so the latest always sits front and centre.
 */
function DeckCard({ enter, pushes, tilt, children }: { enter: number; pushes: number; tilt: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: (VIDEO.width - CARD_WIDTH) / 2,
        top: 900,
        width: CARD_WIDTH,
        opacity: Math.min(1, enter),
        transform: [
          `translateX(${(1 - enter) * 900}px)`,
          `translateY(${-pushes * 170}px)`,
          `rotate(${(1 - enter) * 14 + tilt * (1 - pushes * 0.5)}deg)`,
          `scale(${SCALE * (1 - pushes * 0.1)})`,
        ].join(' '),
        transformOrigin: '0 0',
        zIndex: 10 - Math.round(pushes * 2),
      }}
    >
      <div style={{ width: 360, position: 'relative' }}>
        {children}
        {/* Cards behind sink into the page instead of turning see-through. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius.lg,
            background: color.canvas,
            opacity: Math.min(0.7, pushes * 0.45),
          }}
        />
      </div>
    </div>
  );
}

/** Three more features as a fast deck, each card on its own phrase. */
export function MoreScene({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subsAt = spokenAt('more', 'It finds');
  const splitAt = spokenAt('more', 'It splits');
  const goalAt = spokenAt('more', 'And it rounds');
  const enter = (at: number) => pop(frame, at, fps);
  const pushes = (...ats: number[]) => ats.reduce((sum, at) => sum + Math.min(1, pop(frame, at, fps)), 0);

  return (
    <AbsoluteFill style={{ background: color.canvas, overflow: 'hidden' }}>
      <Headline words={[{ text: 'Forgotten' }, { text: 'subscriptions?', mark: true }]} at={subsAt} out={splitAt - 8} top={190} size={104} />
      <Headline words={[{ text: 'Split' }, { text: 'the' }, { text: 'bill.', mark: true }]} at={splitAt} out={goalAt - 8} top={190} size={104} />
      <Headline words={[{ text: 'Saving' }, { text: 'on' }, { text: 'autopilot.', mark: true }]} at={goalAt} top={190} size={104} />
      <DeckCard enter={enter(subsAt)} pushes={pushes(splitAt, goalAt)} tilt={-2}>
        <SubscriptionCard />
      </DeckCard>
      <DeckCard enter={enter(splitAt)} pushes={pushes(goalAt)} tilt={2}>
        <SplitCard />
      </DeckCard>
      <DeckCard enter={enter(goalAt)} pushes={0} tilt={-1}>
        <GoalCard fill={progress(frame, goalAt + 8, 30)} />
      </DeckCard>
      <Sfx name="whip" at={subsAt} />
      <Sfx name="whip" at={splitAt} />
      <Sfx name="whip" at={goalAt} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
