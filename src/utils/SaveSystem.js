const SAVE_KEY = 'studiolot_save_v2';

export class SaveSystem {
  static save(gameState) {
    try {
      gameState.lastSaveTimestamp = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (err) {
      console.error('SaveSystem.save failed:', err);
    }
  }

  static load() {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (!data) return null;
      const state = JSON.parse(data);
      SaveSystem.migrate(state);
      return state;
    } catch (err) {
      console.error('SaveSystem.load failed:', err);
      return null;
    }
  }

  static migrate(state) {
    const defaults = SaveSystem.getDefaultState();
    if (state.lastSaveTimestamp === undefined) state.lastSaveTimestamp = Date.now();
    if (!state.inventory) state.inventory = { ...defaults.inventory };
    if (state.xp === undefined) state.xp = 0;
    if (state.level === undefined) state.level = 1;
    if (state.totalCoins === undefined) state.totalCoins = 0;
    if (state.totalProjects === undefined) state.totalProjects = 0;
    if (!state.unlockedLands) state.unlockedLands = [...defaults.unlockedLands];
    if (state.landsPurchased === undefined) state.landsPurchased = 1;
  }

  static hasSave() {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  static deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (err) {
      console.error('SaveSystem.deleteSave failed:', err);
    }
  }

  static getDefaultState() {
    return {
      playerX: 2.5 * 384,
      playerY: 2.5 * 384,
      inventory: {
        script: 0,
        idea: 0,
        coffee: 0,
        contact: 0,
        coin: 0,
        pitch: 0,
        project: 0,
      },
      xp: 0,
      level: 1,
      totalCoins: 0,
      totalProjects: 0,
      unlockedLands: ['2,2'],
      landsPurchased: 1,
      lastSaveTimestamp: Date.now(),
    };
  }
}
