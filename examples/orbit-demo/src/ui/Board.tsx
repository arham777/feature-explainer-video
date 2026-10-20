import { Plus } from '@phosphor-icons/react';
import { CHECK_SIZE, LIST, MAIN, NEW_TASK_BUTTON, PROGRESS_CARD } from '../geometry';
import { WEEK_LABEL, type Task } from '../mock-data';
import { color, font, radius, shadow } from '../theme';
import { Avatar, CheckCircle, Chip } from './primitives';

export interface BoardRow {
  task: Task;
  /** 0 to 1: how far the row has grown in (1 for rows already there). */
  grow: number;
  /** 0 to 1: how ticked off the row is. */
  checked: number;
  /** 0 to 1: the row lit up because the narration is about it. */
  highlight?: number;
  checkHover?: number;
}

export interface BoardProps {
  rows: BoardRow[];
  /** Fraction of the bar filled, animated separately from the label. */
  progress: number;
  doneLabel: string;
  newTaskPressed?: number;
  newTaskHover?: number;
}

function ProgressCard({ progress, doneLabel }: Pick<BoardProps, 'progress' | 'doneLabel'>): React.JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        left: PROGRESS_CARD.x,
        top: PROGRESS_CARD.y,
        width: PROGRESS_CARD.w,
        height: PROGRESS_CARD.h,
        background: color.card,
        borderRadius: radius.lg,
        boxShadow: shadow.ring,
        padding: '22px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: color.text }}>Week progress</span>
        <span style={{ fontFamily: font.mono, fontSize: 14, color: color.text2 }}>{doneLabel}</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: color.fill2, overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 999, background: color.accent }} />
      </div>
    </div>
  );
}

function Row({ row }: { row: BoardRow }): React.JSX.Element {
  const { task, grow, checked, highlight = 0, checkHover = 0 } = row;
  return (
    <div style={{ height: LIST.rowH * grow, overflow: 'hidden', opacity: grow }}>
      <div
        style={{
          height: LIST.rowH,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: `0 26px`,
          margin: '0 8px',
          borderRadius: radius.md,
          background: color.mix(color.accent, highlight * 7, 'transparent'),
          transform: `translateY(${(1 - grow) * 10}px)`,
        }}
      >
        <div style={{ marginLeft: -8 }}>
          <CheckCircle checked={checked} hover={checkHover} />
        </div>
        <span
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 500,
            color: checked > 0.5 ? color.text3 : color.text,
            textDecoration: checked > 0.5 ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 190 }}>
          <Avatar person={task.owner} size={26} />
          <span style={{ fontSize: 14.5, color: color.text2 }}>{task.owner.name}</span>
        </div>
        <div style={{ width: 64, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip>{task.due}</Chip>
        </div>
      </div>
    </div>
  );
}

/** The Tasks page: header, New task button, week progress and the task list. */
export function Board({ rows, progress, doneLabel, newTaskPressed = 0, newTaskHover = 0 }: BoardProps): React.JSX.Element {
  return (
    <>
      <div style={{ position: 'absolute', left: MAIN.x, top: 44 }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: color.ink, letterSpacing: '-0.03em' }}>This week</div>
        <div style={{ fontSize: 15, color: color.text2, marginTop: 4 }}>{WEEK_LABEL}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: NEW_TASK_BUTTON.x,
          top: NEW_TASK_BUTTON.y,
          width: NEW_TASK_BUTTON.w,
          height: NEW_TASK_BUTTON.h,
          borderRadius: 999,
          background: color.mix('#ffffff', newTaskHover * 14, color.ink),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 15,
          fontWeight: 600,
          transform: `scale(${1 - newTaskPressed * 0.06})`,
        }}
      >
        <Plus size={17} weight="bold" />
        New task
      </div>
      <ProgressCard progress={progress} doneLabel={doneLabel} />
      <div
        style={{
          position: 'absolute',
          left: LIST.x,
          top: LIST.y,
          width: LIST.w,
          background: color.card,
          borderRadius: radius.lg,
          boxShadow: shadow.ring,
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            height: LIST.headH,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: `0 ${26 + 8}px`,
            fontSize: 13,
            fontWeight: 500,
            color: color.text3,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ width: CHECK_SIZE - 8 }} />
          <span style={{ flex: 1 }}>Task</span>
          <span style={{ width: 190 }}>Owner</span>
          <span style={{ width: 64, textAlign: 'right' }}>Due</span>
        </div>
        {rows.map((row) => (
          <Row key={row.task.id} row={row} />
        ))}
      </div>
    </>
  );
}
