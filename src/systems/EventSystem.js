import { RANDOM_EVENTS } from '../data/eventData.js';

const DEFAULT_PROBABILITY = 0.15;

export class EventSystem {
  constructor() {
    this.pendingEvents = [];
    this.completedEventIds = new Set();
    this.activeEvent = null;
  }

  checkForEvent(gameState) {
    if (this.activeEvent) return null;

    const candidates = RANDOM_EVENTS.filter((event) => {
      if (this.completedEventIds.has(event.id)) return false;
      try {
        return event.condition ? event.condition(gameState) : true;
      } catch {
        return false;
      }
    });

    if (candidates.length === 0) return null;
    if (Math.random() > DEFAULT_PROBABILITY) return null;

    const event = candidates[Math.floor(Math.random() * candidates.length)];
    this.activeEvent = event;
    return event;
  }

  applyChoice(event, choiceIndex, systems) {
    const choice = event?.choices?.[choiceIndex];
    if (!choice) {
      this.activeEvent = null;
      return 'Nothing happened.';
    }

    const effects = choice.effects ?? [];
    const messages = [];

    for (const effect of effects) {
      const msg = this._applyEffect(effect, systems);
      if (msg) messages.push(msg);
    }

    this.completedEventIds.add(event.id);
    this.activeEvent = null;
    return messages.length > 0 ? messages.join(' ') : 'The situation resolved itself.';
  }

  _applyEffect(effect, systems) {
    const type = effect.type;

    switch (type) {
      case 'boost_reputation': {
        const repType = effect.repType ?? 'industry';
        const amount = effect.amount ?? 5;
        systems.careerSystem?.addReputation(repType, amount);
        return `+${amount} ${repType} reputation.`;
      }
      case 'spend_reputation': {
        const repType = effect.repType ?? 'industry';
        const amount = effect.amount ?? 10;
        systems.careerSystem?.addReputation(repType, -amount);
        return `-${amount} ${repType} reputation.`;
      }
      case 'money_change': {
        const amount = effect.amount ?? 0;
        if (systems.gameState) systems.gameState.money = (systems.gameState.money ?? 0) + amount;
        return amount >= 0 ? `+$${amount}.` : `-$${Math.abs(amount)}.`;
      }
      case 'shelve_weakest': {
        const projects = systems.pipelineSystem?.projects ?? [];
        if (projects.length > 0) {
          projects.sort((a, b) => {
            const qa = Object.values(a.script?.quality ?? {}).reduce((s, v) => s + v, 0);
            const qb = Object.values(b.script?.quality ?? {}).reduce((s, v) => s + v, 0);
            return qa - qb;
          });
          const removed = projects.shift();
          return `${removed?.script?.title ?? 'A project'} was shelved.`;
        }
        return null;
      }
      case 'bonus_script': {
        return 'A promising new script has been added to your inbox.';
      }
      case 'attend': {
        systems.careerSystem?.addReputation('industry', 5);
        return '+5 industry reputation.';
      }
      default:
        return null;
    }
  }

  resetDaily() {
    this.activeEvent = null;
  }

  toJSON() {
    return {
      completedEventIds: Array.from(this.completedEventIds),
    };
  }

  static fromJSON(json) {
    const es = new EventSystem();
    es.completedEventIds = new Set(json?.completedEventIds ?? []);
    return es;
  }
}
