import Phaser from 'phaser';
import { TextureGenerator } from '../utils/TextureGenerator.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1A1A2E);

    this.add.text(width / 2, height / 2 - 40, 'GREENLIGHT', {
      fontSize: '48px',
      fontFamily: 'Georgia, serif',
      color: '#E8913A',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 10, 'A Script Development Simulation', {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#FFF5E1',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 40, 'Loading...', {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#8888aa',
    }).setOrigin(0.5);

    TextureGenerator.generateAll(this);

    this.time.delayedCall(500, () => {
      this.scene.start('MenuScene');
    });
  }
}
