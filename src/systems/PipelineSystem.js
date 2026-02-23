export class PipelineSystem {
  constructor(scene) {
    this.scene = scene;
    this.stages = ['inbox', 'coverage', 'development', 'production', 'released'];
    this.stageDurations = { coverage: 2, development: 5, production: 7 };
  }

  submitForCoverage(script) {
    const gs = this.scene.gameState;
    if (!gs) return;

    const inboxIdx = gs.inbox?.indexOf(script);
    if (inboxIdx >= 0) gs.inbox.splice(inboxIdx, 1);

    script.stage = 'coverage';
    script.stageStartDay = gs.day ?? 1;

    if (!gs.pipeline) gs.pipeline = [];
    gs.pipeline.push(script);
    this.scene.events?.emit('script-submitted-coverage', { script });
    this.scene.events?.emit('hud-update');
  }

  advanceStage(script) {
    const gs = this.scene.gameState;
    if (!gs) return false;

    const idx = this.stages.indexOf(script.stage);
    if (idx < 0 || idx >= this.stages.length - 1) return false;

    const duration = this.stageDurations[script.stage] ?? 1;
    const currentDay = gs.day ?? 1;
    const daysElapsed = currentDay - (script.stageStartDay ?? currentDay);

    if (daysElapsed >= duration) {
      script.stage = this.stages[idx + 1];
      script.stageStartDay = currentDay;
      this.scene.events?.emit('script-advanced', { script, stage: script.stage });
      return true;
    }
    return false;
  }

  processDailyPipeline() {
    const gs = this.scene.gameState;
    if (!gs?.pipeline) return [];

    const messages = [];
    for (const script of [...gs.pipeline]) {
      const advanced = this.advanceStage(script);
      if (advanced && script.stage === 'released') {
        const result = this.releaseScript(script);
        const idx = gs.pipeline.indexOf(script);
        if (idx >= 0) gs.pipeline.splice(idx, 1);
        if (!gs.completedScripts) gs.completedScripts = [];
        gs.completedScripts.push(script);
        messages.push(`${script.title} released! Revenue: $${result.revenue}`);
      }
    }
    this.scene.events?.emit('hud-update');
    return messages;
  }

  releaseScript(script) {
    const gs = this.scene.gameState;
    const scriptEngine = this.scene.scriptEngine;
    const careerSystem = this.scene.careerSystem;

    const avgQuality = scriptEngine?.getAverageQuality(script) ?? 5;
    const commercial = script.quality?.commercial ?? 5;

    const revenue = Math.round(avgQuality * commercial * 15);
    gs.money = (gs.money ?? 0) + revenue;

    const creativeGain = Math.round(avgQuality * 2);
    const commercialGain = Math.round(commercial * 2);
    const industryGain = Math.round((avgQuality + commercial) / 2);

    if (careerSystem) {
      careerSystem.addReputation('creative', creativeGain);
      careerSystem.addReputation('commercial', commercialGain);
      careerSystem.addReputation('industry', industryGain);
    }

    this.scene.events?.emit('script-released', { script, revenue });
    return { revenue, reputation: { creative: creativeGain, commercial: commercialGain, industry: industryGain } };
  }

  getPipelineScripts() {
    return this.scene.gameState?.pipeline ?? [];
  }
}
