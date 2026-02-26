import Phaser from 'phaser';
import { CHARACTERS } from '../data/characterData.js';
import { UPGRADES } from '../data/upgradeData.js';
import { ACHIEVEMENTS } from '../data/achievementData.js';
import { LEVELS } from '../systems/LevelSystem.js';

const BG = 0x0d0d1a;
const BORDER = 0x3366aa;
const TEXT = '#c8c8dd';
const HEADER_COLOR = '#e8872a';
const DIM = '#555577';
const BTN_BG = 0x2a2a44;
const BTN_OVER = 0x3a3a5a;
const BTN_PRESS = 0xcc6600;

export class DebugScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DebugScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
    this.labels = {};
  }

  get gs() {
    return this.gameScene.gameState;
  }

  create() {
    this.scene.bringToTop();

    const PW = 390, PH = 580;
    const cx = 480, cy = 320;
    const L = cx - PW / 2 + 16;

    this.add.rectangle(480, 320, 960, 640, 0x000000, 0.2).setDepth(900);
    this.add.rectangle(cx, cy, PW, PH, BG, 0.96).setDepth(901);
    this.add.rectangle(cx, cy, PW, PH).setStrokeStyle(2, BORDER).setDepth(901);

    this.txt(cx, cy - PH / 2 + 13, 'DEBUG', HEADER_COLOR, '13px', true).setOrigin(0.5);
    this.txt(cx, cy + PH / 2 - 10, 'Press [`] to close', DIM, '9px').setOrigin(0.5);

    let y = cy - PH / 2 + 32;

    // ── Relationships ──
    y = this.sectionHeader('Relationships', L, y);
    for (const c of CHARACTERS) {
      const name = c.name.split(' ')[0];
      this.txt(L, y, name, TEXT, '10px');
      this.labels[`heart_${c.id}`] = this.txt(L + 62, y, '', '#ff6666', '10px');
      let bx = L + 120;
      for (const v of [0, 3, 6, 9, 10]) {
        this.btn(bx, y + 7, `${v}`, 28, 16, () => this.setHearts(c.id, v));
        bx += 32;
      }
      y += 20;
    }
    this.btn(L + 50, y + 2, 'All Max', 70, 18, () => {
      CHARACTERS.forEach(c => this.setHearts(c.id, 10));
    });
    this.btn(L + 130, y + 2, 'All Zero', 70, 18, () => {
      CHARACTERS.forEach(c => this.setHearts(c.id, 0));
    });
    this.btn(L + 210, y + 2, 'All Mid', 70, 18, () => {
      CHARACTERS.forEach(c => this.setHearts(c.id, 5));
    });
    y += 26;

    // ── Economy & Level ──
    y = this.sectionHeader('Economy & Level', L, y);
    this.txt(L, y, 'Budget:', TEXT, '10px');
    this.labels.budget = this.txt(L + 55, y, '', '#44cc44', '10px');
    this.btn(L + 135, y + 7, '+100', 44, 16, () => {
      this.gs.budget = (this.gs.budget ?? 0) + 100;
      this.emitHud();
    });
    this.btn(L + 185, y + 7, '+1K', 44, 16, () => {
      this.gs.budget = (this.gs.budget ?? 0) + 1000;
      this.emitHud();
    });
    this.btn(L + 235, y + 7, 'Max', 44, 16, () => {
      this.gs.budget = 9999;
      this.emitHud();
    });
    y += 22;

    this.txt(L, y, 'Level:', TEXT, '10px');
    this.labels.level = this.txt(L + 50, y, '', HEADER_COLOR, '10px');
    let lbx = L + 135;
    for (let lv = 1; lv <= 5; lv++) {
      const level = lv;
      this.btn(lbx, y + 7, `${lv}`, 28, 16, () => this.setLevel(level));
      lbx += 32;
    }
    y += 26;

    // ── Time & Speed ──
    y = this.sectionHeader('Time & Speed', L, y);
    this.txt(L, y, 'Day:', TEXT, '10px');
    this.labels.day = this.txt(L + 30, y, '', TEXT, '10px');
    this.btn(L + 90, y + 7, 'Skip Day', 62, 16, () => {
      this.gameScene.timeSystem.advanceDay();
      this.emitHud();
    });
    this.txt(L + 155, y, 'Speed:', TEXT, '10px');
    this.labels.speed = this.txt(L + 200, y, '', TEXT, '10px');
    let sbx = L + 240;
    for (const s of [1, 5, 10, 20]) {
      const spd = s;
      this.btn(sbx, y + 7, `${s}x`, 32, 16, () => {
        this.gs.speedMultiplier = spd;
        this.emitHud();
      });
      sbx += 36;
    }
    y += 26;

    // ── Scripts & Pipeline ──
    y = this.sectionHeader('Scripts & Pipeline', L, y);
    this.labels.counts = this.txt(L, y, '', DIM, '9px');
    y += 16;
    this.btn(L + 55, y + 2, 'Fill Inbox', 90, 18, () => {
      this.gameScene.scriptEngine.populateInbox(6);
      this.emitHud();
    });
    this.btn(L + 155, y + 2, 'Clear Inbox', 90, 18, () => {
      this.gs.inbox = [];
      this.emitHud();
    });
    y += 24;
    this.btn(L + 55, y + 2, 'Complete All', 90, 18, () => this.completeAllPipeline());
    this.btn(L + 155, y + 2, 'Clear Pipeline', 90, 18, () => {
      this.gs.pipeline = [];
      this.emitHud();
    });
    y += 26;

    // ── Upgrades & Achievements ──
    y = this.sectionHeader('Upgrades & Achievements', L, y);
    this.btn(L + 55, y + 2, 'All Upgrades', 90, 18, () => this.unlockAllUpgrades());
    this.btn(L + 155, y + 2, 'Reset Upgrades', 90, 18, () => {
      this.gs.upgrades = {};
      this.emitHud();
    });
    y += 24;
    this.btn(L + 55, y + 2, 'All Achieve.', 90, 18, () => this.grantAllAchievements());
    this.btn(L + 155, y + 2, 'Reset Achieve.', 90, 18, () => {
      this.gs.achievements = [];
      this.emitHud();
    });
    y += 26;

    // ── Location ──
    y = this.sectionHeader('Location', L, y);
    this.btn(L + 55, y + 2, 'Houseboat', 90, 18, () => this.teleport('houseboat'));
    this.btn(L + 155, y + 2, 'Cafe', 90, 18, () => this.teleport('cafe'));

    this.refresh();
    this.time.addEvent({ delay: 500, loop: true, callback: () => this.refresh() });
  }

  // ─── UI Helpers ───

  txt(x, y, str, color, size, bold) {
    return this.add.text(x, y, str, {
      fontSize: size,
      fontFamily: 'monospace',
      color,
      fontStyle: bold ? 'bold' : undefined,
    }).setDepth(902);
  }

  sectionHeader(text, x, y) {
    this.txt(x, y, `── ${text} ──`, HEADER_COLOR, '9px');
    return y + 15;
  }

  btn(x, y, label, w, h, cb) {
    const bg = this.add.rectangle(x, y, w, h, BTN_BG, 0.9)
      .setDepth(903)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(BTN_OVER))
      .on('pointerout', () => bg.setFillStyle(BTN_BG, 0.9))
      .on('pointerdown', () => {
        bg.setFillStyle(BTN_PRESS);
        cb();
        this.time.delayedCall(120, () => bg.setFillStyle(BTN_BG, 0.9));
      });
    this.add.text(x, y, label, {
      fontSize: '9px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5).setDepth(904);
  }

  emitHud() {
    this.gameScene.events?.emit('hud-update');
    this.refresh();
  }

  // ─── Actions ───

  setHearts(id, value) {
    if (!this.gs.relationships) this.gs.relationships = {};
    this.gs.relationships[id] = Math.max(0, Math.min(10, value));
    this.gameScene.events?.emit('relationship-changed', { npcId: id, hearts: value });
    this.emitHud();
  }

  setLevel(level) {
    const req = LEVELS.find(l => l.level === level);
    this.gs.xp = req?.xpRequired ?? 0;
    this.gs.level = level;
    this.emitHud();
  }

  completeAllPipeline() {
    for (const script of [...(this.gs.pipeline ?? [])]) {
      this.gameScene.pipelineSystem._release(script);
    }
    this.emitHud();
  }

  unlockAllUpgrades() {
    if (!this.gs.upgrades) this.gs.upgrades = {};
    for (const u of UPGRADES) {
      this.gs.upgrades[u.id] = true;
    }
    if (!this.gs.automation) {
      this.gs.automation = {
        autoRead: false, autoNotes: false, autoGreenlight: false,
        qualityThreshold: 6, noteDefaults: {},
      };
    }
    for (const u of UPGRADES) {
      if (u.effect?.type === 'automation') {
        this.gs.automation[u.effect.value] = true;
      }
    }
    this.emitHud();
  }

  grantAllAchievements() {
    if (!this.gs.achievements) this.gs.achievements = [];
    for (const a of ACHIEVEMENTS) {
      if (!this.gs.achievements.includes(a.id)) {
        this.gs.achievements.push(a.id);
      }
    }
    this.emitHud();
  }

  teleport(locationId) {
    this.gameScene.loadLocation(locationId);
    this.gameScene.toggleDebug();
  }

  // ─── Refresh ───

  refresh() {
    for (const c of CHARACTERS) {
      const label = this.labels[`heart_${c.id}`];
      if (label) label.setText(`\u2665${(this.gs.relationships?.[c.id] ?? 0).toFixed(1)}`);
    }
    if (this.labels.budget) this.labels.budget.setText(`$${this.gs.budget ?? 0}K`);
    if (this.labels.level) this.labels.level.setText(`${this.gs.level ?? 1}`);
    if (this.labels.day) this.labels.day.setText(`${this.gs.day ?? 1}`);
    if (this.labels.speed) this.labels.speed.setText(`${this.gs.speedMultiplier ?? 1}x`);
    if (this.labels.counts) {
      this.labels.counts.setText(
        `Inbox: ${this.gs.inbox?.length ?? 0}  Pipeline: ${this.gs.pipeline?.length ?? 0}`
      );
    }
  }
}
