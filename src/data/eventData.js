export const RANDOM_EVENTS = [
  {
    id: 'budget_cut',
    title: 'Budget Cuts',
    description: 'The company announces budget cuts. One project in development must be shelved.',
    condition: (state) => (state.pipeline?.length ?? 0) > 1,
    choices: [
      { label: 'Shelve the weakest project', effects: [{ type: 'shelve_weakest' }] },
      { label: 'Fight to save it', effects: [{ type: 'spend_reputation', repType: 'industry', amount: 10 }] },
    ],
  },
  {
    id: 'festival_invitation',
    title: 'Festival Invitation',
    description: 'A completed project has been invited to a major European film festival.',
    condition: (state) => (state.completedScripts?.length ?? 0) > 0 || (state.pipeline?.length ?? 0) > 0,
    choices: [
      { label: 'Accept and prepare', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 10 }, { type: 'money_change', amount: -200 }] },
      { label: 'Decline and release directly', effects: [{ type: 'boost_reputation', repType: 'commercial', amount: 5 }] },
    ],
  },
  {
    id: 'filmmaker_tantrum',
    title: 'Filmmaker Tantrum',
    description: 'A filmmaker is furious about your latest notes and threatens to leave.',
    condition: (state) => Object.keys(state.relationships ?? {}).length > 0,
    choices: [
      { label: 'Apologize and revisit the notes', effects: [{ type: 'boost_reputation', repType: 'industry', amount: 3 }] },
      { label: 'Stand firm', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 5 }, { type: 'spend_reputation', repType: 'industry', amount: 3 }] },
    ],
  },
  {
    id: 'competitor_poaching',
    title: 'Competitor Poaching',
    description: 'A rival streamer is trying to poach one of your best filmmakers.',
    condition: (state) => Object.values(state.relationships ?? {}).some((r) => r >= 3),
    choices: [
      { label: 'Make a counter-offer', effects: [{ type: 'money_change', amount: -200 }, { type: 'boost_reputation', repType: 'industry', amount: 5 }] },
      { label: 'Wish them well', effects: [{ type: 'spend_reputation', repType: 'industry', amount: 5 }] },
    ],
  },
  {
    id: 'unexpected_hit',
    title: 'Unexpected Hit',
    description: 'A project you championed has overperformed dramatically. The board is impressed.',
    condition: (state) => (state.completedScripts?.length ?? 0) > 0,
    choices: [
      { label: 'Push for creative freedom', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 10 }] },
      { label: 'Stay humble and reinvest', effects: [{ type: 'boost_reputation', repType: 'commercial', amount: 7 }, { type: 'money_change', amount: 300 }] },
    ],
  },
  {
    id: 'bad_review',
    title: 'Scathing Review',
    description: 'Elena Vogt has published a devastating review of a project you greenlit.',
    condition: (state) => (state.completedScripts?.length ?? 0) > 0,
    choices: [
      { label: 'Reach out to Elena', effects: [{ type: 'boost_reputation', repType: 'industry', amount: 5 }] },
      { label: 'Support the filmmaker', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 5 }, { type: 'spend_reputation', repType: 'industry', amount: 3 }] },
    ],
  },
  {
    id: 'office_politics',
    title: 'Office Politics',
    description: 'A colleague is undermining your projects in meetings. Maggie has noticed.',
    condition: (state) => (state.reputation?.industry ?? 0) > 5,
    choices: [
      { label: 'Confront them directly', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 3 }, { type: 'spend_reputation', repType: 'industry', amount: 2 }] },
      { label: 'Let Maggie handle it', effects: [{ type: 'boost_reputation', repType: 'industry', amount: 5 }] },
    ],
  },
  {
    id: 'new_talent',
    title: 'New Talent Arrives',
    description: 'David Osei says an unknown filmmaker has submitted something extraordinary.',
    condition: () => true,
    choices: [
      { label: 'Prioritize reading it', effects: [{ type: 'bonus_script' }] },
      { label: 'Add to the queue', effects: [{ type: 'boost_reputation', repType: 'industry', amount: 3 }] },
    ],
  },
  {
    id: 'industry_party',
    title: 'Industry Party',
    description: 'A major industry party is happening tonight. Networking could open doors.',
    condition: () => true,
    choices: [
      { label: 'Attend and work the room', effects: [{ type: 'attend' }] },
      { label: 'Skip it and catch up on scripts', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 3 }] },
    ],
  },
  {
    id: 'deadline_crunch',
    title: 'Deadline Crunch',
    description: 'Multiple filmmakers need notes. Maggie needs coverage by end of day.',
    condition: (state) => (state.inbox?.length ?? 0) >= 2,
    choices: [
      { label: 'Work through lunch', effects: [{ type: 'boost_reputation', repType: 'industry', amount: 5 }] },
      { label: 'Ask for an extension', effects: [{ type: 'boost_reputation', repType: 'creative', amount: 5 }, { type: 'spend_reputation', repType: 'industry', amount: 2 }] },
    ],
  },
];

const DAILY_TRIGGER_CHANCE = 0.1;

export function getRandomEvent(gameState) {
  const validEvents = RANDOM_EVENTS.filter((event) => {
    try {
      return event.condition(gameState);
    } catch {
      return false;
    }
  });
  if (validEvents.length === 0) return null;
  if (Math.random() > DAILY_TRIGGER_CHANCE) return null;
  return validEvents[Math.floor(Math.random() * validEvents.length)];
}
