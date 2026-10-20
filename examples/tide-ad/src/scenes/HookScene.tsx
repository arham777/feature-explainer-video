import { CreditCard } from '@phosphor-icons/react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { pop, progress, tween } from '../lib/motion';
import { BALANCE, CHARGES, money } from '../mock-data';
import { color, font } from '../theme';
import { spokenAt, type Beats } from '../timeline';
import { Headline } from '../ui/Headline';
import { Narration } from '../ui/Narration';
import { Sfx } from '../ui/Sfx';

const FIRST = 6;
const EVERY = 9;
const ROW = 132;
const SHOWN = 4;

const chargeAt = (i: number) => FIRST + i * EVERY;

/**
 * The cold open: card payments land faster than you can read them while the
 * balance drains, then the question slams in over the blur.
 */
export function HookScene({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const question = spokenAt('hook', 'So where');
  const lastCharge = chargeAt(CHARGES.length - 1);
  const balance = tween(frame, [FIRST, lastCharge + 10], [BALANCE.payday, BALANCE.now]);
  const low = progress(frame, lastCharge - 10, 16);
  const dim = progress(frame, question - 4, 12);
  const landed = CHARGES.filter((_, i) => frame >= chargeAt(i)).length;
  const sinceSlam = frame - question;
  const shake = sinceSlam >= 0 && sinceSlam < 14 ? 8 * (1 - sinceSlam / 14) : 0;
  const { night } = color;

  return (
    <AbsoluteFill style={{ background: night.bg, fontFamily: font.sans, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${color.mix(color.warn, 26 * low, 'transparent')}, transparent 60%)`,
        }}
      />
      <AbsoluteFill style={{ transform: `translate(${Math.sin(frame * 2.7) * shake}px, ${Math.cos(frame * 3.1) * shake}px)` }}>
        <div style={{ position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', opacity: 1 - dim * 0.5 }}>
          <div style={{ fontSize: 34, fontWeight: 600, color: night.muted }}>Balance</div>
          <div
            style={{
              fontSize: 190,
              fontWeight: 800,
              letterSpacing: -8,
              fontVariantNumeric: 'tabular-nums',
              color: color.mix(color.warn, low * 100, night.text),
            }}
          >
            {money(Math.round(balance))}
          </div>
          <div style={{ fontSize: 30, color: night.muted }}>Payday was 10 days ago</div>
        </div>

        {CHARGES.map((charge, i) => {
          const appear = pop(frame, chargeAt(i), fps);
          if (appear <= 0.001) return null;
          // Newest on top; each later charge pushes this one down a row.
          const depth = Math.max(0, landed - 1 - i);
          const y = 620 + Math.min(depth, SHOWN) * ROW;
          const gone = depth >= SHOWN ? 1 : 0;
          return (
            <div
              key={charge.merchant}
              style={{
                position: 'absolute',
                left: 70,
                right: 70,
                top: y,
                height: ROW - 18,
                padding: '0 30px',
                borderRadius: 32,
                background: night.surface,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                opacity: Math.min(1, appear) * (1 - gone) * (1 - depth * 0.16) * (1 - dim * 0.7),
                filter: `blur(${dim * 4}px)`,
                transform: `translateY(${(1 - appear) * -90}px) scale(${1 - depth * 0.025})`,
                zIndex: 10 - depth,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: color.mix(color.warn, 20, night.surface),
                  color: color.warn,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCard size={34} weight="fill" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 24, color: night.muted, fontWeight: 600 }}>Card payment</div>
                <div style={{ fontSize: 34, color: night.text, fontWeight: 700 }}>{charge.merchant}</div>
              </div>
              <div style={{ fontSize: 38, fontWeight: 800, color: color.warn, fontVariantNumeric: 'tabular-nums' }}>
                -{money(charge.amount, 2)}
              </div>
            </div>
          );
        })}

        <Headline
          words={[{ text: 'Where' }, { text: 'did' }, { text: 'it' }, { text: 'go?', mark: true }]}
          at={question}
          top={1170}
          size={140}
          ink={night.text}
        />
      </AbsoluteFill>
      {CHARGES.map((charge, i) => (
        <Sfx key={charge.merchant} name="pop" at={chargeAt(i)} volume={0.16} />
      ))}
      <Sfx name="impact" at={question} />
      <Sfx name="whip" at={question + 2} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
