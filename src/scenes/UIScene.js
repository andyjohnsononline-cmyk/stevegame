import Phaser from 'phaser';
import { SaveSystem } from '../utils/SaveSystem.js';
import { RESOURCE_TYPES } from '../data/resourceData.js';
import { RECIPES } from '../data/craftingData.js';

const HIGHLIGHT = '#E8913A';
const TEXT_COLOR = '#F5E6CC';
const DIM_COLOR = '#8888aa';

const INV_ITEMS = ['script', 'idea', 'coffee', 'contact', 'pitch', 'project', 'coin'];
const SLOT_SIZE = 34;
const SLOT_GAP = 3;
const INV_Y = 614;

const XP_THRESHOLDS = [0, 20, 50, 100, 200, 350, 550, 800, 1100, 1500];

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    this.prevInventory = {};
    this._snapshotInventory();

    this._createInventoryBar();
    this._createXPBar();
    this._createLevelBadge();
    this._createDeskPrompt();
    this._createCraftingPanel();
    this._createPauseOverlay();

    this.gameScene.events.on('inventory-changed', () => {
      this._pulseChangedSlots();
      this._updateInventory();
      this._snapshotInventory();
    });
    this.gameScene.events.on('desk-proximity', (near) => this._onDeskProximity(near));
    this.gameScene.events.on('crafting-toggled', (open) => this._onCraftingToggled(open));
    this.gameScene.events.on('level-up', (level) => this._onLevelUp(level));
    this.gameScene.events.on('pause-toggled', () => this._togglePause());

    this._updateInventory();
    this._updateXP();
  }

  _snapshotInventory() {
    const inv = this.gameScene?.gameState?.inventory;
    if (!inv) return;
    for (const k of INV_ITEMS) {
      this.prevInventory[k] = inv[k] ?? 0;
    }
  }

  // ===== INVENTORY BAR =====

  _createInventoryBar() {
    const totalW = INV_ITEMS.length * (SLOT_SIZE + SLOT_GAP) - SLOT_GAP;
    const startX = (960 - totalW) / 2;

    this.add.rectangle(480, INV_Y, totalW + 12, SLOT_SIZE + 8, 0x000000, 0.75)
      .setDepth(0);

    this.invSlots = [];

    for (let i = 0; i < INV_ITEMS.length; i++) {
      const resId = INV_ITEMS[i];
      const x = startX + i * (SLOT_SIZE + SLOT_GAP) + SLOT_SIZE / 2;

      const slot = this.add.image(x, INV_Y, 'ui_slot')
        .setDepth(1).setDisplaySize(SLOT_SIZE, SLOT_SIZE);

      const rtype = RESOURCE_TYPES[resId];
      const icon = this.add.image(x, INV_Y - 3, rtype.dropTexture)
        .setDepth(2).setScale(1.4);

      const count = this.add.text(x + 10, INV_Y + 8, '0', {
        fontSize: '8px', fontFamily: 'monospace', color: TEXT_COLOR,
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(1, 0.5).setDepth(3);

      this.invSlots.push({ resId, slot, icon, count });
    }
  }

  _updateInventory() {
    const inv = this.gameScene?.gameState?.inventory;
    if (!inv) return;

    for (const s of this.invSlots) {
      const val = inv[s.resId] ?? 0;
      s.count.setText(val > 0 ? val.toString() : '');
      s.icon.setAlpha(val > 0 ? 1 : 0.35);
    }
  }

  _pulseChangedSlots() {
    const inv = this.gameScene?.gameState?.inventory;
    if (!inv) return;

    for (const s of this.invSlots) {
      const newVal = inv[s.resId] ?? 0;
      const oldVal = this.prevInventory[s.resId] ?? 0;
      if (newVal > oldVal) {
        this.tweens.add({
          targets: s.icon,
          scaleX: { from: 2, to: 1.4 },
          scaleY: { from: 2, to: 1.4 },
          duration: 200,
          ease: 'Back.easeOut',
        });
        this.tweens.add({
          targets: s.slot,
          alpha: { from: 1, to: 0.7 },
          duration: 100,
          yoyo: true,
        });
      }
    }
  }

  // ===== XP BAR =====

  _createXPBar() {
    this.add.rectangle(480, 14, 220, 22, 0x000000, 0.75).setDepth(0);

    this.xpBarBg = this.add.image(480, 14, 'ui_xp_bg').setDepth(1);
    this.xpBarFill = this.add.image(380, 14, 'ui_xp_fill').setDepth(2)
      .setOrigin(0, 0.5).setDisplaySize(1, 8);

    this.xpText = this.add.text(480, 14, '', {
      fontSize: '7px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(3);
  }

  _createLevelBadge() {
    this.levelBg = this.add.circle(48, 14, 14, 0xe8913a, 1).setDepth(2);
    this.levelText = this.add.text(48, 14, '1', {
      fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(3);

    this.coinIcon = this.add.image(910, 14, 'drop_coin').setDepth(2).setScale(1.5);
    this.coinText = this.add.text(898, 14, '0', {
      fontSize: '11px', fontFamily: 'monospace', color: '#FFD700',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(1, 0.5).setDepth(2);
  }

  _onLevelUp(level) {
    this.tweens.add({
      targets: this.levelBg,
      scaleX: { from: 2, to: 1 },
      scaleY: { from: 2, to: 1 },
      duration: 400,
      ease: 'Back.easeOut',
    });
  }

  _updateXP() {
    const gs = this.gameScene?.gameState;
    if (!gs) return;

    const level = gs.level ?? 1;
    const xp = gs.xp ?? 0;

    this.levelText.setText(`${level}`);

    const currentThreshold = XP_THRESHOLDS[level - 1] ?? 0;
    const nextThreshold = XP_THRESHOLDS[level] ?? null;

    if (nextThreshold != null) {
      const progress = (xp - currentThreshold) / (nextThreshold - currentThreshold);
      this.xpBarFill.setDisplaySize(Math.max(1, 200 * Math.min(1, progress)), 8);
      this.xpText.setText(`${xp} / ${nextThreshold} XP`);
    } else {
      this.xpBarFill.setDisplaySize(200, 8);
      this.xpText.setText(`${xp} XP (MAX)`);
    }

    this.coinText.setText(`${gs.inventory?.coin ?? 0}`);
  }

  // ===== DESK PROMPT =====

  _createDeskPrompt() {
    this.deskPrompt = this.add.text(480, 548, '[E] Craft', {
      fontSize: '10px', fontFamily: 'monospace', color: TEXT_COLOR,
      backgroundColor: '#000000aa',
      padding: { left: 6, right: 6, top: 3, bottom: 3 },
    }).setOrigin(0.5).setDepth(10).setAlpha(0);
  }

  _onDeskProximity(near) {
    this.tweens.killTweensOf(this.deskPrompt);
    this.tweens.add({
      targets: this.deskPrompt,
      alpha: near ? 1 : 0,
      duration: 150,
    });
  }

  // ===== CRAFTING PANEL =====

  _createCraftingPanel() {
    this.craftContainer = this.add.container(480, 320).setDepth(20).setVisible(false);

    const panelW = 280;
    const panelH = 210;

    const bg = this.add.rectangle(0, 0, panelW, panelH, 0x0d0d1a, 0.92);
    const border = this.add.rectangle(0, 0, panelW, panelH)
      .setStrokeStyle(2, 0xe8913a);

    const title = this.add.text(0, -panelH / 2 + 14, 'CRAFTING', {
      fontSize: '12px', fontFamily: 'monospace', color: HIGHLIGHT,
    }).setOrigin(0.5);

    this.craftContainer.add([bg, border, title]);

    this.recipeButtons = [];
    const startY = -panelH / 2 + 38;

    for (let i = 0; i < RECIPES.length; i++) {
      const recipe = RECIPES[i];
      const ry = startY + i * 52;

      const rowBg = this.add.rectangle(0, ry + 10, panelW - 16, 44, 0x222244, 0.6);

      const inputIcons = [];
      const inputKeys = Object.keys(recipe.inputs);
      const iconStartX = -panelW / 2 + 20;

      for (let j = 0; j < inputKeys.length; j++) {
        const resId = inputKeys[j];
        const rtype = RESOURCE_TYPES[resId];
        const ix = iconStartX + j * 28;
        const ic = this.add.image(ix, ry + 2, rtype.dropTexture).setScale(1.2);
        const ct = this.add.text(ix + 8, ry + 8, `${recipe.inputs[resId]}`, {
          fontSize: '7px', fontFamily: 'monospace', color: TEXT_COLOR,
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5);
        inputIcons.push(ic, ct);
      }

      const arrow = this.add.text(iconStartX + inputKeys.length * 28, ry + 2, '->', {
        fontSize: '9px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(0, 0.5);

      const outType = RESOURCE_TYPES[recipe.output.type];
      const outIcon = this.add.image(iconStartX + inputKeys.length * 28 + 26, ry + 2,
        outType?.dropTexture ?? 'drop_coin').setScale(1.2);

      const nameText = this.add.text(iconStartX, ry + 18, recipe.name, {
        fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
      });

      const btn = this.add.rectangle(panelW / 2 - 40, ry + 10, 50, 28, 0xe8913a, 0.9)
        .setDepth(21).setInteractive({ useHandCursor: true })
        .on('pointerover', () => btn.setFillStyle(0xf09530))
        .on('pointerout', () => btn.setFillStyle(0xe8913a, 0.9))
        .on('pointerdown', () => {
          if (this.gameScene.craft(recipe.id)) {
            this._updateCraftingPanel();
            this.tweens.add({
              targets: btn,
              scaleX: { from: 1.2, to: 1 },
              scaleY: { from: 0.8, to: 1 },
              duration: 120,
              ease: 'Back.easeOut',
            });
          }
        });

      const btnLabel = this.add.text(panelW / 2 - 40, ry + 10, 'CRAFT', {
        fontSize: '8px', fontFamily: 'monospace', color: '#ffffff',
      }).setOrigin(0.5).setDepth(22);

      this.craftContainer.add([rowBg, ...inputIcons, arrow, outIcon, nameText, btn, btnLabel]);
      this.recipeButtons.push({ recipe, btn, btnLabel });
    }

    const closeText = this.add.text(0, panelH / 2 - 12, '[E] Close', {
      fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(0.5);
    this.craftContainer.add(closeText);
  }

  _onCraftingToggled(open) {
    this.craftContainer.setVisible(open);
    if (open) this._updateCraftingPanel();
  }

  _updateCraftingPanel() {
    const inv = this.gameScene?.gameState?.inventory;
    if (!inv) return;

    for (const rb of this.recipeButtons) {
      const canCraft = Object.entries(rb.recipe.inputs).every(
        ([res, amount]) => (inv[res] ?? 0) >= amount
      );
      rb.btn.setFillStyle(canCraft ? 0xe8913a : 0x444455, canCraft ? 0.9 : 0.6);
      if (canCraft) {
        rb.btn.setInteractive({ useHandCursor: true });
      } else {
        rb.btn.disableInteractive();
      }
      rb.btnLabel.setColor(canCraft ? '#ffffff' : '#666666');
    }
  }

  // ===== PAUSE OVERLAY =====

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
        this.gameScene.gameState.playerX = this.gameScene.player.x;
        this.gameScene.gameState.playerY = this.gameScene.player.y;
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
      this.pauseStats.setText(
        `Lv ${gs.level} | ${gs.totalProjects ?? 0} shows | ${gs.unlockedLands?.length ?? 1} lands`
      );
      this.gameScene.scene.pause();
    } else {
      this.gameScene.scene.resume();
    }
  }

  // ===== UPDATE =====

  update() {
    this._updateXP();

    if (this.craftContainer.visible) {
      this._updateCraftingPanel();
    }
  }
}
