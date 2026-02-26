const MAX_OFFLINE_HOURS = 24;
const GAME_MINUTES_PER_REAL_SECOND = 20;
const MINUTES_PER_DAY = 960; // 480 (8AM) to 1440 (midnight)
const DAY_START = 480;

export class OfflineProgressSystem {
  static calculate(gameState, pipelineSystem, scriptEngine, levelSystem) {
    const now = Date.now();
    const lastSave = gameState.lastSaveTimestamp ?? now;
    const elapsedMs = Math.max(0, now - lastSave);
    const elapsedSeconds = elapsedMs / 1000;

    const cappedSeconds = Math.min(elapsedSeconds, MAX_OFFLINE_HOURS * 3600);

    // Need at least 60 real seconds (20 game-minutes) to matter
    if (cappedSeconds < 60) {
      return { daysElapsed: 0, scriptsReleased: 0, revenueEarned: 0, scriptsArrived: 0, levelUps: 0 };
    }

    let totalGameMinutes = cappedSeconds * GAME_MINUTES_PER_REAL_SECOND;

    const result = {
      daysElapsed: 0,
      scriptsReleased: 0,
      revenueEarned: 0,
      scriptsArrived: 0,
      levelUps: 0,
    };

    const startLevel = gameState.level ?? 1;

    while (totalGameMinutes > 0) {
      const currentTime = gameState.time ?? DAY_START;
      const minutesUntilMidnight = 1440 - currentTime;

      if (totalGameMinutes >= minutesUntilMidnight) {
        // Advance pipeline by remaining day minutes
        OfflineProgressSystem._advancePipeline(gameState, minutesUntilMidnight, pipelineSystem, scriptEngine, levelSystem, result);
        totalGameMinutes -= minutesUntilMidnight;

        // Advance day
        gameState.time = DAY_START;
        gameState.day = (gameState.day ?? 1) + 1;
        result.daysElapsed++;

        // Populate inbox for new day
        const count = Math.random() < 0.6 ? 1 : 2;
        const inboxBefore = (gameState.inbox ?? []).length;
        scriptEngine?.populateInbox(count);
        const inboxAfter = (gameState.inbox ?? []).length;
        result.scriptsArrived += (inboxAfter - inboxBefore);
      } else {
        // Partial day — advance pipeline by remaining minutes
        OfflineProgressSystem._advancePipeline(gameState, totalGameMinutes, pipelineSystem, scriptEngine, levelSystem, result);
        gameState.time = currentTime + totalGameMinutes;
        totalGameMinutes = 0;
      }
    }

    result.levelUps = (gameState.level ?? 1) - startLevel;
    gameState.lastSaveTimestamp = now;

    return result;
  }

  static _advancePipeline(gameState, deltaMinutes, pipelineSystem, scriptEngine, levelSystem, result) {
    if (!gameState.pipeline?.length) return;

    const TOTAL_DEV_MINUTES = 960;
    const pipelineSpeedBonus = 1; // upgrades not applied offline for simplicity

    for (const script of [...gameState.pipeline]) {
      const prevProgress = script.progressMinutes ?? 0;
      script.progressMinutes = Math.min(prevProgress + deltaMinutes * pipelineSpeedBonus, TOTAL_DEV_MINUTES);

      if (script.progressMinutes >= TOTAL_DEV_MINUTES) {
        // Release the script
        const avgQuality = scriptEngine?.getAverageQuality(script) ?? 5;
        script.stage = 'released';
        script.releasedDay = gameState.day;

        let revenue, xp, resultTier;
        if (avgQuality >= 8) {
          revenue = 200; xp = 8; resultTier = 'Critical Acclaim';
        } else if (avgQuality >= 6) {
          revenue = 120; xp = 6; resultTier = 'Positive Reviews';
        } else if (avgQuality >= 4) {
          revenue = 60; xp = 4; resultTier = 'Mixed Reviews';
        } else {
          revenue = 20; xp = 2; resultTier = 'Poor Reviews';
        }

        script.resultTier = resultTier;
        script.revenue = revenue;
        script.xpEarned = xp;
        script.avgQuality = Math.round(avgQuality * 10) / 10;

        gameState.budget = (gameState.budget ?? 0) + revenue;
        result.revenueEarned += revenue;
        result.scriptsReleased++;

        if (!gameState.lifetimeStats) gameState.lifetimeStats = { totalRevenue: 0, totalScriptsReleased: 0, totalScriptsRead: 0, criticalAcclaims: 0 };
        gameState.lifetimeStats.totalRevenue += revenue;
        gameState.lifetimeStats.totalScriptsReleased++;
        if (resultTier === 'Critical Acclaim') gameState.lifetimeStats.criticalAcclaims++;

        const idx = gameState.pipeline.indexOf(script);
        if (idx >= 0) gameState.pipeline.splice(idx, 1);

        if (!gameState.completedScripts) gameState.completedScripts = [];
        gameState.completedScripts.push(script);

        gameState.xp = (gameState.xp ?? 0) + xp;
        // Recalculate level from XP
        const LEVELS = [
          { level: 1, xpRequired: 0 },
          { level: 2, xpRequired: 10 },
          { level: 3, xpRequired: 30 },
          { level: 4, xpRequired: 60 },
          { level: 5, xpRequired: 100 },
        ];
        let newLevel = 1;
        for (const entry of LEVELS) {
          if (gameState.xp >= entry.xpRequired) newLevel = entry.level;
        }
        gameState.level = newLevel;
      }
    }
  }
}
