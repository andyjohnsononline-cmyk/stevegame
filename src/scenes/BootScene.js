import Phaser from 'phaser';
import { TextureGenerator } from '../utils/TextureGenerator.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x2d2d44);

    this.add.text(width / 2, height / 2 - 30, 'STUDIO LOT', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#E8913A',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, 'Loading...', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#8888aa',
    }).setOrigin(0.5);

    TextureGenerator.generateAll(this);

    this.time.delayedCall(400, () => {
      this.scene.start('MenuScene');
    });
  }
}
