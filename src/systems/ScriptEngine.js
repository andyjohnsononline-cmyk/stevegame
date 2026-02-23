import { generateScript } from '../data/scriptData.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class ScriptEngine {
  constructor(scene) {
    this.scene = scene;
    this.nextId = 1;
  }

  generateNewScript(filmmakerIndex) {
    const id = this.nextId++;
    return generateScript(id, filmmakerIndex);
  }

  populateInbox(count = 3) {
    const gs = this.scene.gameState;
    if (!gs) return;
    if (!gs.inbox) gs.inbox = [];

    const inboxSize = this.scene.careerSystem?.getCurrentLevel?.()?.inboxSize ?? 3;
    const toAdd = Math.min(count, Math.max(0, inboxSize - gs.inbox.length));

    for (let i = 0; i < toAdd; i++) {
      const filmmakerIndex = Math.floor(Math.random() * 5);
      gs.inbox.push(this.generateNewScript(filmmakerIndex));
    }
  }

  skimScript(script) {
    const quality = script.quality ?? {};
    const attrs = ['character', 'plot', 'dialogue', 'originality', 'commercial'];
    const result = {};
    for (const attr of attrs) {
      const trueVal = quality[attr] ?? 5;
      const deviation = Math.floor(Math.random() * 5) - 2;
      result[attr] = clamp(trueVal + deviation, 1, 10);
    }
    script.skimmed = true;
    return result;
  }

  readScript(script) {
    script.read = true;
    return { ...(script.quality ?? {}) };
  }

  applyNotes(script, noteEffect) {
    const quality = script.quality ?? {};
    const changes = noteEffect.qualityChanges ?? {};
    for (const [attr, delta] of Object.entries(changes)) {
      if (quality[attr] !== undefined) {
        quality[attr] = clamp(quality[attr] + delta, 1, 10);
      }
    }
    if (!script.notes) script.notes = [];
    script.notes.push({ effect: noteEffect });
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
