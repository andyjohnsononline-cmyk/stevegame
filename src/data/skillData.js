export const SKILLS = [
  {
    id: 'coffeeRush',
    name: 'Coffee Rush',
    description: '10x all DPS for 30s',
    icon: 'skill_coffee',
    cooldownSec: 60,
    durationSec: 30,
    effect: { dpsMultiplier: 10 },
    color: '#8D6E63',
  },
  {
    id: 'viralMarketing',
    name: 'Viral Marketing',
    description: 'Each tap hits 4x for 20s',
    icon: 'skill_viral',
    cooldownSec: 120,
    durationSec: 20,
    effect: { tapMultiplier: 4 },
    color: '#4FC3F7',
  },
  {
    id: 'powerPitch',
    name: 'Power Pitch',
    description: 'Guaranteed 5x crits for 15s',
    icon: 'skill_power',
    cooldownSec: 90,
    durationSec: 15,
    effect: { critMultiplier: 5 },
    color: '#FF7043',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Deal 5 minutes of DPS instantly',
    icon: 'skill_brain',
    cooldownSec: 300,
    durationSec: 0,
    effect: { instantDPS: 300 },
    color: '#AB47BC',
  },
];

export function isSkillReady(skillState, now) {
  if (!skillState || !skillState.lastUsed) return true;
  const skill = SKILLS.find(s => s.id === skillState.id);
  if (!skill) return true;
  return (now - skillState.lastUsed) >= skill.cooldownSec * 1000;
}

export function isSkillActive(skillState, now) {
  const skill = SKILLS.find(s => s.id === skillState?.id);
  if (!skill || skill.durationSec === 0) return false;
  if (!skillState?.lastUsed) return false;
  return (now - skillState.lastUsed) < skill.durationSec * 1000;
}

export function getSkillCooldownRemaining(skillDef, skillState, now) {
  if (!skillState?.lastUsed) return 0;
  const elapsed = (now - skillState.lastUsed) / 1000;
  return Math.max(0, skillDef.cooldownSec - elapsed);
}

export function getSkillDurationRemaining(skillDef, skillState, now) {
  if (!skillState?.lastUsed || skillDef.durationSec === 0) return 0;
  const elapsed = (now - skillState.lastUsed) / 1000;
  return Math.max(0, skillDef.durationSec - elapsed);
}
