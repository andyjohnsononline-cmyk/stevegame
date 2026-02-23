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
      time: 480,
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
