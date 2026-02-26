import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';
import { formatNumber } from './GameScene.js';

const PANEL_BG = 0x1a1a2e;
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

    this.add.text(cx, 145, 'Tap  -  Hire  -  Prestige', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: TEXT_COLOR,
    }).setOrigin(0.5);

    const hasSave = SaveSystem.hasSave();

    if (hasSave) {
      const state = SaveSystem.load();
      const offline = SaveSystem.calculateOfflineProgress(state);

      this._createButton(cx, 260, 'Continue', () => {
        if (offline.coins > 0) {
          state.coins += offline.coins;
          state.totalCoins += offline.coins;
          SaveSystem.save(state);
        }
        this.scene.start('GameScene', { loadSave: true });
      });

      if (offline.coins > 0) {
        const mins = Math.floor(offline.seconds / 60);
        const timeStr = mins > 60 ? `${(mins / 60).toFixed(1)}h` : `${mins}m`;
        this.add.text(cx, 300, `Welcome back! +${formatNumber(offline.coins)} coins (${timeStr} away)`, {
          fontSize: '10px', fontFamily: 'monospace', color: '#FFD700',
          stroke: '#000000', strokeThickness: 2,
        }).setOrigin(0.5);
      }

      const saveInfo = this.add.text(cx, 330, `Stage ${state?.maxStage ?? 1} | ★${(state?.prestige?.starPower ?? 1).toFixed(1)}x`, {
        fontSize: '9px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(0.5);

      const newLink = this.add.text(cx, 360, 'new game', {
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
      'Tap executives to pitch your ideas.',
      'Hire crew for passive damage.',
      'Prestige for permanent power.',
    ].join('\n'), {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: DIM_COLOR,
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(cx, h - 40, 'Click to Tap | ESC: Pause', {
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
