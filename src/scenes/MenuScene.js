import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(cx, cy, w, h, 0x1a1a2e);

    this.add.text(cx, 100, 'GREENLIGHT', {
      fontSize: '52px',
      fontFamily: 'Georgia, serif',
      color: '#E8913A',
    }).setOrigin(0.5);

    this.add.text(cx, 160, 'A Script Development Simulation', {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#FFF5E1',
    }).setOrigin(0.5);

    this.add.text(cx, 190, 'Amsterdam, Year One', {
      fontSize: '12px',
      fontFamily: 'Georgia, serif',
      color: '#8B6914',
    }).setOrigin(0.5);

    const buttonY = 290;
    this._createButton(cx, buttonY, 'New Game', () => this.startNewGame());

    if (SaveSystem.hasSave()) {
      this._createButton(cx, buttonY + 60, 'Continue', () => this.continueGame());
    }

    this.add.text(cx, h - 90, 'You are Steve, a junior content executive at a\nstreaming company\'s Amsterdam office.\nRead scripts. Give notes. Build relationships.', {
      fontSize: '11px',
      fontFamily: 'Georgia, serif',
      color: '#aaaacc',
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(cx, h - 30, 'Arrow keys / WASD: Move  |  SPACE: Interact  |  TAB: Inbox  |  ESC: Menu', {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#666688',
    }).setOrigin(0.5);
  }

  _createButton(x, y, label, callback) {
    const bg = this.add.rectangle(x, y, 220, 48, 0xD4721A, 0.9)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(0xE8851F))
      .on('pointerout', () => bg.setFillStyle(0xD4721A, 0.9))
      .on('pointerdown', callback);

    this.add.text(x, y, label, {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ffffff',
    }).setOrigin(0.5);
  }

  startNewGame() {
    this.scene.start('GameScene', { loadSave: false });
  }

  continueGame() {
    this.scene.start('GameScene', { loadSave: true });
  }
}
