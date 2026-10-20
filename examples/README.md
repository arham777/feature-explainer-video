# Examples

## Prompts that work well

Name the feature, who the video is for, and anything you already know you want.

| You want | Ask |
|---|---|
| A standard explainer | "Make an explainer video of how leave requests work, for members and admins." |
| One role only | "Make a 60 second video for new admins showing how to approve or decline a request." |
| A full flow with a loop back | "Make a walkthrough video of approvals: submit, review, reject with a reason, fix and approve." |
| No voice | "Make a demo video of the invoice screen. Captions only, no voiceover." |
| Social media | "Make a 45 second vertical (9:16) video of the new search, with sound effects and no music." |
| A different voice | "Make the onboarding video, and use a male voice for the narration." |

The skill always comes back first with a plain description of the feature for each role and a draft script. You can change the wording, cut scenes, or reorder them before anything is built.

## A full sample script

This is the script behind the Leaves video in the README's preview. It ran 95 seconds. Each row is one narrated beat. Times are where the beat starts in the final video.

| # | Time | On screen | Narration |
|---|---|---|---|
| 1 | 0:00 | Title card | This is Leaves, in X-Loop. The simple way to ask for time off, and to decide on it. |
| 2 | 0:06 | Two role cards: Member and Admin | There are two sides. Members ask for leave. Admins approve or decline it, and see the whole team at a glance. |
| 3 | 0:14 | Member's Leaves page, cursor clicks **Ask for leave** | As a member, open Leaves and click Ask for leave. |
| 4 | 0:18 | Type dropdown opens, each type shows its hours | Pick the kind of leave you need: a full day, multiple days, a half day, work from home, a late come, or an early go. Each one shows how many hours it costs. |
| 5 | 0:29 | Picks a Saturday, the form shows an error | Pick a date. Weekends are not working days, so the form stops you right away. |
| 6 | 0:35 | Types a reason, summary updates, clicks **Send request** | Add a short reason, check the summary, and send. Nothing is booked yet. Your request waits for an admin. |
| 7 | 0:43 | Hovers a waiting request, **Withdraw** appears | Changed your mind? Withdraw it any time while it is still waiting. |
| 8 | 0:48 | Admin view, notification card slides in | On the admin side, a notification arrives straight away, and the request joins the list waiting for them. |
| 9 | 0:56 | Approve dialog, types a note, clicks **Approve** | The admin approves or declines, and can add a note so you know why. |
| 10 | 1:02 | Back to the member, row turns Approved with the note | Back on your side, the answer appears instantly, with the note and who decided. Nothing is ever deleted. Every request stays on record. |
| 11 | 1:12 | Team planner, one month goes red | Every approved day lands on the team planner. The allowance is one day a month, and twelve a year. Go over, and that month turns red. |
| 12 | 1:21 | On leave badge, meeting heads up | Approved leave shows up wherever it matters: an On leave badge next to your name, and a heads up when someone books a meeting with you. |
| 13 | 1:29 | Outro card | Leaves, in X-Loop. Ask in seconds. Decide in one click. |

What to notice:

- Every control the narration names (Ask for leave, Withdraw, Approve) is on screen when it is said.
- The hours, the weekend rule and the yearly allowance come from the app's own code, not from the script writer.
- Lines 1 and 13 have a `spoken` version so the voice says "Ex Loop".
- The same script is in [`templates/src/voiceover/lines.ts`](../skills/feature-explainer-video/templates/src/voiceover/lines.ts), and its chapters are in [`timeline.ts`](../skills/feature-explainer-video/templates/src/timeline.ts).
