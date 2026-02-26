const BASE_HP = 10;
const HP_SCALE = 1.15;
const BASE_COIN_REWARD = 1;
const BOSS_FREQUENCY = 5;
const BOSS_HP_MULT = 10;
const BOSS_COIN_MULT = 10;
const BOSS_TIMER_SEC = 30;

export function getStageHP(stage) {
  const base = BASE_HP * Math.pow(HP_SCALE, stage - 1);
  if (isBossStage(stage)) return Math.floor(base * BOSS_HP_MULT);
  return Math.floor(base);
}

export function getStageCoinReward(stage) {
  const base = BASE_COIN_REWARD + Math.floor(stage * 0.5);
  if (isBossStage(stage)) return base * BOSS_COIN_MULT;
  return base;
}

export function isBossStage(stage) {
  return stage % BOSS_FREQUENCY === 0;
}

export function getBossTimerSec() {
  return BOSS_TIMER_SEC;
}

const EXEC_NAMES = [
  'Junior Associate', 'Assistant Coordinator', 'Development Intern',
  'Script Reader', 'Story Analyst', 'Associate Producer',
  'Development Manager', 'VP of Development', 'Head of Programming',
  'Senior VP', 'Network President', 'Studio Chief',
  'Media Mogul', 'Entertainment Titan', 'Industry Legend',
];

const BOSS_NAMES = [
  'Tough Negotiator', 'Skeptical Producer', 'Budget Hawk',
  'Ratings Obsessed VP', 'Corporate Overlord', 'Rival Studio Head',
  'Board of Directors', 'Media Conglomerate CEO', 'The Shareholders',
  'Industry Monopolist',
];

export function getExecName(stage) {
  if (isBossStage(stage)) {
    const bossIdx = Math.floor(stage / BOSS_FREQUENCY) - 1;
    return BOSS_NAMES[bossIdx % BOSS_NAMES.length];
  }
  const tier = Math.floor((stage - 1) / 10);
  return EXEC_NAMES[tier % EXEC_NAMES.length];
}

export function getExecTier(stage) {
  return Math.floor((stage - 1) / 10);
}
