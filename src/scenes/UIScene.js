import Phaser from 'phaser';
import { CHARACTERS } from '../data/characterData.js';
import { AMBIENT_LINES, GENERAL_AMBIENT } from '../data/activityData.js';

const TEXT_COLOR = '#F5E6CC';
const DIM_COLOR = '#8888aa';
const HIGHLIGHT = '#D4721A';
const PANEL_ALPHA = 0.8;

const PIPELINE_X = 770;
const PIPELINE_W = 180;
const PIPELINE_CARD_H = 58;
const PIPELINE_TOP = 44;

const REL_X = 6;
const REL_W = 44;
const REL_SLOT_H = 56;
const REL_TOP = 44;

const STAGE_COLORS = {
  writing: 0x2196F3,
  production: 0xFFC107,
  post: 0x9C27B0,
};

const RESULT_COLORS = {
  'Critical Acclaim': '#4CAF50',
  'Positive Reviews': '#8BC34A',
  'Mixed Reviews': '#FFC107',
  'Poor Reviews': '#F44336',
};

const COMPLETED_CARD_H = 32;
const PANEL_BOTTOM = 590;

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    // --- Top bar (clock + day) ---
    this.hudBg = this.add.rectangle(480, 0, 960, 36, 0x000000, 0.75)
      .setOrigin(0.5, 0).setDepth(0);

    const style = { fontSize: '13px', fontFamily: 'monospace', color: TEXT_COLOR };
    this.clockText = this.add.text(60, 8, '', style).setDepth(1);
    this.dayText = this.add.text(180, 8, '', style).setDepth(1);

    this.budgetText = this.add.text(310, 8, '', {
      fontSize: '13px', fontFamily: 'monospace', color: '#4CAF50',
    }).setDepth(1);

    const titleStyle = { fontSize: '10px', fontFamily: 'monospace', color: HIGHLIGHT };
    this.levelText = this.add.text(480, 5, '', titleStyle).setOrigin(0.5, 0).setDepth(1);
    this.xpText = this.add.text(480, 18, '', {
      fontSize: '9px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(0.5, 0).setDepth(1);

    const xpBarW = 80;
    const xpBarH = 4;
    const xpBarX = 480 - xpBarW / 2;
    const xpBarY = 30;
    this.xpBarBg = this.add.rectangle(xpBarX + xpBarW / 2, xpBarY + xpBarH / 2,
      xpBarW, xpBarH, 0x222244, 1).setDepth(1);
    this.xpBarFill = this.add.rectangle(xpBarX, xpBarY,
      1, xpBarH, 0xD4721A, 1).setOrigin(0, 0).setDepth(2);

    this.slotsText = this.add.text(660, 8, '', {
      fontSize: '11px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setDepth(1);

    this.gameScene.events.on('level-up', ({ level, title, maxSlots }) => {
      this.showNotification(`Level Up! ${title} (${maxSlots} pipeline slots)`, HIGHLIGHT);
    });

    this._createSpeedButtons();

    this.gameScene.events.on('achievement-earned', ({ name, bonus }) => {
      const bonusStr = bonus ? ` (${bonus.type === 'qualityFloor' ? '+' + bonus.value + ' quality' : bonus.type === 'unlockSpeed' ? bonus.value + 'x speed' : '+' + Math.round(bonus.value * 100) + '% ' + bonus.type})` : '';
      this.showNotification(`Achievement: ${name}${bonusStr}`, '#FFD700');
    });

    // --- Controls hint ---
    this.controlsText = this.add.text(480, 632, 'ARROWS/WASD: Move | SPACE: Interact | TAB: Inbox | ESC: Menu', {
      fontSize: '9px', fontFamily: 'monospace', color: '#555577',
    }).setOrigin(0.5).setDepth(1);

    // --- Notification text ---
    this.messageText = this.add.text(480, 570, '', {
      fontSize: '14px', fontFamily: 'monospace', color: TEXT_COLOR,
      backgroundColor: '#000000BB', padding: { left: 10, right: 10, top: 4, bottom: 4 },
    }).setOrigin(0.5).setDepth(10).setAlpha(0);

    this.gameScene.events.on('show-message', (text) => this.showNotification(text));

    this._createPipelinePanel();
    this._createRelationshipPanel();
    this._createActivityFeed();
  }

  // ===== SPEED BUTTONS =====

  _createSpeedButtons() {
    const speeds = [1, 2, 5];
    this.speedButtons = [];
    const baseX = 870;

    for (let i = 0; i < speeds.length; i++) {
      const spd = speeds[i];
      const x = baseX + i * 30;
      const bg = this.add.rectangle(x, 14, 26, 20, 0x222244, 0.8)
        .setDepth(1).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          const gs = this.gameScene.gameState;
          if (this._isSpeedUnlocked(spd)) {
            gs.speedMultiplier = spd;
          }
        });
      const label = this.add.text(x, 14, `${spd}x`, {
        fontSize: '9px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(0.5).setDepth(2);
      this.speedButtons.push({ speed: spd, bg, label });
    }
  }

  _isSpeedUnlocked(speed) {
    if (speed === 1) return true;
    const gs = this.gameScene.gameState;
    const achievements = gs.achievements ?? [];
    if (speed === 2) {
      return (gs.level ?? 1) >= 2 || achievements.includes('speed_reader');
    }
    if (speed === 5) {
      return (gs.level ?? 1) >= 4 || achievements.includes('veteran_executive');
    }
    return false;
  }

  _updateSpeedButtons() {
    const gs = this.gameScene.gameState;
    const currentSpeed = gs?.speedMultiplier ?? 1;
    for (const btn of this.speedButtons) {
      const unlocked = this._isSpeedUnlocked(btn.speed);
      const active = btn.speed === currentSpeed;
      btn.bg.setFillStyle(active ? 0xD4721A : unlocked ? 0x222244 : 0x111122, active ? 1 : 0.8);
      btn.label.setStyle({ color: active ? '#ffffff' : unlocked ? DIM_COLOR : '#333344' });
    }
  }

  // ===== PIPELINE PANEL (right side) =====

  _createPipelinePanel() {
    this.pipelineBg = this.add.rectangle(
      PIPELINE_X + PIPELINE_W / 2, 320, PIPELINE_W + 12, 600, 0x000000, PANEL_ALPHA
    ).setDepth(0);

    this.pipelineTitle = this.add.text(PIPELINE_X + PIPELINE_W / 2, PIPELINE_TOP - 6, 'PIPELINE', {
      fontSize: '10px', fontFamily: 'monospace', color: HIGHLIGHT, letterSpacing: 2,
    }).setOrigin(0.5).setDepth(1);

    this.pipelineCards = [];
    this.pipelineEmptyText = this.add.text(PIPELINE_X + PIPELINE_W / 2, PIPELINE_TOP + 50,
      'No shows\nin development', {
        fontSize: '9px', fontFamily: 'monospace', color: DIM_COLOR, align: 'center',
      }).setOrigin(0.5).setDepth(1);

    this.completedDivider = this.add.rectangle(
      PIPELINE_X + PIPELINE_W / 2, 0, PIPELINE_W - 20, 1, 0x444466, 0.6
    ).setDepth(1).setVisible(false);

    this.completedHeader = this.add.text(PIPELINE_X + PIPELINE_W / 2, 0, 'COMPLETED', {
      fontSize: '9px', fontFamily: 'monospace', color: HIGHLIGHT, letterSpacing: 1,
    }).setOrigin(0.5).setDepth(1).setVisible(false);

    this.completedSummary = this.add.text(PIPELINE_X + PIPELINE_W / 2, 0, '', {
      fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(0.5).setDepth(1).setVisible(false);

    this.completedCards = [];
    this.completedScrollOffset = 0;

    this.completedArrowUp = this.add.text(PIPELINE_X + 10, 0, '\u25B2', {
      fontSize: '10px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setDepth(2).setVisible(false).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { this.completedScrollOffset = Math.max(0, this.completedScrollOffset - 1); })
      .on('pointerover', function () { this.setStyle({ color: HIGHLIGHT }); })
      .on('pointerout', function () { this.setStyle({ color: DIM_COLOR }); });

    this.completedArrowDown = this.add.text(PIPELINE_X + PIPELINE_W - 10, 0, '\u25BC', {
      fontSize: '10px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(1, 0).setDepth(2).setVisible(false).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { this.completedScrollOffset++; })
      .on('pointerover', function () { this.setStyle({ color: HIGHLIGHT }); })
      .on('pointerout', function () { this.setStyle({ color: DIM_COLOR }); });

    this.completedPageText = this.add.text(PIPELINE_X + PIPELINE_W / 2, 0, '', {
      fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(0.5, 0).setDepth(2).setVisible(false);
  }

  _updatePipelinePanel() {
    const ps = this.gameScene?.pipelineSystem;
    if (!ps) return;

    const scripts = ps.getPipelineScripts();

    // Clear old cards
    for (const card of this.pipelineCards) {
      card.bg?.destroy();
      card.titleText?.destroy();
      card.authorText?.destroy();
      card.stageText?.destroy();
      card.barBg?.destroy();
      card.barFill?.destroy();
      card.pctText?.destroy();
    }
    this.pipelineCards = [];

    this.pipelineEmptyText.setVisible(scripts.length === 0);

    const maxCards = Math.min(scripts.length, 8);
    for (let i = 0; i < maxCards; i++) {
      const script = scripts[i];
      const info = ps.getProgress(script);
      const y = PIPELINE_TOP + 20 + i * PIPELINE_CARD_H;

      const bg = this.add.rectangle(PIPELINE_X + PIPELINE_W / 2, y + PIPELINE_CARD_H / 2 - 4,
        PIPELINE_W - 4, PIPELINE_CARD_H - 6, 0x111133, 0.6).setDepth(1);

      const title = script.title?.length > 18
        ? script.title.substring(0, 16) + '...'
        : script.title ?? 'Untitled';
      const titleText = this.add.text(PIPELINE_X + 4, y, title, {
        fontSize: '10px', fontFamily: 'monospace', color: TEXT_COLOR,
      }).setDepth(2);

      const authorText = this.add.text(PIPELINE_X + 4, y + 13, script.filmmakerName ?? '', {
        fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setDepth(2);

      const stageColor = STAGE_COLORS[info.stage.id] ?? 0x2196F3;
      const stageHex = '#' + stageColor.toString(16).padStart(6, '0');
      const stageText = this.add.text(PIPELINE_X + PIPELINE_W - 6, y + 1, info.stage.label, {
        fontSize: '8px', fontFamily: 'monospace', color: stageHex,
      }).setOrigin(1, 0).setDepth(2);

      const barY = y + 28;
      const barW = PIPELINE_W - 12;
      const barH = 8;
      const barBg = this.add.rectangle(PIPELINE_X + 4 + barW / 2, barY + barH / 2,
        barW, barH, 0x222244, 1).setDepth(2);

      const fillW = Math.max(1, barW * info.fraction);
      const barFill = this.add.rectangle(PIPELINE_X + 4, barY,
        fillW, barH, stageColor, 1).setOrigin(0, 0).setDepth(3);

      const pct = Math.floor(info.fraction * 100);
      const pctText = this.add.text(PIPELINE_X + PIPELINE_W - 6, barY - 1, `${pct}%`, {
        fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(1, 0).setDepth(3);

      this.pipelineCards.push({ bg, titleText, authorText, stageText, barBg, barFill, pctText });
    }
  }

  // ===== COMPLETED SECTION (below active pipeline) =====

  _clearCompletedCards() {
    for (const card of this.completedCards) {
      card.bg?.destroy();
      card.titleText?.destroy();
      card.infoText?.destroy();
      card.tierText?.destroy();
    }
    this.completedCards = [];
  }

  _updateCompletedSection() {
    const gs = this.gameScene?.gameState;
    if (!gs) return;

    this._clearCompletedCards();

    const completed = gs.completedScripts ?? [];
    const hasCompleted = completed.length > 0;

    this.completedDivider.setVisible(hasCompleted);
    this.completedHeader.setVisible(hasCompleted);
    this.completedSummary.setVisible(hasCompleted);

    if (!hasCompleted) {
      this.completedArrowUp.setVisible(false);
      this.completedArrowDown.setVisible(false);
      this.completedPageText.setVisible(false);
      return;
    }

    const activeCount = Math.min((gs.pipeline ?? []).length, 8);
    const activeSectionBottom = activeCount === 0
      ? PIPELINE_TOP + 80
      : PIPELINE_TOP + 20 + activeCount * PIPELINE_CARD_H;

    const dividerY = activeSectionBottom + 6;
    this.completedDivider.setY(dividerY);

    const headerY = dividerY + 10;
    this.completedHeader.setY(headerY);

    const totalRevenue = completed.reduce((sum, s) => sum + (s.revenue ?? 0), 0);
    this.completedSummary.setText(`${completed.length} released | $${totalRevenue}K`);
    this.completedSummary.setY(headerY + 13);

    const cardsTop = headerY + 26;
    const availableHeight = PANEL_BOTTOM - cardsTop - 18;
    const maxVisibleCards = Math.max(1, Math.floor(availableHeight / COMPLETED_CARD_H));

    const reversed = [...completed].reverse();
    const maxOffset = Math.max(0, reversed.length - maxVisibleCards);
    this.completedScrollOffset = Math.min(Math.max(0, this.completedScrollOffset), maxOffset);

    const visibleItems = reversed.slice(
      this.completedScrollOffset,
      this.completedScrollOffset + maxVisibleCards
    );

    for (let i = 0; i < visibleItems.length; i++) {
      const script = visibleItems[i];
      const y = cardsTop + i * COMPLETED_CARD_H;
      const tierColor = RESULT_COLORS[script.resultTier] ?? DIM_COLOR;

      const bg = this.add.rectangle(PIPELINE_X + PIPELINE_W / 2, y + COMPLETED_CARD_H / 2 - 2,
        PIPELINE_W - 4, COMPLETED_CARD_H - 4, 0x0a0a22, 0.5).setDepth(1);

      const titleStr = script.title?.length > 14
        ? script.title.substring(0, 12) + '...'
        : script.title ?? 'Untitled';
      const titleText = this.add.text(PIPELINE_X + 4, y, titleStr, {
        fontSize: '9px', fontFamily: 'monospace', color: tierColor,
      }).setDepth(2);

      const infoText = this.add.text(PIPELINE_X + 4, y + 12,
        `$${script.revenue ?? 0}K | Day ${script.releasedDay ?? '?'}`, {
          fontSize: '8px', fontFamily: 'monospace', color: DIM_COLOR,
        }).setDepth(2);

      const tierShort = script.resultTier === 'Critical Acclaim' ? '\u2605\u2605\u2605'
        : script.resultTier === 'Positive Reviews' ? '\u2605\u2605'
          : script.resultTier === 'Mixed Reviews' ? '\u2605'
            : '\u00B7';
      const tierText = this.add.text(PIPELINE_X + PIPELINE_W - 6, y + 1, tierShort, {
        fontSize: '9px', fontFamily: 'monospace', color: tierColor,
      }).setOrigin(1, 0).setDepth(2);

      this.completedCards.push({ bg, titleText, infoText, tierText });
    }

    const needsPagination = reversed.length > maxVisibleCards;
    const arrowY = cardsTop + visibleItems.length * COMPLETED_CARD_H + 2;

    this.completedArrowUp.setVisible(needsPagination && this.completedScrollOffset > 0);
    this.completedArrowDown.setVisible(needsPagination && this.completedScrollOffset < maxOffset);
    this.completedPageText.setVisible(needsPagination);

    if (needsPagination) {
      this.completedArrowUp.setPosition(PIPELINE_X + 10, arrowY);
      this.completedArrowDown.setPosition(PIPELINE_X + PIPELINE_W - 10, arrowY);
      const page = Math.floor(this.completedScrollOffset / maxVisibleCards) + 1;
      const totalPages = Math.ceil(reversed.length / maxVisibleCards);
      this.completedPageText.setText(`${page}/${totalPages}`).setPosition(PIPELINE_X + PIPELINE_W / 2, arrowY);
    }
  }

  // ===== RELATIONSHIP PANEL (left side) =====

  _createRelationshipPanel() {
    this.relBg = this.add.rectangle(
      REL_X + REL_W / 2, 320, REL_W + 8, 600, 0x000000, PANEL_ALPHA
    ).setDepth(0);

    this.relSlots = [];
    const filmmakers = CHARACTERS.filter(c => c.role === 'filmmaker');
    const colleagues = CHARACTERS.filter(c => c.role === 'colleague');
    const ordered = [...filmmakers, ...colleagues];

    for (let i = 0; i < ordered.length; i++) {
      const ch = ordered[i];
      const y = REL_TOP + i * REL_SLOT_H;

      const colors = ch.portraitColors ?? {};
      const skinColor = Phaser.Display.Color.HexStringToColor(colors.skin ?? '#ccaa88').color;
      const shirtColor = Phaser.Display.Color.HexStringToColor(colors.shirt ?? '#445566').color;
      const hairColor = Phaser.Display.Color.HexStringToColor(colors.hair ?? '#333333').color;

      // Mini portrait: hair on top, face, shirt on bottom
      const hairRect = this.add.rectangle(REL_X + REL_W / 2, y + 2, 24, 8, hairColor).setDepth(2);
      const faceRect = this.add.rectangle(REL_X + REL_W / 2, y + 10, 24, 12, skinColor).setDepth(2);
      const bodyRect = this.add.rectangle(REL_X + REL_W / 2, y + 20, 24, 8, shirtColor).setDepth(2);

      const initial = this.add.text(REL_X + REL_W / 2, y + 10, ch.name.charAt(0), {
        fontSize: '9px', fontFamily: 'monospace', color: '#000000', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(3);

      const heartText = this.add.text(REL_X + REL_W / 2, y + 30, '', {
        fontSize: '8px', fontFamily: 'monospace', color: '#ff6b8a',
      }).setOrigin(0.5).setDepth(2);

      const nameTag = this.add.text(REL_X + REL_W / 2, y + 40, ch.name.split(' ')[0], {
        fontSize: '7px', fontFamily: 'monospace', color: DIM_COLOR,
      }).setOrigin(0.5).setDepth(2);

      const glowRect = this.add.rectangle(REL_X + REL_W / 2, y + 14, 30, 34, 0xffffff, 0)
        .setDepth(1);

      this.relSlots.push({
        characterId: ch.id,
        hairRect, faceRect, bodyRect, initial, heartText, nameTag, glowRect,
        lastHearts: -1,
      });
    }

    this.gameScene.events.on('relationship-changed', ({ npcId }) => {
      const slot = this.relSlots.find(s => s.characterId === npcId);
      if (slot) {
        this.tweens.killTweensOf(slot.glowRect);
        slot.glowRect.setFillStyle(0xffffff, 0.35);
        this.tweens.add({
          targets: slot.glowRect,
          alpha: 0, duration: 800, ease: 'Power2',
          onComplete: () => slot.glowRect.setAlpha(1),
        });
      }
    });
  }

  _updateRelationshipPanel() {
    const rs = this.gameScene?.relationshipSystem;
    if (!rs) return;

    for (const slot of this.relSlots) {
      const hearts = rs.getHearts(slot.characterId);
      if (hearts !== slot.lastHearts) {
        const filled = Math.floor(hearts);
        const display = filled > 0 ? '\u2665'.repeat(Math.min(filled, 5)) : '\u2661';
        slot.heartText.setText(display);
        slot.lastHearts = hearts;
      }
    }
  }

  // ===== ACTIVITY FEED (bottom) =====

  _createActivityFeed() {
    this.feedBg = this.add.rectangle(480, 607, 680, 20, 0x000000, 0.6).setDepth(0);

    this.feedText = this.add.text(480, 607, '', {
      fontSize: '9px', fontFamily: 'monospace', color: DIM_COLOR,
    }).setOrigin(0.5).setDepth(1);

    this.feedQueue = [];
    this.feedTimer = 0;
    this.feedInterval = 5000;
    this.ambientTimer = 0;
    this.ambientInterval = 25000 + Math.random() * 20000;

    this.gameScene.events.on('activity-message', (msg) => {
      this.feedQueue.push(msg);
    });

    this.gameScene.events.on('pipeline-release', ({ message }) => {
      this.showNotification(message, '#4CAF50');
    });
  }

  _updateActivityFeed(delta) {
    this.feedTimer += delta;
    this.ambientTimer += delta;

    if (this.ambientTimer >= this.ambientInterval) {
      this.ambientTimer = 0;
      this.ambientInterval = 25000 + Math.random() * 20000;
      this._pushAmbientLine();
    }

    if (this.feedTimer >= this.feedInterval) {
      this.feedTimer = 0;
      if (this.feedQueue.length > 0) {
        const msg = this.feedQueue.shift();
        this._showFeedLine(msg);
        this.feedInterval = 4000;
      } else {
        this.feedInterval = 5000;
      }
    }
  }

  _pushAmbientLine() {
    const charIds = Object.keys(AMBIENT_LINES);
    const useGeneral = Math.random() < 0.3;

    if (useGeneral) {
      const pool = GENERAL_AMBIENT;
      this.feedQueue.push(pool[Math.floor(Math.random() * pool.length)]);
    } else {
      const id = charIds[Math.floor(Math.random() * charIds.length)];
      const pool = AMBIENT_LINES[id];
      if (pool?.length) {
        this.feedQueue.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
  }

  _showFeedLine(text) {
    this.feedText.setText(text).setAlpha(0);
    this.tweens.killTweensOf(this.feedText);
    this.tweens.add({
      targets: this.feedText,
      alpha: 1, duration: 400, ease: 'Power2',
      yoyo: false,
      onComplete: () => {
        this.tweens.add({
          targets: this.feedText,
          alpha: 0, duration: 600, delay: 3500,
        });
      },
    });
  }

  // ===== NOTIFICATIONS =====

  showNotification(text, color = TEXT_COLOR) {
    this.messageText.setText(text).setStyle({ color }).setAlpha(1);
    this.tweens.killTweensOf(this.messageText);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0, duration: 1500, delay: 2500,
      onComplete: () => this.messageText.setAlpha(0),
    });
  }

  // ===== UPDATE =====

  update(_time, delta) {
    const gs = this.gameScene?.gameState;
    const ts = this.gameScene?.timeSystem;
    if (!gs || !ts) return;

    this.clockText.setText(ts.getTimeString());
    this.dayText.setText(`Day ${gs.day}`);

    const budget = gs.budget ?? 0;
    this.budgetText.setText(`$${budget}K`);
    this.budgetText.setStyle({ color: budget > 100 ? '#4CAF50' : budget > 50 ? '#FFC107' : '#F44336' });

    const ls = this.gameScene.levelSystem;
    if (ls) {
      this.levelText.setText(ls.getTitle());
      const nextXP = ls.getXPForNextLevel();
      this.xpText.setText(nextXP !== null ? `XP: ${ls.getXP()}/${nextXP}` : `XP: ${ls.getXP()} (MAX)`);
      const progress = ls.getXPProgress();
      this.xpBarFill.setDisplaySize(Math.max(1, 80 * progress), 4);

      const maxSlots = ls.getMaxSlots();
      const used = (gs.pipeline ?? []).length;
      this.slotsText.setText(`Slots: ${used}/${maxSlots}`);
    }

    this._updatePipelinePanel();
    this._updateCompletedSection();
    this._updateRelationshipPanel();
    this._updateActivityFeed(delta);
    this._updateSpeedButtons();
  }
}
