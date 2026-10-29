# Examples

Two complete projects made with this skill, one of each kind. Everything in them is made up: the products, the logos and the people.

| | [Orbit Tasks](orbit-demo) | [Tide](tide-ad) |
|---|---|---|
| Kind | Feature walkthrough | Product ad |
| Format | 16:9, 41 s | 9:16, 31 s |
| The product | A weekly task board for a small team | A personal money app |
| Shows | One feature, start to finish, from two people's side | Four features, one claim each |
| Hook | Team messages pile up: **Who's _on it?_** | The balance drains under card payments: **Where did it _go?_** |
| Screens | Desktop app on a moving camera, cursor clicks | Phone frame, kinetic headlines, a card deck |

Run either one:

```bash
cd examples/orbit-demo     # or examples/tide-ad
pnpm install               # or: npm install
pnpm sfx                   # download the sound effects
pnpm audio                 # synthesise the music bed, impact, pop and riser
pnpm studio                # scrub through it in Remotion Studio
pnpm render                # out/orbit-tasks.mp4 or out/tide-ad.mp4
pnpm voiceover             # record the lines again (the WAVs are already included)
```

## Orbit Tasks: a feature walkthrough

| File | What it shows |
|---|---|
| [`src/scenes/HookChapter.tsx`](orbit-demo/src/scenes/HookChapter.tsx) | The cold open: messages build, the question slams in, everything collapses into the wipe |
| [`src/voiceover/lines.ts`](orbit-demo/src/voiceover/lines.ts) | The script, one line per beat |
| [`src/timeline.ts`](orbit-demo/src/timeline.ts) | Chapters, beats sized from the recorded voice, `spokenAt` |
| [`src/geometry.ts`](orbit-demo/src/geometry.ts) | One set of positions shared by the screens, the cursor and the camera |
| [`src/ui/`](orbit-demo/src/ui) | The rebuilt screens: app shell, board, dialog, notification, title card |
| [`src/scenes/BoardChapter.tsx`](orbit-demo/src/scenes/BoardChapter.tsx) | Named moments driving the cursor, dialog, camera and sound |
| [`src/scenes/TeammateChapter.tsx`](orbit-demo/src/scenes/TeammateChapter.tsx) | A second viewpoint: the notification arrives, the task is ticked off |
| [`src/Video.tsx`](orbit-demo/src/Video.tsx) | Crossfades, the wipe out of the hook, the music and the riser |

| # | Time | On screen | Narration |
|---|---|---|---|
| 1 | 0:00 | Dark screen. Team messages pile up faster and faster. **Who's on it?** slams in and the mess blurs back, then collapses into a wipe | Three group chats, two spreadsheets, and still nobody knows who is sending the launch email. |
| 2 | 0:07 | An accent disc swells, the logo pops in, the name rises. Music starts | Orbit Tasks puts the whole week on one calm board. |
| 3 | 0:11 | The board. Camera pushes in on **New task**, the dialog opens, the name types itself, Maya and Friday are picked | Click New task. Give it a name, pick who owns it, and choose a due day. |
| 4 | 0:20 | Clicks **Create**, the row grows into the list, the count goes from 3 of 5 to 3 of 6 | Press Create, and the task lands on the board for everyone. |
| 5 | 0:24 | Maya's view. A notification slides in from the right | Maya gets a notification straight away, so nothing slips through. |
| 6 | 0:30 | Maya ticks the task off, the camera moves to the progress bar as it fills to 4 of 6 | When the work is finished, tick it off. The week's progress moves on its own. |
| 7 | 0:36 | Logo outro, after a riser. Music swells | Orbit Tasks. Plan it, share it, ship it. |

## Tide: a product ad

| File | What it shows |
|---|---|
| [`src/scenes/HookScene.tsx`](tide-ad/src/scenes/HookScene.tsx) | The cold open: payments stack up, the balance turns red, the question slams in |
| [`src/scenes/HomeScene.tsx`](tide-ad/src/scenes/HomeScene.tsx) | The phone rises and tilts upright, the number counts up, the meters fill |
| [`src/scenes/BudgetScene.tsx`](tide-ad/src/scenes/BudgetScene.tsx) | A budget fills toward its limit, the camera pushes in as the nudge drops |
| [`src/scenes/MoreScene.tsx`](tide-ad/src/scenes/MoreScene.tsx) | Three features as a deck of cards, each on its own phrase |
| [`src/scenes/OutroScene.tsx`](tide-ad/src/scenes/OutroScene.tsx) | Logo, name, the promise and two fact chips |
| [`src/Ad.tsx`](tide-ad/src/Ad.tsx) | Scenes back to back, a wipe and whoosh on every cut, music and riser |
| [`scripts/generate-audio.ts`](tide-ad/scripts/generate-audio.ts) | The same music synth as Orbit, in a brighter key and faster |

| # | Time | On screen | Narration |
|---|---|---|---|
| 1 | 0:00 | Dark screen. Card payments drop in one after another while the balance drains from $2,140 to $312 and turns red. **Where did it go?** slams in | Payday was ten days ago. So where did it all go? |
| 2 | 0:06 | Wipe. **Every account. One place.** The phone rises: safe to spend counts up to $1,286, spending meters fill | Tide puts every account in one place, and shows what is safe to spend this month. |
| 3 | 0:11 | **A nudge, not a surprise.** Eating out fills to 92% and turns orange, a push notification drops in as the camera leans in | Set a budget, and Tide nudges you before you go over, not after. |
| 4 | 0:18 | A deck of cards, each on its phrase: a forgotten subscription, a split bill, a savings goal filling | It finds the subscriptions you forgot. It splits the dinner bill. And it rounds up every purchase into your goals. |
| 5 | 0:26 | Logo in a swelling disc, **Know where it goes.**, two chips | Tide. Know where your money goes. |

## What to notice in both

- The first frame is already moving, and the voice comes in a second later.
- Every control the narration names is on screen when it is said.
- Numbers count and meters fill on screen. Nothing appears already finished.
- Each cut is either a crossfade between two calm screens, or a wipe when the mood changes (dark to light, scene to scene in the ad).

## Prompts that work well

Name the feature or product, who the video is for, and anything you already know you want.

| You want | Ask |
|---|---|
| A feature walkthrough | "Make an explainer video of how invoices get approved, for staff and managers." |
| One role only | "Make a 60 second video for new admins showing how to invite a teammate and set their role." |
| A full flow with a loop back | "Make a walkthrough video of a support ticket: opened, assigned, sent back for details, then solved." |
| A product ad | "Make a 30 second vertical ad for our app for Reels and TikTok. Open on the problem it solves." |
| A launch video | "Make a launch video for the new mobile app that shows its four best features." |
| No voice | "Make a demo video of the reports page. Captions only, no voiceover." |
| A different voice | "Make the onboarding video, and use a male voice for the narration." |

The skill always comes back first with a plain description of the product for each role and a draft script like the ones above, starting with the hook. You can change the wording, cut scenes or reorder them before anything is built.
