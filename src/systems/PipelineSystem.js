export class PipelineSystem {
  constructor(scene) {
    this.scene = scene;
  }

  greenlight(script) {
    const gs = this.scene.gameState;
    if (!gs) return;

    const inboxIdx = gs.inbox?.indexOf(script);
    if (inboxIdx >= 0) gs.inbox.splice(inboxIdx, 1);

    script.stage = 'development';
    script.stageStartDay = gs.day ?? 1;

    if (!gs.pipeline) gs.pipeline = [];
    gs.pipeline.push(script);
  }

  processDailyPipeline() {
    const gs = this.scene.gameState;
    if (!gs?.pipeline) return [];

    const messages = [];
    for (const script of [...gs.pipeline]) {
      const currentDay = gs.day ?? 1;
      const daysElapsed = currentDay - (script.stageStartDay ?? currentDay);

      if (daysElapsed >= 3) {
        const result = this.releaseScript(script);
        const idx = gs.pipeline.indexOf(script);
        if (idx >= 0) gs.pipeline.splice(idx, 1);
        if (!gs.completedScripts) gs.completedScripts = [];
        gs.completedScripts.push(script);
        messages.push(result);
      }
    }
    return messages;
  }

  releaseScript(script) {
    const scriptEngine = this.scene.scriptEngine;
    const avgQuality = scriptEngine?.getAverageQuality(script) ?? 5;

    script.stage = 'released';
    script.releasedDay = this.scene.gameState.day;

    if (avgQuality >= 8) {
      return `"${script.title}" released to critical acclaim! A triumph.`;
    } else if (avgQuality >= 6) {
      return `"${script.title}" released to positive reviews. Solid work.`;
    } else if (avgQuality >= 4) {
      return `"${script.title}" released to mixed reviews. Could have been better.`;
    }
    return `"${script.title}" released to poor reviews. A learning experience.`;
  }

  getPipelineScripts() {
    return this.scene.gameState?.pipeline ?? [];
  }
}
