const TOTAL_DEV_MINUTES = 2880; // 3 game-days worth of active time (960 min/day)

const STAGES = [
  { id: 'writing', label: 'Writing', start: 0, end: 960 },
  { id: 'production', label: 'Production', start: 960, end: 1920 },
  { id: 'post', label: 'Post-Production', start: 1920, end: TOTAL_DEV_MINUTES },
];

export class PipelineSystem {
  constructor(scene) {
    this.scene = scene;
  }

  greenlight(script) {
    const gs = this.scene.gameState;
    if (!gs) return;

    const inboxIdx = gs.inbox?.indexOf(script);
    if (inboxIdx >= 0) gs.inbox.splice(inboxIdx, 1);

    script.stage = 'writing';
    script.progressMinutes = 0;

    if (!gs.pipeline) gs.pipeline = [];
    gs.pipeline.push(script);

    this.scene.events?.emit('activity-message', `"${script.title}" greenlit — entering Writing.`);
  }

  update(deltaMinutes) {
    const gs = this.scene.gameState;
    if (!gs?.pipeline?.length) return;

    for (const script of [...gs.pipeline]) {
      const prevProgress = script.progressMinutes ?? 0;
      script.progressMinutes = Math.min(prevProgress + deltaMinutes, TOTAL_DEV_MINUTES);

      const prevStage = this._getStage(prevProgress);
      const currStage = this._getStage(script.progressMinutes);
      if (prevStage.id !== currStage.id) {
        script.stage = currStage.id;
        this.scene.events?.emit('stage-changed', { script, stage: currStage });
        this.scene.events?.emit('activity-message',
          `"${script.title}" moved to ${currStage.label}.`);
      }

      if (script.progressMinutes >= TOTAL_DEV_MINUTES) {
        this._release(script);
      }
    }
  }

  _release(script) {
    const gs = this.scene.gameState;
    const idx = gs.pipeline.indexOf(script);
    if (idx >= 0) gs.pipeline.splice(idx, 1);

    const result = this.releaseScript(script);
    if (!gs.completedScripts) gs.completedScripts = [];
    gs.completedScripts.push(script);

    this.scene.events?.emit('pipeline-release', { script, message: result });
    this.scene.events?.emit('activity-message', result);
  }

  releaseScript(script) {
    const scriptEngine = this.scene.scriptEngine;
    const avgQuality = scriptEngine?.getAverageQuality(script) ?? 5;
    const gs = this.scene.gameState;

    script.stage = 'released';
    script.releasedDay = gs.day;

    let revenue, xp, message;
    if (avgQuality >= 8) {
      revenue = 200; xp = 8;
      message = `"${script.title}" released to critical acclaim! A triumph.`;
    } else if (avgQuality >= 6) {
      revenue = 120; xp = 6;
      message = `"${script.title}" released to positive reviews. Solid work.`;
    } else if (avgQuality >= 4) {
      revenue = 60; xp = 4;
      message = `"${script.title}" released to mixed reviews. Could have been better.`;
    } else {
      revenue = 20; xp = 2;
      message = `"${script.title}" released to poor reviews. A learning experience.`;
    }

    gs.budget = (gs.budget ?? 0) + revenue;
    this.scene.events?.emit('activity-message', `Revenue: +$${revenue}K from "${script.title}"`);

    this.scene.levelSystem?.addXP(xp);

    return message;
  }

  _getStage(progressMinutes) {
    for (const s of STAGES) {
      if (progressMinutes < s.end) return s;
    }
    return STAGES[STAGES.length - 1];
  }

  getProgress(script) {
    const progress = script.progressMinutes ?? 0;
    return {
      fraction: Math.min(progress / TOTAL_DEV_MINUTES, 1),
      stage: this._getStage(progress),
      minutes: progress,
      total: TOTAL_DEV_MINUTES,
    };
  }

  getPipelineScripts() {
    return this.scene.gameState?.pipeline ?? [];
  }

  migrateScripts() {
    const gs = this.scene.gameState;
    if (!gs?.pipeline) return;
    for (const script of gs.pipeline) {
      if (script.progressMinutes === undefined) {
        const daysElapsed = (gs.day ?? 1) - (script.stageStartDay ?? gs.day ?? 1);
        script.progressMinutes = Math.min(daysElapsed * 960, TOTAL_DEV_MINUTES - 1);
        script.stage = this._getStage(script.progressMinutes).id;
      }
    }
  }
}

export { STAGES, TOTAL_DEV_MINUTES };
