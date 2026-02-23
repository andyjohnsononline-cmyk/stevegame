import { generateScript } from '../data/scriptData.js';

export class ScriptEngine {
  constructor(scene) {
    this.scene = scene;
    this.nextId = 1;
  }

  generateNewScript(filmmakerIndex) {
    const id = this.nextId++;
    return generateScript(id, filmmakerIndex);
  }

  populateInbox(count = 2) {
    const gs = this.scene.gameState;
    if (!gs) return;
    if (!gs.inbox) gs.inbox = [];

    const maxInbox = 6;
    const toAdd = Math.min(count, Math.max(0, maxInbox - gs.inbox.length));

    for (let i = 0; i < toAdd; i++) {
      const filmmakerIndex = Math.floor(Math.random() * 5);
      gs.inbox.push(this.generateNewScript(filmmakerIndex));
    }
  }

  readScript(script) {
    script.read = true;
    return { ...(script.quality ?? {}) };
  }

  getAverageQuality(script) {
    const quality = script.quality ?? {};
    const attrs = ['character', 'plot', 'dialogue', 'originality', 'commercial'];
    const sum = attrs.reduce((s, a) => s + (quality[a] ?? 5), 0);
    return sum / attrs.length;
  }

  getCoverageRating(script) {
    const avg = this.getAverageQuality(script);
    if (avg < 4) return 'Pass';
    if (avg < 7) return 'Consider';
    return 'Recommend';
  }
}
