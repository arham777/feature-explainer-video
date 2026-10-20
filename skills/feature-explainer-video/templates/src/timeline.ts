import durations from './voiceover/durations.json';
import type { VoiceLineId } from './voiceover/lines';
import { VIDEO } from './theme';

/** Silence before a line starts inside its beat, and after it ends. */
export const LEAD = 10;
export const TAIL = 20;
/** Crossfade between chapters. Smaller than LEAD + TAIL so two voices never overlap. */
export const TRANSITION = 20;

/**
 * Beats whose on-screen choreography needs longer than the line itself takes
 * to say. Everything else is sized purely by its voiceover.
 */
const MIN_FRAMES: Partial<Record<VoiceLineId, number>> = {
  ask: 120,
  send: 240,
  withdraw: 150,
  decide: 220,
  outro: 180,
};

export function audioFrames(id: VoiceLineId): number {
  return Math.ceil((durations as Record<string, number>)[id] * VIDEO.fps);
}

export function beatLength(id: VoiceLineId): number {
  return Math.max(MIN_FRAMES[id] ?? 0, LEAD + audioFrames(id) + TAIL);
}

/** Chapters are continuous screens; each narrates one or more beats. */
export const CHAPTERS = [
  { id: 'intro', beats: ['intro'] },
  { id: 'roles', beats: ['roles'] },
  { id: 'member', beats: ['ask', 'types', 'weekend', 'send', 'withdraw'] },
  { id: 'admin', beats: ['notify', 'decide'] },
  { id: 'result', beats: ['result'] },
  { id: 'planner', beats: ['planner'] },
  { id: 'everywhere', beats: ['everywhere'] },
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

export const TOTAL_FRAMES =
  CHAPTERS.reduce((sum, c) => sum + chapterLength(c.beats), 0) - TRANSITION * (CHAPTERS.length - 1);
