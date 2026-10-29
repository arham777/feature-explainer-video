import durations from './voiceover/durations.json';
import { VOICE_LINES, type VoiceLineId } from './voiceover/lines';
import { VIDEO } from './theme';

/** Silence before a line starts inside its beat, and after it ends. */
export const LEAD = 10;
export const TAIL = 20;
/** Crossfade between chapters. Smaller than LEAD + TAIL so two voices never overlap. */
export const TRANSITION = 20;

/**
 * Beats that play silent visuals before the voice comes in. The hook is the
 * usual one: a second or two of picture first is what makes people stop.
 */
const LEADS: Partial<Record<VoiceLineId, number>> = {
  hook: 40,
};

/**
 * Beats whose on-screen choreography needs longer than the line itself takes
 * to say. Everything else is sized purely by its voiceover.
 */
const MIN_FRAMES: Partial<Record<VoiceLineId, number>> = {
  hook: 200,
  intro: 120,
  create: 270,
  add: 150,
  notify: 150,
  done: 210,
  outro: 150,
};

export function lead(id: VoiceLineId): number {
  return LEADS[id] ?? LEAD;
}

export function audioFrames(id: VoiceLineId): number {
  return Math.ceil((durations as Record<string, number>)[id] * VIDEO.fps);
}

export function beatLength(id: VoiceLineId): number {
  return Math.max(MIN_FRAMES[id] ?? 0, lead(id) + audioFrames(id) + TAIL);
}

/**
 * Frame inside the beat when `phrase` is spoken, estimated from where it sits
 * in the line. Hang visual moments off this, so they move with the voice.
 */
export function spokenAt(id: VoiceLineId, phrase: string): number {
  const text = VOICE_LINES.find((l) => l.id === id)?.text ?? '';
  const index = text.indexOf(phrase);
  if (index < 0) throw new Error(`"${phrase}" is not in line "${id}"`);
  return Math.round(lead(id) + (index / text.length) * audioFrames(id));
}

/** Chapters are continuous screens; each narrates one or more beats. */
export const CHAPTERS = [
  { id: 'hook', beats: ['hook'] },
  { id: 'intro', beats: ['intro'] },
  { id: 'board', beats: ['create', 'add'] },
  { id: 'teammate', beats: ['notify', 'done'] },
  { id: 'outro', beats: ['outro'] },
] as const satisfies readonly { id: string; beats: readonly VoiceLineId[] }[];

export type ChapterId = (typeof CHAPTERS)[number]['id'];

export interface Beat {
  id: VoiceLineId;
  /** Frame the beat starts at, relative to its chapter. */
  start: number;
  length: number;
}

export type Beats = Record<string, Beat>;

export function chapterBeats(beats: readonly VoiceLineId[]): Beats {
  let cursor = 0;
  const out: Beats = {};
  for (const id of beats) {
    out[id] = { id, start: cursor, length: beatLength(id) };
    cursor += beatLength(id);
  }
  return out;
}

export function chapterLength(beats: readonly VoiceLineId[]): number {
  return beats.reduce((sum, id) => sum + beatLength(id), 0);
}

/** Where a chapter starts in the whole video, after the crossfades before it. */
export function chapterStart(id: ChapterId): number {
  let start = 0;
  for (const chapter of CHAPTERS) {
    if (chapter.id === id) return start;
    start += chapterLength(chapter.beats) - TRANSITION;
  }
  throw new Error(`Unknown chapter "${id}"`);
}

export const TOTAL_FRAMES =
  CHAPTERS.reduce((sum, c) => sum + chapterLength(c.beats), 0) - TRANSITION * (CHAPTERS.length - 1);
