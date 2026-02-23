export const EMAIL_TEMPLATES = {
  pipeline_update: [
    {
      subject: (ctx) => `${ctx.scriptTitle} — Stage Update`,
      body: (ctx) => `Your project "${ctx.scriptTitle}" has moved to ${ctx.stage}. Keep an eye on the pipeline.`,
      from: 'Pipeline Bot',
    },
    {
      subject: (ctx) => `${ctx.scriptTitle} advancing`,
      body: (ctx) => `Just a heads-up: "${ctx.scriptTitle}" is now in ${ctx.stage}. Things are moving.`,
      from: 'Pipeline Bot',
    },
  ],

  filmmaker_request: [
    {
      subject: () => 'Can we talk about my script?',
      body: (ctx) => `Hi Steve,\n\nI've been thinking about your last round of notes. Can we find time to discuss? I have some ideas I'd like to run by you.\n\nBest,\n${ctx.filmmakerName}`,
      from: (ctx) => ctx.filmmakerName,
      actionable: true,
      actionLabel: 'Schedule Meeting',
      actionType: 'schedule_filmmaker_meeting',
    },
    {
      subject: () => 'New project idea',
      body: (ctx) => `Steve,\n\nI've been developing something new. It's early, but I think it could be special. Would love your initial thoughts when you have a moment.\n\n— ${ctx.filmmakerName}`,
      from: (ctx) => ctx.filmmakerName,
      actionable: false,
    },
    {
      subject: () => 'Quick question about the notes',
      body: (ctx) => `Hi Steve,\n\nYour notes on the dialogue were clear, but I'm not sure I agree with the pacing feedback. Can we find time to talk through it? I want to make sure we're aligned before I start revisions.\n\nThanks,\n${ctx.filmmakerName}`,
      from: (ctx) => ctx.filmmakerName,
      actionable: false,
    },
  ],

  company_memo: [
    {
      subject: () => 'Q results are in',
      body: () => 'Team,\n\nThe quarterly numbers are in. Overall viewership is up 12%, but completion rates on drama have dipped. We need to think about what this means for our development slate.\n\n— Corporate',
      from: 'Corporate',
    },
    {
      subject: () => 'All-hands reminder',
      body: () => 'Hi everyone,\n\nReminder that the all-hands is this Friday. Bernie will be presenting the content strategy update. Attendance is expected.\n\n— Office Admin',
      from: 'Office Admin',
    },
    {
      subject: () => 'New coffee machine!',
      body: () => 'Good news — the new espresso machine has arrived in the lobby café. Pieter has posted instructions. Please clean up after yourselves.\n\n— Facilities',
      from: 'Pieter de Jong',
    },
    {
      subject: () => 'Content strategy update',
      body: (ctx) => `All,\n\nLondon is pushing for more genre content this quarter. ${ctx.strategyFocus === 'prestige' ? 'I know this conflicts with our current prestige focus — we\'ll need to find a balance.' : ctx.strategyFocus === 'audience' ? 'This aligns well with our current audience growth strategy.' : 'Let\'s discuss how to balance this with our existing commitments.'}\n\n— Bernie`,
      from: "Bernard 'Bernie' Okafor",
    },
    {
      subject: () => 'Competitor slate announcement',
      body: () => 'FYI — our main competitor just announced 15 new originals for next quarter. Heavy on thriller and sci-fi. Worth keeping in mind as we shape our own slate.\n\n— Strategy Team',
      from: 'Strategy Team',
    },
  ],

  boss_checkin: [
    {
      subject: () => 'Let\'s catch up',
      body: () => 'Steve,\n\nCome by my office when you get a chance. I want to discuss the current slate and where we\'re heading.\n\n— Bernie',
      from: "Bernard 'Bernie' Okafor",
      actionable: true,
      actionLabel: 'Accept Meeting',
      actionType: 'schedule_boss_meeting',
    },
    {
      subject: () => 'Pipeline review needed',
      body: () => 'Steve,\n\nI want to review the pipeline with you this week. Bring your numbers and be ready to defend your choices.\n\n— Bernie',
      from: "Bernard 'Bernie' Okafor",
      actionable: true,
      actionLabel: 'Accept Meeting',
      actionType: 'schedule_boss_meeting',
    },
    {
      subject: () => 'Quarterly check-in',
      body: () => 'Steve,\n\nIt\'s time for our quarterly one-on-one. I\'ll have Lena pull the numbers. You bring the narrative.\n\n— Bernie',
      from: "Bernard 'Bernie' Okafor",
      actionable: true,
      actionLabel: 'Accept Meeting',
      actionType: 'schedule_boss_meeting',
    },
  ],

  gossip: [
    {
      subject: () => 'Did you hear...?',
      body: (ctx) => `Steve,\n\nDon't tell anyone I told you this, but ${ctx.gossipContent}\n\nYou didn't hear it from me.\n\n— Pieter`,
      from: 'Pieter de Jong',
    },
    {
      subject: () => 'Industry buzz',
      body: (ctx) => `Steve,\n\nPicked this up at a dinner last night: ${ctx.gossipContent}\n\nThought you should know.\n\n— Sophie`,
      from: 'Sophie Laurent',
    },
  ],

  data_review: [
    {
      subject: () => 'Numbers you should see',
      body: (ctx) => `Steve,\n\nI've been crunching the latest viewership data. Your slate is ${ctx.commercialRep > 40 ? 'performing above average' : ctx.commercialRep > 20 ? 'holding steady' : 'underperforming relative to targets'}. I want to walk you through the breakdown. Can we meet?\n\n— Lena`,
      from: 'Lena Vogel',
      actionable: true,
      actionLabel: 'Schedule Review',
      actionType: 'schedule_data_meeting',
    },
  ],
};

export const GOSSIP_CONTENT = [
  'Katrien turned down a meeting with a major studio. Said they "lacked vision." Classic Katrien.',
  'Marco has been pulling all-nighters on his rewrite. Someone should check on him.',
  'Helena was spotted having dinner with a producer from Berlin. Could be nothing. Could be everything.',
  'Jake\'s agent is fielding calls from three other streamers. He\'s in demand.',
  'Yuki\'s last festival entry got a 12-minute standing ovation. The press is calling it a masterpiece.',
  'Bernie got a call from London. He didn\'t look happy afterward.',
  'there\'s talk of restructuring. Nothing confirmed, but people are nervous.',
  'Sophie just signed a hot new director. First-timer. Everyone wants their script.',
  'Oliver is writing a piece about the state of streaming. He\'s been asking pointed questions.',
  'the board is comparing our output to the LA office. We need a hit.',
  'someone left a very passive-aggressive note about the coffee machine. My money is on Lena.',
  'Jake and Katrien got into it at the café. Something about "selling out" versus "reaching people."',
];

export function pickGossip(usedGossipIds) {
  const available = GOSSIP_CONTENT.filter((_, i) => !usedGossipIds?.includes(i));
  if (available.length === 0) return { content: GOSSIP_CONTENT[0], index: 0 };
  const idx = Math.floor(Math.random() * available.length);
  const originalIndex = GOSSIP_CONTENT.indexOf(available[idx]);
  return { content: available[idx], index: originalIndex };
}
