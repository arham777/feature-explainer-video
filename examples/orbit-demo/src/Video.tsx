import { fade } from '@remotion/transitions/fade';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { Fragment } from 'react';
import { AbsoluteFill } from 'remotion';
import { BoardChapter } from './scenes/BoardChapter';
import { TeammateChapter } from './scenes/TeammateChapter';
import { CHAPTERS, chapterBeats, chapterLength, TRANSITION, type Beats, type ChapterId } from './timeline';
import { Narration } from './ui/Narration';
import { Sfx } from './ui/Sfx';
import { TitleCard } from './ui/TitleCard';

/** Title cards show their own words, so they skip subtitles. */
function TitleChapter({ beats, title, line }: { beats: Beats; title: string; line: string }): React.JSX.Element {
  return (
    <AbsoluteFill>
      <TitleCard title={title} line={line} />
      <Sfx name="whoosh" at={2} />
      <Narration beats={beats} subtitles={false} />
    </AbsoluteFill>
  );
}

const SCENES: Record<ChapterId, (props: { beats: Beats }) => React.JSX.Element> = {
  intro: ({ beats }) => <TitleChapter beats={beats} title="Orbit Tasks" line="Plan the week with your team." />,
  board: BoardChapter,
  teammate: TeammateChapter,
  outro: ({ beats }) => <TitleChapter beats={beats} title="Orbit Tasks" line="Plan it. Share it. Ship it." />,
};

export function FeatureExplainer(): React.JSX.Element {
  return (
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
  );
}
