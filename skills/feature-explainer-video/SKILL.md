---
name: feature-explainer-video
description: Make a narrated, product-accurate video of the user's own app with Remotion, either a feature walkthrough (16:9, cursor, camera pushes) or a product ad (9:16, phone, kinetic headlines, music). It understands the product from the code, writes a script that opens with a hook, generates a free local voiceover (Kokoro TTS), rebuilds the app's real screens frame-driven in the project's own design tokens, and adds subtitles, SFX and a synthesised music bed. Use when the user asks for a "feature video", "explainer video", "walkthrough video", "demo video of how X works", "product video", "app ad", "promo video", "launch video", "video for Reels/Shorts/TikTok", or a Remotion video of their app's UI. Loads remotion-best-practices for Remotion API details.
---

# Feature explainer video

The result looks like the real product, and every label in it is true to the
code. There are two kinds:

| | Feature walkthrough | Product ad |
|---|---|---|
| For | Teaching one feature, step by step, per role | Selling the whole product in one go |
| Shape | 16:9, 40 to 120 s | 9:16 (or 1:1), 25 to 60 s |
| Screen | Desktop app on a `Stage`, camera pushes, `Cursor` clicks | `Phone` frame, cards, a deck montage |
| Text | Subtitles | `Headline` per scene (one short claim) plus subtitles |
| Cuts | Crossfades between chapters, a `Wipe` out of the hook | A `Wipe` on every cut |
| Sound | Clicks and whooshes, music from the logo on | Music under everything after the hook, whips on headlines |

**Both open with a hook.** The first 3 to 8 seconds decide whether anyone keeps
watching, so never open on a logo. Open on the problem the product solves
(the mess, the pain, the question), as picture first and voice second, then
land the question as a `Headline` with an `impact`, then `Wipe` to the logo or
straight to the answer. See "The hook" below.

`templates/` here holds the reusable plumbing. Its `lines.ts`, `timeline.ts`
and `theme.ts` are filled in with a worked example (Orbit Tasks, a made-up
task app): keep the shape, replace the content. Two complete example projects
live in https://github.com/arham777/feature-explainer-video:
`examples/orbit-demo` (walkthrough) and `examples/tide-ad` (ad). Read the one
that matches when in doubt.

Load `remotion-best-practices` before you write Remotion code. It covers
`interpolate`/`spring`, Sequences, transitions, and the fact that **CSS
animations and transitions are forbidden**.

## Phase 1: understand the product (no code yet)

1. Map the feature (or, for an ad, the 3 to 5 strongest features) end to end with an Explore agent. Cover:
   - routes and pages
   - the components and dialogs
   - the shared constants and SSOT (labels, types, hint copy, maths)
   - the lifecycle (statuses, who can do what)
   - notifications
   - limits and validation messages
   - role differences
   - design tokens (CSS variables, fonts, radii, icon library)
   - which components are props-only and which fetch or use router/context
   - for an ad: the problem each feature answers, in the user's own words.
