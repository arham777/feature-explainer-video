import { Composition } from 'remotion';
import { loadFonts } from './fonts';
import { VIDEO } from './theme';
import { TOTAL_FRAMES } from './timeline';
import { FeatureExplainer } from './Video';

loadFonts();

export function RemotionRoot(): React.JSX.Element {
  return (
    <Composition
      id="FeatureExplainer"
      component={FeatureExplainer}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
}
