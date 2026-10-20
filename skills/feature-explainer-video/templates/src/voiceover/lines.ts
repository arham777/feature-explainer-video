/**
 * The narration, one line per beat. The SSOT for both the voiceover generator
 * (which turns `text` into public/voiceover/<id>.wav) and the on-screen
 * subtitles, so what is heard and what is read can never drift.
 *
 * `spoken` exists only where the TTS needs a nudge to pronounce something the
 * way the team says it ("X-Loop" read as "ex loop").
 *
 * The lines below are the reference build's (the Leaves video), kept as a
 * worked example. Replace them with the approved script, then update
 * CHAPTERS and MIN_FRAMES in timeline.ts to match.
 */
export interface VoiceLine {
  id: string;
  text: string;
  spoken?: string;
}

export const VOICE_LINES = [
  {
    id: 'intro',
    text: 'This is Leaves, in X-Loop. The simple way to ask for time off, and to decide on it.',
    spoken: 'This is Leaves, in Ex Loop. The simple way to ask for time off, and to decide on it.',
  },
  {
    id: 'roles',
    text: 'There are two sides. Members ask for leave. Admins approve or decline it, and see the whole team at a glance.',
  },
  {
    id: 'ask',
    text: 'As a member, open Leaves and click Ask for leave.',
  },
  {
    id: 'types',
    text: 'Pick the kind of leave you need: a full day, multiple days, a half day, work from home, a late come, or an early go. Each one shows how many hours it costs.',
  },
  {
    id: 'weekend',
    text: 'Pick a date. Weekends are not working days, so the form stops you right away.',
  },
  {
    id: 'send',
    text: 'Add a short reason, check the summary, and send. Nothing is booked yet. Your request waits for an admin.',
  },
  {
    id: 'withdraw',
    text: 'Changed your mind? Withdraw it any time while it is still waiting.',
  },
  {
    id: 'notify',
    text: 'On the admin side, a notification arrives straight away, and the request joins the list waiting for them.',
  },
  {
    id: 'decide',
    text: 'The admin approves or declines, and can add a note so you know why.',
  },
  {
    id: 'result',
    text: 'Back on your side, the answer appears instantly, with the note and who decided. Nothing is ever deleted. Every request stays on record.',
  },
  {
    id: 'planner',
    text: 'Every approved day lands on the team planner. The allowance is one day a month, and twelve a year. Go over, and that month turns red.',
  },
  {
    id: 'everywhere',
    text: 'Approved leave shows up wherever it matters: an On leave badge next to your name, and a heads up when someone books a meeting with you.',
  },
  {
    id: 'outro',
    text: 'Leaves, in X-Loop. Ask in seconds. Decide in one click.',
    spoken: 'Leaves, in Ex Loop. Ask in seconds. Decide in one click.',
  },
] as const satisfies readonly VoiceLine[];

export type VoiceLineId = (typeof VOICE_LINES)[number]['id'];