2. Tell the user in plain words what it does for each role, and give a
   **draft script table** (# · time · on screen · narration). Row 1 is always
   the hook. Ask only what changes the build:
   - walkthrough or ad (if the request did not say)
   - voiceover or captions only
   - aspect ratio
   - music, or SFX only
   - real or made-up names.
3. Wait for their answers before building.

## Phase 2: project setup

- Create a separate folder (e.g. `video/`) with **its own `pnpm-workspace.yaml`**
  (`packages: []`). It must not be a workspace member, so installs never relink
  the main app. Exclude it from the root `tsconfig` and eslint ignores.
- Copy `templates/` in and adapt:
  - the package name, and the composition id (`FeatureExplainer`) in the `render` script and `render-stills.ts`
  - the `@app/shared` alias in `remotion.webpack.ts` and `tsconfig.json`, pointed at the project's shared/SSOT code (drop it if there is none)
  - every token in `src/theme.ts`, and `VIDEO` (1080 x 1920 for 9:16)
  - the font list in `fonts.ts`; copy the app's own woff2 files into `public/fonts`
  - `CHAPTERS`, `LEADS` and `MIN_FRAMES` in `timeline.ts`. For an ad, one chapter per line and `TRANSITION = 0`
  - `lines.ts`, then delete the example `durations.json` (the voiceover step rewrites it).
- The templates stop at the plumbing. Write `src/index.ts`, `src/Root.tsx` (one
  `Composition` sized by `TOTAL_FRAMES`), the app shell or phone screens, the
  chapters and small helpers such as `Reveal` yourself. Drop the pieces the
  video does not use (`Stage` and `Cursor` in an ad, `Phone` in a walkthrough).
- Use the package manager the user prefers. Pin every `remotion` / `@remotion/*` package to the same exact version.
- `pnpm sfx` downloads whoosh, whip, mouse-click, ding, switch and page-turn
  from remotion.media into `public/sfx`. `pnpm audio` synthesises the music bed
  (`public/music/bed.wav`) and impact, pop and riser. Both run offline after
  that. Change `BPM` and `CHORDS` in `generate-audio.ts` to fit the mood: minor
  and slower for calm or serious, major and faster for upbeat.

## Phase 3: voiceover (free, local)

- Use **Kokoro-82M via `kokoro-js`**, which is Apache 2.0, runs on the CPU and needs no API key. The default voice is `af_heart`.
  Only suggest ElevenLabs if the user asks for it.
- `src/voiceover/lines.ts` is the single source for both the audio and the
  subtitles. Use an optional `spoken` field for pronunciation (for example a product called "Qx" spoken as "queue ex", or numbers in words).
- `scripts/generate-voiceover.ts` writes `public/voiceover/<id>.wav` and
  `src/voiceover/durations.json`. Run it in the background; the first run downloads about 90 MB.
- Beat length = `max(MIN_FRAMES, lead + audio + TAIL)`, where `lead` is `LEAD`
  unless `LEADS` gives the beat its own (the hook's silent picture). Retiming =
  edit line, `pnpm voiceover <id>`, re-render. Keep `TRANSITION < LEAD + TAIL` so voices never overlap.
- Narration style: short sentences, second person ("you"), plain words, and no em dashes.
  An ad line is one idea; the walkthrough can be a step.
- Don't promise UI that isn't there. If a line names a control, that control must be on screen.

## The hook

- **Problem first, product second.** Show the mess the product removes: a pile
  of chat messages, a balance draining under card payments, the lights going
  out. Make it the product's real problem, in its users' words.
- **Picture before voice.** `LEADS.hook` (30 to 40 frames) gives the hook a
  second of motion before the narration starts. Things should already be moving
  on frame 1.
- **Build, then slam.** Items land faster and faster (`pop` springs, a soft
  `pop` sound each, low volume). On the question's key phrase
  (`spokenAt('hook', '...')`) the `Headline` lands with `impact` + `whip`, a
  short camera shake, and the background blurs and dims behind it.
- **Dark, then light.** A dark hook makes the cut to the light product feel
  like relief. Collapse or blur the hook's items out, then `Wipe`.
- **Then the answer.** Walkthrough: the logo lands in a swelling accent disc
  (`riser` before it), then the first screen. Ad: straight to the phone rising
  with the first feature's headline.

## Phase 4: rebuild the screens

The app's real components usually can't render in Remotion: they animate with CSS, framer-motion or Radix, and they fetch data. Instead:

- Copy the tokens into `src/theme.ts`: colors, tone pairs, radii, shadows and fonts.
- Rebuild each surface as a **props-only component** whose every moving state is a
  number from 0 to 1 (`appear`, `open`, `hover`, `pressed`, `highlight`, `count`). Mirror the
  real markup and copy. Pull labels, hints and maths **from the shared SSOT**, never retyped.
- Walkthrough: draw the app shell at a logical size (e.g. 1440×810). `Stage` scales it to 1080p
  and runs a **camera** (keyframes `{at, x, y, scale}`) that pushes in on whatever
  the narration is talking about. Keep every position in one `geometry.ts` that
  both the screens and the cursor and camera read.
- Ad: draw mobile screens at their real dp size inside `Phone` (390 x 844, scaled
  by `DP`). `onCanvas(x, y)` maps a dp point to the frame for taps and zooms.
  Secondary features become cards in a deck that each fly in on their phrase.
- Put mock data in `src/mock-data.ts`. Every person in it is **fictional**.

## Phase 5: choreography

- Derive every key moment from the voice: `beats.<id>.start + spokenAt(id, 'phrase')`
  (or `+ LEAD + n` for an action right after a line starts). Never use absolute frames.
- Name the moments (`clickNew`, `pickOwner`, `nudgeAt`) and drive everything from them:
  - cursor keys
  - dialog states
  - camera keys
  - headlines
  - SFX.
- Keyframe arrays passed to `interpolate` must strictly increase.
- Cursor: `Cursor` keys in stage coordinates; `pressAmount` squashes the button
  under a click. Hold a highlight before moving it back (add a hold key).
- Use the house easing curve (`EASE_OUT` in `motion.ts`) and `pop` springs for dialogs, toasts, cards and badges.
  Rows enter with a `Reveal` height grow, so the list below glides down instead of jumping.
- Numbers count up (`count` 0 to 1) and meters fill instead of appearing finished.
- `Headline`: one claim per scene, 2 to 5 words, the payoff word `mark`ed. Swap
  headlines inside a scene with `out` on the old one.
- Camera framing:
  - Keep the focus above the subtitle band (the bottom ~110px of 1080, ~200px of 1920).
  - Don't zoom a tall dialog past ~1.2.
  - The camera clamps at the stage edges, so a far-right target needs a lower zoom.
- Turn subtitles off on title and logo cards that already show their words.
- Music: `<Music from={…} swellAt={logo} end={TOTAL_FRAMES} />`, entering after the hook, with a `riser` ~30 frames before the logo.

## Phase 6: verify, then render

1. Run the project's typecheck.
2. `pnpm stills <frames…>` renders chosen frames from one bundle at half scale
   (`scripts/render-stills.ts`). Pick frames mid-action (always one in the hook,
   one on the headline slam, one per scene), read the PNGs, and fix:
   - cursor misalignment: convert pixel error ÷ (base scale × camera zoom) to stage pixels
   - font fallbacks: set `fontFamily` on the Stage root so floating cards inherit it
   - crops and subtitle overlap
   - numbers or meters still at 0 while the voice talks about them
   - highlight timing.
3. Run `pnpm render` in the background (about 5 minutes for 95s at 4x concurrency). Report the path, duration and size.
4. Write a short `README.md` in the video folder. Log the work wherever the project keeps its change log.

## Pitfalls already hit

- On Windows, multi-line bash heredocs that contain quotes or curly apostrophes can fail without writing anything. Write files with the file tool instead.
- `FontFaceSet.add` needs `"DOM.Iterable"` in `lib`.
- A dialog's computed layout drifts from estimates. Calibrate the cursor and popover offsets from stills, not from arithmetic alone.
- A camera key the clamp cannot reach silently frames something else. Aim at the furthest point it can reach.
- The ffmpeg bundled with Remotion has no `fps` filter; use `-r` on the output when cutting GIFs.
- Flag any em dashes in the app's own UI copy that the video shows. Write them differently in the video and offer to fix them in the app.
