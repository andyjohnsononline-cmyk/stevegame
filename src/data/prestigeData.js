const PRESTIGE_MIN_STAGE = 50;

export function canPrestige(maxStage) {
  return maxStage >= PRESTIGE_MIN_STAGE;
}

export function getPrestigeStarPower(maxStage) {
  if (maxStage < PRESTIGE_MIN_STAGE) return 0;
  return Math.floor(Math.sqrt(maxStage / PRESTIGE_MIN_STAGE));
}

export function getPrestigeMinStage() {
  return PRESTIGE_MIN_STAGE;
}
