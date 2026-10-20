import { Audio } from '@remotion/media';
import { interpolate, Sequence, staticFile } from 'remotion';

const BED = 0.12;
const SWELL = 0.2;

/**
 * The music bed (public/music/bed.wav, from `pnpm audio`). It fades in at
 * `from`, sits low under the voice, swells at `swellAt` (the logo) and fades
 * out by `end`. All three are frames in the whole video.
 */
export function Music({ from, swellAt, end }: { from: number; swellAt: number; end: number }): React.JSX.Element {
  const swell = swellAt - from;
  const stop = end - from;
  return (
    <Sequence from={from} name="music" layout="none">
      <Audio
        src={staticFile('music/bed.wav')}
        volume={(f) =>
          interpolate(f, [0, 20, swell, swell + 20, stop - 30, stop], [0, BED, BED, SWELL, SWELL, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
    </Sequence>
  );
}
