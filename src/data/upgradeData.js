export const LEVEL_UPGRADES = {
  2:  { label: 'Wider Magnet',     magnetRange: 120 },
  3:  { label: 'Faster Attacks',   attackCooldown: 240 },
  4:  { label: 'Quick Feet',       moveSpeed: 200 },
  5:  { label: 'Harvest Bonus',    magnetRange: 160, dropBonus: 1 },
  6:  { label: 'Rapid Strikes',    attackCooldown: 200 },
  7:  { label: 'Multi-Hit',        multiHit: 2 },
  8:  { label: 'Sprint',           moveSpeed: 220 },
  9:  { label: 'Vacuum Range',     magnetRange: 200 },
  10: { label: 'Auto-Craft',       autoCraft: true },
};

const DEFAULTS = {
  magnetRange: 90,
  attackCooldown: 280,
  moveSpeed: 180,
  dropBonus: 0,
  multiHit: 1,
  autoCraft: false,
};

export function getStatsForLevel(level) {
  const stats = { ...DEFAULTS };
  for (let lv = 2; lv <= level; lv++) {
    const up = LEVEL_UPGRADES[lv];
    if (!up) continue;
    for (const [key, val] of Object.entries(up)) {
      if (key === 'label') continue;
      stats[key] = val;
    }
  }
  return stats;
}
