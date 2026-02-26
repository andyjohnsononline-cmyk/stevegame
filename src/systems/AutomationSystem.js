import { NOTE_FOCUSES } from '../data/notesData.js';
import { getCharacter } from '../data/characterData.js';

export class AutomationSystem {
  constructor(scene) {
    this.scene = scene;
  }

  get state() {
    return this.scene.gameState;
  }

  get auto() {
    if (!this.state.automation) {
      this.state.automation = { autoRead: false, autoNotes: false, autoGreenlight: false, qualityThreshold: 6, noteDefaults: {} };
    }
    return this.state.automation;
  }

  onNewDay() {
    if (this.auto.autoRead) this._autoRead();
    if (this.auto.autoNotes) this._autoNotes();
    if (this.auto.autoGreenlight) this._autoGreenlight();
  }

  _autoRead() {
    const inbox = this.state.inbox ?? [];
    let count = 0;
    for (const script of inbox) {
      if (!script.read) {
        script.read = true;
        count++;
        if (!this.state.lifetimeStats) this.state.lifetimeStats = { totalRevenue: 0, totalScriptsReleased: 0, totalScriptsRead: 0, criticalAcclaims: 0 };
        this.state.lifetimeStats.totalScriptsRead++;
      }
    }
    if (count > 0) {
      this.scene.events?.emit('activity-message', `Auto-Read: ${count} script(s) reviewed.`);
    }
  }

  _autoNotes() {
    const inbox = this.state.inbox ?? [];
    const noteDefaults = this.auto.noteDefaults ?? {};

    for (const script of inbox) {
      if (!script.read || script.notesGiven) continue;

      const filmmaker = getCharacter(script.filmmakerIndex);
      if (!filmmaker) continue;

      const defaults = noteDefaults[filmmaker.id];
      const focusId = defaults?.focus ?? this._pickWeakestFocus(script);
      const toneId = defaults?.tone ?? 'supportive';

      const result = this.scene.notesSystem?.applyNote(script, focusId, toneId);
      script.notesGiven = true;

      if (result) {
        this.scene.events?.emit('activity-message',
          `Auto-Notes: "${script.title}" — ${focusId} (${toneId})`);
      }
    }
  }

  _pickWeakestFocus(script) {
    const quality = script.quality ?? {};
    const entries = NOTE_FOCUSES.map(f => ({ id: f.id, val: quality[f.targetAttribute] ?? 5 }));
    entries.sort((a, b) => a.val - b.val);
    return entries[0]?.id ?? 'dialogue';
  }

  _autoGreenlight() {
    const gs = this.state;
    const inbox = gs.inbox ?? [];
    const maxSlots = this.scene.levelSystem?.getMaxSlots() ?? 1;
    const threshold = this.auto.qualityThreshold ?? 6;
    const scriptEngine = this.scene.scriptEngine;

    const toGreenlight = [];
    for (const script of inbox) {
      if (!script.read) continue;
      const avg = scriptEngine?.getAverageQuality(script) ?? 5;
      if (avg >= threshold) {
        toGreenlight.push(script);
      }
    }

    for (const script of toGreenlight) {
      const pipelineCount = (gs.pipeline ?? []).length;
      if (pipelineCount >= maxSlots) break;

      const cost = script.cost ?? 80;
      if ((gs.budget ?? 0) < cost) continue;

      gs.budget -= cost;
      this.scene.pipelineSystem?.greenlight(script);
      this.scene.events?.emit('activity-message',
        `Auto-Greenlight: "${script.title}" ($${cost}K)`);
    }
  }

  setNoteDefault(filmmakerId, focusId, toneId) {
    if (!this.auto.noteDefaults) this.auto.noteDefaults = {};
    this.auto.noteDefaults[filmmakerId] = { focus: focusId, tone: toneId };
  }
}
