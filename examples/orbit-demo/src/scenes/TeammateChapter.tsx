import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { checkCenter } from '../geometry';
import { pop, progress, tween } from '../lib/motion';
import { NEW_TASK, PEOPLE, WEEK_TASKS } from '../mock-data';
import { LEAD, type Beats } from '../timeline';
import { AppShell } from '../ui/AppShell';
import { Board, type BoardRow } from '../ui/Board';
import { Cursor, type CursorKey } from '../ui/Cursor';
import { Narration } from '../ui/Narration';
import { NotificationCard } from '../ui/NotificationCard';
import { Sfx } from '../ui/Sfx';
import { Stage, type CameraKey } from '../ui/Stage';

const NEW_ROW = WEEK_TASKS.length;

/** Maya's side: the notification arrives, then she ticks the task off. */
export function TeammateChapter({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { notify, done } = beats;

  const notifyAt = notify.start + LEAD + 6;
  const clickCheck = done.start + LEAD + 40;
  const ticked = clickCheck + 10;
  const check = checkCenter(NEW_ROW);

  const keys: CursorKey[] = [
    { at: 0, x: 820, y: 560 },
    { at: done.start + 10, x: 820, y: 560 },
    { at: clickCheck - 12, ...check },
    { at: clickCheck, ...check, click: true },
    { at: clickCheck + 40, x: 640, y: 540 },
  ];

  const camera: CameraKey[] = [
    { at: 0, x: 720, y: 405, scale: 1 },
    { at: notifyAt + 6, x: 1220, y: 66, scale: 1.3 },
    { at: done.start, x: 1220, y: 66, scale: 1.3 },
    { at: done.start + 30, x: 560, y: 600, scale: 1.2 },
    { at: clickCheck + 14, x: 560, y: 600, scale: 1.2 },
    // As far right and up as the camera can go at 1.3, so the bar and its count both show.
    { at: clickCheck + 44, x: 886, y: 311, scale: 1.3 },
  ];

  const rows: BoardRow[] = [
    ...WEEK_TASKS.map((task) => ({ task, grow: 1, checked: task.done ? 1 : 0 })),
    {
      task: NEW_TASK,
      grow: 1,
      checked: progress(frame, clickCheck + 1, 10),
      checkHover: progress(frame, clickCheck - 12, 8) * (1 - progress(frame, clickCheck + 4, 8)),
      highlight: tween(frame, [done.start + 20, done.start + 32, clickCheck + 20, clickCheck + 40], [0, 1, 1, 0]),
    },
  ];

  return (
    <AbsoluteFill>
      <Stage camera={camera}>
        <AppShell viewer={PEOPLE.maya}>
          <Board
            rows={rows}
            progress={tween(frame, [ticked, ticked + 24], [3 / 6, 4 / 6])}
            doneLabel={frame >= ticked ? '4 of 6 done' : '3 of 6 done'}
          />
          <NotificationCard
            appear={pop(frame, notifyAt, fps) * (1 - progress(frame, done.start + 6, 14))}
            from={PEOPLE.sam}
            task={NEW_TASK}
          />
        </AppShell>
        <Cursor keys={keys} appearAt={done.start} />
      </Stage>
      <Sfx name="ding" at={notifyAt} />
      <Sfx name="mouse-click" at={clickCheck} />
      <Sfx name="switch" at={ticked} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
