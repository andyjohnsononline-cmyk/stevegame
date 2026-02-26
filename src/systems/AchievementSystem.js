import { ACHIEVEMENTS } from '../data/achievementData.js';

export class AchievementSystem {
  constructor(scene) {
    this.scene = scene;
  }

  get state() {
    return this.scene.gameState;
  }

  checkAll() {
    if (!this.state) return [];
    if (!this.state.achievements) this.state.achievements = [];

    const newlyEarned = [];
    for (const ach of ACHIEVEMENTS) {
      if (this.state.achievements.includes(ach.id)) continue;
      try {
        if (ach.condition(this.state)) {
          this.state.achievements.push(ach.id);
          newlyEarned.push(ach);
          this.scene.events?.emit('achievement-earned', { name: ach.name, bonus: ach.bonus });
          this.scene.events?.emit('activity-message', `Achievement unlocked: ${ach.name}`);
        }
      } catch (_e) {
        // condition threw — skip
      }
    }
    return newlyEarned;
  }

  getBonus(type) {
    const earned = this.state?.achievements ?? [];
    let total = 0;
    for (const ach of ACHIEVEMENTS) {
      if (earned.includes(ach.id) && ach.bonus?.type === type) {
        total += ach.bonus.value;
      }
    }
    return total;
  }

  getAllAchievements() {
    return ACHIEVEMENTS;
  }

  isEarned(id) {
    return (this.state?.achievements ?? []).includes(id);
  }
}
