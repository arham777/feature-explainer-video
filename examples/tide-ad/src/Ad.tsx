import { AbsoluteFill, Sequence } from 'remotion';
import { BudgetScene } from './scenes/BudgetScene';
import { HomeScene } from './scenes/HomeScene';
import { HookScene } from './scenes/HookScene';
import { MoreScene } from './scenes/MoreScene';
import { OutroScene } from './scenes/OutroScene';
import { color, font } from './theme';
import { CHAPTERS, chapterBeats, chapterLength, chapterStart, TOTAL_FRAMES, type Beats, type ChapterId } from './timeline';
import { Music } from './ui/Music';
import { Sfx } from './ui/Sfx';
import { Wipe } from './ui/Wipe';

const SCENES: Record<ChapterId, (props: { beats: Beats }) => React.JSX.Element> = {
  hook: HookScene,
  home: HomeScene,
  budget: BudgetScene,
  more: MoreScene,
  outro: OutroScene,
};

/** Tide, 9:16: the problem, then each feature's answer, cut together with wipes. */
export function ProductAd(): React.JSX.Element {
  return (
    <AbsoluteFill style={{ background: color.canvas, fontFamily: font.sans }}>
      {CHAPTERS.map((chapter) => {
        const Scene = SCENES[chapter.id];
        return (
          <Sequence key={chapter.id} from={chapterStart(chapter.id)} durationInFrames={chapterLength(chapter.beats)} name={chapter.id}>
            <Scene beats={chapterBeats(chapter.beats)} />
          </Sequence>
        );
      })}
      {CHAPTERS.slice(1).map((chapter) => (
        <Wipe key={chapter.id} at={chapterStart(chapter.id)} />
      ))}
      {CHAPTERS.slice(1).map((chapter) => (
        <Sfx key={chapter.id} name="whoosh" at={chapterStart(chapter.id) - 9} />
      ))}
      <Sfx name="riser" at={chapterStart('outro') - 30} />
      <Music from={chapterStart('home')} swellAt={chapterStart('outro')} end={TOTAL_FRAMES} />
    </AbsoluteFill>
  );
}
