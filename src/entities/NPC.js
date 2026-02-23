import Phaser from 'phaser';
import { getCharacter } from '../data/characterData.js';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, characterId) {
    const characterData = getCharacter(characterId);
    if (!characterData) {
      throw new Error(`NPC: No character found for id ${characterId}`);
    }
    const spriteKey = `npc_${characterData.id}`;
    const fallback = scene.textures.exists(spriteKey) ? spriteKey : 'player';
    super(scene, x, y, fallback);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.characterId = characterId;
    this.characterData = characterData;
    this.body.setImmovable(true);
    this.setDepth(9);
    this.body.setSize(14, 14);
    this.body.setOffset(1, 18);

    const firstName = this.characterData.name.split(' ')[0];
    this.nameLabel = scene.add
      .text(x, y - 24, firstName, {
        fontSize: '10px',
        fontFamily: 'monospace',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { left: 2, right: 2, top: 1, bottom: 1 },
      })
      .setOrigin(0.5)
      .setDepth(11);

    this.indicator = scene.add.text(x, y - 36, '!', {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: '#ffcc00',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(11)
      .setVisible(false);

    scene.tweens.add({
      targets: this,
      y: y + 2,
      duration: 2000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(playerX, playerY) {
    this.nameLabel.setPosition(this.x, this.y - 24);
    this.indicator.setPosition(this.x, this.y - 36);
    const dist = Phaser.Math.Distance.Between(playerX, playerY, this.x, this.y);
    this.indicator.setVisible(dist < 48);
  }

  getDialogue(hearts) {
    const h = hearts ?? 0;
    let pool = 'greeting';
    if (h >= 8) pool = 'special';
    else if (h >= 5) pool = 'pleased';
    else if (h >= 2) pool = 'heartTwo';
    else if (h < 0) pool = 'upset';

    const lines = this.characterData.dialoguePool?.[pool]
      ?? this.characterData.dialoguePool?.greeting
      ?? this.characterData.dialoguePool?.casual;
    if (!lines || lines.length === 0) return null;
    return lines[Math.floor(Math.random() * lines.length)];
  }

  getCharacterData() {
    return this.characterData;
  }

  destroy() {
    if (this.nameLabel) this.nameLabel.destroy();
    if (this.indicator) this.indicator.destroy();
    super.destroy();
  }
}
