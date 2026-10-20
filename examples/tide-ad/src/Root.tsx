import { Composition } from 'remotion';
import { ProductAd } from './Ad';
import { loadFonts } from './fonts';
import { VIDEO } from './theme';
import { TOTAL_FRAMES } from './timeline';

loadFonts();

export function RemotionRoot(): React.JSX.Element {
  return (
    <Composition
      id="ProductAd"
      component={ProductAd}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
}
