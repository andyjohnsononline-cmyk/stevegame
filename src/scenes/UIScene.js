import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';
import { CREW_MEMBERS, getCrewHireCost, getCrewDPS, getTotalDPS } from '../data/crewData.js';
import { SKILLS, isSkillReady, isSkillActive, getSkillCooldownRemaining, getSkillDurationRemaining } from '../data/skillData.js';
import { canPrestige, getPrestigeStarPower } from '../data/prestigeData.js';
import { isBossStage, getBossTimerSec } from '../data/stageData.js';
import { formatNumber } from './GameScene.js';
import { SFX } from '../utils/SoundGenerator.js';

const HIGHLIGHT = '#E8913A';
const TEXT_COLOR = '#F5E6CC';
const DIM_COLOR = '#8888aa';
const GOLD_COLOR = '#FFD700';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    this._createTopHUD();
    this._createHPBar();
    this._createBossTimer();
    this._createSkillBar();
    this._createBottomPanel();
    this._createCrewPanel();
    this._createTapUpgradeButton();
    this._createPrestigeButton();
    this._createDPSLabel();
    this._createPauseOverlay();

    this.gameScene.events.on('coins-changed', () => this._updateAll());
    this.gameScene.events.on('enemy-changed', () => this._onEnemyChanged());
    this.gameScene.events.on('hp-changed', (hp, max) => this._updateHP(hp, max));
    this.gameScene.events.on('boss-timer', (remaining, total) => this._updateBossTimer(remaining, total));
    this.gameScene.events.on('skill-activated', () => this._updateSkills());

    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on('down', () => this._togglePause());

    this._updateAll();
    this._onEnemyChanged();
  }

  // ===== TOP HUD =====

  _createTopHUD() {
    this.add.rectangle(480, 18, 960, 36, 0x000000, 0.6).setDepth(20);

    this.stageText = this.add.text(20, 18, 'Stage 1', {
      fontSize: '14px', fontFamily: 'monospace', color: TEXT_COLOR,
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0, 0.5).setDepth(21);

    this.bossLabel = this.add.text(120, 18, 'BOSS', {
      fontSize: '10px', fontFamily: 'monospace', color: '#FF4444',
      stroke: '#000000', strokeThickness: 2,
      backgroundColor: '#441111',
      padding: { left: 4, right: 4, top: 1, bottom: 1 },
    }).setOrigin(0, 0.5).setDepth(21).setVisible(false);

    this.coinIcon = this.add.image(900, 18, 'drop_coin').setDepth(21).setScale(1.5);
    this.coinText = this.add.text(888, 18, '0', {
      fontSize: '14px', fontFamily: 'monospace', color: GOLD_COLOR,
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(1, 0.5).setDepth(21);
  }

  // ===== HP BAR =====

  _createHPBar() {
    this.hpBarBg = this.add.image(480, 340, 'hp_bar_bg').setDepth(5);
    this.hpBarFill = this.add.image(382, 340, 'hp_bar_fill')
      .setDepth(6).setOrigin(0, 0.5);

    this.hpText = this.add.text(480, 340, '', {
      fontSize: '8px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(7);
  }

  _updateHP(hp, max) {
    const ratio = Math.max(0, hp / max);
    this.hpBarFill.setDisplaySize(196 * ratio, 12);
    this.hpText.setText(`${formatNumber(Math.max(0, Math.ceil(hp)))} / ${formatNumber(max)}`);
  }

  // ===== BOSS TIMER =====

  _createBossTimer() {
    this.bossTimerBg = this.add.image(480, 358, 'boss_timer_bg').setDepth(5).setVisible(false);
    this.bossTimerFill = this.add.image(402, 358, 'boss_timer_fill')
      .setDepth(6).setOrigin(0, 0.5).setVisible(false);
    this.bossTimerText = this.add.text(480, 358, '', {
      fontSize: '7px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(7).setVisible(false);
  }

  _updateBossTimer(remaining, total) {
    const show = remaining > 0;
    this.bossTimerBg.setVisible(show);
    this.bossTimerFill.setVisible(show);
    this.bossTimerText.setVisible(show);

    if (show) {
      const ratio = Math.max(0, remaining / total);
      this.bossTimerFill.setDisplaySize(156 * ratio, 6);
      this.bossTimerText.setText(`${(remaining / 1000).toFixed(1)}s`);
    }
  }

  // ===== SKILL BAR =====

  _createSkillBar() {
    this.skillButtons = [];
    const startX = 160;
    const y = 390;

    for (let i = 0; i < SKILLS.length; i++) {
      const skill = SKILLS[i];
      const x = startX + i * 56;

      const bg = this.add.image(x, y, 'btn_skill').setDepth(20);
      const icon = this.add.image(x, y - 2, skill.icon).setDepth(21);
      const cdText = this.add.text(x, y + 16, '', {
        fontSize: '7px', fontFamily: 'monospace', color: '#ffffff',
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(22);

      bg.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.gameScene.activateSkill(skill.id);
        });

      this.skillButtons.push({ skill, bg, icon, cdText });
    }

    this.dpsText = this.add.text(500, y, 'DPS: 0', {
      fontSize: '12px', fontFamily: 'monospace', color: HIGHLIGHT,
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0, 0.5).setDepth(20);
  }

  // ===== BOTTOM PANEL =====

  _createBottomPanel() {
    this.add.rectangle(480, 540, 960, 220, 0x111122, 0.92).setDepth(15);
    this.add.rectangle(480, 430, 960, 2, 0x333355).setDepth(16);
  }

  // ===== CREW PANEL =====

  _createCrewPanel() {
    this.crewRows = [];
    const startX = 30;
    const startY = 440;
    const rowH = 38;

    this.crewScrollY = 0;
    this.crewContainer = this.add.container(0, 0).setDepth(20);

    for (let i = 0; i < CREW_MEMBERS.length; i++) {
      const crew = CREW_MEMBERS[i];
      const y = startY + i * rowH;

      const icon = this.add.image(startX + 16, y, `crew_${crew.id}`).setScale(1);

      const nameText = this.add.text(startX + 36, y - 8, crew.name, {
        fontSize: '9px', fontFamily: 'monospace', color: crew.color,
        stroke: '#000000', strokeThickness: 1,
      });

      const levelText = this.add.text(startX + 36, y + 4, 'Lv 0', {
        fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
      });

      const dpsText = this.add.text(startX + 160, y, 'DPS: 0', {
        fontSize: '8px', fontFamily: 'monospace', color: TEXT_COLOR,
      }).setOrigin(0, 0.5);

      const btnBg = this.add.image(startX + 310, y, 'btn_hire').setInteractive({ useHandCursor: true });
      const btnText = this.add.text(startX + 310, y, 'HIRE', {
        fontSize: '8px', fontFamily: 'monospace', color: '#ffffff',
      }).setOrigin(0.5);

      const costText = this.add.text(startX + 310, y + 14, '', {
        fontSize: '7px', fontFamily: 'monospace', color: GOLD_COLOR,
      }).setOrigin(0.5);

      const lockText = this.add.text(startX + 250, y, '', {
        fontSize: '7px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(0, 0.5).setVisible(false);

      btnBg.on('pointerdown', () => {
        this.gameScene.hireCrew(crew.id);
      });

      this.crewContainer.add([icon, nameText, levelText, dpsText, btnBg, btnText, costText, lockText]);
      this.crewRows.push({ crew, icon, nameText, levelText, dpsText, btnBg, btnText, costText, lockText });
    }

    const crewMask = this.add.rectangle(240, 520, 480, 190, 0x000000, 0).setVisible(false);
    const mask = this.make.graphics();
    mask.fillRect(0, 432, 480, 200);
    this.crewContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));

    this.input.on('wheel', (pointer, _go, _dx, dy) => {
      if (pointer.x < 490) {
        this.crewScrollY = Phaser.Math.Clamp(
          this.crewScrollY - dy * 0.5,
          -(CREW_MEMBERS.length * 38 - 180),
          0,
        );
        this.crewContainer.y = this.crewScrollY;
      }
    });
  }

  // ===== TAP UPGRADE =====

  _createTapUpgradeButton() {
    const x = 700;
    const y = 460;

    this.tapUpgBg = this.add.image(x, y, 'btn_upgrade').setDepth(20)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.gameScene.upgradeTap());

    this.tapUpgText = this.add.text(x, y - 4, '', {
      fontSize: '9px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5).setDepth(21);

    this.tapUpgCost = this.add.text(x, y + 10, '', {
      fontSize: '8px', fontFamily: 'monospace', color: GOLD_COLOR,
    }).setOrigin(0.5).setDepth(21);
  }

  // ===== PRESTIGE =====

  _createPrestigeButton() {
    const x = 700;
    const y = 520;

    this.prestigeBg = this.add.image(x, y, 'btn_prestige').setDepth(20)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.gameScene.doPrestige();
      });

    this.prestigeText = this.add.text(x, y - 4, 'New Season', {
      fontSize: '9px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5).setDepth(21);

    this.prestigeInfo = this.add.text(x, y + 10, '', {
      fontSize: '7px', fontFamily: 'monospace', color: '#cc99ff',
    }).setOrigin(0.5).setDepth(21);

    this.starPowerText = this.add.text(x, y + 40, '', {
      fontSize: '8px', fontFamily: 'monospace', color: GOLD_COLOR,
    }).setOrigin(0.5).setDepth(20);
  }

  // ===== DPS LABEL =====

  _createDPSLabel() {
    // already created in skill bar area
  }

  // ===== PAUSE =====

  _createPauseOverlay() {
    this.pauseContainer = this.add.container(480, 320).setDepth(30).setVisible(false);

    const dim = this.add.rectangle(0, 0, 960, 640, 0x000000, 0.6);
    const panel = this.add.rectangle(0, 0, 240, 180, 0x0d0d1a, 0.95);
    const border = this.add.rectangle(0, 0, 240, 180).setStrokeStyle(2, 0xe8913a);

    const title = this.add.text(0, -60, 'PAUSED', {
      fontSize: '16px', fontFamily: 'monospace', color: HIGHLIGHT,
    }).setOrigin(0.5);

    const resumeBtn = this.add.rectangle(0, -10, 160, 32, 0xd4721a, 0.9)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => resumeBtn.setFillStyle(0xe8851f))
      .on('pointerout', () => resumeBtn.setFillStyle(0xd4721a, 0.9))
      .on('pointerdown', () => this._togglePause());
    const resumeLabel = this.add.text(0, -10, 'Resume', {
      fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5);

    const menuBtn = this.add.rectangle(0, 30, 160, 32, 0x444466, 0.9)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => menuBtn.setFillStyle(0x555577))
      .on('pointerout', () => menuBtn.setFillStyle(0x444466, 0.9))
      .on('pointerdown', () => {
        SaveSystem.save(this.gameScene.gameState);
        this.scene.stop('GameScene');
        this.scene.stop('UIScene');
        this.scene.start('MenuScene');
      });
    const menuLabel = this.add.text(0, 30, 'Save & Quit', {
      fontSize: '12px', fontFamily: 'monospace', color: '#aaaacc',
    }).setOrigin(0.5);

    const stats = this.add.text(0, 65, '', {
      fontSize: '7px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(0.5);
    this.pauseStats = stats;

    this.pauseContainer.add([dim, panel, border, title, resumeBtn, resumeLabel, menuBtn, menuLabel, stats]);
    this.isPaused = false;
  }

  _togglePause() {
    this.isPaused = !this.isPaused;
    this.pauseContainer.setVisible(this.isPaused);

    if (this.isPaused) {
      const gs = this.gameScene.gameState;
      const sp = gs.prestige?.starPower ?? 1;
      this.pauseStats.setText(
        `Stage ${gs.stage} | Max ${gs.maxStage} | ★${sp.toFixed(1)}x | ${gs.prestige?.count ?? 0} seasons`
      );
      this.gameScene.scene.pause();
    } else {
      this.gameScene.scene.resume();
    }
  }

  // ===== UPDATE ALL =====

  _updateAll() {
    const gs = this.gameScene.gameState;

    this.stageText.setText(`Stage ${gs.stage}`);
    this.coinText.setText(formatNumber(gs.coins));
    this.bossLabel.setVisible(isBossStage(gs.stage));

    this._updateCrew();
    this._updateTapUpgrade();
    this._updatePrestige();
    this._updateDPS();
  }

  _onEnemyChanged() {
    const gs = this.gameScene.gameState;
    this.stageText.setText(`Stage ${gs.stage}`);
    this.bossLabel.setVisible(isBossStage(gs.stage));
    this._updateHP(this.gameScene.enemyHP, this.gameScene.enemyMaxHP);

    const showTimer = isBossStage(gs.stage);
    this.bossTimerBg.setVisible(showTimer);
    this.bossTimerFill.setVisible(showTimer);
    this.bossTimerText.setVisible(showTimer);
  }

  _updateCrew() {
    const gs = this.gameScene.gameState;
    const starPower = gs.prestige?.starPower ?? 1;

    for (const row of this.crewRows) {
      const state = gs.crew.find(c => c.id === row.crew.id);
      const level = state?.level ?? 0;
      const unlocked = gs.maxStage >= row.crew.unlockStage;

      row.levelText.setText(`Lv ${level}`);

      if (!unlocked) {
        row.lockText.setVisible(true);
        row.lockText.setText(`Unlocks at stage ${row.crew.unlockStage}`);
        row.btnBg.setVisible(false);
        row.btnText.setVisible(false);
        row.costText.setVisible(false);
        row.dpsText.setText('');
        row.icon.setAlpha(0.3);
        row.nameText.setAlpha(0.4);
        row.levelText.setAlpha(0.4);
      } else {
        row.lockText.setVisible(false);
        row.btnBg.setVisible(true);
        row.btnText.setVisible(true);
        row.costText.setVisible(true);
        row.icon.setAlpha(1);
        row.nameText.setAlpha(1);
        row.levelText.setAlpha(1);

        const cost = getCrewHireCost(row.crew, level);
        const canAfford = gs.coins >= cost;

        row.costText.setText(`$${formatNumber(cost)}`);
        row.btnBg.setTexture(canAfford ? 'btn_hire' : 'btn_hire_disabled');
        row.btnText.setText(level === 0 ? 'HIRE' : 'LVL UP');

        const dps = getCrewDPS(row.crew, level, starPower);
        row.dpsText.setText(level > 0 ? `DPS: ${formatNumber(dps)}` : '');
      }
    }
  }

  _updateTapUpgrade() {
    const gs = this.gameScene.gameState;
    const cost = this.gameScene.getTapUpgradeCost();
    const canAfford = gs.coins >= cost;

    this.tapUpgText.setText(`Tap Lv ${gs.tapLevel} → ${gs.tapLevel + 1}`);
    this.tapUpgCost.setText(`$${formatNumber(cost)}`);
    this.tapUpgBg.setTexture(canAfford ? 'btn_upgrade' : 'btn_upgrade_disabled');
  }

  _updatePrestige() {
    const gs = this.gameScene.gameState;
    const can = canPrestige(gs.maxStage);
    const earn = getPrestigeStarPower(gs.maxStage);

    this.prestigeBg.setAlpha(can ? 1 : 0.4);
    this.prestigeInfo.setText(can ? `+${earn} ★ Star Power` : `Reach stage 50`);
    this.starPowerText.setText(`★ ${(gs.prestige?.starPower ?? 1).toFixed(1)}x Star Power`);
  }

  _updateDPS() {
    const gs = this.gameScene.gameState;
    const starPower = gs.prestige?.starPower ?? 1;
    const dps = getTotalDPS(gs.crew, starPower);
    this.dpsText.setText(`DPS: ${formatNumber(dps)}`);
  }

  _updateSkills() {
    const now = Date.now();
    const gs = this.gameScene.gameState;

    for (const sb of this.skillButtons) {
      const state = gs.skills[sb.skill.id];
      const ready = isSkillReady(state, now);
      const active = isSkillActive(state, now);

      if (active) {
        sb.bg.setTexture('btn_skill_active');
        const rem = getSkillDurationRemaining(sb.skill, state, now);
        sb.cdText.setText(`${rem.toFixed(0)}s`);
      } else if (!ready) {
        sb.bg.setTexture('btn_skill_cooldown');
        const rem = getSkillCooldownRemaining(sb.skill, state, now);
        sb.cdText.setText(`${rem.toFixed(0)}s`);
      } else {
        sb.bg.setTexture('btn_skill');
        sb.cdText.setText('');
      }
    }
  }

  // ===== UPDATE =====

  update() {
    this._updateSkills();

    const gs = this.gameScene.gameState;
    this.coinText.setText(formatNumber(gs.coins));
    this._updateCrew();
    this._updateTapUpgrade();
    this._updatePrestige();
    this._updateDPS();
  }
}
