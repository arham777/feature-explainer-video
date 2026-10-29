import { Audio } from '@remotion/media';
import { Sequence, staticFile } from 'remotion';

/** Downloaded from remotion.media by `pnpm sfx`. */
export const REMOTE_SFX = ['whoosh', 'whip', 'mouse-click', 'ding', 'switch', 'page-turn'] as const;
/** Synthesised by `pnpm audio` (scripts/generate-audio.ts). */
export const SYNTH_SFX = ['impact', 'pop', 'riser'] as const;

export type SfxName = (typeof REMOTE_SFX)[number] | (typeof SYNTH_SFX)[number];

const VOLUME: Record<SfxName, number> = {
  whoosh: 0.35,
  whip: 0.28,
  'mouse-click': 0.5,
  ding: 0.3,
  switch: 0.35,
  'page-turn': 0.3,
  impact: 0.55,
  pop: 0.22,
  riser: 0.3,
};

/** A short sound at frame `at`, quiet enough to sit under the voice. */
export function Sfx({ name, at, volume }: { name: SfxName; at: number; volume?: number }): React.JSX.Element {
  return (
    <Sequence from={Math.max(0, Math.round(at))} durationInFrames={75} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? VOLUME[name]} />
    </Sequence>
  );
}
