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

  getDialogue(npcId, type) {
    const character = CHARACTERS.find(c => c.id === npcId);
    if (!character?.dialoguePool) return '...';

    const hearts = this.getHearts(npcId);
    let pool = character.dialoguePool[type] ?? character.dialoguePool.casual;

    if (hearts >= 8 && character.dialoguePool.special) {
      pool = [...(character.dialoguePool.special ?? []), ...(pool ?? [])];
    }
    if (hearts < 2 && character.dialoguePool.upset) {
      pool = [...(character.dialoguePool.upset ?? []), ...(pool ?? [])];
    }

    const lines = Array.isArray(pool) ? pool : [];
    return lines[Math.floor(Math.random() * lines.length)] ?? '...';
  }

  getNPCsAtLocation(locationId) {
    if (locationId === 'cafe') {
      return CHARACTERS.filter(c => c.role === 'filmmaker' || c.role === 'colleague');
    }
    return [];
  }
}
