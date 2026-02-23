export class CareerSystem {
  constructor(scene) {
    this.scene = scene;
    this.levels = [
      {
        title: 'Junior Executive',
        salary: 100,
        inboxSize: 3,
        unlocks: [],
        requirements: null,
      },
      {
        title: 'Content Executive',
        salary: 200,
        inboxSize: 5,
        unlocks: ['meeting_room'],
        requirements: { creative: 25, commercial: 25, industry: 15, completedProjects: 2 },
      },
      {
        title: 'Senior Executive',
        salary: 350,
        inboxSize: 7,
        unlocks: ['meeting_room', 'screening_room', 'festival_travel'],
        requirements: { creative: 45, commercial: 45, industry: 35, completedProjects: 5 },
      },
      {
        title: 'Director of Content',
        salary: 500,
        inboxSize: 9,
        unlocks: ['meeting_room', 'screening_room', 'festival_travel', 'slate_strategy', 'mentoring', 'rooftop'],
        requirements: { creative: 65, commercial: 60, industry: 55, completedProjects: 10 },
      },
      {
        title: 'VP of Content',
        salary: 750,
        inboxSize: 12,
        unlocks: ['meeting_room', 'screening_room', 'festival_travel', 'slate_strategy', 'mentoring', 'rooftop', 'legacy_projects'],
        requirements: { creative: 80, commercial: 75, industry: 70, completedProjects: 18 },
      },
    ];
  }

  getCurrentLevel() {
    const gs = this.scene.gameState;
    const level = gs?.careerLevel ?? 0;
    return this.levels[Math.min(level, this.levels.length - 1)];
  }

  getLevelIndex() {
    return Math.min(this.scene.gameState?.careerLevel ?? 0, this.levels.length - 1);
  }

  getTitle() {
    return this.getCurrentLevel().title;
  }

  getSalary() {
    return this.getCurrentLevel().salary;
  }

  hasUnlock(unlock) {
    return this.getCurrentLevel().unlocks.includes(unlock);
  }

  getPromotionProgress() {
    const gs = this.scene.gameState;
    if (!gs) return null;
    const level = gs.careerLevel ?? 0;
    if (level >= this.levels.length - 1) return { atMax: true, title: this.getTitle() };

    const next = this.levels[level + 1];
    const req = next.requirements;
    const rep = gs.reputation ?? { creative: 0, commercial: 0, industry: 0 };
    const completed = gs.completedScripts?.length ?? 0;

    return {
      atMax: false,
      currentTitle: this.getTitle(),
      nextTitle: next.title,
      creative: { current: rep.creative, required: req.creative, met: rep.creative >= req.creative },
      commercial: { current: rep.commercial, required: req.commercial, met: rep.commercial >= req.commercial },
      industry: { current: rep.industry, required: req.industry, met: rep.industry >= req.industry },
      completedProjects: { current: completed, required: req.completedProjects, met: completed >= req.completedProjects },
    };
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

    const next = this.levels[level + 1];
    const req = next.requirements;
    if (!req) return false;

    const rep = gs.reputation ?? { creative: 0, commercial: 0, industry: 0 };
    const completed = gs.completedScripts?.length ?? 0;

    if (rep.creative >= req.creative &&
        rep.commercial >= req.commercial &&
        rep.industry >= req.industry &&
        completed >= req.completedProjects) {
      gs.careerLevel = level + 1;
      this.scene.events?.emit('promotion', { title: next.title, level: level + 1 });
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

  generateSlateReview() {
    const gs = this.scene.gameState;
    if (!gs) return null;

    const startRep = gs.seasonStartReputation ?? { creative: 0, commercial: 0, industry: 0 };
    const currentRep = gs.reputation ?? { creative: 0, commercial: 0, industry: 0 };
    const completedThisSeason = gs.completedScripts?.filter(s => s.releasedSeason === gs.season && s.releasedYear === gs.year) ?? [];
    const pipelineCount = gs.pipeline?.length ?? 0;
    const totalRevenue = completedThisSeason.reduce((sum, s) => sum + (s.revenue ?? 0), 0);

    const avgQuality = completedThisSeason.length > 0
      ? completedThisSeason.reduce((sum, s) => {
          const q = s.quality ?? {};
          const vals = Object.values(q);
          return sum + (vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 5);
        }, 0) / completedThisSeason.length
      : 0;

    const deltas = {
      creative: currentRep.creative - (startRep.creative ?? 0),
      commercial: currentRep.commercial - (startRep.commercial ?? 0),
      industry: currentRep.industry - (startRep.industry ?? 0),
    };

    const overallScore = deltas.creative + deltas.commercial + deltas.industry + completedThisSeason.length * 5;

    let bossReaction, bonus;
    if (overallScore >= 30) {
      bossReaction = 'Outstanding quarter, Steve. The board noticed. Keep this up and bigger things are coming.';
      bonus = 300;
    } else if (overallScore >= 15) {
      bossReaction = 'Solid work this quarter. A few smart moves in there. Let\'s build on it.';
      bonus = 150;
    } else if (overallScore >= 5) {
      bossReaction = 'Mixed results. Some decent calls, some questionable ones. I need to see more consistency.';
      bonus = 50;
    } else if (overallScore >= 0) {
      bossReaction = 'A quiet quarter. Not terrible, but not the kind of impact we need. Step it up.';
      bonus = 0;
    } else {
      bossReaction = 'We need to talk about your performance. The numbers don\'t lie, and right now they\'re not pretty.';
      bonus = 0;
    }

    const budgetDelta = overallScore >= 20 ? 1 : overallScore < 0 ? -1 : 0;
    const currentBudget = gs.quarterlyBudget ?? 3;
    gs.quarterlyBudget = Math.max(2, Math.min(8, currentBudget + budgetDelta));

    if (bonus > 0) {
      gs.money = (gs.money ?? 0) + bonus;
      this.scene.events?.emit('money-changed', { money: gs.money });
    }

    return {
      completedCount: completedThisSeason.length,
      pipelineCount,
      avgQuality: Math.round(avgQuality * 10) / 10,
      totalRevenue,
      deltas,
      bossReaction,
      bonus,
      budgetDelta,
      newBudget: gs.quarterlyBudget,
      promotionReady: false,
    };
  }

  snapshotReputation() {
    const gs = this.scene.gameState;
    if (!gs) return;
    gs.seasonStartReputation = { ...(gs.reputation ?? { creative: 0, commercial: 0, industry: 0 }) };
  }
}
