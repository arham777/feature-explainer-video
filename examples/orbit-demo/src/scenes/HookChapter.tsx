import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { pop, progress } from '../lib/motion';
import { PEOPLE, type Person } from '../mock-data';
import { color, font, VIDEO } from '../theme';
import { spokenAt, type Beats } from '../timeline';
import { Headline } from '../ui/Headline';
import { Narration } from '../ui/Narration';
import { Avatar } from '../ui/primitives';
import { Sfx } from '../ui/Sfx';

interface Message {
  from: Person;
  text: string;
  x: number;
  y: number;
  rot: number;
  at: number;
  file?: boolean;
}

/** The mess Orbit replaces, landing faster and faster. */
const MESSAGES: Message[] = [
  { from: PEOPLE.lena, text: 'Is anyone on the launch email?', x: 150, y: 120, rot: -4, at: 6 },
  { from: PEOPLE.omar, text: 'I thought Maya had it?', x: 1200, y: 90, rot: 3, at: 16 },
  { from: PEOPLE.maya, text: 'Wait, which sheet is current?', x: 620, y: 260, rot: -2, at: 26 },
  { from: PEOPLE.sam, text: 'tracker_v3_FINAL.xlsx', x: 1320, y: 400, rot: 5, at: 35, file: true },
  { from: PEOPLE.lena, text: 'Who owns the client demo?', x: 110, y: 520, rot: 3, at: 43 },
  { from: PEOPLE.omar, text: 'Can someone update the sheet', x: 760, y: 660, rot: -5, at: 50 },
  { from: PEOPLE.maya, text: 'Ping me when it is done', x: 1290, y: 640, rot: -2, at: 56 },
  { from: PEOPLE.sam, text: 'Did this ever get sent?', x: 230, y: 740, rot: 4, at: 61 },
];

const NIGHT = { bg: '#0e0e11', bubble: '#1c1c21', text: '#ececf0', muted: '#8b8b95' } as const;
const CENTER = { x: VIDEO.width / 2, y: VIDEO.height / 2 };

function Bubble({ message, index, appear, dim, collapse }: { message: Message; index: number; appear: number; dim: number; collapse: number }) {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame + index * 23) / 28) * 6;
  // Pulled toward the centre and shrunk as the hook collapses into the wipe.
  const pullX = (CENTER.x - (message.x + 220)) * collapse;
  const pullY = (CENTER.y - (message.y + 40)) * collapse;
  return (
    <div
      style={{
        position: 'absolute',
        left: message.x,
        top: message.y,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '16px 22px 16px 16px',
        borderRadius: 24,
        background: NIGHT.bubble,
        boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)',
        opacity: Math.min(1, appear) * (1 - dim * 0.62) * (1 - collapse),
        filter: `blur(${dim * 3}px)`,
        transform: [
          `translate(${pullX}px, ${pullY + drift + (1 - appear) * 40}px)`,
          `rotate(${message.rot * (1 - collapse)}deg)`,
          `scale(${(0.85 + appear * 0.15) * (1 - dim * 0.05) * (1 - collapse * 0.75)})`,
        ].join(' '),
      }}
    >
      <Avatar person={message.from} size={44} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: NIGHT.muted }}>{message.from.name}</span>
        <span
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: NIGHT.text,
            fontFamily: message.file ? font.mono : font.sans,
            letterSpacing: message.file ? 0 : '-0.01em',
          }}
        >
          {message.text}
        </span>
      </div>
    </div>
  );
}

/**
 * The cold open: the problem, before any product. Messages pile up in the
 * dark while the voice names the mess, the question slams in, then everything
 * is sucked into the centre for the wipe to the logo.
 */
export function HookChapter({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { hook } = beats;
  const question = hook.start + spokenAt('hook', 'nobody knows');
  const collapseAt = hook.start + hook.length - 26;

  const dim = progress(frame, question - 4, 12);
  const collapse = progress(frame, collapseAt, 18, Easing.in(Easing.cubic));
  const sinceSlam = frame - question;
  const shake = sinceSlam >= 0 && sinceSlam < 14 ? 7 * (1 - sinceSlam / 14) : 0;
  const push = 1 + frame * 0.0004;

  return (
    <AbsoluteFill style={{ background: NIGHT.bg, fontFamily: font.sans, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${color.mix(color.accent, 22, 'transparent')}, transparent 55%)`,
          opacity: dim * (1 - collapse),
        }}
      />
      <AbsoluteFill
        style={{
          transform: `translate(${Math.sin(frame * 2.7) * shake}px, ${Math.cos(frame * 3.1) * shake}px) scale(${push})`,
        }}
      >
        {MESSAGES.map((message, i) => (
          <Bubble
            key={message.text}
            message={message}
            index={i}
            appear={pop(frame, hook.start + message.at, fps)}
            dim={dim}
            collapse={collapse}
          />
        ))}
        <div style={{ opacity: 1 - collapse, transform: `scale(${1 - collapse * 0.3})`, transformOrigin: '50% 50%' }}>
          <Headline
            words={[{ text: "Who's" }, { text: 'on it?', mark: true }]}
            at={question}
            top={420}
            size={160}
            ink={NIGHT.text}
          />
        </div>
      </AbsoluteFill>
      {MESSAGES.map((message) => (
        <Sfx key={message.text} name="pop" at={hook.start + message.at} volume={0.16} />
      ))}
      <Sfx name="impact" at={question} />
      <Sfx name="whip" at={question + 2} />
      <Sfx name="whoosh" at={collapseAt + 4} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
