import { CREW_MEMBERS, getTotalDPS } from '../data/crewData.js';
import { SKILLS } from '../data/skillData.js';

const SAVE_KEY = 'studiolot_idle_v1';

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
    if (state.stage === undefined) state.stage = 1;
    if (state.maxStage === undefined) state.maxStage = state.stage;
    if (state.tapLevel === undefined) state.tapLevel = 1;
    if (state.tapDamage === undefined) state.tapDamage = 1;
    if (state.coins === undefined) state.coins = 0;
    if (state.totalCoins === undefined) state.totalCoins = 0;
    if (!state.crew) state.crew = [...defaults.crew];
    if (!state.skills) state.skills = { ...defaults.skills };
    if (!state.prestige) state.prestige = { ...defaults.prestige };
    if (state.lastSaveTimestamp === undefined) state.lastSaveTimestamp = Date.now();

    for (const cm of CREW_MEMBERS) {
      if (!state.crew.find(c => c.id === cm.id)) {
        state.crew.push({ id: cm.id, level: 0 });
      }
    }
    for (const sk of SKILLS) {
      if (!state.skills[sk.id]) {
        state.skills[sk.id] = { id: sk.id, lastUsed: 0 };
      }
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

  static calculateOfflineProgress(state) {
    if (!state.lastSaveTimestamp) return { coins: 0, seconds: 0 };
    const now = Date.now();
    const elapsed = (now - state.lastSaveTimestamp) / 1000;
    if (elapsed < 10) return { coins: 0, seconds: 0 };

    const starPower = state.prestige?.starPower ?? 1;
    const dps = getTotalDPS(state.crew, starPower);
    const offlineCoins = Math.floor(dps * elapsed * 0.5);
    return { coins: offlineCoins, seconds: Math.floor(elapsed) };
  }

  static getDefaultState() {
    const crew = CREW_MEMBERS.map(cm => ({ id: cm.id, level: 0 }));
    const skills = {};
    for (const sk of SKILLS) {
      skills[sk.id] = { id: sk.id, lastUsed: 0 };
    }

    return {
      stage: 1,
      maxStage: 1,
      tapLevel: 1,
      tapDamage: 1,
      coins: 0,
      totalCoins: 0,
      crew,
      skills,
      prestige: {
        count: 0,
        starPower: 1.0,
        totalStarPower: 0,
      },
      lastSaveTimestamp: Date.now(),
    };
  }
}
