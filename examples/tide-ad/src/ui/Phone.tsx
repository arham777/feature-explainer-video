import type { ReactNode } from 'react';
import { BatteryFull, CellSignalFull, WifiHigh } from '@phosphor-icons/react';
import { color, font, VIDEO } from '../theme';

/** A mobile app is drawn at its real dp size and scaled up into the frame. */
export const SCREEN = { width: 390, height: 844 } as const;
/** dp to video pixels. 1.6 fills a 9:16 frame below a headline; use ~1.0 in 16:9. */
export const DP = 1.6;
const BEZEL = 16;
export const PHONE = {
  width: SCREEN.width * DP + BEZEL * 2,
  height: SCREEN.height * DP + BEZEL * 2,
  left: (VIDEO.width - (SCREEN.width * DP + BEZEL * 2)) / 2,
  top: 500,
} as const;

/** Where a dp point inside the screen lands in the video frame (for taps and camera). */
export function onCanvas(x: number, y: number): { x: number; y: number } {
  return { x: PHONE.left + BEZEL + x * DP, y: PHONE.top + BEZEL + y * DP };
}

function StatusBar({ time }: { time: string }): React.JSX.Element {
  return (
    <div
      style={{
        height: 44,
        padding: '0 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 15,
        fontWeight: 600,
        color: color.ink,
      }}
    >
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
      <span style={{ display: 'flex', gap: 5 }}>
        <CellSignalFull size={17} weight="fill" />
        <WifiHigh size={17} weight="bold" />
        <BatteryFull size={20} weight="fill" />
      </span>
    </div>
  );
}

/**
 * A phone frame. `rise` (0 to 1) brings it up from below the frame; `tilt`
 * leans it back in 3D for hero moments.
 */
export function Phone({
  children,
  rise = 1,
  tilt = 0,
  time = '9:41',
}: {
  children: ReactNode;
  rise?: number;
  tilt?: number;
  time?: string;
}): React.JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        left: PHONE.left,
        top: PHONE.top,
        width: PHONE.width,
        height: PHONE.height,
        borderRadius: 48 * DP,
        background: '#0B0D14',
        padding: BEZEL,
        boxShadow: '0 30px 60px rgba(14,16,28,0.25), 0 80px 160px rgba(14,16,28,0.22)',
        transform: `perspective(2400px) translateY(${(1 - rise) * VIDEO.height * 0.8}px) rotateX(${tilt * 14}deg) rotateZ(${tilt * -3}deg)`,
        transformOrigin: '50% 100%',
      }}
    >
      <div
        style={{
          width: SCREEN.width * DP,
          height: SCREEN.height * DP,
          borderRadius: 38 * DP,
          overflow: 'hidden',
          position: 'relative',
          background: color.canvas,
        }}
      >
        <div
          style={{
            width: SCREEN.width,
            height: SCREEN.height,
            transform: `scale(${DP})`,
            transformOrigin: '0 0',
            fontFamily: font.sans,
            color: color.ink,
            position: 'relative',
          }}
        >
          <StatusBar time={time} />
          {children}
          <div
            style={{
              position: 'absolute',
              top: 11,
              left: SCREEN.width / 2 - 58,
              width: 116,
              height: 32,
              borderRadius: 999,
              background: '#0B0D14',
            }}
          />
        </div>
      </div>
    </div>
  );
}
