const SAVE_KEY = 'greenlight_save';

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
    if (!state.upgrades) state.upgrades = defaults.upgrades;
    if (!state.automation) state.automation = { ...defaults.automation };
    if (!state.achievements) state.achievements = [];
    if (!state.lifetimeStats) state.lifetimeStats = { ...defaults.lifetimeStats };
    if (state.speedMultiplier === undefined) state.speedMultiplier = 1;
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
      day: 1,
      time: 480,
      relationships: {},
      inbox: [],
      pipeline: [],
      completedScripts: [],
      flags: {},
      currentLocation: 'houseboat',
      playerPos: { x: 5, y: 5 },
      budget: 300,
      xp: 0,
      level: 1,
      lastSaveTimestamp: Date.now(),
      upgrades: {},
      automation: {
        autoRead: false,
        autoNotes: false,
        autoGreenlight: false,
        qualityThreshold: 6,
        noteDefaults: {},
      },
      achievements: [],
      lifetimeStats: {
        totalRevenue: 0,
        totalScriptsReleased: 0,
        totalScriptsRead: 0,
        criticalAcclaims: 0,
      },
      speedMultiplier: 1,
    };
  }
}
