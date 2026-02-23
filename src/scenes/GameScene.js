import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { EnergySystem } from '../systems/EnergySystem.js';
import { ScriptEngine } from '../systems/ScriptEngine.js';
import { NotesSystem } from '../systems/NotesSystem.js';
import { RelationshipSystem } from '../systems/RelationshipSystem.js';
import { CareerSystem } from '../systems/CareerSystem.js';
import { PipelineSystem } from '../systems/PipelineSystem.js';
import { EventSystem } from '../systems/EventSystem.js';
import { SaveSystem } from '../utils/SaveSystem.js';
import { LOCATIONS, getLocation } from '../data/locationData.js';
import { CHARACTERS } from '../data/characterData.js';

const TILE = 32;

const OBJ_TEXTURES = {
  bed: 'obj_bed',
  desk: 'obj_desk',
  coffee_machine: 'obj_coffee',
  phone: 'obj_phone',
  chair: 'obj_chair',
  table: 'obj_table',
  bookshelf: 'obj_bookshelf',
  bar: 'obj_table',
  bench: 'obj_chair',
  tree: 'obj_tree',
  reception: 'obj_desk',
  meeting: 'obj_desk',
  gift_vendor: 'obj_market_stall',
  stall: 'obj_market_stall',
  door: 'obj_door',
};

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.loadSave = data?.loadSave ?? false;
  }

  create() {
    if (this.loadSave) {
      this.gameState = SaveSystem.load() ?? SaveSystem.getDefaultState();
    } else {
      this.gameState = SaveSystem.getDefaultState();
    }

    this.npcs = [];
    this.interactables = [];
    this.exitZones = [];
    this.timePaused = false;
    this.transitioning = false;

    this.timeSystem = new TimeSystem(this);
    this.energySystem = new EnergySystem(this);
    this.scriptEngine = new ScriptEngine(this);
    this.notesSystem = new NotesSystem(this);
    this.relationshipSystem = new RelationshipSystem(this);
    this.careerSystem = new CareerSystem(this);
    this.pipelineSystem = new PipelineSystem(this);
    this.eventSystem = new EventSystem();

    if (!this.gameState.inbox) this.gameState.inbox = [];
    if (this.gameState.inbox.length === 0) {
      this.scriptEngine.populateInbox(3);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

    this.spaceKey.on('down', () => this.handleInteract());
    this.escKey.on('down', () => this.togglePauseMenu());
    this.tabKey.on('down', () => this.openInbox());

    this.daylightOverlay = this.add.rectangle(480, 320, 1600, 1200, 0x0a0a1e)
      .setDepth(50).setAlpha(0).setScrollFactor(0);

    this.interactPrompt = this.add.text(0, 0, '', {
      fontSize: '11px', fontFamily: 'monospace', color: '#FFD700',
      backgroundColor: '#000000AA', padding: { left: 6, right: 6, top: 3, bottom: 3 },
    }).setDepth(200).setVisible(false);

    this.locationBanner = this.add.text(480, 40, '', {
      fontSize: '20px', fontFamily: 'Georgia, serif', color: '#F5E6CC',
      stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(200).setAlpha(0).setScrollFactor(0);

    this.messageText = this.add.text(480, 580, '', {
      fontSize: '13px', fontFamily: 'monospace', color: '#F5E6CC',
      backgroundColor: '#000000CC',
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
    }).setOrigin(0.5).setDepth(200).setAlpha(0).setScrollFactor(0);

    this.loadLocation(this.gameState.currentLocation ?? 'houseboat');
    this.scene.launch('UIScene', { gameScene: this });
  }

  loadLocation(locationId) {
    const loc = getLocation(locationId);
    if (!loc) return;

    this.cleanupLocation();
    this.gameState.currentLocation = locationId;
    this.currentLocation = loc;

    const mapW = loc.mapWidth * TILE;
    const mapH = loc.mapHeight * TILE;
    this.physics.world.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setBounds(0, 0, mapW, mapH);

    this.wallGroup = this.physics.add.staticGroup();

    const floorKey = loc.tileFloor ?? 'tile_office_floor';
    const wallKey = loc.tileWall ?? 'tile_wall';

    for (let row = 0; row < loc.mapHeight; row++) {
      for (let col = 0; col < loc.mapWidth; col++) {
        const px = col * TILE + TILE / 2;
        const py = row * TILE + TILE / 2;
        const isWall = loc.wallMap?.[row]?.[col] === 1;

        const texKey = isWall ? wallKey : floorKey;
        const fallback = this.textures.exists(texKey) ? texKey : 'tile_office_floor';
        this.add.image(px, py, fallback).setDepth(0);

        if (isWall) {
          const wall = this.wallGroup.create(px, py, null);
          wall.setVisible(false);
          wall.body.setSize(TILE, TILE);
          wall.refreshBody();
        }
      }
    }

    this.interactables = [];
    for (const obj of (loc.interactables ?? [])) {
      const px = obj.x * TILE + TILE / 2;
      const py = obj.y * TILE + TILE / 2;
      const texKey = OBJ_TEXTURES[obj.type] ?? 'obj_desk';
      const fallback = this.textures.exists(texKey) ? texKey : 'obj_desk';
      this.add.image(px, py, fallback).setDepth(2);
      this.interactables.push({ ...obj, px, py });
    }

    this.exitZones = [];
    for (const exit of (loc.exits ?? [])) {
      const px = exit.x * TILE + TILE / 2;
      const py = exit.y * TILE + TILE / 2;
      if (this.textures.exists('obj_door')) {
        this.add.image(px, py, 'obj_door').setDepth(2);
      }
      this.add.text(px, py - 20, exit.label, {
        fontSize: '9px', fontFamily: 'monospace', color: '#FFD700',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(6);
      this.exitZones.push({ ...exit, px, py });
    }

    const spawn = this.gameState.playerPos ?? { x: Math.floor(loc.mapWidth / 2), y: Math.floor(loc.mapHeight / 2) };
    if (this.player) this.player.destroy();
    this.player = new Player(this, spawn.x * TILE + TILE / 2, spawn.y * TILE + TILE / 2);
    this.player.setDepth(10);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.physics.add.collider(this.player, this.wallGroup);

    this.spawnNPCs();
    this.showLocationBanner(loc.name);
  }

  cleanupLocation() {
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];
    this.interactables = [];
    this.exitZones = [];
    this.children?.list
      ?.filter(c => c !== this.daylightOverlay && c !== this.interactPrompt
        && c !== this.locationBanner && c !== this.messageText)
      .forEach(c => c.destroy());
  }

  spawnNPCs() {
    this.npcs.forEach(n => n.destroy());
    this.npcs = [];

    const timePeriod = this.timeSystem.getTimePeriod();
    const npcsHere = this.relationshipSystem.getNPCsAtLocation(this.gameState.currentLocation, timePeriod);
    const spots = this.currentLocation?.npcSpots ?? [];

    npcsHere.forEach((charData, i) => {
      if (i >= spots.length) return;
      const spot = spots[i];
      const px = spot.x * TILE + TILE / 2;
      const py = spot.y * TILE + TILE / 2;
      try {
        const npc = new NPC(this, px, py, charData.id);
        this.npcs.push(npc);
        if (this.player) this.physics.add.collider(this.player, npc);
      } catch (e) {
        console.warn('Failed to spawn NPC:', charData.name, e);
      }
    });
  }

  showLocationBanner(name) {
    this.locationBanner.setText(name).setAlpha(1);
    this.tweens.add({
      targets: this.locationBanner,
      alpha: 0, duration: 2000, delay: 1200, ease: 'Power2',
    });
  }

  showMessage(text) {
    this.messageText.setText(text).setAlpha(1);
    this.tweens.killTweensOf(this.messageText);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0, duration: 1500, delay: 2000, ease: 'Power2',
    });
  }

  handleInteract() {
    if (this.timePaused || this.transitioning || !this.player || this.player.isInUI) return;

    const px = this.player.x;
    const py = this.player.y;

    for (const exit of this.exitZones) {
      if (Phaser.Math.Distance.Between(px, py, exit.px, exit.py) < 44) {
        this.handleExit(exit);
        return;
      }
    }

    for (const npc of this.npcs) {
      if (Phaser.Math.Distance.Between(px, py, npc.x, npc.y) < 48) {
        this.startDialogue(npc);
        return;
      }
    }

    for (const obj of this.interactables) {
      if (Phaser.Math.Distance.Between(px, py, obj.px, obj.py) < 44) {
        this.handleObjectInteraction(obj);
        return;
      }
    }
  }

  handleExit(exit) {
    if (this.transitioning) return;
    this.transitioning = true;

    const targetLoc = getLocation(exit.target);
    if (!targetLoc) { this.transitioning = false; return; }

    const returnExit = targetLoc.exits?.find(e => e.target === this.gameState.currentLocation);
    let spawnPos;
    if (returnExit) {
      const offX = returnExit.x <= 0 ? 2 : returnExit.x >= targetLoc.mapWidth - 1 ? -2 : 0;
      const offY = returnExit.y <= 0 ? 2 : returnExit.y >= targetLoc.mapHeight - 1 ? -2 : 0;
      spawnPos = { x: returnExit.x + (offX || 0), y: returnExit.y + (offY || 1) };
    } else {
      spawnPos = { x: Math.floor(targetLoc.mapWidth / 2), y: Math.floor(targetLoc.mapHeight / 2) };
    }

    this.gameState.playerPos = spawnPos;
    this.cameras.main.fadeOut(200, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.loadLocation(exit.target);
      this.cameras.main.fadeIn(200, 0, 0, 0);
      this.transitioning = false;
    });
  }

  startDialogue(npc) {
    const hearts = this.relationshipSystem.getHearts(npc.characterId);
    const dialogue = npc.getDialogue(hearts);
    if (!dialogue) return;

    this.relationshipSystem.addHearts(npc.characterId, 0.2);
    this.timePaused = true;
    this.player.setInUI(true);

    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'dialogue',
      speakerName: npc.getCharacterData().name,
      text: dialogue,
      characterId: npc.characterId,
    });
  }

  handleObjectInteraction(obj) {
    switch (obj.action) {
      case 'sleep': this.handleSleep(); break;
      case 'make_coffee': this.handleCoffee(); break;
      case 'check_phone':
      case 'read_scripts':
      case 'work': this.openInbox(); break;
      case 'buy_gift': this.openGiftShop(); break;
      case 'order_drink': this.handleDrink(); break;
      case 'sit': this.showMessage(this._flavorText('sit')); break;
      case 'admire': this.showMessage(this._flavorText('admire')); break;
      case 'browse': this.showMessage(this._flavorText('browse')); break;
      case 'smoke': this.handleSmoke(); break;
      default: this.showMessage(obj.label ?? 'Nothing happens.');
    }
  }

  handleSleep() {
    const h = Math.floor((this.gameState.time ?? 480) / 60);
    if (h < 18) {
      this.showMessage("It's too early to sleep. Enjoy the day first.");
      return;
    }
    this.showMessage('Sleeping... Sweet dreams, Steve.');
    SaveSystem.save(this.gameState);

    this.time.delayedCall(1200, () => {
      this.timeSystem.advanceDay();
      this.energySystem.restoreFull();
      this._onNewDay();
    });
  }

  handleCoffee() {
    if ((this.gameState.energy ?? 0) >= (this.gameState.maxEnergy ?? 10)) {
      this.showMessage('Already at full energy!');
      return;
    }
    this.energySystem.restore(2);
    this.gameState.time = (this.gameState.time ?? 480) + 15;
    this.showMessage('A strong Dutch coffee. +2 Energy.');
  }

  handleDrink() {
    if (!this.energySystem.canAfford('socialize')) {
      this.showMessage('Too tired for a drink.');
      return;
    }
    this.energySystem.spend('socialize');
    this.gameState.time = (this.gameState.time ?? 480) + 30;
    this.showMessage('You enjoy a borrel at the bar. Gezellig.');
  }

  handleSmoke() {
    this.gameState.time = (this.gameState.time ?? 480) + 15;
    this.energySystem.restore(1);
    const lines = [
      'You light up by the canal. The water glimmers. +1 Energy.',
      'A quiet smoke break. Barges drift by. +1 Energy.',
      'You watch the cyclists pass, cigarette in hand. +1 Energy.',
      'The canal air mixes with smoke. A moment of calm. +1 Energy.',
    ];
    this.showMessage(lines[Math.floor(Math.random() * lines.length)]);
  }

  openInbox() {
    if (this.scene.isActive('DialogueScene')) return;
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'inbox',
    });
  }

  openGiftShop() {
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'gift_shop',
    });
  }

  togglePauseMenu() {
    if (this.scene.isActive('DialogueScene')) {
      this.scene.stop('DialogueScene');
      this.resumeFromUI();
      return;
    }
    this.timePaused = true;
    this.player?.setInUI(true);
    this.scene.launch('DialogueScene', {
      gameScene: this,
      mode: 'pause',
    });
  }

  _onNewDay() {
    const gs = this.gameState;

    const pipelineMessages = this.pipelineSystem.processDailyPipeline();
    pipelineMessages.forEach((msg, i) => {
      this.time.delayedCall(500 + i * 1500, () => this.showMessage(msg));
    });

    if (gs.day % 7 === 0) {
      this.careerSystem.paySalary();
      const salary = this.careerSystem.getSalary();
      this.showMessage(`Payday! +$${salary}`);
    }

    const promoted = this.careerSystem.checkPromotion();
    if (promoted) {
      this.time.delayedCall(1500, () => {
        this.showMessage(`Promoted to ${this.careerSystem.getTitle()}!`);
      });
    }

    this.scriptEngine.populateInbox(Math.random() < 0.6 ? 1 : 2);

    const event = this.eventSystem.checkForEvent(gs);
    if (event) {
      this.time.delayedCall(2000, () => {
        this.timePaused = true;
        this.player?.setInUI(true);
        this.scene.launch('DialogueScene', {
          gameScene: this,
          mode: 'event',
          event,
        });
      });
    }

    this.spawnNPCs();
  }

  resumeFromUI() {
    this.timePaused = false;
    this.player?.setInUI(false);
  }

  _flavorText(action) {
    const pool = {
      sit: [
        'You take a seat and enjoy a quiet moment.',
        'The chair creaks. Amsterdam hums outside.',
        'A moment of calm in the chaos.',
      ],
      admire: [
        'The Amsterdam light is beautiful today.',
        'Trees sway over the canal. A cyclist passes.',
        'The city has a way of making you feel small and grateful.',
      ],
      browse: [
        'Interesting wares.',
        'You browse but nothing catches your eye.',
        'The vendor smiles warmly.',
      ],
    };
    const lines = pool[action] ?? ['You look around.'];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  getCoverageRating(script) {
    const q = script.quality ?? {};
    const avg = Object.values(q).reduce((a, b) => a + b, 0) / Math.max(Object.values(q).length, 1);
    if (avg >= 7) return 'Recommend';
    if (avg >= 4) return 'Consider';
    return 'Pass';
  }

  update(time, delta) {
    if (!this.timePaused) {
      this.timeSystem.update(delta);

      if ((this.gameState.time ?? 480) >= 1380) {
        this.showMessage("It's getting very late. Head home to sleep.");
      }
    }

    if (this.player && !this.player.isInUI) {
      const combined = {
        left: { isDown: this.cursors.left.isDown || this.wasd.left.isDown },
        right: { isDown: this.cursors.right.isDown || this.wasd.right.isDown },
        up: { isDown: this.cursors.up.isDown || this.wasd.up.isDown },
        down: { isDown: this.cursors.down.isDown || this.wasd.down.isDown },
      };
      this.player.update(combined);
    }

    for (const npc of this.npcs) {
      npc.update(this.player?.x ?? 0, this.player?.y ?? 0);
    }

    if (this.daylightOverlay) {
      const alpha = 1 - this.timeSystem.getDaylightAlpha();
      this.daylightOverlay.setAlpha(alpha * 0.5);
    }

    this.updateInteractionPrompt();
  }

  updateInteractionPrompt() {
    if (!this.player || this.player.isInUI) {
      this.interactPrompt?.setVisible(false);
      return;
    }

    const px = this.player.x;
    const py = this.player.y;
    let closest = { dist: 48, text: '', x: 0, y: 0 };

    for (const exit of this.exitZones) {
      const d = Phaser.Math.Distance.Between(px, py, exit.px, exit.py);
      if (d < closest.dist) closest = { dist: d, text: `[SPACE] ${exit.label}`, x: exit.px, y: exit.py - 28 };
    }
    for (const obj of this.interactables) {
      const d = Phaser.Math.Distance.Between(px, py, obj.px, obj.py);
      if (d < closest.dist) closest = { dist: d, text: `[SPACE] ${obj.label}`, x: obj.px, y: obj.py - 28 };
    }
    for (const npc of this.npcs) {
      const d = Phaser.Math.Distance.Between(px, py, npc.x, npc.y);
      if (d < closest.dist) closest = { dist: d, text: '[SPACE] Talk', x: npc.x, y: npc.y - 40 };
    }

    if (closest.text) {
      this.interactPrompt.setText(closest.text).setPosition(closest.x, closest.y).setOrigin(0.5).setVisible(true);
    } else {
      this.interactPrompt.setVisible(false);
    }
  }
}
