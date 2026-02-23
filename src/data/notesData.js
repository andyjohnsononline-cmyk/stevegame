export const NOTE_FOCUSES = [
  {
    id: 'dialogue',
    label: 'Dialogue',
    description: 'Focus on what characters say—subtext, authenticity, real voices.',
    targetAttribute: 'dialogue',
  },
  {
    id: 'character',
    label: 'Character',
    description: 'Focus on depth, motivation, and earned choices.',
    targetAttribute: 'character',
  },
  {
    id: 'plot',
    label: 'Plot',
    description: 'Focus on structure, logic, and earned twists.',
    targetAttribute: 'plot',
  },
  {
    id: 'pacing',
    label: 'Pacing',
    description: 'Focus on rhythm, momentum, and flow.',
    targetAttribute: 'plot',
  },
  {
    id: 'theme',
    label: 'Theme',
    description: 'Focus on what the story is really about beneath the surface.',
    targetAttribute: 'originality',
  },
  {
    id: 'commercial',
    label: 'Commercial',
    description: 'Focus on audience appeal and market positioning.',
    targetAttribute: 'commercial',
  },
];

export const NOTE_TONES = [
  {
    id: 'supportive',
    label: 'Supportive',
    description: 'Gentle, encouraging feedback',
    qualityMod: 0.5,
    relationshipMod: 1,
    riskFactor: 0,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Fair, constructive criticism',
    qualityMod: 1.0,
    relationshipMod: 0,
    riskFactor: 0.3,
  },
  {
    id: 'direct',
    label: 'Direct',
    description: 'Blunt, challenging feedback',
    qualityMod: 1.5,
    relationshipMod: -1,
    riskFactor: 0.6,
  },
];

const FEEDBACK = {
  dialogue_positive: 'Your notes on the dialogue landed. The writer is already revising key scenes.',
  dialogue_negative: 'The dialogue notes missed the mark—the writer pushed back hard.',
  character_positive: 'Your character notes resonated. The protagonist feels deeper now.',
  character_negative: 'The writer felt your character notes were off-base. Pushback ensued.',
  plot_positive: 'Your structural notes made sense. The story holds together better now.',
  plot_negative: 'The plot notes didn\'t land—the writer defended their structural choices.',
  originality_positive: 'Your thematic notes gave the writer something to aim for. Real progress.',
  originality_negative: 'The writer felt the thematic notes imposed rather than discovered.',
  commercial_positive: 'Your commercial notes were practical. The project might find its audience.',
  commercial_negative: 'Commercial notes bristled the writer. "I\'m not making a product."',
  neutral: 'Your notes were noted. The script remains largely unchanged.',
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function calculateNoteEffect(focusId, toneId, scriptQuality, filmmakerPreference) {
  const focus = NOTE_FOCUSES.find(f => f.id === focusId);
  const tone = NOTE_TONES.find(t => t.id === toneId);
  if (!focus || !tone) {
    return { qualityChanges: {}, relationshipChange: 0, commercialShift: 0, feedback: 'Invalid note configuration.' };
  }

  const targetAttr = focus.targetAttribute;
  const currentValue = scriptQuality[targetAttr] ?? 5;
  const isWeak = currentValue <= 5;
  const isStrong = currentValue >= 7;

  let relationshipChange = tone.relationshipMod;
  const qualityChanges = {};

  if (filmmakerPreference === tone.id) {
    relationshipChange += 1;
  } else if (filmmakerPreference === 'direct' && tone.id === 'supportive') {
    relationshipChange -= 0.5;
  } else if (filmmakerPreference === 'supportive' && tone.id === 'direct') {
    relationshipChange -= 1;
  }

  let baseDelta = 0;
  let feedbackKey;

  if (isWeak) {
    baseDelta = Math.round(2 * tone.qualityMod);
    baseDelta = Math.min(baseDelta, 3);
    feedbackKey = `${targetAttr}_positive`;
  } else if (isStrong) {
    if (Math.random() < tone.riskFactor) {
      baseDelta = -Math.round(1 * tone.qualityMod);
      feedbackKey = `${targetAttr}_negative`;
    } else {
      feedbackKey = 'neutral';
    }
  } else {
    baseDelta = Math.round(1 * tone.qualityMod);
    feedbackKey = `${targetAttr}_positive`;
  }

  qualityChanges[targetAttr] = baseDelta;

  let commercialShift = 0;
  if (focusId === 'commercial') {
    commercialShift = baseDelta > 0 ? 0.5 : baseDelta < 0 ? -0.5 : 0;
  }

  const feedback = FEEDBACK[feedbackKey] || FEEDBACK.neutral;

  return { qualityChanges, relationshipChange, commercialShift, feedback };
}
