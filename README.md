# Feature Explainer Video

An agent skill that turns a feature in **your own app** into a narrated, 60 to 120 second explainer video.

It reads your code to understand the feature, writes a script for you to approve, records a free voiceover on your machine, and rebuilds your real screens in your own colors and fonts. Then it animates a cursor walkthrough with camera moves, subtitles and sound effects. Every label in the video comes from your code, so the video never shows something the product doesn't do.

Built on [Remotion](https://www.remotion.dev) and [Kokoro TTS](https://huggingface.co/hexgrad/Kokoro-82M). No API keys, no paid voice service.

| A member asks for leave | An admin decides | A reviewer opens the request |
|---|---|---|
| ![Member picks a leave type in the Ask for leave dialog](assets/member-asks.gif) | ![Admin approves a request with a note](assets/admin-decides.gif) | ![Reviewer sees the request in Waiting on you](assets/admin-reviews.gif) |

*Clips from two 95 second videos this skill made: "Leaves" and "Approvals" in a team portal. All names in them are made up.*

## Install

### With the skills CLI (works with Claude Code, Cursor, Codex and more)

| What | pnpm | npm |
|---|---|---|
| Install for this project | `pnpm dlx skills add arham777/feature-explainer-video` | `npx skills add arham777/feature-explainer-video` |
| Install for every project | `pnpm dlx skills add arham777/feature-explainer-video -g` | `npx skills add arham777/feature-explainer-video -g` |
| Only for Claude Code | `pnpm dlx skills add arham777/feature-explainer-video -a claude-code` | `npx skills add arham777/feature-explainer-video -a claude-code` |
| Get the latest version | `pnpm dlx skills update feature-explainer-video` | `npx skills update feature-explainer-video` |
| See what is installed | `pnpm dlx skills list` | `npx skills list` |
| Remove it | `pnpm dlx skills remove feature-explainer-video` | `npx skills remove feature-explainer-video` |

The skill is copied onto your machine when you install it. Updates don't arrive by themselves, so run `update` to get a new version.

### As a Claude Code plugin

Inside Claude Code:

```
/plugin marketplace add arham777/feature-explainer-video
/plugin install feature-explainer-video@arham777-skills
```

### By hand

Copy `skills/feature-explainer-video/` into `~/.claude/skills/` for every project, or into `.claude/skills/` for one project.

### It also needs

- The **`remotion-best-practices`** skill. This skill loads it before writing any Remotion code:
  `pnpm dlx skills add remotion-dev/skills` (or `npx skills add remotion-dev/skills`)
- Node 18 or newer.
- About 90 MB of disk for the voice model, downloaded on the first run.

## Use it

Open your app's repo in your agent and ask for a video. For example:

> Make an explainer video of how leave requests work, for members and admins.

> Make a walkthrough video of the new approvals flow: submit, review, reject with a reason, fix and approve.

> I need a 90 second demo video of the invoice screen for our sales team. Captions only, no voice.

The skill first tells you what the feature does for each role and shows a draft script as a table. It only starts building after you say yes. More prompts and a full sample script are in [examples/](examples/README.md).

## How it works

| Step | What happens |
|---|---|
| 1. Understand | Maps the feature from the code: pages, dialogs, statuses, roles, limits, notifications, error messages and design tokens. |
| 2. Script | Shows a script table (time, what is on screen, what is said) and asks a few questions: voice or captions, aspect ratio, sound, names. |
| 3. Set up | Creates a separate `video/` folder with its own lockfile, so it never touches your app's install. |
| 4. Voiceover | Records every line locally with Kokoro. Each scene stretches to fit its line, so audio and picture always stay in sync. |
| 5. Screens | Rebuilds each screen as a simple component in your own colors, fonts and copy. Labels and maths are imported from your code, not retyped. |
| 6. Motion | Moves the cursor, presses buttons, opens dialogs, pushes the camera in and plays clicks and whooshes, all timed to the narration. |
| 7. Check and render | Renders single frames to check alignment, fixes what is off, then renders the 1080p MP4. |

The full guide, covering animation, camera, cursor, voice, subtitles, sound effects and visuals, is in **[docs/how-it-works.md](docs/how-it-works.md)**.

## What is in this repo

```
skills/feature-explainer-video/
  SKILL.md                     the instructions the agent follows
  templates/                   plumbing copied into every new video project
    package.json               Remotion, kokoro-js, scripts (studio, voiceover, stills, render)
    remotion.webpack.ts        alias to your app's shared code, so labels stay true
    scripts/generate-voiceover.ts   lines.ts to WAV files and durations.json
    scripts/render-stills.ts        renders chosen frames for checking
    src/theme.ts               your design tokens, the video size and the stage size
    src/fonts.ts               loads your app's own font files before frame one
    src/timeline.ts            beat and chapter lengths, sized from the voiceover
    src/lib/motion.ts          easing curve, tween, spring pop, typing effect
    src/ui/Stage.tsx           scales the app to 1080p and runs the camera
    src/ui/Cursor.tsx          the pointer: glide, click squash, ripple
    src/ui/Narration.tsx       voice clips and timed subtitles
    src/ui/Sfx.tsx             click, whoosh, ding, switch and page-turn sounds
    src/voiceover/lines.ts     the script (one place for audio and subtitles)
docs/how-it-works.md           the deep dive
examples/README.md             prompts and a full sample script
```

## Licenses

- This skill: [MIT](LICENSE).
- **Remotion** has its own license. It is free for individuals and for companies of up to 3 people. Bigger companies need a [company license](https://www.remotion.dev/license) to render videos with it.
- **Kokoro-82M** is Apache 2.0.
- Sound effects are downloaded from `remotion.media` when a project is set up. They are not stored in this repo.
