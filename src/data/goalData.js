export const STAR_MILESTONES = [
  {
    star: 1,
    label: 'First Show',
    requires: { totalProjects: 1 },
  },
  {
    star: 2,
    label: 'Rising Studio',
    requires: { totalProjects: 10, landsOwned: 5 },
  },
  {
    star: 3,
    label: 'Hit Maker',
    requires: { totalProjects: 25, level: 5 },
  },
  {
    star: 4,
    label: 'Major Studio',
    requires: { totalProjects: 50, landsOwned: 15, level: 8 },
  },
  {
    star: 5,
    label: 'Legendary',
    requires: { totalProjects: 100, landsOwned: 24, level: 10 },
  },
];

export function computeStarRating(gameState) {
  let stars = 0;
  for (const m of STAR_MILESTONES) {
    const r = m.requires;
    const projects = gameState.totalProjects ?? 0;
    const lands = gameState.unlockedLands?.length ?? 1;
    const level = gameState.level ?? 1;

    if (
      projects >= (r.totalProjects ?? 0) &&
      lands >= (r.landsOwned ?? 0) &&
      level >= (r.level ?? 0)
    ) {
      stars = m.star;
    } else {
      break;
    }
  }
  return stars;
}
