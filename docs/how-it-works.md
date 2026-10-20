# How it works

This is what happens inside a video made by the skill, and why it is built this way. File names refer to `skills/feature-explainer-video/templates/`.

## The one big rule: everything is a function of the frame

Remotion renders a video by taking a screenshot of every frame, one at a time, often out of order and in parallel. A CSS transition or a framer-motion animation runs on the clock, not on the frame, so it comes out frozen or flickering.

So nothing in the video animates on its own. Every moving thing is a number computed from the current frame:

```tsx
const frame = useCurrentFrame();
const open = progress(frame, clickAsk, 14); // 0 before the click, 1 fourteen frames later
return <Dialog open={open} />;               // the dialog draws itself from that number
```

Each screen is rebuilt as a **props-only component** whose states are numbers from 0 to 1: `appear`, `open`, `hover`, `pressed`, `highlight`. A component never fetches, never routes and never keeps its own state. The video can then show any moment exactly, frame by frame.

## Timeline: the voice sets the pace

The script is split into **beats**, one narrated line each. Beats are grouped into **chapters**, and each chapter is one continuous screen. Chapters crossfade into each other.

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
const clickAsk  = beats.ask.start + LEAD + 30;
const pickType  = beats.types.start + LEAD + 40;
const clickSend = beats.send.start + LEAD + 120;
```

The cursor, the dialog states, the camera and the sound effects are all driven from these names. If a beat gets longer, everything that belongs to it moves with it.

## Animation helpers (`src/lib/motion.ts`)

| Helper | What it gives you | Typical use |
|---|---|---|
| `EASE_OUT` | Your app's own easing curve (the reference uses `[0.16, 1, 0.3, 1]`) | Everything, so the video moves like the product |
| `progress(frame, start, duration)` | 0 to 1 over a window, eased and clamped | Fades, slides, a dialog opening |
| `tween(frame, input, output)` | Many keyframes, eased in and out | Cursor paths, camera moves, hold then release |
| `pop(frame, start, fps)` | A soft spring that overshoots slightly | Dialogs, toasts, badges, notification cards |
| `enter(frame, start)` | Fade and rise, as a style object | Rows and cards arriving |
| `typed(text, frame, start)` | The part of a string typed so far | A reason being typed into a text box |

Rows that arrive grow their height from 0 (a small `Reveal` wrapper), so the list below glides down instead of jumping.

Keyframe arrays passed to `interpolate` must strictly increase. To hold a value, add a second key with the same value a few frames later.

## Camera (`src/ui/Stage.tsx`)

The app is drawn at a logical size of **1440 x 810** (`STAGE` in `theme.ts`). `Stage` scales it up to 1920 x 1080 and moves a camera over it. A camera key says "by frame `at`, be centred on point (x, y) at zoom `scale`":

```tsx
const camera: CameraKey[] = [
  { at: 0,             x: 720,  y: 405, scale: 1 },    // whole screen
  { at: clickAsk - 20, x: 1100, y: 200, scale: 1.25 }, // push in on the button
  { at: clickAsk + 10, x: 720,  y: 405, scale: 1.1 },  // ease back as the dialog opens
];
```

Framing rules learned the hard way:

- Keep the subject above the subtitle band, the bottom ~110 px of the frame.
- Don't zoom a tall dialog past about 1.2, or its top or bottom gets cropped.
- The camera never pans past the edge of the app. A target near the far right needs a lower zoom to be centred.

## Cursor (`src/ui/Cursor.tsx`)

The cursor is a list of keys in stage coordinates:

```tsx
const keys: CursorKey[] = [
  { at: beats.ask.start,  x: 700,  y: 420 },
  { at: clickAsk,         x: 1340, y: 64, click: true },
  { at: clickAsk + 12,    x: 1340, y: 64 },  // hold still for a moment after the click
];
```

Between keys it glides on an ease-in-out curve. On a `click` the arrow squashes for 8 frames and leaves a soft ripple in the accent color. `pressAmount(keys, frame, clickAsk)` gives 0 to 1 to 0 around the click, so the button underneath can press in at the same moment.

Cursor positions are checked against rendered stills, not just calculated. To fix a miss, divide the pixel error in the still by `base scale x camera zoom` to get the correction in stage pixels.

## Voiceover (`scripts/generate-voiceover.ts`)

- Voice: **Kokoro-82M** through `kokoro-js`. It is Apache 2.0, runs on the CPU, needs no API key, and nothing leaves your machine. The first run downloads about 90 MB.
- Default voice `af_heart`. Change it with `VOICE=am_michael pnpm voiceover`, and change the pace with `SPEED=1.1`.
- `src/voiceover/lines.ts` is the only place the script lives. Each line has an `id`, the `text` shown as a subtitle and, if needed, a `spoken` version for pronunciation. For example, `X-Loop` is spoken as `Ex Loop`.
- `pnpm voiceover` records every line. `pnpm voiceover send ask` records only those two. Each run writes `public/voiceover/<id>.wav` and updates `src/voiceover/durations.json`.

How the narration is written:

- Short sentences, plain words, "you" for the person using the feature.
- No em dashes. They read badly as subtitles and TTS stumbles on them.
- Never mention a control that is not on screen at that moment.

## Subtitles (`src/ui/Narration.tsx`)

The same `text` that was spoken becomes the subtitle, so the two can never disagree. Each line is split into sentences, and each sentence stays on screen for its share of the clip, by character count. Subtitles fade in, rise 8 px, and fade out after the voice ends.

On dark title or outro cards that already show their words, subtitles are switched off (`<Narration subtitles={false} />`).

## Sound effects (`src/ui/Sfx.tsx`)

Five short sounds, downloaded once into `public/sfx/` so renders work offline:

| Sound | Volume | Used for |
|---|---|---|
| `mouse-click` | 0.5 | Every cursor click |
| `whoosh` | 0.35 | Chapter changes, a dialog or panel sliding in |
| `ding` | 0.3 | A notification, a toast, an approval |
| `switch` | 0.35 | Toggles, tabs, picking an option |
| `page-turn` | 0.3 | Moving to another page |

Volumes are low on purpose so the sounds sit under the voice. A sound is placed with a named moment: `<Sfx name="mouse-click" at={clickAsk} />`.

## Visuals: making it look like your app

- **Tokens.** Colors, tone pairs, radii, shadows and fonts are copied from your CSS into `src/theme.ts`. Every component uses those tokens, never a hard-coded color.
- **Fonts.** `src/fonts.ts` loads your app's own woff2 files from `public/fonts` and holds the first frame until they are ready, so no frame renders in a fallback font. `Stage` sets the font family on its root, so floating cards inherit it.
- **Copy and logic from your code.** `remotion.webpack.ts` adds an alias (`@app/shared`) to your app's shared package. Labels, hint text, limits and maths are imported from there. If the app says "8h a day", the video says it because the same constant is used.
- **Markup.** Each screen mirrors the real one: the same layout, the same order and the same wording. The reference build uses the app's own icon set (Phosphor).
- **Mock data** lives in `src/mock-data.ts`, and every person in it is made up.
- **Size.** 1920 x 1080 at 30 fps by default. The aspect ratio is one of the questions the skill asks.

## Checking and rendering

| Command | What it does |
|---|---|
| `pnpm studio` | Opens Remotion Studio to scrub through the video |
| `pnpm stills 770 974 1190` | Renders just those frames at half size into `out/stills/`, from one bundle, in seconds |
| `pnpm typecheck` | Type checks the project |
| `pnpm render` | Renders the final MP4 to `out/`. About 5 minutes for 95 seconds of video |

The skill renders stills from the middle of every action, looks at them, and fixes cursor misses, font fallbacks, crops and subtitle overlaps before the full render.

## Putting it together: one chapter

```tsx
export function MemberChapter({ beats }: { beats: Beats }): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clickAsk = beats.ask.start + LEAD + 30;
  const dialog = pop(frame, clickAsk + 4, fps);

  const keys: CursorKey[] = [
    { at: beats.ask.start, x: 700, y: 420 },
    { at: clickAsk, x: 1340, y: 64, click: true },
    { at: clickAsk + 12, x: 1340, y: 64 },
  ];
  const camera: CameraKey[] = [
    { at: 0, x: 720, y: 405, scale: 1 },
    { at: clickAsk - 20, x: 1100, y: 200, scale: 1.25 },
    { at: clickAsk + 10, x: 720, y: 405, scale: 1.1 },
  ];

  return (
    <AbsoluteFill>
      <Stage camera={camera}>
        <LeavesPage askPressed={pressAmount(keys, frame, clickAsk)} />
        {dialog > 0 ? <AskDialog open={dialog} /> : null}
        <Cursor keys={keys} />
      </Stage>
      <Sfx name="mouse-click" at={clickAsk} />
      <Sfx name="whoosh" at={clickAsk + 4} />
      <Narration beats={beats} />
    </AbsoluteFill>
  );
}
```

`LeavesPage` and `AskDialog` are the rebuilt, props-only screens. Everything else comes from the templates.
