# Examples

## The Orbit demo

[`orbit-demo/`](orbit-demo) is a complete project made with this skill, for **Orbit Tasks**, a made-up weekly task board. It is the source of the GIFs in the main README. Everything in it is fictional: the product, the logo and the people.

It shows the whole pattern in a small space:

| File | What it shows |
|---|---|
| [`src/voiceover/lines.ts`](orbit-demo/src/voiceover/lines.ts) | The script, one line per beat |
| [`src/timeline.ts`](orbit-demo/src/timeline.ts) | Chapters, and beats sized from the recorded voice |
| [`src/theme.ts`](orbit-demo/src/theme.ts) | Design tokens: colors, tones, radii, shadows, fonts |
| [`src/geometry.ts`](orbit-demo/src/geometry.ts) | One set of positions shared by the screens, the cursor and the camera |
| [`src/ui/`](orbit-demo/src/ui) | The rebuilt screens: app shell, board, dialog, notification, title card |
| [`src/scenes/BoardChapter.tsx`](orbit-demo/src/scenes/BoardChapter.tsx) | Named moments driving the cursor, dialog, camera and sound |
| [`src/scenes/TeammateChapter.tsx`](orbit-demo/src/scenes/TeammateChapter.tsx) | A second viewpoint: the notification arrives, the task is ticked off |

Run it yourself:

```bash
cd examples/orbit-demo
pnpm install          # or: npm install
pnpm sfx              # download the five sound effects
pnpm studio           # scrub through it in Remotion Studio
pnpm stills 206 330   # render single frames to out/stills/
pnpm render           # out/orbit-tasks.mp4
pnpm voiceover        # record the lines again (the WAVs are already included)
```

### Its script

The video runs 35 seconds. Each row is one narrated beat, and the time is where it starts.

| # | Time | On screen | Narration |
|---|---|---|---|
| 1 | 0:00 | Title card, the logo settles in | This is Orbit Tasks. One calm place to plan the week with your team. |
| 2 | 0:05 | The board. Camera pushes in on **New task**, the dialog opens, the name is typed, Maya and Friday are picked | Click New task. Give it a name, pick who owns it, and choose a due day. |
| 3 | 0:14 | Clicks **Create**, the row grows into the list, the progress count updates | Press Create, and the task lands on the board for everyone. |
| 4 | 0:18 | Maya's view. A notification slides in from the right | Maya gets a notification straight away, so nothing slips through. |
| 5 | 0:24 | Maya ticks the task off, then the camera moves to the progress bar as it fills | When the work is finished, tick it off. The week's progress moves on its own. |
| 6 | 0:30 | Outro card | Orbit Tasks. Plan it, share it, ship it. |

What to notice:

- Every control the narration names (New task, Create) is on screen when it is said.
- The same task appears in both chapters, seen by two people, so the viewer follows one story.
- The progress count changes from "3 of 5" to "3 of 6" to "4 of 6", because it is computed from the same rows the list shows.

## Prompts that work well

Name the feature, who the video is for, and anything you already know you want.

| You want | Ask |
|---|---|
| A standard explainer | "Make an explainer video of how invoices get approved, for staff and managers." |
| One role only | "Make a 60 second video for new admins showing how to invite a teammate and set their role." |
| A full flow with a loop back | "Make a walkthrough video of a support ticket: opened, assigned, sent back for details, then solved." |
| No voice | "Make a demo video of the reports page. Captions only, no voiceover." |
| Social media | "Make a 45 second vertical (9:16) video of the new search, with sound effects and no music." |
| A different voice | "Make the onboarding video, and use a male voice for the narration." |

The skill always comes back first with a plain description of the feature for each role and a draft script like the one above. You can change the wording, cut scenes, or reorder them before anything is built.
