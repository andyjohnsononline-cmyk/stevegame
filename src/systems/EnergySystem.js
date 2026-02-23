const ACTION_COSTS = {
  readScript: 3,
  skimScript: 1,
  fullRead: 3,
  skimRead: 1,
  giveNotes: 2,
  meeting: 2,
  socialize: 1,
  explore: 1,
  makeCoffee: 0,
};

export class EnergySystem {
  constructor(scene) {
    this.scene = scene;
  }

  get state() {
    return this.scene.gameState;
  }

  canAfford(action) {
    const cost = ACTION_COSTS[action] ?? 0;
    return (this.state?.energy ?? 0) >= cost;
  }

  spend(action) {
    const cost = ACTION_COSTS[action] ?? 0;
    const gs = this.state;
    if (!gs || gs.energy < cost) return false;
    gs.energy -= cost;
    this.scene.events?.emit('hud-update');
    return true;
  }

  restore(amount) {
    const gs = this.state;
    if (!gs) return;
    gs.energy = Math.min(gs.maxEnergy ?? 10, (gs.energy ?? 0) + amount);
    this.scene.events?.emit('hud-update');
  }

  restoreFull() {
    const gs = this.state;
    if (!gs) return;
    gs.energy = gs.maxEnergy ?? 10;
    this.scene.events?.emit('hud-update');
  }
}
