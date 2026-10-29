/**
 * The narration, one line per scene. The SSOT for both the voiceover generator
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
    id: 'hook',
    text: 'Payday was ten days ago. So where did it all go?',
  },
  {
    id: 'home',
    text: 'Tide puts every account in one place, and shows what is safe to spend this month.',
  },
  {
    id: 'budget',
    text: 'Set a budget, and Tide nudges you before you go over, not after.',
  },
  {
    id: 'more',
    text: 'It finds the subscriptions you forgot. It splits the dinner bill. And it rounds up every purchase into your goals.',
  },
  {
    id: 'outro',
    text: 'Tide. Know where your money goes.',
  },
] as const satisfies readonly VoiceLine[];

export type VoiceLineId = (typeof VOICE_LINES)[number]['id'];
