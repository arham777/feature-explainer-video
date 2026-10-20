---
name: feature-explainer-video
description: Make a narrated, product-accurate explainer video of a feature in the user's own app with Remotion. It understands the feature from the code, writes a script, generates a free local voiceover (Kokoro TTS), rebuilds the app's real screens frame-driven in the project's own design tokens, and animates a cursor walkthrough with camera pushes, subtitles and SFX. Use when the user asks for a "feature video", "explainer video", "walkthrough video", "demo video of how X works", "video for admins/users showing the flow", or a Remotion video of their app's UI. Loads remotion-best-practices for Remotion API details.
---

# Feature explainer video

The result is a 60 to 120 second, 16:9 video. It looks like the real product, narrates
how a feature works for each role, and every label in it is true to the code.
`templates/` here holds the reusable plumbing. Its `lines.ts`, `timeline.ts` and
`theme.ts` are filled in with a worked example (Orbit Tasks, a made-up task
app): keep the shape, replace the content. The complete example project,
screens and chapters included, is `examples/orbit-demo` in
https://github.com/arham777/feature-explainer-video. Read it when in doubt.

Load `remotion-best-practices` before you write Remotion code. It covers
`interpolate`/`spring`, Sequences, transitions, and the fact that **CSS
animations and transitions are forbidden**.

## Phase 1: understand the feature (no code yet)

1. Map the feature end to end with an Explore agent. Cover:
   - routes and pages
   - the components and dialogs
   - the shared constants and SSOT (labels, types, hint copy, maths)
   - the lifecycle (statuses, who can do what)
   - notifications
   - limits and validation messages
   - role differences
   - design tokens (CSS variables, fonts, radii, icon library)
   - which components are props-only and which fetch or use router/context.
2. Tell the user in plain words what the feature does for each role, and give a
   **draft script table** (# · time · on screen · narration). Ask only what
   changes the build:
   - voiceover or captions only
   - aspect ratio
   - music or SFX only
   - real or made-up names
3. Wait for their answers before building.

## Phase 2: project setup

- Create a separate folder (e.g. `video/`) with **its own `pnpm-workspace.yaml`**
  (`packages: []`). It must not be a workspace member, so installs never relink
  the main app. Exclude it from the root `tsconfig` and eslint ignores.
- Copy `templates/` in and adapt:
  - the package name, and the composition id (`FeatureExplainer`) in the `render` script and `render-stills.ts`
  - the `@app/shared` alias in `remotion.webpack.ts` and `tsconfig.json`, pointed at the project's shared/SSOT code (drop it if there is none)
  - every token in `src/theme.ts`
  - the font list in `fonts.ts`; copy the app's own woff2 files into `public/fonts`
  - the `CHAPTERS` and `MIN_FRAMES` in `timeline.ts`
  - `lines.ts`, then delete the example `durations.json` (the voiceover step rewrites it).
- The templates stop at the plumbing. Write `src/index.ts`, `src/Root.tsx` (one
  `Composition` sized by `TOTAL_FRAMES`), the app shell, the chapters and small
  helpers such as `Reveal` yourself.
- Use the package manager the user prefers. Pin every `remotion` / `@remotion/*` package to the same exact version.
- Run `pnpm sfx` (`scripts/fetch-sfx.ts`) to download the SFX into `public/sfx`
  from `https://remotion.media/<name>.wav` (whoosh, mouse-click, ding, switch,
  page-turn), so renders work offline.

## Phase 3: voiceover (free, local)

- Use **Kokoro-82M via `kokoro-js`**, which is Apache 2.0, runs on the CPU and needs no API key. The default voice is `af_heart`.
  Only suggest ElevenLabs if the user asks for it.
- `src/voiceover/lines.ts` is the single source for both the audio and the
  subtitles. Use an optional `spoken` field for pronunciation (for example a product called "Qx" spoken as "queue ex").
- `scripts/generate-voiceover.ts` writes `public/voiceover/<id>.wav` and
  `src/voiceover/durations.json`. Run it in the background; the first run downloads about 90 MB.
- Beat length = `max(MIN_FRAMES, LEAD + audio + TAIL)`. Retiming = edit line,
  `pnpm voiceover <id>`, re-render. Keep `TRANSITION < LEAD + TAIL` so voices never overlap.
- Narration style: short sentences, second person for the member ("you"), plain
  words, and no em dashes.
- Don't promise UI that isn't there. If a line names a control, that control must be on screen.

## Phase 4: rebuild the screens

The app's real components usually can't render in Remotion: they animate with CSS, framer-motion or Radix, and they fetch data. Instead:

- Copy the tokens into `src/theme.ts`: colors, tone pairs, radii, shadows and fonts.
- Rebuild each surface as a **props-only component** whose every moving state is a
  number from 0 to 1 (`appear`, `open`, `hover`, `pressed`, `highlight`). Mirror the
  real markup and copy. Pull labels, hints and maths **from the shared SSOT**, never retyped.
- Draw the app shell at a logical size (e.g. 1440×810). `Stage` scales it to 1080p
  and runs a **camera** (keyframes `{at, x, y, scale}`) that pushes in on whatever
  the narration is talking about.
- Put mock data in `src/mock-data.ts`. Every person in it is **fictional**.

## Phase 5: choreography

- Each chapter is one continuous screen that narrates one or more beats, and the chapters crossfade into each other. Derive every key moment from `beats.<id>.start + LEAD`, never from absolute frames.
- Name the moments (`clickAsk`, `pickFriday`, `clickSend`) and drive everything from them:
  - cursor keys
  - dialog states
  - camera keys
  - SFX.
- Keyframe arrays passed to `interpolate` must strictly increase.
- Cursor: `Cursor` keys in stage coordinates; `pressAmount` squashes the button
  under a click. Hold a highlight before moving it back (add a hold key).
- Use the house easing curve (`EASE_OUT` in `motion.ts`) and `pop` springs for dialogs, toasts and badges.
  Rows enter with a `Reveal` height grow, so the list below glides down instead of jumping.
- Camera framing:
  - Keep the focus above the subtitle band (the bottom ~110px of 1080).
  - Don't zoom a tall dialog past ~1.2.
  - The camera clamps at the stage edges, so a far-right target needs a lower zoom.
- Turn subtitles off on dark scenes that already show their text.

## Phase 6: verify, then render

1. Run the project's typecheck.
2. `pnpm stills <frames…>` renders chosen frames from one bundle at half scale
   (`scripts/render-stills.ts`). Pick frames mid-action, read the PNGs, and fix:
   - cursor misalignment: convert pixel error ÷ (base scale × camera zoom) to stage pixels
   - font fallbacks: set `fontFamily` on the Stage root so floating cards inherit it
   - crops and subtitle overlap
   - highlight timing.
3. Run `pnpm render` in the background (about 5 minutes for 95s at 4x concurrency). Report the path, duration and size.
4. Write a short `README.md` in the video folder. Log the work wherever the project keeps its change log.

## Pitfalls already hit

- On Windows, multi-line bash heredocs that contain quotes or curly apostrophes can fail without writing anything. Write files with the file tool instead.
- `FontFaceSet.add` needs `"DOM.Iterable"` in `lib`.
- A dialog's computed layout drifts from estimates. Calibrate the cursor and popover offsets from stills, not from arithmetic alone.
- Flag any em dashes in the app's own UI copy that the video shows. Write them differently in the video and offer to fix them in the app.
