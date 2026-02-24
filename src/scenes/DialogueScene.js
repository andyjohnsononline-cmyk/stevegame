import Phaser from 'phaser';
import { NOTE_FOCUSES, NOTE_TONES } from '../data/notesData.js';
import { CHARACTERS } from '../data/characterData.js';
import { SaveSystem } from '../utils/SaveSystem.js';

const PANEL_BG = 0x1a1a2e;
const PANEL_BORDER = 0x2E86C1;
const TEXT_COLOR = '#F5E6CC';
const HIGHLIGHT = '#D4721A';
const DIM_COLOR = '#8888aa';
const BTN_BG = 0xD4721A;
const BTN_HOVER = 0xE8851F;

export class DialogueScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DialogueScene' });
  }

  init(data) {
    this.mode = data.mode || 'dialogue';
    this.gameScene = data.gameScene;
    this.speakerName = data.speakerName || '';
    this.dialogueText = data.text || '';
    this.characterId = data.characterId || null;
    this.choiceData = data.choiceData || null;
    this.elements = [];
  }

  create() {
    this.overlay = this.add.rectangle(480, 320, 960, 640, 0x000000, 0.6)
      .setDepth(0).setInteractive();

    switch (this.mode) {
      case 'inbox': this.showInbox(); break;
      case 'pause': this.showPauseMenu(); break;
      case 'notes': this.showNotesInterface(); break;
      case 'dialogue_choice': this.showDialogueChoice(); break;
      case 'history': this.showHistory(0); break;
      default: this.showDialogue(); break;
    }

    this.input.keyboard.on('keydown-ESC', () => this.closeScene());
  }

  addEl(el) { this.elements.push(el); return el; }

  clearElements() {
    this.elements.forEach(e => { if (e?.destroy) e.destroy(); });
    this.elements = [];
  }

  closeScene() {
    this.gameScene?.resumeFromUI();
    this.scene.stop();
  }

  makePanel(x, y, w, h) {
    this.addEl(this.add.rectangle(x, y, w, h, PANEL_BG, 0.95).setDepth(1));
    this.addEl(this.add.rectangle(x, y, w, h).setDepth(1).setStrokeStyle(2, PANEL_BORDER));
  }

  makeButton(x, y, label, callback, w = 200, h = 38) {
    const bg = this.add.rectangle(x, y, w, h, BTN_BG, 0.9)
      .setDepth(3).setInteractive({ useHandCursor: true })
      .on('pointerover', () => bg.setFillStyle(BTN_HOVER))
      .on('pointerout', () => bg.setFillStyle(BTN_BG, 0.9))
      .on('pointerdown', callback);
    const txt = this.add.text(x, y, label, {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffffff',
    }).setOrigin(0.5).setDepth(4);
    this.addEl(bg);
    this.addEl(txt);
  }

  makeText(x, y, str, opts = {}) {
    const t = this.add.text(x, y, str, {
      fontSize: opts.fontSize || '13px',
      fontFamily: 'monospace',
      color: opts.color || TEXT_COLOR,
      wordWrap: opts.wordWrap ? { width: opts.wordWrap } : undefined,
      lineSpacing: 4,
    }).setDepth(opts.depth || 2);
    if (opts.origin !== undefined) t.setOrigin(opts.origin);
    this.addEl(t);
    return t;
  }

  showQuickMessage(text) {
    const msg = this.add.text(480, 560, text, {
      fontSize: '13px', fontFamily: 'monospace', color: TEXT_COLOR,
      backgroundColor: '#000000CC',
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({
      targets: msg, alpha: 0, y: 540,
      duration: 1500, delay: 1200, onComplete: () => msg.destroy(),
    });
  }

  showDialogue() {
    this.makePanel(480, 500, 700, 160);
    if (this.speakerName) {
      this.makeText(160, 430, this.speakerName, { color: HIGHLIGHT, fontSize: '15px' });
    }
    this.makeText(160, 460, this.dialogueText, { wordWrap: 600, fontSize: '12px' });
    this.makeButton(480, 570, 'OK', () => this.closeScene(), 120, 32);
  }

  showDialogueChoice() {
    const choice = this.choiceData;
    if (!choice) { this.closeScene(); return; }

    this.makePanel(480, 400, 720, 280);
    if (this.speakerName) {
      this.makeText(155, 280, this.speakerName, { color: HIGHLIGHT, fontSize: '15px' });
    }
    this.makeText(155, 305, choice.npcLine, { wordWrap: 600, fontSize: '12px' });

    this.makeButton(480, 420, choice.optionA.text, () => this.applyDialogueChoice(choice.optionA), 580, 38);
    this.makeButton(480, 475, choice.optionB.text, () => this.applyDialogueChoice(choice.optionB), 580, 38);
  }

  applyDialogueChoice(option) {
    const rs = this.gameScene.relationshipSystem;
    const gs = this.gameScene.gameState;
    const feedbackParts = [];

    for (const eff of (option.effects ?? [])) {
      if (eff.npcId && eff.hearts) {
        rs.addHearts(eff.npcId, eff.hearts);
        const sign = eff.hearts > 0 ? '+' : '';
        feedbackParts.push(`${eff.npcId}: ${sign}${eff.hearts.toFixed(1)}`);
      }
    }

    if (option.special) {
      switch (option.special.type) {
        case 'budget_bonus':
          gs.budget = (gs.budget ?? 0) + (option.special.amount ?? 0);
          feedbackParts.push(`Budget +$${option.special.amount}K`);
          this.gameScene.events?.emit('activity-message',
            `Budget boost: +$${option.special.amount}K`);
          break;
        case 'reveal_commercial':
          gs.flags.lenaInsight = true;
          feedbackParts.push('Lena shared data insights');
          break;
        case 'reveal_preference': {
          const fmIdx = option.special.filmmakerIndex;
          const fm = CHARACTERS[fmIdx];
          if (fm) {
            if (!gs.flags.revealedPreferences) gs.flags.revealedPreferences = {};
            gs.flags.revealedPreferences[fm.id] = true;
            feedbackParts.push(`Pieter hinted about ${fm.name.split(' ')[0]}'s preferences`);
          }
          break;
        }
      }
    }

    this.clearElements();
    this.makePanel(480, 500, 700, 120);
    const feedbackLine = feedbackParts.length > 0
      ? feedbackParts.join(' | ')
      : 'The conversation was pleasant.';
    this.makeText(480, 480, feedbackLine, { fontSize: '11px', origin: 0.5, color: DIM_COLOR });
    this.makeButton(480, 540, 'OK', () => this.closeScene(), 120, 32);
  }

  showInbox() {
    const gs = this.gameScene.gameState;
    const inbox = gs?.inbox ?? [];

    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 80, 'Script Inbox', { fontSize: '20px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 105, `${inbox.length} script(s) waiting`, { fontSize: '11px', origin: 0.5, color: DIM_COLOR });

    if (inbox.length === 0) {
      this.makeText(480, 300, 'No scripts in your inbox.\nNew scripts arrive each morning.', { origin: 0.5, color: DIM_COLOR });
      this.makeButton(480, 540, 'Close', () => this.closeScene());
      return;
    }

    const maxVisible = Math.min(inbox.length, 6);
    const startY = 130;
    const lineH = 60;

    for (let i = 0; i < maxVisible; i++) {
      const script = inbox[i];
      const y = startY + i * lineH;

      this.addEl(this.add.rectangle(480, y + 20, 700, 52, 0x222244, 0.5).setDepth(2));

      const statusTag = script.read ? '[READ]' : '[NEW]';
      const statusColor = script.read ? '#4CAF50' : '#2196F3';

      this.makeText(150, y + 5, `${script.genreIcon ?? ''} ${script.title}`, { fontSize: '13px' });
      const costStr = script.cost ? ` | $${script.cost}K` : '';
      const lenaHint = gs.flags?.lenaInsight ? ` | Commercial: ${(script.quality?.commercial ?? 5)}/10` : '';
      this.makeText(150, y + 22, `${script.genre} | by ${script.filmmakerName}${costStr}${lenaHint}`, { fontSize: '10px', color: DIM_COLOR });
      this.makeText(600, y + 5, statusTag, { fontSize: '10px', color: statusColor });

      this.makeButton(700, y + 20, 'Read', () => this.readScript(script, i), 80, 28);
    }

    if (inbox.length > maxVisible) {
      this.makeText(480, startY + maxVisible * lineH + 10,
        `+ ${inbox.length - maxVisible} more scripts...`, { origin: 0.5, color: DIM_COLOR, fontSize: '11px' });
    }

    this.makeButton(480, 540, 'Close', () => this.closeScene());
  }

  readScript(script, _idx) {
    const gs = this.gameScene;
    gs.gameState.time += 60;
    script.read = true;

    this.clearElements();
    this.showScriptDetail(script, script.quality);
  }

  makeDisabledButton(x, y, label, tooltipText, w = 200, h = 38) {
    const bg = this.add.rectangle(x, y, w, h, 0x444466, 0.6).setDepth(3);
    const txt = this.add.text(x, y, label, {
      fontSize: '13px', fontFamily: 'monospace', color: '#666688',
    }).setOrigin(0.5).setDepth(4);
    this.addEl(bg);
    this.addEl(txt);
    if (tooltipText) {
      const tip = this.add.text(x, y + h / 2 + 8, tooltipText, {
        fontSize: '9px', fontFamily: 'monospace', color: '#F44336',
      }).setOrigin(0.5).setDepth(5).setAlpha(0);
      this.addEl(tip);
      bg.setInteractive()
        .on('pointerover', () => tip.setAlpha(1))
        .on('pointerout', () => tip.setAlpha(0));
    }
  }

  showScriptDetail(script, quality) {
    const gs = this.gameScene.gameState;
    const budget = gs.budget ?? 0;
    const cost = script.cost ?? 80;
    const pipelineCount = (gs.pipeline ?? []).length;
    const maxSlots = this.gameScene.levelSystem?.getMaxSlots() ?? 1;

    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 75, `${script.genreIcon ?? ''} ${script.title}`, { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 100, `${script.genre} | by ${script.filmmakerName}`, { fontSize: '11px', origin: 0.5, color: DIM_COLOR });

    const costColor = budget >= cost ? '#4CAF50' : '#F44336';
    this.makeText(480, 118, `Cost: $${cost}K | Budget: $${budget}K`, { fontSize: '11px', origin: 0.5, color: costColor });

    this.makeText(170, 138, `"${script.logline}"`, { fontSize: '11px', wordWrap: 580, color: '#ccccdd' });

    if (script.excerpt) {
      this.makeText(170, 175, `Scene: "${script.excerpt}"`, { fontSize: '10px', wordWrap: 580, color: '#9999bb' });
    }

    const attrs = [
      { key: 'character', label: 'Character Depth' },
      { key: 'plot', label: 'Plot Coherence' },
      { key: 'dialogue', label: 'Dialogue Quality' },
      { key: 'originality', label: 'Originality' },
      { key: 'commercial', label: 'Commercial Appeal' },
    ];

    let ay = 215;
    attrs.forEach(attr => {
      const val = quality[attr.key] ?? 5;
      this.makeText(190, ay, `${attr.label}:`, { fontSize: '12px' });
      const barFull = '\u2588'.repeat(val);
      const barEmpty = '\u2591'.repeat(10 - val);
      const barColor = val >= 7 ? '#4CAF50' : val >= 4 ? '#FFC107' : '#F44336';
      this.makeText(340, ay, `${barFull}${barEmpty} ${val}/10`, { fontSize: '12px', color: barColor });
      ay += 24;
    });

    const rating = this.gameScene.getCoverageRating(script);
    const ratingColor = rating === 'Recommend' ? '#4CAF50' : rating === 'Consider' ? '#FFC107' : '#F44336';
    this.makeText(480, ay + 10, `Coverage recommendation: ${rating}`, { fontSize: '14px', origin: 0.5, color: ratingColor });

    this.makeText(480, ay + 30, `Pipeline: ${pipelineCount}/${maxSlots} slots`, { fontSize: '10px', origin: 0.5, color: DIM_COLOR });

    const btnY = 510;

    this.makeButton(260, btnY, 'Give Notes', () => {
      this.currentScript = script;
      this.clearElements();
      this.showNotesInterface();
    }, 140, 38);

    const canAfford = budget >= cost;
    const hasSlot = pipelineCount < maxSlots;

    if (canAfford && hasSlot) {
      this.makeButton(480, btnY, 'Greenlight', () => {
        gs.budget = (gs.budget ?? 0) - cost;
        gs.inbox = gs.inbox.filter(s => s.id !== script.id);
        this.gameScene.pipelineSystem.greenlight(script);
        this.showQuickMessage(`${script.title} greenlit! -$${cost}K`);
        this.time.delayedCall(1500, () => { this.clearElements(); this.showInbox(); });
      }, 140, 38);
    } else {
      const reason = !canAfford ? `Need $${cost}K (have $${budget}K)` : `Pipeline full (${maxSlots} slots)`;
      this.makeDisabledButton(480, btnY, 'Greenlight', reason, 140, 38);
    }

    this.makeButton(700, btnY, 'Pass', () => {
      gs.inbox = gs.inbox.filter(s => s.id !== script.id);
      this.showQuickMessage(`Passed on "${script.title}"`);
      this.gameScene.events?.emit('activity-message', `Passed on "${script.title}".`);
      this.time.delayedCall(1000, () => { this.clearElements(); this.showInbox(); });
    }, 100, 38);
  }

  showNotesInterface() {
    const script = this.currentScript;
    if (!script) { this.showInbox(); return; }

    const quality = script.quality ?? {};
    const attrEntries = NOTE_FOCUSES.map(f => ({ focus: f, val: quality[f.targetAttribute] ?? 5 }));
    attrEntries.sort((a, b) => a.val - b.val);
    const topTwo = attrEntries.slice(0, 2).map(e => e.focus);

    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 75, `Notes: ${script.title}`, { fontSize: '16px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(170, 130, 'This script needs work in two areas.\nWhich will you focus on?', { fontSize: '13px' });

    let fy = 210;
    topTwo.forEach(focus => {
      this.makeButton(320, fy, focus.label, () => this.selectFocus(focus), 200, 38);
      this.makeText(440, fy - 8, focus.description, { fontSize: '10px', color: DIM_COLOR });
      fy += 65;
    });

    this.makeText(170, fy + 30, 'The Notes Triangle:', { fontSize: '12px', color: HIGHLIGHT });
    this.makeText(170, fy + 50, 'Every note navigates tension between quality,', { fontSize: '10px', color: DIM_COLOR });
    this.makeText(170, fy + 63, 'filmmaker relationship, and commercial viability.', { fontSize: '10px', color: DIM_COLOR });
  }

  selectFocus(focus) {
    this.selectedFocus = focus;
    this.clearElements();

    const script = this.currentScript;
    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 80, `Notes: ${script.title}`, { fontSize: '16px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 110, `Focus: ${focus.label}`, { fontSize: '13px', origin: 0.5 });
    this.makeText(170, 165, 'How will you deliver the notes?', { fontSize: '13px' });

    let ty = 220;
    NOTE_TONES.forEach(tone => {
      this.makeButton(320, ty, tone.label, () => this.applyNote(focus, tone), 200, 38);
      this.makeText(440, ty - 8, tone.description, { fontSize: '10px', color: DIM_COLOR });
      ty += 65;
    });

    const fm = CHARACTERS[script.filmmakerIndex];
    const fmName = fm?.name ?? 'Unknown';
    const raw = fm?.preferredTone ?? 'gentle';
    const prefLabel = raw === 'gentle' ? 'supportive' : raw;

    const gs = this.gameScene.gameState;
    const revealed = gs.flags?.revealedPreferences?.[fm?.id];
    if (revealed) {
      this.makeText(170, ty + 20, `Pieter mentioned: ${fmName} prefers a ${prefLabel} approach.`, {
        fontSize: '10px', color: '#D4721A',
      });
    } else {
      this.makeText(170, ty + 20, `You\'re not sure what approach ${fmName} prefers...`, {
        fontSize: '10px', color: DIM_COLOR,
      });
    }
  }

  applyNote(focus, tone) {
    const script = this.currentScript;
    const gs = this.gameScene;

    gs.gameState.time += 45;

    const result = gs.notesSystem.applyNote(script, focus.id, tone.id);

    this.clearElements();
    this.makePanel(480, 320, 750, 480);
    this.makeText(480, 100, 'Notes Delivered', { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(170, 150, result.feedbackText, { wordWrap: 580, fontSize: '12px' });

    let ry = 230;
    if (result.qualityChanges) {
      for (const [attr, delta] of Object.entries(result.qualityChanges)) {
        if (delta === 0) continue;
        const sign = delta > 0 ? '+' : '';
        const color = delta > 0 ? '#4CAF50' : '#F44336';
        const label = attr.charAt(0).toUpperCase() + attr.slice(1);
        this.makeText(200, ry, `${label}: ${sign}${delta}`, { fontSize: '12px', color });
        ry += 24;
      }
    }

    const relDelta = result.relationshipChange ?? 0;
    if (relDelta !== 0) {
      const sign = relDelta > 0 ? '+' : '';
      const color = relDelta > 0 ? '#4CAF50' : '#F44336';
      this.makeText(200, ry, `Relationship: ${sign}${relDelta.toFixed(1)}`, { fontSize: '12px', color });
    }

    this.makeButton(480, 500, 'Continue', () => { this.clearElements(); this.showInbox(); }, 140, 34);
  }

  showHistory(page) {
    this.clearElements();
    const gs = this.gameScene.gameState;
    const completed = gs.completedScripts ?? [];

    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 75, 'Show History', { fontSize: '20px', origin: 0.5, color: HIGHLIGHT });

    if (completed.length === 0) {
      this.makeText(480, 300, 'No shows released yet.\nGreenlight scripts and wait for them to finish production.', {
        origin: 0.5, color: DIM_COLOR,
      });
      this.makeButton(480, 540, 'Back', () => { this.clearElements(); this.showPauseMenu(); });
      return;
    }

    const totalRevenue = completed.reduce((sum, s) => sum + (s.revenue ?? 0), 0);
    const totalXP = completed.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
    this.makeText(480, 100, `${completed.length} show(s) released | Total revenue: $${totalRevenue}K | Total XP: ${totalXP}`, {
      fontSize: '10px', origin: 0.5, color: DIM_COLOR,
    });

    const perPage = 7;
    const totalPages = Math.ceil(completed.length / perPage);
    const safePage = Math.max(0, Math.min(page, totalPages - 1));
    const reversed = [...completed].reverse();
    const pageItems = reversed.slice(safePage * perPage, (safePage + 1) * perPage);

    const startY = 125;
    const rowH = 54;

    const tierColors = {
      'Critical Acclaim': '#4CAF50',
      'Positive Reviews': '#8BC34A',
      'Mixed Reviews': '#FFC107',
      'Poor Reviews': '#F44336',
    };

    for (let i = 0; i < pageItems.length; i++) {
      const show = pageItems[i];
      const y = startY + i * rowH;

      this.addEl(this.add.rectangle(480, y + 20, 700, 48, 0x222244, 0.5).setDepth(2));

      const title = (show.title ?? 'Untitled').length > 28
        ? show.title.substring(0, 26) + '...'
        : show.title ?? 'Untitled';
      this.makeText(150, y + 4, `${show.genreIcon ?? ''} ${title}`, { fontSize: '12px' });

      const tier = show.resultTier ?? 'Unknown';
      const tierColor = tierColors[tier] ?? DIM_COLOR;
      this.makeText(150, y + 20, `${show.genre ?? '?'} | by ${show.filmmakerName ?? '?'} | Day ${show.releasedDay ?? '?'}`, {
        fontSize: '9px', color: DIM_COLOR,
      });

      this.makeText(560, y + 4, tier, { fontSize: '10px', color: tierColor });

      const rev = show.revenue != null ? `$${show.revenue}K` : '?';
      const xp = show.xpEarned != null ? `${show.xpEarned} XP` : '?';
      const qual = show.avgQuality != null ? `Q: ${show.avgQuality}` : '';
      this.makeText(560, y + 20, `${rev} | ${xp}${qual ? ' | ' + qual : ''}`, {
        fontSize: '9px', color: DIM_COLOR,
      });
    }

    const navY = 540;

    if (totalPages > 1) {
      this.makeText(480, navY - 30, `Page ${safePage + 1} / ${totalPages}`, {
        fontSize: '10px', origin: 0.5, color: DIM_COLOR,
      });
      if (safePage > 0) {
        this.makeButton(380, navY, 'Prev', () => this.showHistory(safePage - 1), 80, 30);
      }
      if (safePage < totalPages - 1) {
        this.makeButton(580, navY, 'Next', () => this.showHistory(safePage + 1), 80, 30);
      }
    }

    this.makeButton(480, navY, 'Back', () => { this.clearElements(); this.showPauseMenu(); }, 80, 30);
  }

  showPauseMenu() {
    this.clearElements();
    this.makePanel(480, 320, 420, 380);
    this.makeText(480, 170, 'PAUSED', { fontSize: '24px', origin: 0.5, color: HIGHLIGHT });

    const gs = this.gameScene.gameState;
    const ts = this.gameScene.timeSystem;
    this.makeText(480, 210, `Day ${gs.day} | ${ts.getTimeString()}`, { origin: 0.5, fontSize: '12px' });

    const active = this.gameScene.pipelineSystem.getPipelineScripts();
    this.makeText(480, 240, `Active projects: ${active.length}`, { origin: 0.5, fontSize: '10px', color: DIM_COLOR });
    this.makeText(480, 258, `Completed: ${(gs.completedScripts ?? []).length}`, { origin: 0.5, fontSize: '10px', color: DIM_COLOR });

    this.makeButton(480, 300, 'Resume', () => this.closeScene());
    this.makeButton(480, 355, 'Show History', () => this.showHistory(0), 180, 38);
    this.makeButton(480, 410, 'Save & Quit', () => {
      SaveSystem.save(gs);
      this.gameScene.scene.stop('UIScene');
      this.gameScene.scene.stop('GameScene');
      this.scene.stop();
      this.scene.start('MenuScene');
    }, 180, 38);
  }
}
