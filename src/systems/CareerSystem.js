export class CareerSystem {
  constructor(scene) {
    this.scene = scene;
    this.levels = [
      { title: 'Junior Executive', salary: 100, inboxSize: 3, unlocks: [] },
      { title: 'Content Executive', salary: 200, inboxSize: 5, unlocks: ['meeting_room'] },
    ];
  }

  getCurrentLevel() {
    const gs = this.scene.gameState;
    const level = gs?.careerLevel ?? 0;
    return this.levels[Math.min(level, this.levels.length - 1)];
  }

  getTitle() {
    return this.getCurrentLevel().title;
  }

  getSalary() {
    return this.getCurrentLevel().salary;
  }

  addReputation(type, amount) {
    const gs = this.scene.gameState;
    if (!gs) return;
    if (!gs.reputation) gs.reputation = { creative: 0, commercial: 0, industry: 0 };
    if (gs.reputation[type] === undefined) return;
    gs.reputation[type] = Math.max(0, Math.min(100, gs.reputation[type] + amount));
    this.scene.events?.emit('reputation-changed', { type, amount, reputation: gs.reputation });
    this.scene.events?.emit('hud-update');
  }

  checkPromotion() {
    const gs = this.scene.gameState;
    if (!gs) return false;
    const level = gs.careerLevel ?? 0;
    if (level >= this.levels.length - 1) return false;

    const rep = gs.reputation ?? { creative: 0, commercial: 0, industry: 0 };

    if (rep.creative >= 30 && rep.commercial >= 30 && rep.industry >= 20) {
      gs.careerLevel = level + 1;
      this.scene.events?.emit('promotion', { title: this.levels[gs.careerLevel].title });
      this.scene.events?.emit('hud-update');
      return true;
    }
    return false;
  }

  paySalary() {
    const gs = this.scene.gameState;
    if (!gs) return;
    const salary = this.getSalary();
    gs.money = (gs.money ?? 0) + salary;
    this.scene.events?.emit('money-changed', { money: gs.money });
    this.scene.events?.emit('hud-update');
  }
}
