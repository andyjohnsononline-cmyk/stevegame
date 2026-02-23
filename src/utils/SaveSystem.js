const SAVE_KEY = 'greenlight_save';

export class SaveSystem {
  static save(gameState) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    } catch (err) {
      console.error('SaveSystem.save failed:', err);
    }
  }

  static load() {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('SaveSystem.load failed:', err);
      return null;
    }
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
      season: 0,
      year: 1,
      time: 480,
      energy: 10,
      maxEnergy: 10,
      money: 1000,
      reputation: { creative: 0, commercial: 0, industry: 0 },
      careerLevel: 0,
      relationships: {},
      inbox: [],
      pipeline: [],
      completedScripts: [],
      flags: {},
      currentLocation: 'houseboat',
      playerPos: { x: 5, y: 5 },
    };
  }
}
