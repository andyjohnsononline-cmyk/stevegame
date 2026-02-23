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
    this.eventData = data.event || null;
    this.meetingData = data.meeting || null;
    this.reviewData = data.review || null;
    this.elements = [];
  }

  create() {
    this.overlay = this.add.rectangle(480, 320, 960, 640, 0x000000, 0.6)
      .setDepth(0).setInteractive();

    switch (this.mode) {
      case 'inbox': this.showInbox(); break;
      case 'email': this.showEmailList(); break;
      case 'gift_shop': this.showGiftShop(); break;
      case 'pause': this.showPauseMenu(); break;
      case 'event': this.showEvent(); break;
      case 'notes': this.showNotesInterface(); break;
      case 'meeting': this.showMeeting(); break;
      case 'slate_review': this.showSlateReview(); break;
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

  // ── NPC Dialogue ──

  showDialogue() {
    this.makePanel(480, 500, 700, 160);
    if (this.speakerName) {
      this.makeText(160, 430, this.speakerName, { color: HIGHLIGHT, fontSize: '15px' });
    }
    this.makeText(160, 460, this.dialogueText, { wordWrap: 600, fontSize: '12px' });
    this.makeButton(480, 570, 'OK', () => this.closeScene(), 120, 32);
  }

  // ── Inbox ──

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

      const statusTag = script.read ? '[READ]' : script.skimmed ? '[SKIMMED]' : '[NEW]';
      const statusColor = script.read ? '#4CAF50' : script.skimmed ? '#FFC107' : '#2196F3';

      this.makeText(150, y + 5, `${script.genreIcon ?? '📄'} ${script.title}`, { fontSize: '13px' });
      this.makeText(150, y + 22, `${script.genre} | by ${script.filmmakerName}`, { fontSize: '10px', color: DIM_COLOR });
      this.makeText(600, y + 5, statusTag, { fontSize: '10px', color: statusColor });

      this.makeButton(640, y + 30, 'Skim', () => this.skimScript(script, i), 65, 22);
      this.makeButton(720, y + 30, 'Read', () => this.readScript(script, i), 65, 22);
    }

    if (inbox.length > maxVisible) {
      this.makeText(480, startY + maxVisible * lineH + 10,
        `+ ${inbox.length - maxVisible} more scripts...`, { origin: 0.5, color: DIM_COLOR, fontSize: '11px' });
    }

    this.makeButton(480, 540, 'Close', () => this.closeScene());
  }

  skimScript(script, _idx) {
    const gs = this.gameScene;
    if (!gs.energySystem.canAfford('skimRead')) {
      this.showQuickMessage('Not enough energy to skim.');
      return;
    }
    gs.energySystem.spend('skimRead');
    gs.gameState.time += 30;
    script.skimmed = true;

    const approx = {};
    for (const [key, val] of Object.entries(script.quality)) {
      const offset = Math.floor(Math.random() * 5) - 2;
      approx[key] = Math.max(1, Math.min(10, val + offset));
    }

    this.clearElements();
    this.showScriptDetail(script, approx, false);
  }

  readScript(script, _idx) {
    const gs = this.gameScene;
    if (!gs.energySystem.canAfford('fullRead')) {
      this.showQuickMessage('Not enough energy to read.');
      return;
    }
    gs.energySystem.spend('fullRead');
    gs.gameState.time += 90;
    script.read = true;
    script.skimmed = true;

    this.clearElements();
    this.showScriptDetail(script, script.quality, true);
  }

  showScriptDetail(script, quality, fullRead) {
    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 75, `${script.genreIcon ?? '📄'} ${script.title}`, { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });
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
      const approx = fullRead ? '' : ' ~';
      this.makeText(190, ay, `${attr.label}:`, { fontSize: '12px' });
      const barFull = '\u2588'.repeat(val);
      const barEmpty = '\u2591'.repeat(10 - val);
      const barColor = val >= 7 ? '#4CAF50' : val >= 4 ? '#FFC107' : '#F44336';
      this.makeText(340, ay, `${barFull}${barEmpty} ${val}/10${approx}`, { fontSize: '12px', color: barColor });
      ay += 24;
    });

    const rating = this.gameScene.getCoverageRating(script);
    const ratingColor = rating === 'Recommend' ? '#4CAF50' : rating === 'Consider' ? '#FFC107' : '#F44336';
    this.makeText(480, ay + 10, `Coverage recommendation: ${rating}`, { fontSize: '14px', origin: 0.5, color: ratingColor });

    const btnY = 510;
    if (fullRead) {
      this.makeButton(300, btnY, 'Give Notes', () => {
        this.currentScript = script;
        this.clearElements();
        this.showNotesInterface();
      }, 140, 34);

      this.makeButton(480, btnY, 'Greenlight', () => {
        const gs = this.gameScene.gameState;
        gs.inbox = gs.inbox.filter(s => s.id !== script.id);
        this.gameScene.pipelineSystem.submitForCoverage(script);
        this.showQuickMessage(`${script.title} greenlit for development!`);
        this.time.delayedCall(1500, () => { this.clearElements(); this.showInbox(); });
      }, 140, 34);
    }

    this.makeButton(660, btnY, 'Back', () => { this.clearElements(); this.showInbox(); }, 100, 34);
  }

  // ── Notes Interface ──

  showNotesInterface() {
    const script = this.currentScript;
    if (!script) { this.showInbox(); return; }

    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 75, `Notes: ${script.title}`, { fontSize: '16px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(170, 110, 'Choose a focus area for your notes:', { fontSize: '13px' });

    let fy = 145;
    NOTE_FOCUSES.forEach(focus => {
      this.makeButton(280, fy, `${focus.label}`, () => this.selectFocus(focus), 160, 28);
      this.makeText(380, fy - 6, focus.description, { fontSize: '9px', color: DIM_COLOR });
      fy += 38;
    });

    this.makeText(170, fy + 15, 'The Notes Triangle:', { fontSize: '12px', color: HIGHLIGHT });
    this.makeText(170, fy + 35, 'Every note navigates tension between quality,', { fontSize: '10px', color: DIM_COLOR });
    this.makeText(170, fy + 48, 'filmmaker relationship, and commercial viability.', { fontSize: '10px', color: DIM_COLOR });

    this.makeButton(480, 540, 'Back', () => { this.clearElements(); this.showInbox(); }, 100, 34);
  }

  selectFocus(focus) {
    this.selectedFocus = focus;
    this.clearElements();

    const script = this.currentScript;
    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 80, `Notes: ${script.title}`, { fontSize: '16px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 110, `Focus: ${focus.label}`, { fontSize: '13px', origin: 0.5 });
    this.makeText(170, 145, 'Choose your tone:', { fontSize: '13px' });

    let ty = 185;
    NOTE_TONES.forEach(tone => {
      this.makeButton(280, ty, tone.label, () => this.applyNote(focus, tone), 160, 32);
      this.makeText(380, ty - 6, tone.description, { fontSize: '10px', color: DIM_COLOR });
      ty += 48;
    });

    const fmName = CHARACTERS[script.filmmakerIndex]?.name ?? 'Unknown';
    const prefTone = CHARACTERS[script.filmmakerIndex]?.preferredTone ?? 'balanced';
    this.makeText(170, ty + 10, `${fmName} prefers a ${prefTone} approach.`, {
      fontSize: '10px', color: '#D4721A',
    });

    this.makeButton(480, 540, 'Back', () => { this.clearElements(); this.showNotesInterface(); }, 100, 34);
  }

  applyNote(focus, tone) {
    const script = this.currentScript;
    const gs = this.gameScene;

    if (!gs.energySystem.canAfford('giveNotes')) {
      this.showQuickMessage('Not enough energy to give notes.');
      return;
    }
    gs.energySystem.spend('giveNotes');
    gs.gameState.time += 60;

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

  // ── Gift Shop ──

  showGiftShop() {
    const gs = this.gameScene.gameState;
    this.makePanel(480, 320, 700, 510);
    this.makeText(480, 85, 'De Pijp Market — Gifts', { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 115, `Your money: $${gs.money ?? 0}`, { origin: 0.5, fontSize: '12px' });

    const gifts = [
      { id: 'rare_cinema_books', name: 'Rare Cinema Book', price: 50 },
      { id: 'coffee', name: 'Specialty Coffee', price: 20 },
      { id: 'vintage_wine', name: 'Vintage Wine', price: 80 },
      { id: 'art_prints', name: 'Art Print', price: 40 },
      { id: 'flowers', name: 'Dutch Tulips', price: 30 },
      { id: 'premium_spirits', name: 'Premium Jenever', price: 100 },
      { id: 'tech_gadgets', name: 'Tech Gadget', price: 60 },
      { id: 'homemade_treats', name: 'Stroopwafels', price: 15 },
      { id: 'restaurant_gift_cards', name: 'Restaurant Voucher', price: 70 },
    ];

    if (!gs.inventory) gs.inventory = [];

    let gy = 145;
    gifts.forEach(gift => {
      const canAfford = (gs.money ?? 0) >= gift.price;
      this.makeText(200, gy, gift.name, { fontSize: '12px', color: canAfford ? TEXT_COLOR : '#555' });
      this.makeText(430, gy, `$${gift.price}`, { fontSize: '12px', color: canAfford ? TEXT_COLOR : '#555' });
      if (canAfford) {
        this.makeButton(560, gy + 4, 'Buy', () => {
          gs.money -= gift.price;
          gs.inventory.push(gift.id);
          this.showQuickMessage(`Bought ${gift.name}!`);
          this.clearElements();
          this.showGiftShop();
        }, 70, 22);
      }
      gy += 30;
    });

    if (gs.inventory.length > 0) {
      this.makeText(480, gy + 10, `Inventory: ${gs.inventory.length} item(s)`, {
        origin: 0.5, fontSize: '11px', color: DIM_COLOR,
      });
      this.makeButton(480, gy + 45, 'Give a Gift', () => {
        this.clearElements();
        this.showGiftGiving();
      }, 140, 32);
    }

    this.makeButton(480, 545, 'Close', () => this.closeScene());
  }

  showGiftGiving() {
    const gs = this.gameScene.gameState;
    this.makePanel(480, 320, 700, 480);
    this.makeText(480, 100, 'Give a Gift', { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });

    const timePeriod = this.gameScene.timeSystem.getTimePeriod();
    const npcsHere = this.gameScene.relationshipSystem.getNPCsAtLocation(gs.currentLocation, timePeriod);
    const inventory = gs.inventory ?? [];

    if (npcsHere.length === 0 || inventory.length === 0) {
      this.makeText(480, 250, npcsHere.length === 0 ? 'No one here to give gifts to.' : 'No gifts in inventory.', {
        origin: 0.5, color: DIM_COLOR,
      });
      this.makeButton(480, 540, 'Back', () => { this.clearElements(); this.showGiftShop(); });
      return;
    }

    let ny = 150;
    npcsHere.forEach(npc => {
      const hearts = this.gameScene.relationshipSystem.getHearts(npc.id);
      const heartStr = '\u2665'.repeat(hearts) + '\u2661'.repeat(10 - hearts);
      this.makeText(200, ny, `${npc.name} (${heartStr})`, { fontSize: '12px' });

      this.makeButton(620, ny + 4, 'Give', () => {
        const giftId = inventory[0];
        gs.inventory.splice(0, 1);
        const matched = giftId === npc.preferredGiftType;
        this.gameScene.relationshipSystem.giveGift(npc.id, giftId, npc.preferredGiftType);
        const msg = matched
          ? `${npc.name.split(' ')[0]} loved it! A perfect gift.`
          : `${npc.name.split(' ')[0]} appreciated the gesture.`;
        this.showQuickMessage(msg);
        this.time.delayedCall(1500, () => { this.clearElements(); this.showGiftShop(); });
      }, 70, 22);

      ny += 36;
    });

    this.makeButton(480, 540, 'Back', () => { this.clearElements(); this.showGiftShop(); });
  }

  // ── Pause Menu ──

  showPauseMenu() {
    this.makePanel(480, 320, 420, 380);
    this.makeText(480, 170, 'PAUSED', { fontSize: '24px', origin: 0.5, color: HIGHLIGHT });

    const gs = this.gameScene.gameState;
    const ts = this.gameScene.timeSystem;
    this.makeText(480, 210, `${ts.getDayOfWeek()}, Day ${gs.day}`, { origin: 0.5, fontSize: '12px' });
    this.makeText(480, 230, `${ts.getSeasonName()}, Year ${gs.year}`, { origin: 0.5, fontSize: '12px' });

    const rep = this.gameScene.gameState.reputation ?? { creative: 0, commercial: 0, industry: 0 };
    this.makeText(480, 265, `Creative: ${rep.creative}  Commercial: ${rep.commercial}  Industry: ${rep.industry}`, {
      origin: 0.5, fontSize: '10px', color: DIM_COLOR,
    });

    const active = this.gameScene.pipelineSystem.getPipelineScripts();
    this.makeText(480, 285, `Active projects: ${active.length}`, { origin: 0.5, fontSize: '10px', color: DIM_COLOR });

    this.makeButton(480, 330, 'Resume', () => this.closeScene());
    this.makeButton(480, 375, 'Save Game', () => {
      SaveSystem.save(gs);
      this.showQuickMessage('Game saved!');
    }, 180, 34);
    this.makeButton(480, 420, 'Main Menu', () => {
      this.gameScene.scene.stop('UIScene');
      this.gameScene.scene.stop('GameScene');
      this.scene.stop();
      this.scene.start('MenuScene');
    }, 180, 34);
  }

  // ── Random Event ──

  showEvent() {
    const event = this.eventData;
    if (!event) { this.closeScene(); return; }

    this.makePanel(480, 320, 700, 400);
    this.makeText(480, 150, event.title, { fontSize: '20px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 190, event.description, { fontSize: '12px', origin: 0.5, wordWrap: 600 });

    const choices = event.choices ?? [];
    let cy = 260;
    choices.forEach((choice, idx) => {
      this.makeButton(480, cy, choice.label ?? choice.text, () => {
        const systems = {
          careerSystem: this.gameScene.careerSystem,
          pipelineSystem: this.gameScene.pipelineSystem,
          gameState: this.gameScene.gameState,
        };
        const resultMsg = this.gameScene.eventSystem.applyChoice(event, idx, systems);
        this.clearElements();
        this.makePanel(480, 320, 600, 250);
        this.makeText(480, 260, resultMsg, { fontSize: '12px', origin: 0.5, wordWrap: 500 });
        this.makeButton(480, 400, 'Continue', () => this.closeScene(), 140, 34);
      }, 500, 34);
      cy += 48;
    });
  }

  // ── Email ──

  showEmailList() {
    const gs = this.gameScene.gameState;
    const emails = gs?.emails ?? [];

    this.makePanel(480, 320, 750, 520);
    const unread = emails.filter(e => !e.read).length;
    this.makeText(480, 80, 'Email', { fontSize: '20px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 105, `${emails.length} message(s)${unread > 0 ? ` — ${unread} unread` : ''}`, {
      fontSize: '11px', origin: 0.5, color: DIM_COLOR,
    });

    if (emails.length === 0) {
      this.makeText(480, 300, 'No emails.\nCheck back tomorrow morning.', { origin: 0.5, color: DIM_COLOR });
      this.makeButton(380, 540, 'Inbox', () => { this.clearElements(); this.showInbox(); }, 120, 34);
      this.makeButton(560, 540, 'Close', () => this.closeScene(), 120, 34);
      return;
    }

    const maxVisible = Math.min(emails.length, 7);
    const startY = 125;
    const lineH = 52;

    for (let i = 0; i < maxVisible; i++) {
      const email = emails[i];
      const y = startY + i * lineH;
      const bgColor = email.read ? 0x222233 : 0x2a2a4a;

      this.addEl(this.add.rectangle(480, y + 18, 700, 44, bgColor, 0.6).setDepth(2));

      const readMarker = email.read ? '' : '\u25CF ';
      const markerColor = email.read ? DIM_COLOR : '#4CAF50';
      this.makeText(150, y + 3, `${readMarker}${email.subject}`, {
        fontSize: '12px', color: email.read ? DIM_COLOR : TEXT_COLOR,
      });
      this.makeText(150, y + 20, `From: ${email.from}`, { fontSize: '9px', color: DIM_COLOR });

      if (email.actionable && !email.expired) {
        this.makeText(680, y + 3, '\u2605', { fontSize: '14px', color: '#FFD700' });
      }

      const row = this.add.rectangle(480, y + 18, 700, 44, 0xffffff, 0.0)
        .setDepth(3).setInteractive({ useHandCursor: true })
        .on('pointerover', () => row.setFillStyle(0xffffff, 0.05))
        .on('pointerout', () => row.setFillStyle(0xffffff, 0.0))
        .on('pointerdown', () => {
          this.gameScene.emailSystem?.markRead(email.id);
          this.clearElements();
          this.showEmailDetail(email);
        });
      this.addEl(row);
    }

    if (emails.length > maxVisible) {
      this.makeText(480, startY + maxVisible * lineH + 5,
        `+ ${emails.length - maxVisible} more...`, { origin: 0.5, color: DIM_COLOR, fontSize: '10px' });
    }

    this.makeButton(380, 540, 'Inbox', () => { this.clearElements(); this.showInbox(); }, 120, 34);
    this.makeButton(560, 540, 'Close', () => this.closeScene(), 120, 34);
  }

  showEmailDetail(email) {
    this.makePanel(480, 320, 750, 520);
    this.makeText(480, 80, email.subject, { fontSize: '16px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(170, 110, `From: ${email.from}`, { fontSize: '11px', color: DIM_COLOR });
    this.makeText(170, 140, email.body, { fontSize: '11px', wordWrap: 580, color: TEXT_COLOR });

    let btnX = 480;
    const btnY = 530;
    const btns = [];

    if (email.actionable && !email.expired) {
      btns.push({ label: email.actionLabel ?? 'Accept', cb: () => {
        const msg = this.gameScene.emailSystem?.handleAction(email);
        if (msg) this.showQuickMessage(msg);
        this.clearElements();
        this.showEmailList();
      }});
    }

    btns.push({ label: 'Delete', cb: () => {
      this.gameScene.emailSystem?.removeEmail(email.id);
      this.clearElements();
      this.showEmailList();
    }});

    btns.push({ label: 'Back', cb: () => {
      this.clearElements();
      this.showEmailList();
    }});

    const totalW = btns.length * 130;
    let bx = 480 - totalW / 2 + 65;
    for (const btn of btns) {
      this.makeButton(bx, btnY, btn.label, btn.cb, 120, 34);
      bx += 130;
    }
  }

  // ── Internal Meeting ──

  showMeeting() {
    const meeting = this.meetingData;
    if (!meeting) { this.closeScene(); return; }

    this.meetingStep = 0;
    this.meetingEffects = [];
    this._renderMeetingStep();
  }

  _renderMeetingStep() {
    const meeting = this.meetingData;
    const steps = meeting.steps ?? [];

    if (this.meetingStep >= steps.length) {
      this._showMeetingResults();
      return;
    }

    const step = steps[this.meetingStep];
    this.clearElements();
    this.makePanel(480, 320, 750, 480);

    this.makeText(480, 90, meeting.title, { fontSize: '16px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 115, `with ${meeting.speaker}`, { fontSize: '11px', origin: 0.5, color: DIM_COLOR });
    this.makeText(170, 155, step.prompt, { fontSize: '12px', wordWrap: 580 });

    let cy = 260;
    (step.choices ?? []).forEach((choice, idx) => {
      this.makeButton(480, cy, choice.text, () => {
        if (choice.effects) {
          this.meetingEffects.push(...choice.effects);
        }
        this.meetingStep++;
        this._renderMeetingStep();
      }, 550, 34);
      cy += 46;
    });
  }

  _showMeetingResults() {
    this.clearElements();
    this.makePanel(480, 320, 700, 420);
    this.makeText(480, 140, 'Meeting Complete', { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });

    const gs = this.gameScene;
    let ry = 190;
    const repChanges = {};

    for (const effect of this.meetingEffects) {
      if (effect.type === 'reputation' && effect.repType && effect.amount) {
        gs.careerSystem?.addReputation(effect.repType, effect.amount);
        repChanges[effect.repType] = (repChanges[effect.repType] ?? 0) + effect.amount;
      } else if (effect.type === 'money' && effect.amount) {
        gs.gameState.money = (gs.gameState.money ?? 0) + effect.amount;
        gs.events?.emit('money-changed', { money: gs.gameState.money });
      } else if (effect.type === 'strategy' && effect.focus) {
        gs.gameState.strategyFocus = effect.focus;
      }
    }

    for (const [type, delta] of Object.entries(repChanges)) {
      const sign = delta > 0 ? '+' : '';
      const color = delta > 0 ? '#4CAF50' : '#F44336';
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      this.makeText(300, ry, `${label} Reputation: ${sign}${delta}`, { fontSize: '13px', color });
      ry += 28;
    }

    if (this.gameScene.gameState.strategyFocus && this.meetingEffects.some(e => e.type === 'strategy')) {
      const focus = this.gameScene.gameState.strategyFocus;
      const labels = { prestige: 'Prestige Push', audience: 'Audience Growth', balanced: 'Balanced Slate' };
      this.makeText(300, ry, `Strategy set: ${labels[focus] ?? focus}`, { fontSize: '13px', color: '#2196F3' });
      ry += 28;
    }

    if (Object.keys(repChanges).length === 0 && !this.meetingEffects.some(e => e.type === 'strategy')) {
      this.makeText(480, ry, 'A productive meeting.', { fontSize: '13px', origin: 0.5, color: DIM_COLOR });
    }

    // Remove from pending
    const pending = this.gameScene.gameState.pendingMeetings ?? [];
    const meetingType = this.meetingData?.type;
    if (meetingType) {
      const idx = pending.indexOf(meetingType);
      if (idx >= 0) pending.splice(idx, 1);
      if (!this.gameScene.gameState.completedMeetings) this.gameScene.gameState.completedMeetings = [];
      this.gameScene.gameState.completedMeetings.push(meetingType + '_' + this.gameScene.gameState.day);
    }

    // Cost energy and time
    this.gameScene.energySystem?.spend('meeting');
    this.gameScene.gameState.time = (this.gameScene.gameState.time ?? 480) + 60;

    this.makeButton(480, 480, 'Continue', () => this.closeScene(), 140, 34);
  }

  // ── Slate Review ──

  showSlateReview() {
    const review = this.reviewData;
    if (!review) { this.closeScene(); return; }

    this.makePanel(480, 320, 750, 520);
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const gs = this.gameScene.gameState;
    const seasonName = seasons[gs.season ?? 0] ?? 'Season';
    this.makeText(480, 75, `Quarterly Slate Review`, { fontSize: '18px', origin: 0.5, color: HIGHLIGHT });
    this.makeText(480, 100, `${seasonName}, Year ${gs.year ?? 1}`, { fontSize: '12px', origin: 0.5, color: DIM_COLOR });

    let y = 135;
    this.makeText(170, y, 'Performance Summary', { fontSize: '14px', color: HIGHLIGHT });
    y += 28;

    const stats = [
      ['Projects Released', `${review.completedCount}`],
      ['Active Pipeline', `${review.pipelineCount}`],
      ['Avg. Quality', review.completedCount > 0 ? `${review.avgQuality}/10` : 'N/A'],
      ['Revenue', `$${review.totalRevenue}`],
    ];

    for (const [label, val] of stats) {
      this.makeText(190, y, `${label}:`, { fontSize: '12px' });
      this.makeText(420, y, val, { fontSize: '12px', color: '#D4D4D4' });
      y += 22;
    }

    y += 10;
    this.makeText(170, y, 'Reputation Changes', { fontSize: '14px', color: HIGHLIGHT });
    y += 28;

    for (const [type, delta] of Object.entries(review.deltas)) {
      const sign = delta > 0 ? '+' : '';
      const color = delta > 0 ? '#4CAF50' : delta < 0 ? '#F44336' : DIM_COLOR;
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      this.makeText(190, y, `${label}:`, { fontSize: '12px' });
      this.makeText(420, y, `${sign}${delta}`, { fontSize: '12px', color });
      y += 22;
    }

    y += 14;
    this.makeText(170, y, "Bernie's Assessment", { fontSize: '14px', color: HIGHLIGHT });
    y += 24;
    this.makeText(170, y, `"${review.bossReaction}"`, { fontSize: '11px', wordWrap: 560, color: '#ccccdd' });
    y += 50;

    if (review.bonus > 0) {
      this.makeText(170, y, `Quarterly bonus: +$${review.bonus}`, { fontSize: '12px', color: '#4CAF50' });
      y += 22;
    }

    if (review.budgetDelta !== 0) {
      const budgetMsg = review.budgetDelta > 0
        ? `Pipeline budget increased to ${review.newBudget} projects.`
        : `Pipeline budget reduced to ${review.newBudget} projects.`;
      const budgetColor = review.budgetDelta > 0 ? '#4CAF50' : '#F44336';
      this.makeText(170, y, budgetMsg, { fontSize: '12px', color: budgetColor });
      y += 22;
    }

    if (review.promotionReady) {
      this.makeText(480, y + 5, '\u2605 Promotion incoming! \u2605', {
        fontSize: '14px', origin: 0.5, color: '#FFD700',
      });
    }

    this.makeButton(480, 540, 'Continue', () => this.closeScene(), 140, 34);
  }
}
