import type { Tone } from './theme';

/** Everyone here is made up. */
export interface Person {
  id: string;
  name: string;
  initials: string;
  tone: Tone;
}

export const PEOPLE = {
  sam: { id: 'sam', name: 'Sam Park', initials: 'SP', tone: 'blue' },
  lena: { id: 'lena', name: 'Lena Ortiz', initials: 'LO', tone: 'green' },
  omar: { id: 'omar', name: 'Omar Haddad', initials: 'OH', tone: 'amber' },
  maya: { id: 'maya', name: 'Maya Chen', initials: 'MC', tone: 'rose' },
} as const satisfies Record<string, Person>;

/** The order the owner chips appear in the New task dialog. */
export const OWNER_CHOICES: Person[] = [PEOPLE.sam, PEOPLE.lena, PEOPLE.omar, PEOPLE.maya];

export const DUE_CHOICES = ['Today', 'Tomorrow', 'Friday'] as const;

export interface Task {
  id: string;
  title: string;
  owner: Person;
  due: string;
  done: boolean;
}

export const WEEK_TASKS: Task[] = [
  { id: 't1', title: 'Review pricing page', owner: PEOPLE.lena, due: 'Mon', done: true },
  { id: 't2', title: 'Plan Q4 roadmap', owner: PEOPLE.sam, due: 'Tue', done: true },
  { id: 't3', title: 'Fix signup email bug', owner: PEOPLE.omar, due: 'Wed', done: true },
  { id: 't4', title: 'Write onboarding guide', owner: PEOPLE.lena, due: 'Thu', done: false },
  { id: 't5', title: 'Prepare client demo', owner: PEOPLE.omar, due: 'Fri', done: false },
];

/** The task the video creates, then ticks off. */
export const NEW_TASK: Task = {
  id: 't6',
  title: 'Draft launch email',
  owner: PEOPLE.maya,
  due: 'Fri',
  done: false,
};

export const WEEK_LABEL = 'Mon, Oct 20 to Fri, Oct 24';
