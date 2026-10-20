import { X } from '@phosphor-icons/react';
import { DIALOG, DIALOG_PARTS } from '../geometry';
import { DUE_CHOICES, OWNER_CHOICES } from '../mock-data';
import { color, radius, shadow, STAGE } from '../theme';
import { Avatar } from './primitives';

export interface NewTaskDialogProps {
  /** 0 to 1: scrim and card in (a spring, so it may overshoot slightly). */
  open: number;
  name: string;
  nameFocus: number;
  /** Owner chip index picked, or -1; `ownerPick` animates the selection in. */
  owner: number;
  ownerPick: number;
  due: number;
  duePick: number;
  createPressed: number;
}

function Label({ top, children }: { top: number; children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{ position: 'absolute', left: DIALOG.pad, top: top - 24, fontSize: 13.5, fontWeight: 600, color: color.text2 }}>
      {children}
    </div>
  );
}

/** Lit-up state of a chip or segment: tint and a 2px accent ring. */
function picked(amount: number): React.CSSProperties {
  return {
    background: color.mix(color.accent, 10 * amount, color.fill),
    boxShadow: `inset 0 0 0 ${2 * amount}px ${color.accent}`,
    color: amount > 0.5 ? color.tone.blue.ink : color.text,
  };
}

export function NewTaskDialog(p: NewTaskDialogProps): React.JSX.Element | null {
  if (p.open <= 0.001) return null;
  const card = Math.min(p.open, 1.04);
  const chip = DIALOG_PARTS.ownerChips;
  const seg = DIALOG_PARTS.dueSegments;
  const btn = DIALOG_PARTS.createButton;
  const ready = p.name.length > 0 && p.owner >= 0;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          width: STAGE.width,
          height: STAGE.height,
          background: `rgba(17, 17, 19, ${0.26 * Math.min(p.open, 1)})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: DIALOG.x,
          top: DIALOG.y,
          width: DIALOG.w,
          height: DIALOG_PARTS.height,
          background: color.card,
          borderRadius: radius.lg + 4,
          boxShadow: shadow.modal,
          opacity: Math.min(p.open * 1.6, 1),
          transform: `translateY(${(1 - card) * 24}px) scale(${0.96 + 0.04 * card})`,
        }}
      >
        <div style={{ position: 'absolute', left: DIALOG.pad, top: 26, fontSize: 21, fontWeight: 600, color: color.ink, letterSpacing: '-0.02em' }}>
          New task
        </div>
        <div style={{ position: 'absolute', left: DIALOG.pad, top: 56, fontSize: 14.5, color: color.text2 }}>
          Everyone on the board sees it straight away.
        </div>
        <X size={20} color={color.text3} style={{ position: 'absolute', right: DIALOG.pad, top: 28 }} />

        <Label top={DIALOG_PARTS.nameInput.top}>Name</Label>
        <div
          style={{
            position: 'absolute',
            left: DIALOG.pad,
            right: DIALOG.pad,
            top: DIALOG_PARTS.nameInput.top,
            height: DIALOG_PARTS.nameInput.h,
            borderRadius: radius.sm + 2,
            background: color.fill,
            boxShadow: `inset 0 0 0 ${2 * p.nameFocus}px ${color.accent}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontSize: 16,
            color: p.name ? color.text : color.text3,
          }}
        >
          {p.name || 'What needs doing?'}
          {p.nameFocus > 0.5 && p.owner < 0 ? (
            <span style={{ width: 2, height: 20, background: color.accent, marginLeft: 1 }} />
          ) : null}
        </div>

        <Label top={chip.top}>Owner</Label>
        {OWNER_CHOICES.map((person, i) => (
          <div
            key={person.id}
            style={{
              position: 'absolute',
              left: DIALOG.pad + i * (chip.w + chip.gap),
              top: chip.top,
              width: chip.w,
              height: chip.h,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 8px',
              fontSize: 14,
              fontWeight: 500,
              ...picked(i === p.owner ? p.ownerPick : 0),
            }}
          >
            <Avatar person={person} size={24} />
            {person.name.split(' ')[0]}
          </div>
        ))}

        <Label top={seg.top}>Due</Label>
        {DUE_CHOICES.map((label, i) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: DIALOG.pad + i * (seg.w + seg.gap),
              top: seg.top,
              width: seg.w,
              height: seg.h,
              borderRadius: radius.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14.5,
              fontWeight: 500,
              ...picked(i === p.due ? p.duePick : 0),
            }}
          >
            {label}
          </div>
        ))}

        <div style={{ position: 'absolute', left: 0, right: 0, top: DIALOG_PARTS.footer.top, height: 1, background: color.fill2 }} />
        <div
          style={{
            position: 'absolute',
            right: DIALOG.pad + btn.w + 10,
            top: btn.top,
            height: btn.h,
            width: 88,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 500,
            color: color.text2,
          }}
        >
          Cancel
        </div>
        <div
          style={{
            position: 'absolute',
            right: DIALOG.pad,
            top: btn.top,
            width: btn.w,
            height: btn.h,
            borderRadius: 999,
            background: ready ? color.accent : color.mix(color.accent, 40),
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 600,
            transform: `scale(${1 - p.createPressed * 0.06})`,
          }}
        >
          Create
        </div>
      </div>
    </>
  );
}
