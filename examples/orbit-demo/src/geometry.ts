/**
 * Where things sit on the 1440 x 810 stage. The screens lay themselves out
 * from these numbers and the chapters aim the cursor and camera at them, so
 * the two can never drift apart.
 */
export const SIDEBAR_W = 232;
export const MAIN = { x: 272, w: 1128 } as const;

export const NEW_TASK_BUTTON = { x: 1252, y: 50, w: 148, h: 44 } as const;
export const PROGRESS_CARD = { x: MAIN.x, y: 128, w: MAIN.w, h: 96 } as const;

export const LIST = { x: MAIN.x, y: 248, w: MAIN.w, headH: 54, rowH: 62 } as const;
export const CHECK_SIZE = 22;
const CHECK_LEFT = 26;

export function rowTop(index: number): number {
  return LIST.y + LIST.headH + index * LIST.rowH;
}

export function checkCenter(index: number): { x: number; y: number } {
  return { x: LIST.x + CHECK_LEFT + CHECK_SIZE / 2, y: rowTop(index) + LIST.rowH / 2 };
}

/** The New task dialog, and its controls relative to the dialog's top left. */
export const DIALOG = { x: 450, y: 150, w: 540, pad: 28 } as const;
export const DIALOG_PARTS = {
  nameInput: { top: 134, h: 46 },
  ownerChips: { top: 222, h: 40, w: 112, gap: 10 },
  dueSegments: { top: 304, h: 40, w: 154, gap: 10 },
  footer: { top: 370 },
  createButton: { top: 386, h: 42, w: 104 },
  height: 446,
} as const;

function onDialog(left: number, top: number): { x: number; y: number } {
  return { x: DIALOG.x + left, y: DIALOG.y + top };
}

export const TARGETS = {
  newTask: { x: NEW_TASK_BUTTON.x + NEW_TASK_BUTTON.w / 2, y: NEW_TASK_BUTTON.y + NEW_TASK_BUTTON.h / 2 },
  nameInput: onDialog(DIALOG.pad + 160, DIALOG_PARTS.nameInput.top + DIALOG_PARTS.nameInput.h / 2),
  ownerChip: (index: number) => {
    const c = DIALOG_PARTS.ownerChips;
    return onDialog(DIALOG.pad + index * (c.w + c.gap) + c.w / 2, c.top + c.h / 2);
  },
  dueSegment: (index: number) => {
    const s = DIALOG_PARTS.dueSegments;
    return onDialog(DIALOG.pad + index * (s.w + s.gap) + s.w / 2, s.top + s.h / 2);
  },
  createButton: onDialog(
    DIALOG.w - DIALOG.pad - DIALOG_PARTS.createButton.w / 2,
    DIALOG_PARTS.createButton.top + DIALOG_PARTS.createButton.h / 2,
  ),
} as const;

export const NOTIFICATION = { x: 1036, y: 22, w: 364 } as const;
