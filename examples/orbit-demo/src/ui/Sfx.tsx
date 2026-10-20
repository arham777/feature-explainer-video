import { Audio } from '@remotion/media';
import { Sequence, staticFile } from 'remotion';

/** The handful of sounds the video uses, vendored into public/sfx from remotion.media. */
export type SfxName = 'whoosh' | 'mouse-click' | 'ding' | 'switch' | 'page-turn';

const VOLUME: Record<SfxName, number> = {
  whoosh: 0.35,
  'mouse-click': 0.5,
  ding: 0.3,
  switch: 0.35,
  'page-turn': 0.3,
};

/** A short sound at frame `at`, quiet enough to sit under the voice. */
export function Sfx({ name, at }: { name: SfxName; at: number }): React.JSX.Element {
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={45} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={VOLUME[name]} />
    </Sequence>
  );
}
