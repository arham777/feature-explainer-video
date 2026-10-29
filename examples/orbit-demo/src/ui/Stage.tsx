import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { tween } from '../lib/motion';
import { color, font, STAGE, VIDEO } from '../theme';

/** A camera position: zoom `scale` centred on stage point (x, y), reached at frame `at`. */
export interface CameraKey {
  at: number;
  x: number;
  y: number;
  scale: number;
}

const BASE_SCALE = VIDEO.width / STAGE.width;

/**
 * Draws an app screen at its logical size, scales it to 1080p, and moves a
 * camera over it: slow pushes in on whatever the narration is talking about.
 * Everything inside (cursor included) uses stage coordinates.
 */
export function Stage({ camera, children }: { camera: CameraKey[]; children: ReactNode }): React.JSX.Element {
  const frame = useCurrentFrame();
  const frames = camera.map((k) => k.at);
  const pick = (field: 'x' | 'y' | 'scale'): number =>
    camera.length === 1 ? camera[0][field] : tween(frame, frames, camera.map((k) => k[field]));
  const zoom = pick('scale');
  const cx = pick('x');
  const cy = pick('y');
  // Keep the focus point centred, but never pan past the stage's own edges.
  const half = (size: number) => size / 2 / zoom;
  const clampedX = Math.min(STAGE.width - half(STAGE.width), Math.max(half(STAGE.width), cx));
  const clampedY = Math.min(STAGE.height - half(STAGE.height), Math.max(half(STAGE.height), cy));

  return (
    <AbsoluteFill style={{ background: color.canvas, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: STAGE.width,
          height: STAGE.height,
          transformOrigin: '0 0',
          fontFamily: font.sans,
          transform: `scale(${BASE_SCALE * zoom}) translate(${STAGE.width / 2 / zoom - clampedX}px, ${STAGE.height / 2 / zoom - clampedY}px)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
