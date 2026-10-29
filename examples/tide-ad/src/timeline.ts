import durations from './voiceover/durations.json';
import { VOICE_LINES, type VoiceLineId } from './voiceover/lines';
import { VIDEO } from './theme';

/** Silence before a line starts inside its scene, and after it ends. */
export const LEAD = 8;
export const TAIL = 12;
/** An ad cuts hard with a wipe instead of crossfading, so scenes do not overlap. */
export const TRANSITION = 0;

/** The hook plays its picture for a beat before the voice comes in. */
const LEADS: Partial<Record<VoiceLineId, number>> = {
  hook: 36,
};

/** Scenes whose choreography needs longer than the line takes to say. */
const MIN_FRAMES: Partial<Record<VoiceLineId, number>> = {
  hook: 170,
  home: 170,
  budget: 190,
  more: 240,
  outro: 165,
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

/** One scene per line in an ad. */
export const CHAPTERS = [
  { id: 'hook', beats: ['hook'] },
  { id: 'home', beats: ['home'] },
  { id: 'budget', beats: ['budget'] },
  { id: 'more', beats: ['more'] },
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

/** Where a chapter starts in the whole video. */
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
