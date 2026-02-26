import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';

const PANEL_BG = 0x2d2d44;
const HIGHLIGHT = '#E8913A';
const TEXT_COLOR = '#F5E6CC';
const DIM_COLOR = '#8888aa';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const cx = this.cameras.main.centerX;
    const h = this.cameras.main.height;
    const w = this.cameras.main.width;

    this.add.rectangle(cx, h / 2, w, h, PANEL_BG);

    const title = this.add.text(cx, 90, 'STUDIO LOT', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: HIGHLIGHT,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      y: { from: 80, to: 90 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add.text(cx, 145, 'Gather  -  Craft  -  Expand', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: TEXT_COLOR,
    }).setOrigin(0.5);

    const hasSave = SaveSystem.hasSave();

    if (hasSave) {
      this._createButton(cx, 260, 'Continue', () => {
        this.scene.start('GameScene', { loadSave: true });
      });

      const newLink = this.add.text(cx, 316, 'new game', {
        fontSize: '11px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerover', () => newLink.setColor(HIGHLIGHT))
        .on('pointerout', () => newLink.setColor(DIM_COLOR))
        .on('pointerdown', () => {
          SaveSystem.deleteSave();
          this.scene.start('GameScene', { loadSave: false });
        });
    } else {
      this._createButton(cx, 260, 'Play', () => {
        this.scene.start('GameScene', { loadSave: false });
      });
    }

    this.add.text(cx, h - 110, [
      'Walk near resources to auto-gather.',
      'Craft at your desk. Buy new land.',
      'Complete shows for coins and XP.',
    ].join('\n'), {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: DIM_COLOR,
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(cx, h - 40, 'WASD: Move | E: Craft | SPACE: Buy Land', {
      fontSize: '9px',
      fontFamily: 'monospace',
      color: '#555577',
    }).setOrigin(0.5);
  }

  _createButton(x, y, label, callback) {
    const bg = this.add.rectangle(x, y, 200, 44, 0xd4721a, 0.9)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(0xe8851f))
      .on('pointerout', () => bg.setFillStyle(0xd4721a, 0.9))
      .on('pointerdown', callback);

    this.add.text(x, y, label, {
      fontSize: '16px',
      fontFamily: 'monospace',
      color: '#ffffff',
    }).setOrigin(0.5);
  }
}
