/**
 * The narration, one line per beat. The SSOT for both the voiceover generator
 * (which turns `text` into public/voiceover/<id>.wav) and the on-screen
 * subtitles, so what is heard and what is read can never drift.
 */
export interface VoiceLine {
  id: string;
  text: string;
  spoken?: string;
}

export const VOICE_LINES = [
  {
    id: 'intro',
    text: 'This is Orbit Tasks. One calm place to plan the week with your team.',
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
