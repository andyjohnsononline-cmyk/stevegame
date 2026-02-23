import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';

const PANEL_BG = 0x1a1a2e;
const HIGHLIGHT = '#E8913A';
const TEXT_COLOR = '#F5E6CC';
const DIM_COLOR = '#aaaacc';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.showMainMenu();
  }

  showMainMenu() {
    this.children.removeAll();

    const cx = this.cameras.main.centerX;
    const h = this.cameras.main.height;
    const w = this.cameras.main.width;

    this.add.rectangle(cx, h / 2, w, h, PANEL_BG);

    this.add.text(cx, 100, 'GREENLIGHT', {
      fontSize: '52px',
      fontFamily: 'Georgia, serif',
      color: HIGHLIGHT,
    }).setOrigin(0.5);

    this.add.text(cx, 160, 'A Script Development Simulation', {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#FFF5E1',
    }).setOrigin(0.5);

    this.add.text(cx, 190, 'Amsterdam', {
      fontSize: '12px',
      fontFamily: 'Georgia, serif',
      color: '#8B6914',
    }).setOrigin(0.5);

    const hasSave = SaveSystem.hasSave();
    if (hasSave) {
      this._createButton(cx, 290, 'Continue', () => this.continueGame());
      this._createButton(cx, 350, 'How to Play', () => this.showHowToPlay());

      const newLink = this.add.text(cx, 410, 'or start a new game', {
        fontSize: '12px', fontFamily: 'Georgia, serif', color: DIM_COLOR,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true })
        .on('pointerover', () => newLink.setColor(HIGHLIGHT))
        .on('pointerout', () => newLink.setColor(DIM_COLOR))
        .on('pointerdown', () => this.startNewGame());
    } else {
      this._createButton(cx, 290, 'New Game', () => this.startNewGame());
      this._createButton(cx, 350, 'How to Play', () => this.showHowToPlay());
    }

    this.add.text(cx, h - 90, 'You are Steve, a content executive at a\nstreaming company\'s Amsterdam office.\nRead scripts. Give notes. Talk to people.', {
      fontSize: '11px',
      fontFamily: 'Georgia, serif',
      color: DIM_COLOR,
      align: 'center',
      lineSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(cx, h - 30, 'Arrow keys / WASD: Move  |  SPACE: Interact  |  TAB: Inbox  |  ESC: Menu', {
      fontSize: '10px',
      fontFamily: 'monospace',
      color: '#666688',
    }).setOrigin(0.5);
  }

  showHowToPlay() {
    this.children.removeAll();

    const cx = this.cameras.main.centerX;
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    this.add.rectangle(cx, h / 2, w, h, PANEL_BG);

    this.add.text(cx, 30, 'HOW TO PLAY', {
      fontSize: '28px',
      fontFamily: 'Georgia, serif',
      color: HIGHLIGHT,
    }).setOrigin(0.5);

    const leftX = 80;
    let y = 70;
    const sectionGap = 18;
    const lineH = 16;

    const section = (title, lines) => {
      this.add.text(leftX, y, title, {
        fontSize: '14px', fontFamily: 'Georgia, serif', color: HIGHLIGHT,
      });
      y += lineH + 4;
      lines.forEach(line => {
        this.add.text(leftX + 10, y, line, {
          fontSize: '11px', fontFamily: 'monospace', color: TEXT_COLOR,
          wordWrap: { width: w - 180 },
        });
        y += lineH;
      });
      y += sectionGap;
    };

    section('Controls', [
      'Arrow Keys / WASD .... Move Steve around',
      'SPACE ................. Interact with objects, NPCs, and exits',
      'TAB ................... Open your Script Inbox',
      'ESC ................... Pause menu (save, quit)',
    ]);

    section('The Core Loop', [
      'Scripts arrive in your inbox each morning.',
      'Read them, then give notes or greenlight them.',
      'Walk to the cafe to talk to filmmakers and colleagues.',
      'Go home and sleep to start a new day.',
    ]);

    section('The Notes Triangle', [
      'Every note you give navigates tension between three forces:',
      '  Quality ....... How good the script actually becomes',
      '  Relationship .. How the filmmaker feels about you',
      '  Commercial .... Whether the project will find an audience',
      'Each script presents two focus areas and two tones.',
      "Pay attention to each filmmaker's preferred tone.",
    ]);

    section('Tips', [
      'Talk to NPCs often -- your relationships evolve as you',
      '  give notes on their scripts.',
      'Go to bed after 6pm to start fresh the next day.',
      'Greenlit scripts release after 3 days in development.',
    ]);

    this._createButton(cx, h - 40, 'Back', () => this.showMainMenu());
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
