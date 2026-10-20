import { fade } from '@remotion/transitions/fade';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { Fragment } from 'react';
import { AbsoluteFill } from 'remotion';
import { BoardChapter } from './scenes/BoardChapter';
import { HookChapter } from './scenes/HookChapter';
import { TeammateChapter } from './scenes/TeammateChapter';
import {
  CHAPTERS,
  chapterBeats,
  chapterLength,
  chapterStart,
  TOTAL_FRAMES,
  TRANSITION,
  type Beats,
  type ChapterId,
} from './timeline';
import { Music } from './ui/Music';
import { Narration } from './ui/Narration';
import { Sfx } from './ui/Sfx';
import { TitleCard } from './ui/TitleCard';
import { Wipe } from './ui/Wipe';

/** Title cards show their own words, so they skip subtitles. */
function TitleChapter({ beats, title, line }: { beats: Beats; title: string; line: string }): React.JSX.Element {
  return (
    <AbsoluteFill>
      <TitleCard title={title} line={line} />
      <Sfx name="pop" at={14} />
      <Narration beats={beats} subtitles={false} />
    </AbsoluteFill>
  );
}

const SCENES: Record<ChapterId, (props: { beats: Beats }) => React.JSX.Element> = {
  hook: HookChapter,
  intro: ({ beats }) => <TitleChapter beats={beats} title="Orbit Tasks" line="The whole week, on one calm board." />,
  board: BoardChapter,
  teammate: TeammateChapter,
  outro: ({ beats }) => <TitleChapter beats={beats} title="Orbit Tasks" line="Plan it. Share it. Ship it." />,
};

/** The hard cut out of the hook lands mid crossfade, so the fade never shows. */
const HOOK_CUT = chapterStart('intro') + TRANSITION / 2;

export function FeatureExplainer(): React.JSX.Element {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {CHAPTERS.map((chapter, i) => {
          const Scene = SCENES[chapter.id];
          return (
            <Fragment key={chapter.id}>
              {i > 0 ? (
                <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION })} />
              ) : null}
              <TransitionSeries.Sequence durationInFrames={chapterLength(chapter.beats)} name={chapter.id}>
                <Scene beats={chapterBeats(chapter.beats)} />
              </TransitionSeries.Sequence>
            </Fragment>
          );
        })}
      </TransitionSeries>
      <Wipe at={HOOK_CUT} />
      <Music from={chapterStart('intro')} swellAt={chapterStart('outro')} end={TOTAL_FRAMES} />
      <Sfx name="riser" at={chapterStart('outro') - 34} />
    </AbsoluteFill>
  );
}
