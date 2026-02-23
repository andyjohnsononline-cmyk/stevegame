import { CHARACTERS } from '../data/characterData.js';

export class RelationshipSystem {
  constructor(scene) {
    this.scene = scene;
    this.initRelationships();
  }

  initRelationships() {
    const gs = this.scene.gameState;
    if (!gs) return;
    if (!gs.relationships) gs.relationships = {};
    CHARACTERS.forEach(c => {
      if (gs.relationships[c.id] === undefined) gs.relationships[c.id] = 0;
    });
  }

  getHearts(npcId) {
    return this.scene.gameState?.relationships?.[npcId] ?? 0;
  }

  addHearts(npcId, amount) {
    const gs = this.scene.gameState;
    if (!gs?.relationships) return;
    const current = gs.relationships[npcId] ?? 0;
    gs.relationships[npcId] = Math.max(0, Math.min(10, current + amount));
    this.scene.events?.emit('relationship-changed', { npcId, hearts: gs.relationships[npcId] });
  }

  getThreshold(npcId) {
    const hearts = this.getHearts(npcId);
    if (hearts < 2) return 0;
    if (hearts < 5) return 1;
    if (hearts < 8) return 2;
    return 3;
  }

  canGift(npcId) {
    const gs = this.scene.gameState;
    if (!gs?.flags?.giftedToday) return true;
    return !gs.flags.giftedToday[npcId];
  }

  giveGift(npcId, giftName) {
    const gs = this.scene.gameState;
    if (!gs) return 'Cannot gift.';
    if (!this.canGift(npcId)) return 'Already gifted today.';

    const character = CHARACTERS.find(c => c.id === npcId);
    const preferred = character?.preferredGiftType === giftName;
    const amount = preferred ? 2 : 1;
    this.addHearts(npcId, amount);

    if (!gs.flags) gs.flags = {};
    if (!gs.flags.giftedToday) gs.flags.giftedToday = {};
    gs.flags.giftedToday[npcId] = true;

    return preferred ? 'They loved it! (+2 hearts)' : 'They appreciated it. (+1 heart)';
  }

  getDialogue(npcId, type) {
    const character = CHARACTERS.find(c => c.id === npcId);
    if (!character?.dialoguePool) return '...';

    const threshold = this.getThreshold(npcId);
    let pool = character.dialoguePool[type] ?? character.dialoguePool.casual;

    if (threshold >= 3 && character.dialoguePool.special) {
      pool = [...(character.dialoguePool.special ?? []), ...(pool ?? [])];
    }
    if (threshold === 0 && character.dialoguePool.upset) {
      pool = [...(character.dialoguePool.upset ?? []), ...(pool ?? [])];
    }

    const lines = Array.isArray(pool) ? pool : [];
    return lines[Math.floor(Math.random() * lines.length)] ?? '...';
  }

  getNPCsAtLocation(locationId, timePeriod) {
    return CHARACTERS.filter(c => {
      const schedule = c.schedule ?? {};
      return schedule[timePeriod] === locationId;
    });
  }
}
