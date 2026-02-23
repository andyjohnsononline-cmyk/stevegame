import { EMAIL_TEMPLATES, GOSSIP_CONTENT, pickGossip } from '../data/emailData.js';
import { CHARACTERS } from '../data/characterData.js';

export class EmailSystem {
  constructor(scene) {
    this.scene = scene;
  }

  getEmails() {
    return this.scene.gameState?.emails ?? [];
  }

  getUnreadCount() {
    return this.getEmails().filter(e => !e.read).length;
  }

  markRead(emailId) {
    const email = this.getEmails().find(e => e.id === emailId);
    if (email) email.read = true;
  }

  removeEmail(emailId) {
    const gs = this.scene.gameState;
    if (!gs) return;
    gs.emails = (gs.emails ?? []).filter(e => e.id !== emailId);
  }

  addEmail(email) {
    const gs = this.scene.gameState;
    if (!gs) return;
    if (!gs.emails) gs.emails = [];
    gs.emails.unshift(email);
    if (gs.emails.length > 20) gs.emails.length = 20;
  }

  _nextId() {
    const gs = this.scene.gameState;
    gs._emailIdCounter = (gs._emailIdCounter ?? 0) + 1;
    return `email_${gs._emailIdCounter}`;
  }

  _makeEmail(template, ctx) {
    const gs = this.scene.gameState;
    return {
      id: this._nextId(),
      from: typeof template.from === 'function' ? template.from(ctx) : template.from,
      subject: template.subject(ctx),
      body: template.body(ctx),
      type: ctx.type,
      day: gs.day,
      read: false,
      actionable: template.actionable ?? false,
      actionLabel: template.actionLabel ?? null,
      actionType: template.actionType ?? null,
      expired: false,
    };
  }

  generateDailyEmails() {
    const gs = this.scene.gameState;
    if (!gs) return;
    if (!gs.emails) gs.emails = [];

    const day = gs.day ?? 1;
    const ctx = {
      strategyFocus: gs.strategyFocus ?? 'balanced',
      commercialRep: gs.reputation?.commercial ?? 0,
    };

    // Pipeline update emails for scripts that advanced
    const pipeline = gs.pipeline ?? [];
    for (const script of pipeline) {
      if (script._stageAdvancedToday) {
        const tmpl = this._pick(EMAIL_TEMPLATES.pipeline_update);
        this.addEmail(this._makeEmail(tmpl, {
          ...ctx,
          type: 'pipeline_update',
          scriptTitle: script.title,
          stage: script.stage,
        }));
        delete script._stageAdvancedToday;
      }
    }

    // Boss check-in: weekly (every 7 days), starting day 7
    if (day > 1 && day % 7 === 0) {
      const tmpl = this._pick(EMAIL_TEMPLATES.boss_checkin);
      this.addEmail(this._makeEmail(tmpl, { ...ctx, type: 'boss_checkin' }));
    }

    // Data review: biweekly (every 14 days), starting day 10
    if (day > 1 && (day - 3) % 14 === 0) {
      const tmpl = this._pick(EMAIL_TEMPLATES.data_review);
      this.addEmail(this._makeEmail(tmpl, { ...ctx, type: 'data_review' }));
    }

    // Filmmaker request: 30% chance if there are active pipeline projects
    if (pipeline.length > 0 && Math.random() < 0.3) {
      const filmmakers = CHARACTERS.filter(c => c.role === 'filmmaker');
      const fm = filmmakers[Math.floor(Math.random() * filmmakers.length)];
      const tmpl = this._pick(EMAIL_TEMPLATES.filmmaker_request);
      this.addEmail(this._makeEmail(tmpl, {
        ...ctx,
        type: 'filmmaker_request',
        filmmakerName: fm.name,
        filmmakerI: fm.id,
      }));
    }

    // Company memo: 25% chance
    if (Math.random() < 0.25) {
      const tmpl = this._pick(EMAIL_TEMPLATES.company_memo);
      this.addEmail(this._makeEmail(tmpl, { ...ctx, type: 'company_memo' }));
    }

    // Gossip: 20% chance
    if (Math.random() < 0.2) {
      if (!gs._usedGossipIds) gs._usedGossipIds = [];
      const gossip = pickGossip(gs._usedGossipIds);
      gs._usedGossipIds.push(gossip.index);
      if (gs._usedGossipIds.length >= GOSSIP_CONTENT.length) gs._usedGossipIds = [];

      const tmpl = this._pick(EMAIL_TEMPLATES.gossip);
      this.addEmail(this._makeEmail(tmpl, {
        ...ctx,
        type: 'gossip',
        gossipContent: gossip.content,
      }));
    }

    this.scene.events?.emit('hud-update');
  }

  handleAction(email) {
    const gs = this.scene.gameState;
    if (!gs) return null;
    if (!email.actionable || email.expired) return null;

    if (!gs.pendingMeetings) gs.pendingMeetings = [];

    switch (email.actionType) {
      case 'schedule_boss_meeting':
        if (!gs.pendingMeetings.includes('boss_one_on_one')) {
          gs.pendingMeetings.push('boss_one_on_one');
        }
        email.expired = true;
        return 'Meeting with Bernie scheduled. Head to the office upper floor.';

      case 'schedule_data_meeting':
        if (!gs.pendingMeetings.includes('data_review')) {
          gs.pendingMeetings.push('data_review');
        }
        email.expired = true;
        return 'Data review with Lena scheduled. Head to the office upper floor.';

      case 'schedule_filmmaker_meeting':
        if (!gs.pendingMeetings.includes('filmmaker_meeting')) {
          gs.pendingMeetings.push('filmmaker_meeting');
        }
        email.expired = true;
        return 'Filmmaker meeting scheduled.';

      default:
        return null;
    }
  }

  addPipelineUpdateFlag(script) {
    if (script) script._stageAdvancedToday = true;
  }

  toJSON() {
    const gs = this.scene.gameState;
    return {
      emails: gs?.emails ?? [],
      _emailIdCounter: gs?._emailIdCounter ?? 0,
      _usedGossipIds: gs?._usedGossipIds ?? [],
    };
  }

  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
