export const RESOURCE_TYPES = {
  script: {
    id: 'script',
    name: 'Script',
    color: '#FFF5E1',
    nodeTexture: 'node_script_pile',
    dropTexture: 'drop_script',
    hitsToBreak: 3,
    respawnTime: 8000,
    dropMin: 1,
    dropMax: 2,
    gatherXP: 1,
  },
  idea: {
    id: 'idea',
    name: 'Idea',
    color: '#FFD54F',
    nodeTexture: 'node_idea_board',
    dropTexture: 'drop_idea',
    hitsToBreak: 2,
    respawnTime: 6000,
    dropMin: 1,
    dropMax: 2,
    gatherXP: 1,
  },
  coffee: {
    id: 'coffee',
    name: 'Coffee',
    color: '#8D6E63',
    nodeTexture: 'node_coffee_machine',
    dropTexture: 'drop_coffee',
    hitsToBreak: 1,
    respawnTime: 5000,
    dropMin: 1,
    dropMax: 1,
    gatherXP: 1,
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    color: '#64B5F6',
    nodeTexture: 'node_networking',
    dropTexture: 'drop_contact',
    hitsToBreak: 2,
    respawnTime: 10000,
    dropMin: 1,
    dropMax: 1,
    gatherXP: 2,
  },
  coin: {
    id: 'coin',
    name: 'Coin',
    color: '#FFD700',
    dropTexture: 'drop_coin',
  },
  pitch: {
    id: 'pitch',
    name: 'Pitch',
    color: '#FF8A65',
    dropTexture: 'drop_pitch',
  },
  project: {
    id: 'project',
    name: 'Project',
    color: '#AB47BC',
    dropTexture: 'drop_project',
  },
  xp_orb: {
    id: 'xp_orb',
    name: 'XP',
    color: '#E8913A',
    dropTexture: 'drop_xp',
  },
};

export const LAND_TILE_SIZE = 384;
export const GRID_SIZE = 5;
export const WORLD_PX = LAND_TILE_SIZE * GRID_SIZE;

function nodesForTile(gx, gy) {
  const ox = gx * LAND_TILE_SIZE;
  const oy = gy * LAND_TILE_SIZE;
  const s = LAND_TILE_SIZE;
  const pad = 40;
  const rng = (min, max) => min + ((gx * 7 + gy * 13 + min * 3) % (max - min));

  const spread = (type, count) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + gx + gy;
      const r = pad + ((i * 47 + gx * 31 + gy * 17) % (s / 2 - pad * 2));
      out.push({
        type,
        x: ox + s / 2 + Math.cos(angle) * r,
        y: oy + s / 2 + Math.sin(angle) * r,
      });
    }
    return out;
  };

  const cx = 2, cy = 2;

  if (gx === cx && gy === cy) {
    return [
      ...spread('script', 3),
      ...spread('idea', 3),
      ...spread('coffee', 2),
      ...spread('contact', 2),
    ];
  }

  const dx = gx - cx;
  const dy = gy - cy;

  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    if (dx === -1) return [...spread('idea', 4), ...spread('script', 2)];
    if (dx === 1) return [...spread('coffee', 4), ...spread('contact', 2)];
    if (dy === -1) return [...spread('script', 4), ...spread('idea', 2)];
    if (dy === 1) return [...spread('contact', 4), ...spread('coffee', 2)];
    return [...spread('script', 2), ...spread('idea', 2), ...spread('coffee', 2)];
  }

  const types = ['script', 'idea', 'coffee', 'contact'];
  const primary = types[(Math.abs(dx * 3 + dy * 7)) % types.length];
  const secondary = types[(Math.abs(dx * 5 + dy * 11) + 1) % types.length];
  return [...spread(primary, 5), ...spread(secondary, 3)];
}

export function getLandNodes(gx, gy) {
  return nodesForTile(gx, gy);
}

export function getLandCost(purchaseCount) {
  const costs = [0, 10, 15, 25, 40, 60, 85, 120, 160, 200, 250, 300, 400, 500, 650, 800, 1000, 1200, 1500, 1800, 2200, 2600, 3000, 3500, 4000];
  return costs[purchaseCount] ?? 1000 + purchaseCount * 500;
}
