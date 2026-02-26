import { UPGRADES } from '../data/upgradeData.js';

export class UpgradeSystem {
  constructor(scene) {
    this.scene = scene;
  }

  get state() {
    return this.scene.gameState;
  }

  get upgrades() {
    if (!this.state.upgrades) this.state.upgrades = {};
    return this.state.upgrades;
  }

  hasPurchased(id) {
    return !!this.upgrades[id];
  }

  getUpgrade(id) {
    return UPGRADES.find(u => u.id === id) ?? null;
  }

  canPurchase(id) {
    const def = this.getUpgrade(id);
    if (!def) return false;
    if (this.hasPurchased(id)) return false;
    if (def.prerequisite && !this.hasPurchased(def.prerequisite)) return false;
    if ((this.state.level ?? 1) < def.levelRequired) return false;
    if ((this.state.budget ?? 0) < def.cost) return false;
    return true;
  }

  purchase(id) {
    const def = this.getUpgrade(id);
    if (!def || !this.canPurchase(id)) return false;

    this.state.budget -= def.cost;
    this.upgrades[id] = true;

    if (def.effect?.type === 'automation') {
      if (!this.state.automation) {
        this.state.automation = { autoRead: false, autoNotes: false, autoGreenlight: false, qualityThreshold: 6, noteDefaults: {} };
      }
      this.state.automation[def.effect.value] = true;
    }

    this.scene.events?.emit('activity-message', `Upgrade purchased: ${def.name}`);
    this.scene.events?.emit('hud-update');
    return true;
  }

  getBonus(type) {
    let total = 0;
    for (const def of UPGRADES) {
      if (this.hasPurchased(def.id) && def.effect?.type === type) {
        total += def.effect.value;
      }
    }

    const achievementSystem = this.scene.achievementSystem;
    if (achievementSystem) {
      total += achievementSystem.getBonus(type);
    }

    return total;
  }

  getBonusMultiplier(type) {
    return 1 + this.getBonus(type);
  }

  getAvailableUpgrades() {
    return UPGRADES.filter(u => !this.hasPurchased(u.id));
  }

  getPurchasedUpgrades() {
    return UPGRADES.filter(u => this.hasPurchased(u.id));
  }
}
