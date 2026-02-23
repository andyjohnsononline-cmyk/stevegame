const LEVELS = [
  { level: 1, title: 'Junior Exec',      maxSlots: 1, xpRequired: 0 },
  { level: 2, title: 'Content Lead',     maxSlots: 2, xpRequired: 10 },
  { level: 3, title: 'Senior Executive', maxSlots: 3, xpRequired: 30 },
  { level: 4, title: 'VP of Content',    maxSlots: 4, xpRequired: 60 },
  { level: 5, title: 'Head of Studio',   maxSlots: 5, xpRequired: 100 },
];

export class LevelSystem {
  constructor(scene) {
    this.scene = scene;
    this._migrateState();
  }

  _migrateState() {
    const gs = this.scene.gameState;
    if (gs.xp === undefined) gs.xp = 0;
    if (gs.level === undefined) gs.level = 1;
  }

  addXP(amount) {
    const gs = this.scene.gameState;
    gs.xp = (gs.xp ?? 0) + amount;

    const oldLevel = gs.level ?? 1;
    const newLevel = this._calculateLevel(gs.xp);
    if (newLevel > oldLevel) {
      gs.level = newLevel;
      const info = LEVELS[newLevel - 1];
      this.scene.events?.emit('level-up', {
        level: newLevel,
        title: info.title,
        maxSlots: info.maxSlots,
      });
      this.scene.events?.emit('activity-message',
        `Promoted to ${info.title}! Pipeline expanded to ${info.maxSlots} slots.`);
    }
  }

  _calculateLevel(xp) {
    let lvl = 1;
    for (const entry of LEVELS) {
      if (xp >= entry.xpRequired) lvl = entry.level;
    }
    return lvl;
  }

  getLevel() {
    return this.scene.gameState?.level ?? 1;
  }

  getTitle() {
    const lvl = this.getLevel();
    return LEVELS[lvl - 1]?.title ?? 'Junior Exec';
  }

  getMaxSlots() {
    const lvl = this.getLevel();
    return LEVELS[lvl - 1]?.maxSlots ?? 1;
  }

  getXP() {
    return this.scene.gameState?.xp ?? 0;
  }

  getXPForNextLevel() {
    const lvl = this.getLevel();
    if (lvl >= LEVELS.length) return null;
    return LEVELS[lvl]?.xpRequired ?? null;
  }

  getXPProgress() {
    const xp = this.getXP();
    const lvl = this.getLevel();
    const currentReq = LEVELS[lvl - 1]?.xpRequired ?? 0;
    const nextReq = this.getXPForNextLevel();
    if (nextReq === null) return 1;
    const range = nextReq - currentReq;
    if (range <= 0) return 1;
    return Math.min(1, (xp - currentReq) / range);
  }

  isMaxLevel() {
    return this.getLevel() >= LEVELS.length;
  }
}

export { LEVELS };
