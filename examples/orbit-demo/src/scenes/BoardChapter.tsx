import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { TARGETS } from '../geometry';
import { pop, progress, tween, typed } from '../lib/motion';
import { NEW_TASK, OWNER_CHOICES, PEOPLE, WEEK_TASKS } from '../mock-data';
import { LEAD, type Beats } from '../timeline';
import { AppShell } from '../ui/AppShell';
import { Board, type BoardRow } from '../ui/Board';
import { Cursor, pressAmount, type CursorKey } from '../ui/Cursor';
import { Narration } from '../ui/Narration';
import { NewTaskDialog } from '../ui/NewTaskDialog';
import { Sfx } from '../ui/Sfx';
import { Stage, type CameraKey } from '../ui/Stage';

const MAYA = OWNER_CHOICES.indexOf(PEOPLE.maya);
const FRIDAY = 2;

/** Sam opens New task, fills it in for Maya, and the row lands on the board. */
export function BoardChapter({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { create, add } = beats;

  const clickNew = create.start + LEAD + 28;
  const clickName = clickNew + 26;
  const pickOwner = clickName + 70;
  const pickDue = pickOwner + 40;
  const clickCreate = add.start + LEAD + 18;
  const landed = clickCreate + 16;

  const keys: CursorKey[] = [
    { at: 0, x: 800, y: 520 },
    { at: clickNew - 14, x: TARGETS.newTask.x, y: TARGETS.newTask.y },
    { at: clickNew, x: TARGETS.newTask.x, y: TARGETS.newTask.y, click: true },
    { at: clickName - 10, ...TARGETS.nameInput },
    { at: clickName, ...TARGETS.nameInput, click: true },
    { at: pickOwner - 14, ...TARGETS.ownerChip(MAYA) },
    { at: pickOwner, ...TARGETS.ownerChip(MAYA), click: true },
    { at: pickDue - 14, ...TARGETS.dueSegment(FRIDAY) },
    { at: pickDue, ...TARGETS.dueSegment(FRIDAY), click: true },
    { at: clickCreate - 16, ...TARGETS.createButton },
    { at: clickCreate, ...TARGETS.createButton, click: true },
    { at: clickCreate + 40, x: 900, y: 690 },
  ];

  const camera: CameraKey[] = [
    { at: 0, x: 720, y: 405, scale: 1 },
    { at: clickNew - 18, x: 1120, y: 200, scale: 1.35 },
    { at: clickNew + 4, x: 1120, y: 200, scale: 1.35 },
    { at: clickNew + 26, x: 720, y: 370, scale: 1.12 },
    { at: clickCreate + 2, x: 720, y: 370, scale: 1.12 },
    { at: clickCreate + 34, x: 720, y: 405, scale: 1 },
    { at: clickCreate + 80, x: 720, y: 470, scale: 1.1 },
  ];

  const open = pop(frame, clickNew + 3, fps) * (1 - progress(frame, clickCreate + 4, 12));
  const rows: BoardRow[] = [
    ...WEEK_TASKS.map((task) => ({ task, grow: 1, checked: task.done ? 1 : 0 })),
    {
      task: NEW_TASK,
      grow: progress(frame, landed - 4, 22),
      checked: 0,
      highlight: tween(frame, [landed + 10, landed + 22, landed + 90, landed + 110], [0, 1, 1, 0]),
    },
  ];
  const added = frame >= landed;

  return (
    <AbsoluteFill>
      <Stage camera={camera}>
        <AppShell viewer={PEOPLE.sam}>
          <Board
            rows={rows}
            progress={tween(frame, [landed, landed + 20], [3 / 5, 3 / 6])}
            doneLabel={added ? '3 of 6 done' : '3 of 5 done'}
            newTaskHover={progress(frame, clickNew - 14, 8) * (1 - progress(frame, clickNew + 10, 8))}
            newTaskPressed={pressAmount(keys, frame, clickNew)}
          />
          <NewTaskDialog
            open={open}
            name={typed(NEW_TASK.title, frame, clickName + 6, 0.9)}
            nameFocus={progress(frame, clickName, 6)}
            owner={frame >= pickOwner ? MAYA : -1}
            ownerPick={progress(frame, pickOwner, 8)}
            due={frame >= pickDue ? FRIDAY : -1}
            duePick={progress(frame, pickDue, 8)}
            createPressed={pressAmount(keys, frame, clickCreate)}
          />
        </AppShell>
        <Cursor keys={keys} appearAt={4} />
      </Stage>
      <Sfx name="mouse-click" at={clickNew} />
      <Sfx name="whoosh" at={clickNew + 3} />
      <Sfx name="mouse-click" at={clickName} />
      <Sfx name="switch" at={pickOwner} />
      <Sfx name="switch" at={pickDue} />
      <Sfx name="mouse-click" at={clickCreate} />
      <Sfx name="page-turn" at={landed} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
