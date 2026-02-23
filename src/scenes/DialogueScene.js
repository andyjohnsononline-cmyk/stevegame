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
    this.elements = [];
  }

  create() {
    this.overlay = this.add.rectangle(480, 320, 960, 640, 0x000000, 0.6)
      .setDepth(0).setInteractive();

    switch (this.mode) {
      case 'inbox': this.showInbox(); break;
      case 'pause': this.showPauseMenu(); break;
      case 'notes': this.showNotesInterface(); break;
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
      this.makeText(150, y + 22, `${script.genre} | by ${script.filmmakerName}`, { fontSize: '10px', color: DIM_COLOR });
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

  showScriptDetail(script, quality) {
    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 75, `${script.genreIcon ?? ''} ${script.title}`, { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 100, `${script.genre} | by ${script.filmmakerName}`, { fontSize: '11px', origin: 0.5, color: DIM_COLOR });
    this.makeText(170, 130, `"${script.logline}"`, { fontSize: '11px', wordWrap: 580, color: '#ccccdd' });

    if (script.excerpt) {
      this.makeText(170, 170, `Scene: "${script.excerpt}"`, { fontSize: '10px', wordWrap: 580, color: '#9999bb' });
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

    const btnY = 510;
    this.makeButton(360, btnY, 'Give Notes', () => {
      this.currentScript = script;
      this.clearElements();
      this.showNotesInterface();
    }, 160, 38);

    this.makeButton(600, btnY, 'Greenlight', () => {
      const gs = this.gameScene.gameState;
      gs.inbox = gs.inbox.filter(s => s.id !== script.id);
      this.gameScene.pipelineSystem.greenlight(script);
      this.showQuickMessage(`${script.title} greenlit for development!`);
      this.time.delayedCall(1500, () => { this.clearElements(); this.showInbox(); });
    }, 160, 38);
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

    const fmName = CHARACTERS[script.filmmakerIndex]?.name ?? 'Unknown';
    const raw = CHARACTERS[script.filmmakerIndex]?.preferredTone ?? 'gentle';
    const prefLabel = raw === 'gentle' ? 'supportive' : raw;
    this.makeText(170, ty + 20, `${fmName} prefers a ${prefLabel} approach.`, {
      fontSize: '10px', color: '#D4721A',
    });
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

  showPauseMenu() {
    this.makePanel(480, 320, 420, 340);
    this.makeText(480, 180, 'PAUSED', { fontSize: '24px', origin: 0.5, color: HIGHLIGHT });

    const gs = this.gameScene.gameState;
    const ts = this.gameScene.timeSystem;
    this.makeText(480, 220, `Day ${gs.day} | ${ts.getTimeString()}`, { origin: 0.5, fontSize: '12px' });

    const active = this.gameScene.pipelineSystem.getPipelineScripts();
    this.makeText(480, 250, `Active projects: ${active.length}`, { origin: 0.5, fontSize: '10px', color: DIM_COLOR });
    this.makeText(480, 270, `Completed: ${(gs.completedScripts ?? []).length}`, { origin: 0.5, fontSize: '10px', color: DIM_COLOR });

    this.makeButton(480, 320, 'Resume', () => this.closeScene());
    this.makeButton(480, 380, 'Save & Quit', () => {
      SaveSystem.save(gs);
      this.gameScene.scene.stop('UIScene');
      this.gameScene.scene.stop('GameScene');
      this.scene.stop();
      this.scene.start('MenuScene');
    }, 180, 38);
  }
}
