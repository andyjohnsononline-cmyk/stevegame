import { NOTE_FOCUSES, NOTE_TONES, calculateNoteEffect } from '../data/notesData.js';
import { getCharacter } from '../data/characterData.js';

export class NotesSystem {
  constructor(scene) {
    this.scene = scene;
  }

  applyNote(script, focusId, toneId) {
    const filmmaker = getCharacter(script.filmmakerIndex);
    const raw = filmmaker?.notePreference ?? filmmaker?.preferredTone ?? 'supportive';
    const filmmakerPreference = raw === 'gentle' ? 'supportive' : raw;
    const scriptQuality = script.quality ?? { character: 5, plot: 5, dialogue: 5, originality: 5, commercial: 5 };

    const hearts = this.scene.relationshipSystem?.getHearts(filmmaker?.id) ?? 0;
    const trustLevel = hearts >= 8 ? 2 : hearts >= 5 ? 1 : 0;

    const effect = calculateNoteEffect(focusId, toneId, scriptQuality, filmmakerPreference, trustLevel);

    for (const [attr, delta] of Object.entries(effect.qualityChanges)) {
      if (script.quality[attr] !== undefined) {
        script.quality[attr] = Math.max(1, Math.min(10, script.quality[attr] + delta));
      }
    }

    const relChange = effect.relationshipChange ?? 0;
    const heartsAmount = relChange * 1.5;
    const filmmakerId = filmmaker?.id;
    if (heartsAmount !== 0 && filmmakerId && this.scene.relationshipSystem) {
      this.scene.relationshipSystem.addHearts(filmmakerId, heartsAmount);
    }

    return {
      qualityChanges: effect.qualityChanges,
      relationshipChange: effect.relationshipChange,
      feedbackText: effect.feedback ?? '',
    };
  }
}
