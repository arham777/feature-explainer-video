/**
 * The narration, one line per beat. The SSOT for both the voiceover generator
 * (which turns `text` into public/voiceover/<id>.wav) and the on-screen
 * subtitles, so what is heard and what is read can never drift.
 *
 * `spoken` exists only where the TTS needs a nudge to pronounce something the
 * way the team says it, for example a product called "Qx" read as "queue ex".
 *
 * The lines below are the Orbit demo's (examples/orbit-demo in the skill's
 * repo), kept as a worked example. Replace them with the approved script, then
 * update CHAPTERS and MIN_FRAMES in timeline.ts to match.
 */
export interface VoiceLine {
  id: string;
  text: string;
  spoken?: string;
}

export const VOICE_LINES = [
  {
    id: 'hook',
    text: 'Three group chats, two spreadsheets, and still nobody knows who is sending the launch email.',
  },
  {
    id: 'intro',
    text: 'Orbit Tasks puts the whole week on one calm board.',
  },
  {
    id: 'create',
    text: 'Click New task. Give it a name, pick who owns it, and choose a due day.',
  },
  {
    id: 'add',
    text: 'Press Create, and the task lands on the board for everyone.',
  },
  {
    id: 'notify',
    text: 'Maya gets a notification straight away, so nothing slips through.',
  },
  {
    id: 'done',
    text: "When the work is finished, tick it off. The week's progress moves on its own.",
  },
  {
    id: 'outro',
    text: 'Orbit Tasks. Plan it, share it, ship it.',
  },
] as const satisfies readonly VoiceLine[];

export type VoiceLineId = (typeof VOICE_LINES)[number]['id'];
