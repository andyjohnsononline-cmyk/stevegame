const ALL_NPC_IDS = ['katrien', 'marco', 'helena', 'jake', 'yuki', 'bernie', 'lena', 'pieter'];

export const ACHIEVEMENTS = [
  {
    id: 'first_release',
    name: 'First Release',
    description: 'Release your first script.',
    hint: 'Greenlight a script and wait for it to finish.',
    condition: (gs) => (gs.lifetimeStats?.totalScriptsReleased ?? 0) >= 1,
    bonus: { type: 'revenue', value: 0.05 },
  },
  {
    id: 'critics_darling',
    name: "Critics' Darling",
    description: 'Achieve Critical Acclaim on a release.',
    hint: 'Release a script with average quality 8+.',
    condition: (gs) => (gs.lifetimeStats?.criticalAcclaims ?? 0) >= 1,
    bonus: { type: 'pipelineSpeed', value: 0.05 },
  },
  {
    id: 'prolific',
    name: 'Prolific',
    description: 'Release 10 scripts.',
    hint: 'Keep greenlighting and producing.',
    condition: (gs) => (gs.lifetimeStats?.totalScriptsReleased ?? 0) >= 10,
    bonus: { type: 'revenue', value: 0.10 },
  },
  {
    id: 'people_person',
    name: 'People Person',
    description: 'Reach 5+ hearts with all NPCs.',
    hint: 'Build relationships at the cafe.',
    condition: (gs) => {
      const rels = gs.relationships ?? {};
      return ALL_NPC_IDS.every(id => (rels[id] ?? 0) >= 5);
    },
    bonus: { type: 'qualityFloor', value: 1 },
  },
  {
    id: 'studio_mogul',
    name: 'Studio Mogul',
    description: 'Earn $1000K in total revenue.',
    hint: 'Keep releasing quality scripts.',
    condition: (gs) => (gs.lifetimeStats?.totalRevenue ?? 0) >= 1000,
    bonus: { type: 'pipelineSpeed', value: 0.10 },
  },
  {
    id: 'speed_reader',
    name: 'Speed Reader',
    description: 'Read 50 scripts.',
    hint: 'Open and read scripts from your inbox.',
    condition: (gs) => (gs.lifetimeStats?.totalScriptsRead ?? 0) >= 50,
    bonus: { type: 'unlockSpeed', value: 2 },
  },
  {
    id: 'veteran_executive',
    name: 'Veteran Executive',
    description: 'Reach Level 5 — Head of Studio.',
    hint: 'Earn enough XP through releases and relationships.',
    condition: (gs) => (gs.level ?? 1) >= 5,
    bonus: { type: 'unlockSpeed', value: 5 },
  },
  {
    id: 'content_lead',
    name: 'Content Lead',
    description: 'Reach Level 2.',
    hint: 'Release scripts and build relationships for XP.',
    condition: (gs) => (gs.level ?? 1) >= 2,
    bonus: { type: 'revenue', value: 0.05 },
  },
  {
    id: 'five_star_streak',
    name: 'Five Star Streak',
    description: 'Achieve 3 Critical Acclaims.',
    hint: 'Consistently release high-quality work.',
    condition: (gs) => (gs.lifetimeStats?.criticalAcclaims ?? 0) >= 3,
    bonus: { type: 'qualityFloor', value: 1 },
  },
  {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Purchase 5 studio upgrades.',
    hint: 'Invest in your studio from the desk menu.',
    condition: (gs) => Object.keys(gs.upgrades ?? {}).length >= 5,
    bonus: { type: 'revenue', value: 0.10 },
  },
];
