# How it works

This is what happens inside a video made by the skill, and why it is built this way. The code samples come from the example project in [`examples/orbit-demo`](../examples/orbit-demo), a walkthrough of a made-up task app called Orbit Tasks. Shared pieces live in `skills/feature-explainer-video/templates/`.

## The one big rule: everything is a function of the frame

Remotion renders a video by taking a screenshot of every frame, one at a time, often out of order and in parallel. A CSS transition or a framer-motion animation runs on the clock, not on the frame, so it comes out frozen or flickering.

So nothing in the video animates on its own. Every moving thing is a number computed from the current frame:

```tsx
const frame = useCurrentFrame();
const open = pop(frame, clickNew + 3, fps); // 0 before the click, springs to 1 after it
return <NewTaskDialog open={open} ... />;   // the dialog draws itself from that number
```

Each screen is rebuilt as a **props-only component** whose states are numbers from 0 to 1: `open`, `hover`, `pressed`, `checked`, `highlight`, `grow`. A component never fetches, never routes and never keeps its own state. The video can then show any moment exactly, frame by frame.

## Timeline: the voice sets the pace

The script is split into **beats**, one narrated line each. Beats are grouped into **chapters**, and each chapter is one continuous screen. Chapters crossfade into each other.

```ts
export const CHAPTERS = [
  { id: 'intro', beats: ['intro'] },
  { id: 'board', beats: ['create', 'add'] },
  { id: 'teammate', beats: ['notify', 'done'] },
  { id: 'outro', beats: ['outro'] },
];
```

A beat is as long as its line needs:

```
beat length = max(MIN_FRAMES, LEAD + audio + TAIL)
```

| Constant | Frames | Why |
|---|---|---|
| `LEAD` | 10 | A breath of silence before the voice starts, so the picture can move first |
| `TAIL` | 20 | Room after the line ends, so it never feels cut off |
| `TRANSITION` | 20 | The crossfade between chapters. Kept smaller than `LEAD + TAIL`, so two voices never overlap |
| `MIN_FRAMES` | per beat | For beats whose on-screen action takes longer than the words, such as a form being filled in |

`timeline.ts` reads `durations.json` (written by the voiceover step), so if you rewrite a line and record it again, the whole video retimes itself. You never edit a frame number by hand.

### Named moments

Inside a chapter, every key moment is computed from the start of its beat and given a name:

```tsx
const clickNew    = create.start + LEAD + 28;
const clickName   = clickNew + 26;
const pickOwner   = clickName + 70;
const pickDue     = pickOwner + 40;
const clickCreate = add.start + LEAD + 18;
const landed      = clickCreate + 16;
```

The cursor, the dialog states, the camera and the sound effects are all driven from these names. If a beat gets longer, everything that belongs to it moves with it.

## Layout you can aim at

The demo keeps every position in one file, [`src/geometry.ts`](../examples/orbit-demo/src/geometry.ts). The screens lay themselves out from those numbers, and the chapters aim the cursor and camera at the same numbers:

```ts
export const TARGETS = {
  newTask: { x: 1326, y: 72 },
  ownerChip: (index) => ...,
  createButton: ...,
};
```

So when a button moves, the cursor follows it. Nothing is measured twice.

## Animation helpers (`src/lib/motion.ts`)

| Helper | What it gives you | Used in the demo for |
|---|---|---|
| `EASE_OUT` | Your app's own easing curve (the templates ship `[0.16, 1, 0.3, 1]`) | Everything, so the video moves like the product |
| `progress(frame, start, duration)` | 0 to 1 over a window, eased and clamped | The tick filling in, a row growing in, focus rings |
| `tween(frame, input, output)` | Many keyframes, eased in and out | Cursor paths, camera moves, the progress bar, a highlight that holds then fades |
| `pop(frame, start, fps)` | A soft spring that overshoots slightly | The New task dialog, the notification card |
| `enter(frame, start)` | Fade and rise, as a style object | Title card text arriving line by line |
| `typed(text, frame, start)` | The part of a string typed so far | "Draft launch email" being typed in |

A new row grows its height from 0, so the list below glides down instead of jumping.

Keyframe arrays passed to `interpolate` must strictly increase. To hold a value, add a second key with the same value a few frames later.

## Camera (`src/ui/Stage.tsx`)

The app is drawn at a logical size of **1440 x 810** (`STAGE` in `theme.ts`). `Stage` scales it up to 1920 x 1080 and moves a camera over it. A camera key says "by frame `at`, be centred on point (x, y) at zoom `scale`":

```tsx
const camera: CameraKey[] = [
  { at: 0,               x: 720,  y: 405, scale: 1 },    // the whole board
  { at: clickNew - 18,   x: 1120, y: 200, scale: 1.35 }, // push in on New task
  { at: clickNew + 4,    x: 1120, y: 200, scale: 1.35 }, // hold through the click
  { at: clickNew + 26,   x: 720,  y: 370, scale: 1.12 }, // frame the dialog
  { at: clickCreate + 2, x: 720,  y: 370, scale: 1.12 },
  { at: clickCreate + 34, x: 720, y: 405, scale: 1 },    // pull back as the row lands
];
```

Framing rules learned the hard way:

- Keep the subject above the subtitle band, the bottom ~110 px of the frame.
- Don't zoom a tall dialog past about 1.2, or its top or bottom gets cropped.
- The camera never pans past the edge of the app. A target near the far right needs a lower zoom to be centred, or aim at the furthest point the camera can actually reach.

## Cursor (`src/ui/Cursor.tsx`)

The cursor is a list of keys in stage coordinates:

```tsx
const keys: CursorKey[] = [
  { at: 0, x: 800, y: 520 },
  { at: clickNew - 14, ...TARGETS.newTask },                  // arrive
  { at: clickNew, ...TARGETS.newTask, click: true },          // click
  { at: pickOwner - 14, ...TARGETS.ownerChip(MAYA) },
  { at: pickOwner, ...TARGETS.ownerChip(MAYA), click: true },
];
```

Between keys it glides on an ease-in-out curve. On a `click` the arrow squashes for 8 frames and leaves a soft ripple in the accent color. `pressAmount(keys, frame, clickNew)` gives 0 to 1 to 0 around the click, so the button underneath presses in at the same moment.

Cursor positions are checked against rendered stills, not just calculated. To fix a miss, divide the pixel error in the still by `base scale x camera zoom` to get the correction in stage pixels.

## Voiceover (`scripts/generate-voiceover.ts`)

- Voice: **Kokoro-82M** through `kokoro-js`. It is Apache 2.0, runs on the CPU, needs no API key, and nothing leaves your machine. The first run downloads about 90 MB.
- Default voice `af_heart`. Change it with `VOICE=am_michael pnpm voiceover`, and change the pace with `SPEED=1.1`.
- `src/voiceover/lines.ts` is the only place the script lives. Each line has an `id`, the `text` shown as a subtitle and, if needed, a `spoken` version for pronunciation. For example, a product called `Qx` can be spoken as `queue ex`.
- `pnpm voiceover` records every line. `pnpm voiceover create add` records only those two. Each run writes `public/voiceover/<id>.wav` and updates `src/voiceover/durations.json`.

How the narration is written:

- Short sentences, plain words, "you" for the person using the feature.
- No em dashes. They read badly as subtitles and TTS stumbles on them.
- Never mention a control that is not on screen at that moment.

## Subtitles (`src/ui/Narration.tsx`)

The same `text` that was spoken becomes the subtitle, so the two can never disagree. Each line is split into sentences, and each sentence stays on screen for its share of the clip, by character count. Subtitles fade in, rise 8 px, and fade out after the voice ends.

On title cards that already show their words, subtitles are switched off (`<Narration subtitles={false} />`).

## Sound effects (`src/ui/Sfx.tsx`)

Five short sounds, downloaded once into `public/sfx/` from `https://remotion.media/<name>.wav`, so renders work offline:

| Sound | Volume | Used in the demo for |
|---|---|---|
| `mouse-click` | 0.5 | Every cursor click |
| `whoosh` | 0.35 | Title cards, the dialog opening |
| `switch` | 0.35 | Picking an owner and a due day, ticking a task off |
| `page-turn` | 0.3 | The new row landing on the board |
| `ding` | 0.3 | The notification arriving |

Volumes are low on purpose so the sounds sit under the voice. A sound is placed at a named moment: `<Sfx name="mouse-click" at={clickNew} />`.

## Visuals: making it look like your app

- **Tokens.** Colors, tone pairs, radii, shadows and fonts are copied from your CSS into `src/theme.ts`. Every component uses those tokens, never a hard-coded color.
- **Fonts.** `src/fonts.ts` loads your app's own woff2 files from `public/fonts` and holds the first frame until they are ready, so no frame renders in a fallback font. `Stage` sets the font family on its root, so floating cards inherit it. (The demo has no app of its own, so it borrows Geist from Google Fonts.)
- **Copy and logic from your code.** `remotion.webpack.ts` adds an alias (`@app/shared`) to your app's shared package. Labels, hint text, limits and maths are imported from there. If the app says "8h a day", the video says it because the same constant is used.
- **Markup.** Each screen mirrors the real one: the same layout, the same order and the same wording. Use the app's own icon set; the templates include Phosphor.
- **Surfaces.** Cards sit on the page with a hairline ring and no border; only floating things (dialogs, notifications) get a real shadow.
- **Mock data** lives in `src/mock-data.ts`, and every person in it is made up.
- **Size.** 1920 x 1080 at 30 fps by default. The aspect ratio is one of the questions the skill asks.

## Checking and rendering

| Command | What it does |
|---|---|
| `pnpm studio` | Opens Remotion Studio to scrub through the video |
| `pnpm stills 206 330 590` | Renders just those frames at half size into `out/stills/`, from one bundle, in seconds |
| `pnpm typecheck` | Type checks the project |
| `pnpm render` | Renders the final MP4 to `out/` |

The skill renders stills from the middle of every action, looks at them, and fixes cursor misses, font fallbacks, crops and subtitle overlaps before the full render. In the demo, that pass caught a logo that read as a flat pill and a camera move that was being clamped away from the progress bar.

## Putting it together: one chapter

A trimmed version of [`BoardChapter.tsx`](../examples/orbit-demo/src/scenes/BoardChapter.tsx):

```tsx
export function BoardChapter({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { create, add } = beats;

  const clickNew = create.start + LEAD + 28;
  const clickCreate = add.start + LEAD + 18;
  const open = pop(frame, clickNew + 3, fps) * (1 - progress(frame, clickCreate + 4, 12));

  const keys: CursorKey[] = [/* see Cursor above */];
  const camera: CameraKey[] = [/* see Camera above */];

  return (
    <AbsoluteFill>
      <Stage camera={camera}>
        <AppShell viewer={PEOPLE.sam}>
          <Board rows={rows} newTaskPressed={pressAmount(keys, frame, clickNew)} ... />
          <NewTaskDialog open={open} name={typed(NEW_TASK.title, frame, clickName + 6, 0.9)} ... />
        </AppShell>
        <Cursor keys={keys} />
      </Stage>
      <Sfx name="mouse-click" at={clickNew} />
      <Sfx name="whoosh" at={clickNew + 3} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
```

`AppShell`, `Board` and `NewTaskDialog` are the rebuilt, props-only screens. `Stage`, `Cursor`, `Sfx`, `Narration` and the motion helpers come from the templates.
