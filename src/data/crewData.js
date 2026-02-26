export const CREW_MEMBERS = [
  {
    id: 'intern',
    name: 'Intern',
    baseDPS: 1,
    baseCost: 10,
    costScale: 1.07,
    unlockStage: 1,
    color: '#90CAF9',
  },
  {
    id: 'writer',
    name: 'Writer',
    baseDPS: 5,
    baseCost: 50,
    costScale: 1.07,
    unlockStage: 5,
    color: '#FFF59D',
  },
  {
    id: 'editor',
    name: 'Editor',
    baseDPS: 20,
    baseCost: 250,
    costScale: 1.07,
    unlockStage: 10,
    color: '#A5D6A7',
  },
  {
    id: 'director',
    name: 'Director',
    baseDPS: 100,
    baseCost: 1200,
    costScale: 1.07,
    unlockStage: 20,
    color: '#CE93D8',
  },
  {
    id: 'producer',
    name: 'Producer',
    baseDPS: 400,
    baseCost: 5000,
    costScale: 1.07,
    unlockStage: 35,
    color: '#FFAB91',
  },
  {
    id: 'star',
    name: 'Star Actor',
    baseDPS: 1500,
    baseCost: 20000,
    costScale: 1.07,
    unlockStage: 50,
    color: '#FFD54F',
  },
  {
    id: 'composer',
    name: 'Composer',
    baseDPS: 5000,
    baseCost: 80000,
    costScale: 1.07,
    unlockStage: 75,
    color: '#80DEEA',
  },
  {
    id: 'showrunner',
    name: 'Showrunner',
    baseDPS: 20000,
    baseCost: 350000,
    costScale: 1.07,
    unlockStage: 100,
    color: '#EF9A9A',
  },
];

export function getCrewHireCost(crewDef, currentLevel) {
  if (currentLevel === 0) return crewDef.baseCost;
  return Math.floor(crewDef.baseCost * Math.pow(crewDef.costScale, currentLevel));
}

export function getCrewDPS(crewDef, level, starPower) {
  if (level === 0) return 0;
  return crewDef.baseDPS * level * starPower;
}

export function getTotalDPS(crewStates, starPower) {
  let total = 0;
  for (const crew of CREW_MEMBERS) {
    const state = crewStates.find(c => c.id === crew.id);
    if (state && state.level > 0) {
      total += getCrewDPS(crew, state.level, starPower);
    }
  }
  return total;
}
