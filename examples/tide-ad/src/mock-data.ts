import type { Tone } from './theme';

/** Everything here is made up. */
export const USER = { name: 'Ava', initials: 'AR' } as const;

export const BALANCE = { payday: 2140, now: 312 } as const;

/** The hook's notification storm, newest last. */
export const CHARGES = [
  { merchant: 'Corner Coffee', amount: 4.5 },
  { merchant: 'StreamFlix', amount: 12.99 },
  { merchant: 'FreshCart groceries', amount: 38.2 },
  { merchant: 'CloudBox storage', amount: 9.99 },
  { merchant: 'Zip Rides', amount: 27 },
  { merchant: 'Lunch at Nori', amount: 16.4 },
  { merchant: 'PulseFit gym', amount: 45 },
  { merchant: 'Pizza night', amount: 31.75 },
] as const;

export const SAFE_TO_SPEND = 1286;

export interface Category {
  name: string;
  spent: number;
  limit: number;
  tone: Tone;
}

export const CATEGORIES: Category[] = [
  { name: 'Groceries', spent: 192, limit: 300, tone: 'teal' },
  { name: 'Eating out', spent: 161, limit: 175, tone: 'coral' },
  { name: 'Transport', spent: 64, limit: 160, tone: 'blue' },
  { name: 'Fun', spent: 22, limit: 100, tone: 'violet' },
];

/** The budget the nudge is about, and how full it gets in the video. */
export const NUDGE = { category: 'Eating out', from: 0.7, to: 0.92, daysLeft: 9 } as const;

export const ACCOUNTS = [
  { name: 'Checking', amount: 1902 },
  { name: 'Savings', amount: 6450 },
  { name: 'Credit card', amount: -384 },
] as const;

export const FORGOTTEN = { name: 'PhotoVault Plus', price: 9.99, lastUsed: '4 months ago' } as const;

export const SPLIT = {
  place: 'Dinner at Nori',
  total: 96,
  people: [
    { initials: 'AR', tone: 'violet' },
    { initials: 'JK', tone: 'teal' },
    { initials: 'ML', tone: 'coral' },
    { initials: 'SD', tone: 'blue' },
  ] as { initials: string; tone: Tone }[],
} as const;

export const GOAL = { name: 'Lisbon trip', saved: 1480, target: 2000, roundUps: 18.4 } as const;

export function money(value: number, decimals = 0): string {
  const sign = value < 0 ? '-' : '';
  return `${sign}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}
